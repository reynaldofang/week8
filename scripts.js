var currentBalance = 0;
var apiUrl = "https://rey-api-week8.onrender.com";
document.addEventListener("DOMContentLoaded", function () {
    var transactionForm = document.querySelector("#transactionForm");
    var noTransactionMessage = document.getElementById("noTransactionMessage");
    var balanceElement = document.getElementById("balance");
    if (transactionForm) {
        transactionForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var transactionType = document.getElementById("transaction").value;
            var transactionDescription = document.getElementById("description").value;
            var transactionAmount = parseFloat(document.getElementById("amount").value);
            var newTransaction = {
                type: transactionType,
                description: transactionDescription,
                amount: transactionAmount,
            };
            fetch("".concat(apiUrl, "/api/transactions"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTransaction),
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                console.log("New transaction added:", data);
                if (transactionForm) {
                    transactionForm.reset();
                }
                // Update balance based on the new transaction type
                if (newTransaction.type === "income") {
                    currentBalance += newTransaction.amount;
                }
                else if (newTransaction.type === "expense") {
                    currentBalance -= newTransaction.amount;
                }
                // Update balance display
                updateBalanceDisplay();
                fetchTransactionList();
            })
                .catch(function (error) {
                console.error("Error adding new transaction:", error);
            });
        });
    }
    function updateBalanceDisplay() {
        var formattedBalance = formatCurrency(currentBalance);
        balanceElement.textContent = formattedBalance;
    }
    function formatCurrency(amount) {
        var formatter = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return formatter.format(amount);
    }
    function fetchTransactionList() {
        var transactionList = document.getElementById("transactionList");
        if (transactionList && noTransactionMessage) {
            fetch("".concat(apiUrl, "/api/transactions"))
                .then(function (response) { return response.json(); })
                .then(function (data) {
                console.log("Fetched transactions:", data.transactions);
                transactionList.innerHTML = ""; // Clear previous items
                if (data.transactions.length === 0) {
                    noTransactionMessage.style.display = "block";
                }
                else {
                    noTransactionMessage.style.display = "none";
                    data.transactions.forEach(function (transaction) {
                        var card = document.createElement("div");
                        card.className = "card";
                        card.innerHTML = "\n              <div class=\"card-body\">\n                <h5 class=\"card-title\">ID: ".concat(transaction.id, "</h5>\n                <p class=\"card-text\">Amount: ").concat(transaction.amount, "</p>\n                <p class=\"card-text\">Type: ").concat(transaction.type, "</p>\n                <p class=\"card-text\">Description: ").concat(transaction.description, "</p>\n                <button class=\"btn btn-secondary me-2 edit-button\">Edit</button>\n                <button class=\"btn btn-danger delete-button\">Delete</button>\n                <div class=\"edit-form\" style=\"display: none;\">\n                  <input type=\"number\" class=\"form-control\" id=\"editAmount\" placeholder=\"Amount\" value=\"").concat(transaction.amount, "\">\n                  <select class=\"form-select mt-2\" id=\"editTransactionType\">\n                    <option value=\"income\" ").concat(transaction.type === "income" ? "selected" : "", ">Income</option>\n                    <option value=\"expense\" ").concat(transaction.type === "expense" ? "selected" : "", ">Expense</option>\n                  </select>\n                  <input type=\"text\" class=\"form-control mt-2\" id=\"editDescription\" placeholder=\"Description\" value=\"").concat(transaction.description, "\">\n                  <button class=\"btn btn-primary mt-2 update-button\">Update</button>\n                </div>\n              </div>\n            ");
                        var editButton = card.querySelector(".edit-button");
                        editButton.addEventListener("click", function () {
                            var shouldEdit = window.confirm("Apakah Anda yakin ingin mengedit transaksi ini?");
                            if (shouldEdit) {
                                editTransaction(transaction.id);
                            }
                        });
                        var deleteButton = card.querySelector(".delete-button");
                        deleteButton.addEventListener("click", function () {
                            var shouldDelete = window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?");
                            if (shouldDelete) {
                                deleteTransaction(transaction.id);
                            }
                        });
                        transactionList.appendChild(card);
                    });
                    // Recalculate balance and update display
                    currentBalance = 0;
                    data.transactions.forEach(function (transaction) {
                        if (transaction.type === "income") {
                            currentBalance += transaction.amount;
                        }
                        else if (transaction.type === "expense") {
                            currentBalance -= transaction.amount;
                        }
                    });
                    updateBalanceDisplay();
                }
            })
                .catch(function (error) {
                console.error("Error fetching transaction data:", error);
            });
        }
    }
    function deleteTransaction(transactionId) {
        fetch("".concat(apiUrl, "/api/transactions/").concat(transactionId), {
            method: "DELETE",
        })
            .then(function (response) { return response.json(); })
            .then(function () {
            console.log("Transaction with ID ".concat(transactionId, " deleted."));
            // Fetch and update the transaction list
            fetchTransactionList();
        })
            .catch(function (error) {
            console.error("Error deleting transaction with ID ".concat(transactionId, ":"), error);
        });
    }
    function editTransaction(transactionId) {
        fetch("".concat(apiUrl, "/api/transactions/").concat(transactionId))
            .then(function (response) { return response.json(); })
            .then(function (transaction) {
            var editForm = document.getElementById("editForm");
            var editDescription = editForm.querySelector("#editDescription");
            var editAmount = editForm.querySelector("#editAmount");
            var editType = editForm.querySelector("#editType");
            editDescription.value = transaction.description;
            editAmount.value = transaction.amount.toString();
            editType.value = transaction.type;
            // Check if the dataset attribute exists before setting it
            if (editForm.dataset) {
                editForm.dataset.transactionId = transactionId.toString();
            }
            editForm.style.display = "block";
            editForm.addEventListener("submit", function (event) {
                var _a;
                event.preventDefault();
                var newDescription = editDescription.value;
                var newAmount = parseFloat(editAmount.value);
                var newType = editType.value;
                var updatedTransaction = {
                    description: newDescription,
                    amount: newAmount,
                    type: newType,
                };
                // Get the transaction ID from the data attribute
                var editedTransactionId = parseInt(((_a = editForm.dataset) === null || _a === void 0 ? void 0 : _a.transactionId) || "");
                fetch("".concat(apiUrl, "/api/transactions/").concat(editedTransactionId), {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedTransaction),
                })
                    .then(function (response) { return response.json(); })
                    .then(function () {
                    console.log("Transaction with ID ".concat(editedTransactionId, " updated."));
                    editForm.style.display = "none";
                    fetchTransactionList();
                })
                    .catch(function (error) {
                    console.error("Error updating transaction with ID ".concat(editedTransactionId, ":"), error);
                });
            });
        })
            .catch(function (error) {
            console.error("Error fetching transaction details for edit:", error);
        });
    }
    fetchTransactionList();
});
