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
router.get('/transactions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const transaction = transactions.find((trans) => trans.id === id);
    if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
});
exports.default = router;
