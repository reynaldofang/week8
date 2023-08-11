"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.default.Router();
var transactions = [];
var balance = 0;
var nextId = 1;
// create new a transcation
router.post("/transactions", function (req, res) {
    var _a = req.body, amount = _a.amount, type = _a.type, description = _a.description;
    if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: "Invalid amount" });
    }
    var transcation = {
        id: nextId,
        amount: amount,
        type: type,
        description: description,
    };
    transactions.push(transcation);
    if (type === "income") {
        balance += amount;
    }
    else if (type === "expense") {
        balance -= amount;
    }
    nextId++;
    res.json({ message: "Transcation added successfuly", transcation: transcation });
});
// Read all transactions
router.get("/transactions", function (req, res) {
    res.json({ transactions: transactions, balance: balance });
});
// Read a single transcations
router.get("/transactions/:id", function (req, res) {
    var id = parseInt(req.params.id);
    var transaction = transactions.find(function (trans) { return trans.id === id; });
    if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
});
// Update a transcations by ID using PUT
router.put("/transactions/:id", function (req, res) {
    var id = parseInt(req.params.id);
    var _a = req.body, amount = _a.amount, type = _a.type, description = _a.description;
    var transactionIndex = transactions.findIndex(function (trans) { return trans.id === id; });
    if (transactionIndex === -1) {
        return res.status(404).json({ error: "Transaction not found" });
    }
    var previousTransaction = transactions[transactionIndex];
    var previousAmount = previousTransaction.amount;
    var newAmount = parseFloat(amount);
    if (isNaN(newAmount)) {
        return res.status(400).json({ error: "Invalid amount value" });
    }
    var amountChange = newAmount - previousAmount;
    console.log(amountChange);
    // Determine the change in balance based on transaction type
    var balanceChange = 0;
    console.log("berapa balance", balanceChange);
    if (type === "income") {
        balanceChange = amountChange;
    }
    else if (type === "expense") {
        balanceChange -= -amountChange; // Change this line to a negative value
    }
    console.log("Previous Balance:", balance); // Add this line to log previous balance
    console.log("Balance Change:", balanceChange); // Add this line to log balance change
    transactions[transactionIndex] = __assign(__assign({}, previousTransaction), { amount: newAmount, type: type, description: description });
    // Update the balance
    balance += balanceChange;
    res.json({
        message: "Transaction updated successfully",
        transaction: transactions[transactionIndex],
        balance: balance,
    });
});
// Update a transaction by ID using PATCH
router.patch("/transactions/:id", function (req, res) {
    var id = parseInt(req.params.id);
    var updates = req.body;
    var transactionIndex = transactions.findIndex(function (trans) { return trans.id === id; });
    if (transactionIndex === -1) {
        return res.status(404).json({ error: "Transaction not found" });
    }
    transactions[transactionIndex] = __assign(__assign({}, transactions[transactionIndex]), updates);
    res.json({
        message: "Transaction updated successfully",
        transaction: transactions[transactionIndex],
    });
});
// Delete a transcations
router.delete("/transactions/:id", function (req, res) {
    var id = parseInt(req.params.id);
    var transactionIndex = transactions.findIndex(function (trans) { return trans.id === id; });
    if (transactionIndex === -1) {
        return res.status(404).json({ error: "Transaction not found" });
    }
    var deletedTransaction = transactions[transactionIndex];
    var transactionAmount = deletedTransaction.amount;
    if (deletedTransaction.type === "income") {
        balance -= transactionAmount; // Subtract transactionAmount from balance
    }
    else if (deletedTransaction.type === "expense") {
        balance += transactionAmount; // Add transactionAmount to balance
    }
    transactions.splice(transactionIndex, 1); // Remove the transaction from the array
    res.json({
        message: "Transaction deleted successfully",
        balance: balance,
    });
});
exports.default = router;
