/* =========================================================
   CHECKOUT OPTIONS MODULE
   This file is separate from script.js on purpose, so all the
   "Senior Citizen / PWD" and "Loan" logic lives in one place
   and is easy to find and edit.

   It does 3 simple jobs:
   1. Show the right discount note (10% Regular or 20% Senior/PWD)
      or the Loan fields, depending on what the cashier picks.
   2. Calculate the Senior Citizen / PWD discount.
   3. Read the Loan details (borrower name + amount) so
      script.js can save them with the transaction.
   ========================================================= */


/* ---------------------------------------------------------
   1. GRAB THE HTML ELEMENTS THIS MODULE NEEDS
--------------------------------------------------------- */
const checkoutOptionSelect = document.getElementById("checkoutOptionSelect");
const seniorPwdFields = document.getElementById("seniorPwdFields");
const checkoutDiscountHint = document.getElementById("checkoutDiscountHint");
const loanFields = document.getElementById("loanFields");
const loanBorrowerNameInput = document.getElementById("loanBorrowerName");
const loanAmountInput = document.getElementById("loanAmount");

const REGULAR_DISCOUNT_HINT = "A 10% discount is automatically applied if your total goes over ₱1000.";
const SENIOR_PWD_DISCOUNT_HINT = "A 20% Senior Citizen / PWD discount will be applied to the total.";


/* ---------------------------------------------------------
   2. SHOW THE RIGHT FIELDS BASED ON THE DROPDOWN
   "Regular" = 10% discount note, "Senior/PWD" = 20% discount
   note (same spot, different wording), "Loan" = borrower name
   + loan amount fields instead.
--------------------------------------------------------- */
function updateCheckoutOptionFields() {
  const selectedOption = checkoutOptionSelect.value;

  if (selectedOption === "seniorPwd") {
    checkoutDiscountHint.textContent = SENIOR_PWD_DISCOUNT_HINT;
    seniorPwdFields.style.display = "block";
    loanFields.style.display = "none";
  } else if (selectedOption === "loan") {
    seniorPwdFields.style.display = "none";
    loanFields.style.display = "block";
  } else {
    checkoutDiscountHint.textContent = REGULAR_DISCOUNT_HINT;
    seniorPwdFields.style.display = "block";
    loanFields.style.display = "none";
  }
}

// Run it once whenever the dropdown changes
checkoutOptionSelect.addEventListener("change", function () {
  updateCheckoutOptionFields();
});

// Also run it once right away, so the note matches whatever
// option is selected when the page first loads.
updateCheckoutOptionFields();


/* ---------------------------------------------------------
   3. SENIOR CITIZEN / PWD DISCOUNT
   Philippine law gives Senior Citizens and PWDs a 20% discount
   on most goods. This function just returns that discount
   amount based on the subtotal passed in.
--------------------------------------------------------- */
const SENIOR_PWD_DISCOUNT_RATE = 0.20;

export function getSeniorPwdDiscount(subtotal) {
  if (checkoutOptionSelect.value === "seniorPwd") {
    return subtotal * SENIOR_PWD_DISCOUNT_RATE;
  }
  return 0;
}


/* ---------------------------------------------------------
   4. LOAN DETAILS
   Reads what the cashier typed in for the loan, so script.js
   can attach it to the transaction record.
--------------------------------------------------------- */
export function getLoanDetails() {
  if (checkoutOptionSelect.value === "loan") {
    return {
      isLoan: true,
      borrowerName: loanBorrowerNameInput.value.trim() || "Unnamed Borrower",
      loanAmount: parseFloat(loanAmountInput.value) || 0
    };
  }

  return {
    isLoan: false,
    borrowerName: "",
    loanAmount: 0
  };
}


/* ---------------------------------------------------------
   5. RESET THE OPTIONS BACK TO DEFAULT
   Called after a transaction is completed, so the next
   customer starts with a clean dropdown.
--------------------------------------------------------- */
export function resetCheckoutOptions() {
  checkoutOptionSelect.value = "none";
  loanBorrowerNameInput.value = "";
  loanAmountInput.value = "";
  updateCheckoutOptionFields();
}


/* ---------------------------------------------------------
   6. WHICH OPTION IS CURRENTLY SELECTED?
   Small helper so script.js can check this without needing
   to know the HTML element's id.
--------------------------------------------------------- */
export function getSelectedCheckoutOption() {
  return checkoutOptionSelect.value;
}