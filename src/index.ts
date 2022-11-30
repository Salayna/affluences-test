import express, {} from 'express';
import router from "./routes";
import dotenv from "dotenv"
import * as process from "process";

dotenv.config()
const app = express();
const port = process.env.PORT
app.use(router);

app.listen(port , () => {
    console.log(`Server started on port ${port}`);
});