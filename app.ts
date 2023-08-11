import express from "express";
import bodyParser from "body-parser";
import transactionsRouter from "./transaction";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = 8000;

app.use(bodyParser.json());

app.use(cors());

app.use("/api", transactionsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
