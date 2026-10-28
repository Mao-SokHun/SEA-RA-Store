/**
 * [DISABLED - Sell Account Feature]
 * Account detail page is temporarily disabled. Only the TopUp feature is active.
 * To re-enable: restore the original AccountDetailPage component.
 *
 * Original implementation is preserved in git history.
 */
import { redirect } from 'next/navigation';

export default function AccountDetailPage() {
  redirect('/top-up');
}
