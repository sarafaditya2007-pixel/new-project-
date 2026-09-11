import { getSupabase, isSupabaseConfigured, DEFAULT_SUPABASE_URL, SUPABASE_PROJECT_ID } from './supabase';
import { Issue, SocietyNotice, FacilityItem, UserProfile, IssueStatus, TimelineEvent, CommentItem } from '../types';

export interface DatabaseStatus {
  isConfigured: boolean;
  projectId: string;
  apiUrl: string;
  isConnected: boolean;
  errorMessage?: string;
}

// Check real-time connection status to Supabase
export async function checkSupabaseConnection(): Promise<DatabaseStatus> {
  const isConfigured = isSupabaseConfigured();
  if (!isConfigured) {
    return {
      isConfigured: false,
      projectId: SUPABASE_PROJECT_ID,
      apiUrl: DEFAULT_SUPABASE_URL,
      isConnected: false,
      errorMessage: 'VITE_SUPABASE_ANON_KEY is not set yet in environment.',
    };
  }

  const client = getSupabase();
  if (!client) {
    return {
      isConfigured: false,
      projectId: SUPABASE_PROJECT_ID,
      apiUrl: DEFAULT_SUPABASE_URL,
      isConnected: false,
      errorMessage: 'Client could not be initialized.',
    };
  }

  try {
    const { error } = await client.from('facilities').select('id').limit(1);
    if (error) {
      return {
        isConfigured: true,
        projectId: SUPABASE_PROJECT_ID,
        apiUrl: DEFAULT_SUPABASE_URL,
        isConnected: false,
        errorMessage: error.message,
      };
    }
    return {
      isConfigured: true,
      projectId: SUPABASE_PROJECT_ID,
      apiUrl: DEFAULT_SUPABASE_URL,
      isConnected: true,
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      projectId: SUPABASE_PROJECT_ID,
      apiUrl: DEFAULT_SUPABASE_URL,
      isConnected: false,
      errorMessage: err.message || 'Connection test failed',
    };
  }
}

// ---------------------------------------------------------------------------
// 1. ISSUES & COMPLAINTS
// ---------------------------------------------------------------------------
export async function fetchIssuesFromDatabase(): Promise<Issue[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data: issuesData, error: issuesErr } = await client
      .from('issues')
      .select('*')
      .order('created_at', { ascending: false });

    if (issuesErr || !issuesData) {
      console.warn('Could not fetch issues from Supabase:', issuesErr);
      return null;
    }

    // Fetch associated timeline and comments for each issue
    const fullIssues: Issue[] = await Promise.all(
      issuesData.map(async (row: any) => {
        const [{ data: timelineData }, { data: commentsData }] = await Promise.all([
          client
            .from('timeline_events')
            .select('*')
            .eq('issue_id', row.id)
            .order('created_at', { ascending: true }),
          client
            .from('issue_comments')
            .select('*')
            .eq('issue_id', row.id)
            .order('created_at', { ascending: true }),
        ]);

        const timeline: TimelineEvent[] = (timelineData || []).map((t: any) => ({
          status: t.status,
          label: t.label,
          date: t.date,
          note: t.note || undefined,
        }));

        const comments: CommentItem[] = (commentsData || []).map((c: any) => ({
          id: c.id,
          author: c.author,
          text: c.text,
          date: c.date,
          isStaff: Boolean(c.is_staff),
        }));

        return {
          id: row.id,
          title: row.title,
          category: row.category,
          societyName: row.society_name || 'Maple Heights Housing Society',
          address: row.address,
          description: row.description,
          status: row.status,
          priority: row.priority,
          date: row.date,
          timestamp: Number(row.timestamp) || Date.now(),
          photoUrl: row.photo_url || undefined,
          reporterName: row.reporter_name,
          reporterUnit: row.reporter_unit || undefined,
          assignedDepartment: row.assigned_department || undefined,
          upvotes: Number(row.upvotes) || 0,
          mapCoords: row.map_coords || { x: 50, y: 50 },
          timeline,
          comments,
        };
      })
    );

    return fullIssues;
  } catch (err) {
    console.warn('Error fetching issues from Supabase:', err);
    return null;
  }
}

export async function createIssueInDatabase(issue: Issue): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error: insertErr } = await client.from('issues').insert({
      id: issue.id,
      title: issue.title,
      category: issue.category,
      society_name: issue.societyName,
      address: issue.address,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      date: issue.date,
      timestamp: issue.timestamp,
      photo_url: issue.photoUrl || null,
      reporter_name: issue.reporterName,
      reporter_unit: issue.reporterUnit || null,
      assigned_department: issue.assignedDepartment || null,
      upvotes: issue.upvotes,
      map_coords: issue.mapCoords,
    });

    if (insertErr) {
      console.warn('Error inserting issue:', insertErr);
      return false;
    }

    // Add initial timeline event
    if (issue.timeline && issue.timeline.length > 0) {
      const events = issue.timeline.map((e) => ({
        issue_id: issue.id,
        status: e.status,
        label: e.label,
        date: e.date,
        note: e.note || null,
      }));
      await client.from('timeline_events').insert(events);
    }

    return true;
  } catch (err) {
    console.warn('Exception creating issue in Supabase:', err);
    return false;
  }
}

