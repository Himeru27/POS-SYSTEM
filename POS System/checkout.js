/* =========================================================
   CHECKOUT MODULE (ES module)
   Runs when the cashier clicks "Complete Transaction": totals
   the cart, applies discounts, checks payment, saves the
   transaction record, and hands off to the receipt popup.

   Senior Citizen/PWD discount and Loan details are handled by
   the functions in checkout-options.js, so this file just
   calls them. showReceipt lives in receipt.js, a plain
   (non-module) script, so it's reached here through window.
   ========================================================= */
import {
  cart,
  setCart,
  transactions,
  transactionCounter,
  setTransactionCounter,
  checkoutBtn,
  checkoutMessage,
  amountPaidInput,
  receiptModal
} from "./state.js";
import { getSeniorPwdDiscount, getLoanDetails, resetCheckoutOptions } from "./checkout-options.js";
import { renderCart, renderOrdersList } from "./cart.js";
import { showCatalogView } from "./script.js";

checkoutBtn.addEventListener("click", function () {
  // Make sure there is something to check out
  if (cart.length === 0) {
    checkoutMessage.textContent = "Cart is empty. Please add products first.";
    checkoutMessage.style.color = "#D64550";
    return;
  }

  // Add up all the subtotals to get the raw total
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total = total + cart[i].subtotal;
  }

  // 10% discount automatically applied if the total goes over ₱1000
  let discount = 0;
  if (total > 1000) {
    discount = total * 0.10;
  }

  // If the cashier picked "Senior Citizen / PWD" from the dropdown,
  // add that discount on top of the ₱1000 discount (from checkout-options.js)
  const seniorPwdDiscount = getSeniorPwdDiscount(total);
  discount = discount + seniorPwdDiscount;

  const totalDue = total - discount;

  // Read how much the customer paid
  const amountPaid = parseFloat(amountPaidInput.value);

  if (isNaN(amountPaid) || amountPaid < totalDue) {
    checkoutMessage.textContent = "Insufficient payment. Please enter at least ₱" + totalDue.toFixed(2) + ".";
    checkoutMessage.style.color = "#D64550";
    return;
  }

  const change = amountPaid - totalDue;

  // No name input anymore - every sale is recorded as a walk-in customer
  const customerName = "Walk-in Customer";

  // Get the Loan details (if the cashier picked "Loan" from the dropdown)
  const loanDetails = getLoanDetails();

  // Copy the cart items into a fresh array so this saved record
  // won't change later if the cart changes. (plain loop instead of .map())
  const copiedItems = [];
  for (let i = 0; i < cart.length; i++) {
    copiedItems.push({
      product_id: cart[i].product_id,
      product_name: cart[i].product_name,
      product_price: cart[i].product_price,
      quantity: cart[i].quantity,
      subtotal: cart[i].subtotal
    });
  }

  // Build the full transaction record
  const now = new Date();
  const transaction = {
    transaction_id: transactionCounter,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    customer_name: customerName,
    items: copiedItems,
    total_amount: total,
    discount: discount,
    senior_pwd_discount: seniorPwdDiscount,
    total_due: totalDue,
    amount_paid: amountPaid,
    change: change,
    is_loan: loanDetails.isLoan,
    loan_borrower_name: loanDetails.borrowerName,
    loan_amount: loanDetails.loanAmount
  };

  // Save the transaction into our transactions array
  transactions.push(transaction);
  setTransactionCounter(transactionCounter + 1);

  // Let the cashier know the sale went through
  checkoutMessage.textContent = "Transaction completed! Change: ₱" + change.toFixed(2);
  checkoutMessage.style.color = "#2E7D46";

  // Reset the cart for the next customer
  setCart([]);
  renderCart();
  renderOrdersList();
  amountPaidInput.value = "";
  checkoutMessage.textContent = "";
  resetCheckoutOptions();

  // Go back to the catalog in the background, then pop up the receipt
  showCatalogView();
  window.showReceipt(transaction);
  receiptModal.style.display = "flex";
});