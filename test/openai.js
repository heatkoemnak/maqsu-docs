const express = require('express');
const dotenv = require('dotenv');
const OpenAI = require('openai');
// const fetch = require('node-fetch'); // To send replies back to Chatwoot

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Endpoint to receive Chatwoot webhook
app.post('/api/chatwoot-webhook', async (req, res) => {
  try {
    const { conversation, message } = req.body;
    const userMessage = message.content;
    const conversationId = conversation.id;
    const inboxId = conversation.inbox_id;

    console.log("📩 New message from user:", userMessage);

    // Call OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [{ role: "user", content: userMessage }],
    });

    const reply = aiResponse.choices[0].message.content;

    // Send reply back to Chatwoot
    await fetch(`${process.env.CHATWOOT_URL}/api/v1/accounts/${process.env.CW_ACCOUNT_ID}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_access_token': process.env.CW_API_KEY
      },
      body: JSON.stringify({
        content: reply,
        message_type: 'outgoing'
      })
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error handling Chatwoot webhook:", error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000")

});
