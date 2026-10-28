/**
 * [DISABLED - Sell Account Feature]
 * Order detail page is temporarily disabled. Only the TopUp feature is active.
 * To re-enable: restore the original OrderDetailPage component.
 *
 * Original implementation is preserved in git history.
 */
import { redirect } from 'next/navigation';

export default function OrderDetailPage() {
  redirect('/top-up');
}
