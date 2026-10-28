/**
 * [DISABLED - Sell Account Feature]
 * This page is temporarily disabled. Only the TopUp feature is active.
 * To re-enable: restore the original SellAccountWizardPage component.
 *
 * Original implementation is preserved in git history.
 */
import { redirect } from 'next/navigation';

export default function SellAccountWizardPage() {
  redirect('/top-up');
}
