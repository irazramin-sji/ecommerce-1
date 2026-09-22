/**
 * Client-side cart service placeholder.
 * For this initial runnable pass we rely on localStorage-based cart via useCart hook.
 * Persistent cart endpoints and server-side validation should be implemented
 * later via Supabase Edge Functions (see README).
 */
export async function syncCartToServer() {
  // No-op for now. In production, POST cart to /api/cart when user is authenticated.
  return null;
}
