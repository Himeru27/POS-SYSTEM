/* =========================================================
   TRANSACTIONS / SALES REPORT MODULE (ES module)
   The report buttons shown on the Catalog view: view every
   transaction, and show total sales for the session.
   ========================================================= */
import {
  transactions,
  viewTransactionsBtn,
  totalSalesBtn,
  reportOutput
} from "./state.js";

// View a table listing every transaction made this session
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

// Show the total sales for the whole session
totalSalesBtn.addEventListener("click", function () {
  let totalSales = 0;

  for (let i = 0; i < transactions.length; i++) {
    totalSales = totalSales + transactions[i].total_due;
  }

  reportOutput.innerHTML = "<h3>Total Sales Today: ₱" + totalSales.toFixed(2) + "</h3>";
});
