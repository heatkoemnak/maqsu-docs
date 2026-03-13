const express = require("express");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");
dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const apiKey = process.env.CW_API_KEY;

app.post("/api/chatwoot-webhook", async (req, res) => {
  try {
    const { message_type, content, conversation, account, sender } = req.body;

    if (message_type === "outgoing") return res.sendStatus(200);

    console.log("🆕 New user message:", content);

    // Step 1: Create embedding for user question
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: content
    });
    const userEmbedding = embeddingResponse.data[0].embedding;

    // Step 2: Query Supabase for most relevant document content
    const { data: matches, error } = await supabase.rpc("match_mdx_documents", {
      query_embedding: userEmbedding,
      match_threshold: 0.75,
      match_count: 3
    });

    if (error) throw error;

    const context = matches.map(m => m.doc_content).join("\n\n");
    console.log(context);

    // Step 3: Ask AI with context
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant answering based on the following documentation."
        },
        { role: "user", content: `Context:\n${context}\n\nQuestion: ${content}` }
      ]
    });

    const answer = aiResponse.choices[0].message.content;

    // Step 4: Reply back to Chatwoot
    const chatwootUrl = `https://app.chatwoot.com/api/v1/accounts/${account.id}/conversations/${conversation.id}/messages`;

    await axios.post(chatwootUrl, { content: answer, message_type: "outgoing" }, {
      headers: {
        'api_access_token': apiKey,
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Sent AI reply!");
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// 🚀 Start your server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
