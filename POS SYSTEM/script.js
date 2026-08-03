
import { groceryItems, getProductCategory } from "./products.js";


/* ---------------------------------------------------------
   1. APP STATE | Para sa products.js
--------------------------------------------------------- */
let cart = [];           
let transactions = [];        
let transactionCounter = 1; 
let currentCategory = "All";


/* ---------------------------------------------------------
   2. HTML ELEMENT REFERENCES | Para sa index.html
--------------------------------------------------------- */

const searchBox = document.getElementById("searchBox");
const productTableBody = document.getElementById("productTableBody");
const ordersList = document.getElementById("ordersList");
const catalogCartTotalEl = document.getElementById("catalogCartTotal");
const proceedToCheckoutBtn = document.getElementById("proceedToCheckoutBtn");


const catalogView = document.getElementById("catalogView");
const checkoutView = document.getElementById("checkoutView");


const backToCatalogBtn = document.getElementById("backToCatalogBtn");
const cartTableBody = document.getElementById("cartTableBody");
const cartTotalSpan = document.getElementById("cartTotal");
const amountPaidInput = document.getElementById("amountPaid");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutMessage = document.getElementById("checkoutMessage");

// Checkout options: Senior Citizen/PWD discount + Loan fields
const checkoutOptionSelect = document.getElementById("checkoutOptionSelect");
const seniorPwdFields = document.getElementById("seniorPwdFields");
const checkoutDiscountHint = document.getElementById("checkoutDiscountHint");
const loanFields = document.getElementById("loanFields");
const loanBorrowerNameInput = document.getElementById("loanBorrowerName");
const loanAmountInput = document.getElementById("loanAmount");

// Receipt popup
const receiptModal = document.getElementById("receiptModal");

// Sales report
const viewTransactionsBtn = document.getElementById("viewTransactionsBtn");
const totalSalesBtn = document.getElementById("totalSalesBtn");
const mostPurchasedBtn = document.getElementById("mostPurchasedBtn");
const reportOutput = document.getElementById("reportOutput");


/* ---------------------------------------------------------
   3. VIEW SWITCHING (Catalog <-> Checkout)
--------------------------------------------------------- */
function showCatalogView() {
  catalogView.style.display = "block";
  checkoutView.style.display = "none";
}

function showCheckoutView() {
  catalogView.style.display = "none";
  checkoutView.style.display = "block";
}


/* ---------------------------------------------------------
   4. PRODUCT CATALOG (build the table + category/search filter)
--------------------------------------------------------- */
function displayProducts(productList) {
  productTableBody.innerHTML = "";

  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];

    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" + product.product_id + "</td>" +
      "<td>" + product.product_name + "</td>" +
      "<td>₱" + product.product_price + "</td>" +
      "<td><input type='number' id='qty-" + product.product_id + "' value='1' min='1' class='qty-input'></td>" +
      "<td><button class='btn-add' onclick='addToCart(" + product.product_id + ")'>Add</button></td>";

    productTableBody.appendChild(row);
  }
}

// A product is shown only if it matches the selected category
// AND the search text.
function showFilteredProducts() {
  const searchText = searchBox.value.toLowerCase();
  const filteredList = [];

  for (let i = 0; i < groceryItems.length; i++) {
    const product = groceryItems[i];

    const productCategory = getProductCategory(product.product_id);
    const matchesCategory = (currentCategory === "All") || (productCategory === currentCategory);
    const matchesSearch = product.product_name.toLowerCase().indexOf(searchText) !== -1;

    if (matchesCategory && matchesSearch) {
      filteredList.push(product);
    }
  }

  displayProducts(filteredList);
}

// Called when a category tab button is clicked
function filterByCategory(category, btnElement) {
  currentCategory = category;
  searchBox.value = "";

  // Remove the "active" look from every tab, then add it back
  // to just the one that was clicked
  const tabButtons = document.getElementsByClassName("tab-btn");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }
  btnElement.classList.add("active");

  showFilteredProducts();
}

