"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const transactions = [];
let balance = 0;
let nextId = 1;
// create new a transcation
router.post("/transactions", (req, res) => {
    const { amount, type, description } = req.body;
    if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: "Invalid amount" });
    }
    const transcation = {
        id: nextId,
        amount,
        type,
        description,
    };
    transactions.push(transcation);
    if (type === "income") {
        balance += amount;
    }
    else if (type === "expense") {
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
    const id = parseInt(req.params.id);
    const { amount, type, description } = req.body;
    const transactionIndex = transactions.findIndex((trans) => trans.id === id);
    if (transactionIndex === -1) {
        return res.status(404).json({ error: "Transaction not found" });
    }
    const previousTransaction = transactions[transactionIndex];
    const previousAmount = previousTransaction.amount;
    const newAmount = parseFloat(amount);
    if (isNaN(newAmount)) {
        return res.status(400).json({ error: "Invalid amount value" });
    }
    const amountChange = newAmount - previousAmount;
    console.log(amountChange);
    // Determine the change in balance based on transaction type
    let balanceChange = 0;
    console.log("berapa balance", balanceChange);
    if (type === "income") {
        balanceChange = amountChange;
    }
    else if (type === "expense") {
        balanceChange -= -amountChange; // Change this line to a negative value
    }
    console.log("Previous Balance:", balance); // Add this line to log previous balance
    console.log("Balance Change:", balanceChange); // Add this line to log balance change
    transactions[transactionIndex] = Object.assign(Object.assign({}, previousTransaction), { amount: newAmount, type,
        description });
    // Update the balance
    balance += balanceChange;
    res.json({
        message: "Transaction updated successfully",
        transaction: transactions[transactionIndex],
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
    transactions[transactionIndex] = Object.assign(Object.assign({}, transactions[transactionIndex]), updates);
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
    }
    else if (deletedTransaction.type === "expense") {
        balance += transactionAmount; // Add transactionAmount to balance
    }
    transactions.splice(transactionIndex, 1); // Remove the transaction from the array
    res.json({
        message: "Transaction deleted successfully",
        balance,
    });
});
exports.default = router;
