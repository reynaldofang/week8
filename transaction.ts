import express from "express";

import { Transaction } from "./models/transaction";

const router = express.Router();

const transcation: Transaction[] = [];

let balance: number = 0;
let nextId: number = 1;



export default router;
