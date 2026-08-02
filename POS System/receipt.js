/* =========================================================
   RECEIPT.JS (plain script, not a module)
   Builds and shows the Receipt popup after a transaction, and
   handles the popup's two buttons: Save receipt (download a
   .txt copy) and Done (close the popup).

   showReceipt is put on "window" so checkout.js (a module)
   can call it after a transaction completes.
   ========================================================= */

const receiptModal = document.getElementById("receiptModal");
const receiptBox = document.getElementById("receiptBox");
const downloadReceiptBtn = document.getElementById("downloadReceiptBtn");
const closeReceiptBtn = document.getElementById("closeReceiptBtn");

// Holds the most recently completed transaction, so the
// "Save receipt" button knows what to write into the file.
let lastTransaction = null;


/* ---------------------------------------------------------
   1. BUILD THE RECEIPT TEXT
   Both the on-screen popup and the downloaded .txt file use
   this same plain-text layout, so it only needs to be built
   in one place.
--------------------------------------------------------- */
function buildReceiptText(transaction) {
  let text = "";
  text += "\n";
  text += "--------------------------------------------\n";
  text += "\n";
  text += "DATE: " + transaction.date + ", TIME: " + transaction.time + "\n";
  text += "\n";
  text += "CUSTOMER: " + transaction.customer_name + "\n";
  text += "--------------------------------------\n";
  text += "\n";
  text += "ITEMLIST - QTY - SUBTOTAL\n";
  text += "\n";

  for (let i = 0; i < transaction.items.length; i++) {
    const item = transaction.items[i];
    text += item.product_name + " - " + item.quantity + " - ₱" + item.subtotal + "\n";
  }

  text += "\n";
  text += "------------------------------\n";
  text += "TOTAL: ₱" + transaction.total_amount.toFixed(2) + "\n";
  text += "\n";
  text += "DISCOUNT: ₱" + transaction.discount.toFixed(2) + "\n";
  text += "\n";
  text += "AMOUNT DUE: ₱" + transaction.total_due.toFixed(2) + "\n";
  text += "\n";
  text += "AMOUNT PAID: ₱" + transaction.amount_paid.toFixed(2) + "\n";
  text += "\n";
  text += "CHANGE: ₱" + transaction.change.toFixed(2) + "\n";

  if (transaction.is_loan) {
    text += "\n";
    text += "LOAN BORROWER: " + transaction.loan_borrower_name + "\n";
    text += "LOAN AMOUNT: ₱" + transaction.loan_amount.toFixed(2) + "\n";
  }

  text += "\n";
  text += "THANK YOU FOR THE PURCHASE!\n";
  text += "\n";
  text += "-------------------------------------------------\n";

  return text;
}


/* ---------------------------------------------------------
   2. SHOW THE RECEIPT
--------------------------------------------------------- */
function showReceipt(transaction) {
  // Remember this transaction so the "Save receipt" button can use it
  lastTransaction = transaction;

  const receiptText = buildReceiptText(transaction);

  // A <pre> tag keeps the spacing and line breaks exactly as written
  receiptBox.innerHTML = "<pre>" + receiptText + "</pre>";
}

// checkout.js is a module and calls this through window.showReceipt
window.showReceipt = showReceipt;


/* ---------------------------------------------------------
   3. RECEIPT POPUP BUTTONS
--------------------------------------------------------- */

// "Save receipt" - downloads a plain text (.txt) copy of the receipt
downloadReceiptBtn.addEventListener("click", function () {
  if (!lastTransaction) {
    return;
  }

  const text = buildReceiptText(lastTransaction);

  const link = document.createElement("a");
  link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
  link.download = "receipt-" + lastTransaction.transaction_id + ".txt";
  link.click();
});

// "Done" - just closes the popup. The catalog is already showing behind it.
closeReceiptBtn.addEventListener("click", function () {
  receiptModal.style.display = "none";
});