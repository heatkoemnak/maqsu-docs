// // auto-create.js
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

// Folder to watch
const watchDir = path.resolve("./src/pages/sales"); // Adjust as needed

console.log(`👀 Watching directory: ${watchDir}`);

const watcher = chokidar.watch(watchDir, {
  persistent: true,
  ignoreInitial: true, // Ignore already existing files
});

// Watch for new .mdx files
watcher.on("add", (filePath) => {
  const fileName = path.basename(filePath); // e.g., "hello.mdx"
  const dirName = path.dirname(filePath);

  if (fileName.endsWith(".mdx")) {
    const baseName = fileName.replace(".mdx", ""); // "hello"
    const newFolderPath = path.join(dirName, `${baseName}s`); // "./src/pages/hellos"
    const newFilePath = path.join(newFolderPath, `${baseName}.js`); // "./src/pages/hellos/hello.js"

    // Create folder if not exist
    if (!fs.existsSync(newFolderPath)) {
      fs.mkdirSync(newFolderPath, { recursive: true });
      console.log(`📁 Created folder: ${newFolderPath}`);
    }

    // Create JS file if not exist
    if (!fs.existsSync(newFilePath)) {
      const content = `import React from "react";


        // Auto-generated file for ${baseName}.mdx
        `;

      fs.writeFileSync(newFilePath, content);
      console.log(`✅ Created file: ${newFilePath}`);
    } else {
      console.log(`⚠️ Skipped (already exists): ${newFilePath}`);
    }
  }
});

// Helper function to capitalize the page name
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
