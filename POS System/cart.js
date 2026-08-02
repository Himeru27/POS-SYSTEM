/* =========================================================
   CART MODULE (ES module)
   Everything about the shopping cart: adding a product,
   removing a product, and drawing the two places the cart
   shows up (the Checkout table and the "Orders" side panel).
   ========================================================= */
import { groceryItems } from "./products.js";
import {
  cart,
  cartTableBody,
  cartTotalSpan,
  ordersList,
  catalogCartTotalEl,
  proceedToCheckoutBtn,
  backToCatalogBtn
} from "./state.js";
import { showCatalogView, showCheckoutView } from "./script.js";


/* ---------------------------------------------------------
   1. ADD A PRODUCT TO THE CART
--------------------------------------------------------- */
export function addToCart(productId) {
  // Look up the product's info from our master list
  // (plain loop instead of .find())
  let product = null;
  for (let i = 0; i < groceryItems.length; i++) {
    if (groceryItems[i].product_id === productId) {
      product = groceryItems[i];
    }
  }

  // Read the quantity the cashier typed in for this product
  const qtyInput = document.getElementById("qty-" + productId);
  const quantity = parseInt(qtyInput.value);

  // Basic validation: quantity must be a real number greater than 0
  if (isNaN(quantity) || quantity <= 0) {
    alert("Please enter a valid quantity (1 or more).");
    return;
  }

  // Check if this product is already in the cart.
  // If it is, we just increase its quantity instead of adding a duplicate row.
  let existingItem = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].product_id === productId) {
      existingItem = cart[i];
    }
  }

  if (existingItem) {
    existingItem.quantity = existingItem.quantity + quantity;
    existingItem.subtotal = existingItem.quantity * existingItem.product_price;
  } else {
    cart.push({
      product_id: product.product_id,
      product_name: product.product_name,
      product_price: product.product_price,
      quantity: quantity,
      subtotal: product.product_price * quantity
    });
  }

  renderCart();
  renderOrdersList();
}


/* ---------------------------------------------------------
   2. DRAW THE CART TABLE (used in the Checkout view)
--------------------------------------------------------- */
export function renderCart() {
  cartTableBody.innerHTML = "";
  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    total = total + item.subtotal;

    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" + item.product_name + "</td>" +
      "<td>₱" + item.product_price + "</td>" +
      "<td>" + item.quantity + "</td>" +
      "<td>₱" + item.subtotal + "</td>" +
      "<td><button class='btn-remove' onclick='removeFromCart(" + i + ")'>Remove</button></td>";

    cartTableBody.appendChild(row);
  }

  cartTotalSpan.textContent = total;
}

// Itemized "Orders" list shown in the left panel of the Catalog view.
// Each row shows the product name + quantity, its subtotal, and a
// small round button to remove it - same data as the cart, just
// displayed item-by-item instead of just a count.
export function renderOrdersList() {
  ordersList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    ordersList.innerHTML = "<p class='empty-orders'>No items yet. Tap a product to add it.</p>";
  }

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    total = total + item.subtotal;

    const row = document.createElement("div");
    row.className = "order-row";
    row.innerHTML =
      "<span class='order-name'>" + item.product_name + " (" + item.quantity + ")</span>" +
      "<span class='order-price'>₱" + item.subtotal + "</span>" +
      "<button class='remove-circle' onclick='removeFromCart(" + i + ")'>−</button>";

    ordersList.appendChild(row);
  }

  catalogCartTotalEl.textContent = total;
}


/* ---------------------------------------------------------
   3. REMOVE AN ITEM FROM THE CART
--------------------------------------------------------- */
export function removeFromCart(index) {
  cart.splice(index, 1); // removes 1 item at this position in the array
  renderCart();
  renderOrdersList();
}


/* ---------------------------------------------------------
   4. PROCEED TO CHECKOUT / BACK TO CATALOG
--------------------------------------------------------- */
proceedToCheckoutBtn.addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Please add at least one product before proceeding to checkout.");
    return;
  }
  showCheckoutView();
});

backToCatalogBtn.addEventListener("click", function () {
  showCatalogView();
});

// addToCart and removeFromCart are called from inline onclick=""
// attributes (built as strings in displayProducts/renderCart above),
// so they're attached to window here to keep those working.
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
