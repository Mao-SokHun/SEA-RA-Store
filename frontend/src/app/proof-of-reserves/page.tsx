/**
 * [DISABLED - Sell Account Feature]
 * Proof-of-Reserves page is temporarily disabled. Only the TopUp feature is active.
 * To re-enable: restore the original ProofOfReservesPage component.
 *
 * Original implementation is preserved in git history.
 */
import { redirect } from 'next/navigation';

export default function ProofOfReservesPage() {
  redirect('/top-up');
}
