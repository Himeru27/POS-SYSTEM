/* =========================================================
   CATALOG MODULE (ES module)
   This is the "sort" logic: drawing the product table and
   filtering it by category tab and search.
   ========================================================= */
import { groceryItems } from "./products.js";
import {
  searchBox,
  productTableBody,
  currentCategory,
  setCurrentCategory
} from "./state.js";


/* ---------------------------------------------------------
   1. DISPLAY THE PRODUCT CATALOG
   This function builds the product table rows from a given
   list of products. We reuse it for both category filtering
   and search filtering.
--------------------------------------------------------- */
function displayProducts(productList) {
  // Clear out whatever rows are currently shown
  productTableBody.innerHTML = "";

  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];

    // Create one <tr> row for this product
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


/* ---------------------------------------------------------
   2. CATEGORY TABS + SEARCH FILTER (the "sort" logic)
   Both features work together: a product is shown only if
   it matches the selected category AND the search text.
   (No .filter() here - just a plain loop.)
--------------------------------------------------------- */
export function showFilteredProducts() {
  const searchText = searchBox.value.toLowerCase();
  const filteredList = [];

  for (let i = 0; i < groceryItems.length; i++) {
    const product = groceryItems[i];

    const matchesCategory = (currentCategory === "All") || (product.product_category === currentCategory);
    const matchesSearch = product.product_name.toLowerCase().indexOf(searchText) !== -1;

    if (matchesCategory && matchesSearch) {
      filteredList.push(product);
    }
  }

  displayProducts(filteredList);
}

// Called when a category tab button is clicked
export function filterByCategory(category, btnElement) {
  setCurrentCategory(category);
  searchBox.value = "";

  // Remove the "active" look from every tab button...
  const tabButtons = document.getElementsByClassName("tab-btn");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }
  // ...then add it back to just the one that was clicked
  btnElement.classList.add("active");

  showFilteredProducts();
}

// Re-filter every time the cashier types in the search box
searchBox.addEventListener("input", function () {
  showFilteredProducts();
});

// Show the full catalog as soon as the page loads
showFilteredProducts();

// filterByCategory is called from an inline onclick="" attribute in
// index.html, and inline handlers can only reach plain global
// functions - not the ones inside a module. So we also attach it
// to window here, right where it's defined, to keep that working.
window.filterByCategory = filterByCategory;
