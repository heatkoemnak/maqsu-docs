const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


(async () => {
  try {
    console.log("🔍 Testing OpenAI connection...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo" if your account doesn't have gpt-4 access
      messages: [{ role: "user", content: "Hello, are you working?" }],
    });

    console.log("✅ OpenAI Response:", response.choices[0].message.content);
  } catch (error) {
    console.error("❌ OpenAI test failed:", error);
  }
})();

(async () => {
  try {
    console.log("🔍 Testing Supabase table connection...");

    // Insert a new row
    // const { data: insertData, error: insertError } = await supabase
    //   .from("test_connections")
    //   .insert([{ name: "Hello from Node.js" }])
    //   .select();

    // if (insertError) throw insertError;
    // console.log("✅ Inserted:", insertData);

    // Fetch the latest rows
    const { data: fetchData, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (fetchError) throw fetchError;
    console.log("✅ Retrieved rows:", fetchData);
  } catch (error) {
    console.error("❌ Supabase test failed:", error.message);
  }
})();

// async function addDocument(content) {
//   const embeddingRes = await openai.embeddings.create({
//     model: "text-embedding-3-small",
//     input: content,
//   });

//   const embedding = embeddingRes.data[0].embedding;

//   await supabase
//     .from('document_embeddings')
//     .insert([{ content, embedding }]);
// }

// (async () => {
//   const { data: docs } = await supabase.from('docs').select('content');
//   console.log(docs);
// //   for (const doc of docs) {
// //     await addDocument(doc.content);
// //   }
// })();
