/**
 * [DISABLED - Sell Account Feature]
 * Warranty page is temporarily disabled. Only the TopUp feature is active.
 * To re-enable: restore the original WarrantyPage component.
 *
 * Original implementation is preserved in git history.
 */
import { redirect } from 'next/navigation';

export default function WarrantyPage() {
  redirect('/top-up');
}
