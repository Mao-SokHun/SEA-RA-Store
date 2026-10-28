/**
 * [DISABLED - Sell Account Feature]
 * Checkout page is temporarily disabled. Only the TopUp feature is active.
 * To re-enable: restore the original CheckoutPage component.
 *
 * Original implementation is preserved in git history.
 */
import { redirect } from 'next/navigation';

export default function CheckoutPage() {
  redirect('/top-up');
}
