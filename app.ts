import express from "express";
import bodyParser from "body-parser";
import transactionsRouter from "./transaction";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 8000;

app.use(bodyParser.json());

app.use('/', transactionsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


