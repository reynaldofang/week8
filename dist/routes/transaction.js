"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const transcations = [
    { id: 1, amount: 500000, type: "income", description: "mamak kasih jajan" },
];
let balance = 0;
let nextId = 1;
// create new a transcation
router.post("/transcations", (req, res) => {
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
    transcations.push(transcation);
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
router.get("/", (req, res) => {
    res.json({ transcations, balance });
});
exports.default = router;
