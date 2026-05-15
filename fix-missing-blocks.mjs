import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export default function fixMissingBlocks() {
  return {
    name: "fix-missing-blocks",
    hooks: {
      "astro:config:setup": () => {
        const pagesDir = path.join(process.cwd(), "src/content/page");

        if (!fs.existsSync(pagesDir)) return;

        const files = fs
          .readdirSync(pagesDir)
          .filter((f) => f.endsWith(".mdx"));

        files.forEach((file) => {
          const filePath = path.join(pagesDir, file);
          let content = fs.readFileSync(filePath, "utf8");

          // Check if frontmatter exists and doesn't have blocks field
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            if (!frontmatter.includes("blocks:")) {
              // Add blocks: [] to the end of frontmatter
              const newContent = content.replace(
                /^---\n([\s\S]*?)\n---/,
                `---\n$1\nblocks: []\n---`
              );
              fs.writeFileSync(filePath, newContent);
              console.log(`✅ Fixed missing blocks in ${file}`);
            }
          }
        });
      },
    },
  };
}
