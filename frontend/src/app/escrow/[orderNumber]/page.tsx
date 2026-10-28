/**
 * [DISABLED - Sell Account Feature]
 * Escrow page is temporarily disabled. Only the TopUp feature is active.
 * To re-enable: restore the original EscrowPage component.
 *
 * Original implementation is preserved in git history.
 */
import { redirect } from 'next/navigation';

export default function EscrowPage() {
  redirect('/top-up');
}
