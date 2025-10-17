const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const axios = require("axios");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const apiKey = process.env.CW_API_KEY;

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});