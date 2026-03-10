const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🔹 The search query text (you can replace or make dynamic)
const queryText = process.argv[2] || "How to create a new page?";

async function searchDocs(query) {
  console.log(`🔎 Searching for: "${query}"\n`);

  // 1️⃣ Create embedding for the search query
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: query,
  });

  const [{ embedding }] = embeddingRes.data;

  // 2️⃣ Query Supabase function `match_documents`
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.7, // you can tune this
    match_count: 5,
  });

  if (error) {
    console.error("❌ Supabase error:", error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log("⚠️ No matches found.");
    return;
  }

  // 3️⃣ Print formatted search results
  console.log(`📄 Found ${data.length} matching documents:\n`);

  data.forEach((doc, i) => {
    const preview = doc.content.slice(0, 150).replace(/\s+/g, " ") + "...";
    console.log(
      `${i + 1}. 🧩 ${doc.path || doc.file_name}\n` +
      `   🔸 Similarity: ${(doc.similarity * 100).toFixed(2)}%\n` +
      `   📝 Preview: ${preview}\n`
    );
  });
}

// Run it
searchDocs(queryText);
