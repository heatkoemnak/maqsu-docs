const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testSupabase() {
  try {
    const userMessage = "How to start a Docusaurus site?";

    // 1️⃣ Create embedding for document content
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: userMessage,
    });

    const [{ embedding }] = embeddingRes.data;

    // 2️⃣ Insert into mdx_docs table
    const { error: insertError } = await supabase.from("mdx_docs").insert([
      {
        title: "Getting started",
        description: "Description for getting started",
        tags: ["Demo", "Getting started"], // ✅ Must be an array, not string
        content: "Content for getting started. Learn how to create a Docusaurus site easily.",
        embedding: embedding,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      return;
    }
    console.log("✅ Inserted successfully into mdx_docs");

    // 3️⃣ Use same embedding (or create new one) to test similarity search
    const { data: matchData, error: matchError } = await supabase.rpc("match_mdx_docs", {
      query_embedding: embedding, // ✅ Use same embedding for now
      match_count: 3,
    });

    if (matchError) {
      console.error("Supabase RPC error:", matchError);
    } else {
      console.log("✅ Top matching docs:", matchData);
    }

  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

testSupabase();
