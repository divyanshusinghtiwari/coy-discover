import { cookies, headers } from 'next/headers';

export const DEFAULT_CURRENT_USER_ID = 'user-current';

/**
 * Returns the current active user ID.
 * Supports override via 'x-user-id' header or 'coy_user_id' cookie,
 * defaulting to DEFAULT_CURRENT_USER_ID.
 */
export async function getCurrentUserId(): Promise<string> {
  try {
    const headersList = headers();
    const headerUserId = headersList.get('x-user-id');
    if (headerUserId) return headerUserId;
  } catch {
    // If called outside request context (e.g., tests/scripts)
  }

  try {
    const cookieStore = cookies();
    const cookieUserId = cookieStore.get('coy_user_id')?.value;
    if (cookieUserId) return cookieUserId;
  } catch {
    // Fallback if cookies not available
  }

  return DEFAULT_CURRENT_USER_ID;
}
