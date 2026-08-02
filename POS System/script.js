/* =========================================================
   SCRIPT.JS - MAIN ENTRY POINT (ES module)
   This is the file that imports the other function modules:
   catalog.js (sort/filter), cart.js, checkout.js,
   checkout-options.js, and reports.js (transactions). It's
   the only <script> loaded with type="module" in index.html,
   so its own import statements pull in all the module code.

   This file also owns the view-switching logic (Catalog <->
   Checkout) since that's core to how the app runs, and exports
   it so cart.js and checkout.js can import it directly.

   receipt.js is a plain (non-module) script loaded separately,
   since only checkout/sort/cart/transactions use import/export
   in this app - it's reached through window.showReceipt instead.
   ========================================================= */
import "./checkout-options.js";
import "./catalog.js";
import "./cart.js";
import "./checkout.js";
import "./reports.js";

const catalogView = document.getElementById("catalogView");
const checkoutView = document.getElementById("checkoutView");

export function showCatalogView() {
  catalogView.style.display = "block";
  checkoutView.style.display = "none";
}

export function showCheckoutView() {
  catalogView.style.display = "none";
  checkoutView.style.display = "block";
}