export async function updateIssueStatusInDatabase(
  issueId: string,
  newStatus: IssueStatus,
  note?: string
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error: updateErr } = await client
      .from('issues')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', issueId);

    if (updateErr) return false;

    // Append new timeline event
    const nowStr = 'Just now';
    await client.from('timeline_events').insert({
      issue_id: issueId,
      status: newStatus,
      label: `Status Updated to ${newStatus}`,
      date: nowStr,
      note: note || `Administrative review status changed to ${newStatus}`,
    });

    return true;
  } catch (err) {
    console.warn('Error updating status in Supabase:', err);
    return false;
  }
}

export async function upvoteIssueInDatabase(issueId: string, newUpvotes: number): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('issues')
      .update({ upvotes: newUpvotes })
      .eq('id', issueId);
    return !error;
  } catch (err) {
    return false;
  }
}

export async function addIssueCommentInDatabase(
  issueId: string,
  comment: CommentItem
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('issue_comments').insert({
      issue_id: issueId,
      author: comment.author,
      text: comment.text,
      date: comment.date,
      is_staff: Boolean(comment.isStaff),
    });
    return !error;
  } catch (err) {
    return false;
  }
}

// ---------------------------------------------------------------------------
// 2. NOTICES
// ---------------------------------------------------------------------------
export async function fetchNoticesFromDatabase(): Promise<SocietyNotice[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((n: any) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      category: n.category,
      date: n.date,
      author: n.author,
      urgent: Boolean(n.urgent),
    }));
  } catch (err) {
    return null;
  }
}

export async function createNoticeInDatabase(notice: SocietyNotice): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('notices').insert({
      id: notice.id,
      title: notice.title,
      content: notice.content,
      category: notice.category,
      date: notice.date,
      author: notice.author,
      urgent: notice.urgent,
    });
    return !error;
  } catch (err) {
    return false;
  }
}

// ---------------------------------------------------------------------------
// 3. FACILITIES
// ---------------------------------------------------------------------------
export async function fetchFacilitiesFromDatabase(): Promise<FacilityItem[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('facilities')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data) return null;

    return data.map((f: any) => ({
      id: f.id,
      name: f.name,
      status: f.status,
      hours: f.hours,
      bookingFee: f.booking_fee || undefined,
    }));
  } catch (err) {
    return null;
  }
}

export async function updateFacilityStatusInDatabase(
  facilityId: string,
  newStatus: 'Open' | 'Maintenance' | 'Booked'
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('facilities')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', facilityId);
    return !error;
  } catch (err) {
    return false;
  }
}

// ---------------------------------------------------------------------------
// 4. DUES TRANSACTIONS
// ---------------------------------------------------------------------------
export async function recordDuesPaymentInDatabase(
  residentId: string,
  residentName: string,
  unit: string,
  amount: number,
  receiptNo: string
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('dues_transactions').insert({
      resident_id: residentId,
      resident_name: residentName,
      unit: unit,
      amount: amount,
      receipt_no: receiptNo,
      status: 'PAID',
      payment_method: 'Card / UPI / NetBanking',
    });
    return !error;
  } catch (err) {
    return false;
  }
}

// ---------------------------------------------------------------------------
// 5. AUTH & PROFILES
// ---------------------------------------------------------------------------
export async function fetchProfilesFromDatabase(): Promise<UserProfile[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client.from('profiles').select('*');
    if (error || !data) return null;

    return data.map((p: any) => ({
      id: p.id,
      role: p.role,
      name: p.name,
      email: p.email,
      phone: p.phone,
      unit: p.unit || undefined,
      societyName: p.society_name || 'Maple Heights Housing Society',
      designation: p.designation || (p.role === 'secretary' ? 'Hon. Secretary' : 'Resident'),
      avatarUrl: p.avatar_url || undefined,
    }));
  } catch (err) {
    return null;
  }
}

export async function loginWithSupabaseAuth(email: string, pass: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { success: false, error: 'Supabase client is not configured yet. Add VITE_SUPABASE_ANON_KEY to connect.' };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error || !data.user) {
      return { success: false, error: error?.message || 'Login failed' };
    }

    // Fetch profile
    const { data: profile } = await client
      .from('profiles')
      .select('*')
      .or(`auth_user_id.eq.${data.user.id},email.eq.${email}`)
      .single();

    if (profile) {
      const userProfile: UserProfile = {
        id: profile.id,
        role: profile.role,
        name: profile.name,
        email: profile.email,
        phone: profile.phone || '+1 (555) 019-2834',
        unit: profile.unit,
        societyName: profile.society_name,
        designation: profile.designation,
        avatarUrl: profile.avatar_url,
      };
      return { success: true, user: userProfile };
    }

    // Default member fallback profile from auth metadata
    const userProfile: UserProfile = {
      id: data.user.id,
      role: (data.user.user_metadata?.role as any) || 'member',
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Resident User',
      email: data.user.email || email,
      phone: '+1 (555) 019-2834',
      unit: data.user.user_metadata?.unit || 'Tower B - Flat 402',
      societyName: 'Maple Heights Housing Society',
      designation: 'Resident',
    };

    return { success: true, user: userProfile };
  } catch (err: any) {
    return { success: false, error: err.message || 'Auth failure' };
  }
}
