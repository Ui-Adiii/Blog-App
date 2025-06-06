import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './utils/db.js'

dotenv.config({})
connectDB();

const app = express();
app.use(cors({}))
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.listen(PORT, () => {
  console.log(`server started on : ${PORT}`);  
})