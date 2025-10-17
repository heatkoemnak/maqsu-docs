const axios = require('axios'); // or const axios = require('axios');
require('dotenv').config();

const accountId = '138386';
const conversationId = 3;
const apiKey = process.env.CW_API_KEY;

const url = `https://app.chatwoot.com/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;

const messageBody = {
  content: "Hello",
  message_type: "outgoing",
  private: false,
  content_type: "text",
  content_attributes: {},
  campaign_id: 1,
  template_params: {
    name: "purchase_receipt",
    category: "UTILITY",
    language: "en_US",
    processed_params: {
      body: { "1": "Visa", "2": "Nike", "3": "Bill" },
      header: {
        media_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        media_type: "document"
      },
      buttons: [
        { type: "url", parameter: "SSFSDFSD" }
      ]
    }
  }
};

(async () => {
  try {
    const response = await axios.post(url, messageBody, {
      headers: {
        'api_access_token': apiKey,
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Message sent:", response.data);
  } catch (error) {
    console.error("❌ Error sending message:", error.response?.data || error.message);
  }
})();
