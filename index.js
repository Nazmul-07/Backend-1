import express from 'express';
import dotenv from "dotenv"
import { connectToMongoDB } from './src/config/db.js';
import productRouter from './src/routes/productRoute.js';
import productCategoryRouter from './src/routes/productCategoryRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

// middleware
app.use(express.json());

// connctDb;
await connectToMongoDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/', productRouter)
app.use('/', productCategoryRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});