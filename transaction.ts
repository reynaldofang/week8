import express, { Request, Response } from "express";

import { Transaction } from "./models/transaction";

const router = express.Router();

const transactions: Transaction[] = [];

let balance: number = 0;
let nextId: number = 1;

// create new a transcation

router.post("/transactions", (req, res) => {
  const { amount, type, description } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const transcation: Transaction = {
    id: nextId,
    amount,
    type,
    description,
  };

  transactions.push(transcation);

  if (type === "income") {
    balance += amount;
  } else if (type === "expense") {
    balance -= amount;
  }

  nextId++;

  res.json({ message: "Transcation added successfuly", transcation });
});

// Read all transactions
router.get("/transactions", (req, res) => {
  res.json({ transactions, balance });
});

// Read a single transcations

router.get("/transactions/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const transaction = transactions.find((trans) => trans.id === id);

  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  res.json(transaction);
});

// Update a transcations by ID using PUT
router.put("/transactions/:id", (req, res) => {
  const { id } = req.params;
  const { amount, type, description } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const transactionToUpdate = transactions.find(
    (transaction) => transaction.id === parseInt(id)
  );

  if (!transactionToUpdate) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  // Adjust the balance by reversing the previous transaction's effect
  if (transactionToUpdate.type === "income") {
    balance -= transactionToUpdate.amount;
  } else if (transactionToUpdate.type === "expense") {
    balance += transactionToUpdate.amount;
  }

  // Update the transaction with new values
  transactionToUpdate.amount = amount;
  transactionToUpdate.type = type;
  transactionToUpdate.description = description;

  // Adjust the balance with the effect of the updated transaction
  if (type === "income") {
    balance += amount;
  } else if (type === "expense") {
    balance -= amount;
  }

  res.json({
    message: "Transaction updated successfully",
    transaction: transactionToUpdate,
    balance,
  });
});

// Update a transaction by ID using PATCH
router.patch("/transactions/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;

  const transactionIndex = transactions.findIndex((trans) => trans.id === id);

  if (transactionIndex === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  transactions[transactionIndex] = {
    ...transactions[transactionIndex],
    ...updates,
  };

  res.json({
    message: "Transaction updated successfully",
    transaction: transactions[transactionIndex],
  });
});

// Delete a transcations

router.delete("/transactions/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const transactionIndex = transactions.findIndex((trans) => trans.id === id);

  if (transactionIndex === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  const deletedTransaction = transactions[transactionIndex];
  const transactionAmount = deletedTransaction.amount;

  if (deletedTransaction.type === "income") {
    balance -= transactionAmount; // Subtract transactionAmount from balance
  } else if (deletedTransaction.type === "expense") {
    balance += transactionAmount; // Add transactionAmount to balance
  }

  transactions.splice(transactionIndex, 1); // Remove the transaction from the array

  res.json({
    message: "Transaction deleted successfully",
    balance,
  });
});

export default router;
