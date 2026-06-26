const express = require('express');
const router = require('./router/router');
const cors = require("cors");
require("dotenv").config();
const database = require("./db");
const cookieParser = require('cookie-parser');


const app = express()


database();

app.use(express.json())
app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use('/', router);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
