import express from "express";
import bodyParser from "body-parser";
import transactionsRouter from "./transaction";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/transactions", transactionsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
