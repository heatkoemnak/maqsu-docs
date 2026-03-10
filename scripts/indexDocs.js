const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function indexDocs() {
  const docsDir = path.join(__dirname, "../src/pages/sales/orders"); // folder containing .mdx files
  const files = fs.readdirSync(docsDir).filter(f => f.endsWith(".mdx"));

  for (const file of files) {
    const filePath = path.join(docsDir, file);
    const raw = fs.readFileSync(filePath, "utf8");

    // Parse YAML + content
    const { data, content } = matter(raw);
    const title = data.title || path.basename(file, ".mdx");

    // Merge structured sections like 'how_to' or 'items' into one readable text
    let structuredText = "";
    if (data.how_to) {
      structuredText += data.how_to.map(
        item => `\n## ${item.title}\n${item.body || ""}`
      ).join("\n");
    }
    if (data.items) {
      structuredText += data.items.map(
        item => `\n### ${item.title}\n${item.body || ""}`
      ).join("\n");
    }

    // Combine all content
    const fullContent = `${title}\n\n${structuredText}\n\n${content}`;

    console.log(`📘 Indexing: ${title}`);

    // Generate embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: fullContent
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Store in Supabase
    const { error } = await supabase
      .from("docs_embeddings")
      .insert({
        title,
        content: fullContent,
        embedding
      });

    if (error) console.error("❌ Error inserting:", error);
    else console.log(`✅ Indexed: ${title}`);
  }

  console.log("🎉 All .mdx files embedded into Supabase!");
}

indexDocs();
