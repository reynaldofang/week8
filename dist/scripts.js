"use strict";
// scripts.ts
let currentBalance = 0;
document.addEventListener("DOMContentLoaded", () => {
    const transactionForm = document.querySelector("#transactionForm");
    const noTransactionMessage = document.getElementById("noTransactionMessage");
    const balanceElement = document.getElementById("balance");
    if (transactionForm) {
        transactionForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const transactionType = document.getElementById("transaction").value;
            const transactionDescription = document.getElementById("description").value;
            const transactionAmount = parseFloat(document.getElementById("amount").value);
            const newTransaction = {
                type: transactionType,
                description: transactionDescription,
                amount: transactionAmount,
            };
            fetch("http://localhost:8000/api/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTransaction),
            })
                .then((response) => response.json())
                .then((data) => {
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
                .catch((error) => {
                console.error("Error adding new transaction:", error);
            });
        });
    }
    function updateBalanceDisplay() {
        const formattedBalance = formatCurrency(currentBalance);
        balanceElement.textContent = formattedBalance;
    }
    function formatCurrency(amount) {
        const formatter = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return formatter.format(amount);
    }
    function fetchTransactionList() {
        const transactionList = document.getElementById("transactionList");
        if (transactionList && noTransactionMessage) {
            fetch("http://localhost:8000/api/transactions")
                .then((response) => response.json())
                .then((data) => {
                console.log("Fetched transactions:", data.transactions);
                transactionList.innerHTML = ""; // Clear previous items
                if (data.transactions.length === 0) {
                    noTransactionMessage.style.display = "block";
                }
                else {
                    noTransactionMessage.style.display = "none";
                    data.transactions.forEach((transaction) => {
                        const card = document.createElement("div");
                        card.className = "card";
                        card.innerHTML = `
              <div class="card-body">
                <h5 class="card-title">ID: ${transaction.id}</h5>
                <p class="card-text">Amount: ${transaction.amount}</p>
                <p class="card-text">Type: ${transaction.type}</p>
                <p class="card-text">Description: ${transaction.description}</p>
                <button class="btn btn-secondary me-2 edit-button">Edit</button>
                <button class="btn btn-danger delete-button">Delete</button>
                <div class="edit-form" style="display: none;">
                  <input type="number" class="form-control" id="editAmount" placeholder="Amount" value="${transaction.amount}">
                  <select class="form-select mt-2" id="editTransactionType">
                    <option value="income" ${transaction.type === "income" ? "selected" : ""}>Income</option>
                    <option value="expense" ${transaction.type === "expense" ? "selected" : ""}>Expense</option>
                  </select>
                  <input type="text" class="form-control mt-2" id="editDescription" placeholder="Description" value="${transaction.description}">
                  <button class="btn btn-primary mt-2 update-button">Update</button>
                </div>
              </div>
            `;
                        const editButton = card.querySelector(".edit-button");
                        editButton.addEventListener("click", () => {
                            const shouldEdit = window.confirm("Apakah Anda yakin ingin mengedit transaksi ini?");
                            if (shouldEdit) {
                                editTransaction(transaction.id);
                            }
                        });
                        const deleteButton = card.querySelector(".delete-button");
                        deleteButton.addEventListener("click", () => {
                            const shouldDelete = window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?");
                            if (shouldDelete) {
                                deleteTransaction(transaction.id);
                            }
                        });
                        transactionList.appendChild(card);
                    });
                    // Recalculate balance and update display
                    currentBalance = 0;
                    data.transactions.forEach((transaction) => {
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
                .catch((error) => {
                console.error("Error fetching transaction data:", error);
            });
        }
    }
    function deleteTransaction(transactionId) {
        fetch(`http://localhost:8000/api/transactions/${transactionId}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then(() => {
            console.log(`Transaction with ID ${transactionId} deleted.`);
            // Fetch and update the transaction list
            fetchTransactionList();
        })
            .catch((error) => {
            console.error(`Error deleting transaction with ID ${transactionId}:`, error);
        });
    }
    function editTransaction(transactionId) {
        fetch(`http://localhost:8000/api/transactions/${transactionId}`)
            .then((response) => response.json())
            .then((transaction) => {
            const editForm = document.getElementById("editForm");
            const editDescription = editForm.querySelector("#editDescription");
            const editAmount = editForm.querySelector("#editAmount");
            const editType = editForm.querySelector("#editType");
            editDescription.value = transaction.description;
            editAmount.value = transaction.amount.toString();
            editType.value = transaction.type;
            // Check if the dataset attribute exists before setting it
            if (editForm.dataset) {
                editForm.dataset.transactionId = transactionId.toString();
            }
            editForm.style.display = "block";
            editForm.addEventListener("submit", (event) => {
                var _a;
                event.preventDefault();
                const newDescription = editDescription.value;
                const newAmount = parseFloat(editAmount.value);
                const newType = editType.value;
                const updatedTransaction = {
                    description: newDescription,
                    amount: newAmount,
                    type: newType,
                };
                // Get the transaction ID from the data attribute
                const editedTransactionId = parseInt(((_a = editForm.dataset) === null || _a === void 0 ? void 0 : _a.transactionId) || "");
                fetch(`http://localhost:8000/api/transactions/${editedTransactionId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedTransaction),
                })
                    .then((response) => response.json())
                    .then(() => {
                    console.log(`Transaction with ID ${editedTransactionId} updated.`);
                    editForm.style.display = "none";
                    fetchTransactionList();
                })
                    .catch((error) => {
                    console.error(`Error updating transaction with ID ${editedTransactionId}:`, error);
                });
            });
        })
            .catch((error) => {
            console.error(`Error fetching transaction details for edit:`, error);
        });
    }
    fetchTransactionList();
});