// Re-filter every time the cashier types in the search box
searchBox.addEventListener("input", function () {
  showFilteredProducts();
});

// Show the full catalog as soon as the page loads
showFilteredProducts();


/* ---------------------------------------------------------
   5. CART (add, remove, render)
--------------------------------------------------------- */
function addToCart(productId) {
  // Look up the product's info from the master list
  let product = null;
  for (let i = 0; i < groceryItems.length; i++) {
    if (groceryItems[i].product_id === productId) {
      product = groceryItems[i];
    }
  }

  // Read the quantity the cashier typed in for this product
  const qtyInput = document.getElementById("qty-" + productId);
  const quantity = parseInt(qtyInput.value);

  if (isNaN(quantity) || quantity <= 0) {
    alert("Please enter a valid quantity (1 or more).");
    return;
  }

  // If this product is already in the cart, just add to its
  // quantity instead of adding a duplicate row
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

// Draws the cart table used in the Checkout view
function renderCart() {
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

// Draws the itemized "Orders" list in the left panel of the
// Catalog view - same data as the cart, shown item-by-item
function renderOrdersList() {
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

function removeFromCart(index) {
  cart.splice(index, 1); // removes 1 item at this position in the array
  renderCart();
  renderOrdersList();
}

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


/* ---------------------------------------------------------
   6. CHECKOUT OPTIONS (Senior Citizen/PWD discount + Loan)
--------------------------------------------------------- */
const REGULAR_DISCOUNT_HINT = "A 10% discount is automatically applied if your total goes over ₱1000.";
const SENIOR_PWD_DISCOUNT_HINT = "A 20% Senior Citizen / PWD discount will be applied to the total.";
const SENIOR_PWD_DISCOUNT_RATE = 0.20;

// Shows the right fields based on the dropdown: "Regular" = 10%
// discount note, "Senior/PWD" = 20% discount note (same spot,
// different wording), "Loan" = borrower name + loan amount fields
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

checkoutOptionSelect.addEventListener("change", function () {
  updateCheckoutOptionFields();
});

// Run it once right away, so the note matches whatever option
// is selected when the page first loads
updateCheckoutOptionFields();

// Philippine law gives Senior Citizens and PWDs a 20% discount
function getSeniorPwdDiscount(subtotal) {
  if (checkoutOptionSelect.value === "seniorPwd") {
    return subtotal * SENIOR_PWD_DISCOUNT_RATE;
  }
  return 0;
}

// Reads what the cashier typed in for the loan
function getLoanDetails() {
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

// Resets the dropdown back to default after a transaction
function resetCheckoutOptions() {
  checkoutOptionSelect.value = "none";
  loanBorrowerNameInput.value = "";
  loanAmountInput.value = "";
  updateCheckoutOptionFields();
}


/* ---------------------------------------------------------
   7. CHECKOUT (complete the transaction)
--------------------------------------------------------- */
checkoutBtn.addEventListener("click", function () {
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

  // Add the Senior Citizen/PWD discount on top, if picked
  const seniorPwdDiscount = getSeniorPwdDiscount(total);
  discount = discount + seniorPwdDiscount;

  const totalDue = total - discount;

  const amountPaid = parseFloat(amountPaidInput.value);

  // Loans work differently: the cashier only needs to collect at
  // least half of the loan amount now, not the full total due.
  if (checkoutOptionSelect.value === "loan") {
    const loanAmount = parseFloat(loanAmountInput.value) || 0;
    const minimumLoanPayment = loanAmount / 2;

    if (isNaN(amountPaid) || amountPaid < minimumLoanPayment) {
      checkoutMessage.textContent = "For a loan, please pay at least half of the loan amount first (₱" + minimumLoanPayment.toFixed(2) + ").";
      checkoutMessage.style.color = "#D64550";
      return;
    }
  } else {
    if (isNaN(amountPaid) || amountPaid < totalDue) {
      checkoutMessage.textContent = "Insufficient payment. Please enter at least ₱" + totalDue.toFixed(2) + ".";
      checkoutMessage.style.color = "#D64550";
      return;
    }
  }

  const change = amountPaid - totalDue;

  // No name input - every sale is recorded as a walk-in customer
  const customerName = "Walk-in Customer";

  const loanDetails = getLoanDetails();

  // Copy the cart items into a fresh array so this saved record
  // won't change later if the cart changes
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

  transactions.push(transaction);
  transactionCounter = transactionCounter + 1;

  checkoutMessage.textContent = "Transaction completed! Change: ₱" + change.toFixed(2);
  checkoutMessage.style.color = "#2E7D46";

  // Reset the cart for the next customer
  cart = [];
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


/* ---------------------------------------------------------
   8. SALES REPORT
--------------------------------------------------------- */
viewTransactionsBtn.addEventListener("click", function () {
  if (transactions.length === 0) {
    reportOutput.innerHTML = "<p>No transactions recorded yet.</p>";
    return;
  }

  let rows = "";
  for (let i = 0; i < transactions.length; i++) {
    const t = transactions[i];
    rows =
      rows +
      "<tr>" +
      "<td>" + t.transaction_id + "</td>" +
      "<td>" + t.date + "</td>" +
      "<td>" + t.customer_name + "</td>" +
      "<td>₱" + t.total_due.toFixed(2) + "</td>" +
      "</tr>";
  }

  reportOutput.innerHTML =
    "<h3>All Transactions</h3>" +
    "<table>" +
    "<thead><tr><th>ID</th><th>Date</th><th>Customer</th><th>Total Due</th></tr></thead>" +
    "<tbody>" + rows + "</tbody>" +
    "</table>";
});

totalSalesBtn.addEventListener("click", function () {
  let totalSales = 0;

  for (let i = 0; i < transactions.length; i++) {
    totalSales = totalSales + transactions[i].total_due;
  }

  reportOutput.innerHTML = "<h3>Total Sales Today: ₱" + totalSales.toFixed(2) + "</h3>";
});

mostPurchasedBtn.addEventListener("click", function () {
  if (transactions.length === 0) {
    reportOutput.innerHTML = "<p>No transactions recorded yet.</p>";
    return;
  }

  // Build a simple list that adds up how many of each product
  // has been sold across every transaction so far.
  const productTotals = [];

  for (let i = 0; i < transactions.length; i++) {
    const items = transactions[i].items;

    for (let j = 0; j < items.length; j++) {
      const item = items[j];

      // Check if we're already tallying this product
      let existing = null;
      for (let k = 0; k < productTotals.length; k++) {
        if (productTotals[k].product_name === item.product_name) {
          existing = productTotals[k];
        }
      }

      if (existing) {
        existing.totalQuantity = existing.totalQuantity + item.quantity;
      } else {
        productTotals.push({
          product_name: item.product_name,
          totalQuantity: item.quantity
        });
      }
    }
  }

  // Find the product with the highest total quantity sold
  let topProduct = productTotals[0];
  for (let i = 1; i < productTotals.length; i++) {
    if (productTotals[i].totalQuantity > topProduct.totalQuantity) {
      topProduct = productTotals[i];
    }
  }

  reportOutput.innerHTML =
    "<h3>Most Purchased Product</h3>" +
    "<p>" + topProduct.product_name + " - " + topProduct.totalQuantity + " sold</p>";
});


/* ---------------------------------------------------------
   9. GLOBAL FUNCTIONS
   addToCart, removeFromCart, and filterByCategory are called
   from inline onclick="" attributes in index.html. Inline
   handlers can only reach plain global functions, not ones
   inside a module, so we attach them to window here.
--------------------------------------------------------- */
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.filterByCategory = filterByCategory;
