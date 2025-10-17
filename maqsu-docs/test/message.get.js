const axios = require('axios'); // or const axios = require('axios');
require('dotenv').config();

const accountId = process.env.CW_ACCOUNT_ID;
const conversationId = 3;
const apiKey = process.env.CW_API_KEY;

const url = `https://app.chatwoot.com/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
const options = {method: 'GET', headers: {api_access_token: apiKey}, body: undefined};

(async () => {
  try {

    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error("❌ Error sending message:", error.response?.data || error.message);
  }
})();
