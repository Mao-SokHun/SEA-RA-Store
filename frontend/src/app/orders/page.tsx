/**
 * [DISABLED - Sell Account Feature]
 * Orders page is temporarily disabled. Only the TopUp feature is active.
 * To re-enable: restore the original OrdersPage component.
 *
 * Original implementation is preserved in git history.
 */
import { redirect } from 'next/navigation';

export default function OrdersPage() {
  redirect('/top-up');
}
