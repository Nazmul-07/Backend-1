import express from 'express';
import dotenv from "dotenv"
import { connectToMongoDB } from './src/config/db.js';
import router from './src/routes/productRoute.js';

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
app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});