/* =========================================================
   STATE MODULE (ES module)
   Shared state and element references used by the modules
   that use import/export in this app: catalog.js (sort/filter),
   cart.js, checkout.js, checkout-options.js, and reports.js.

   Note: cart, transactions, and transactionCounter are
   reassigned (not just edited) by other files, e.g. "cart = []".
   A module can't let other files reassign its variables
   directly, so we export small setter functions for that
   instead - everything else works exactly the same as before.
   ========================================================= */


/* ---------------------------------------------------------
   1. APP STATE
--------------------------------------------------------- */

// "cart" holds the items the cashier has added for the CURRENT
// customer, before checkout happens.
export let cart = [];

// "transactions" holds every completed sale made this session.
export let transactions = [];

// Every transaction gets a unique ID number.
export let transactionCounter = 1;

// Which category tab is currently selected. "All" shows everything.
export let currentCategory = "All";

// Setter functions, used only when a file needs to replace one
// of the values above instead of just reading it.
export function setCart(newCart) {
  cart = newCart;
}

export function setTransactionCounter(newCounter) {
  transactionCounter = newCounter;
}

export function setCurrentCategory(newCategory) {
  currentCategory = newCategory;
}


/* ---------------------------------------------------------
   2. GRAB REFERENCES TO THE HTML ELEMENTS WE NEED
--------------------------------------------------------- */

// Catalog view elements
export const searchBox = document.getElementById("searchBox");
export const productTableBody = document.getElementById("productTableBody");
export const ordersList = document.getElementById("ordersList");
export const catalogCartTotalEl = document.getElementById("catalogCartTotal");
export const proceedToCheckoutBtn = document.getElementById("proceedToCheckoutBtn");

// Checkout view elements
export const backToCatalogBtn = document.getElementById("backToCatalogBtn");
export const cartTableBody = document.getElementById("cartTableBody");
export const cartTotalSpan = document.getElementById("cartTotal");
export const amountPaidInput = document.getElementById("amountPaid");
export const checkoutBtn = document.getElementById("checkoutBtn");
export const checkoutMessage = document.getElementById("checkoutMessage");

// Receipt popup element (checkout.js needs this to open the popup)
export const receiptModal = document.getElementById("receiptModal");

// Sales report elements
export const viewTransactionsBtn = document.getElementById("viewTransactionsBtn");
export const totalSalesBtn = document.getElementById("totalSalesBtn");
export const reportOutput = document.getElementById("reportOutput");