#!/usr/bin/env node

import path from "path";
import { globby } from "globby";
import sharp from "sharp";
import fs from "fs";

/**
 * Parse CLI args 
 */
function parseArgs(rawArgs) {
  const args = rawArgs.slice(2);
  const positional = [];
  const flags = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith("--")) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i++;
      }
    } else {
      positional.push(arg);
    }
  }

  return { positional, flags };
}

/**
 * Convert a single image file
 */
async function convertImage(filePath, sourceDir, targetFormat) {
  const imageName = path.basename(filePath).split(".")[0];
  const outputPath = path.join(sourceDir, `${imageName}.${targetFormat}`);

  await sharp(filePath).toFormat(targetFormat).toFile(outputPath);

  console.log(`[Mini-Image] Converting image: ${filePath}`);

  return {
    original: filePath,
    converted: outputPath,
    format: targetFormat,
  };
}

/**
 * Replace original image paths with converted ones
 */
function replaceImagePaths(rootDir, conversions) {
  const allFiles = fs.readdirSync(rootDir, { withFileTypes: true });

  for (const file of allFiles) {
    const currentFilePath = path.join(rootDir, file.name);

    if (file.isDirectory()) {
      replaceImagePaths(currentFilePath, conversions);
    } else if (/\.(js|ts|jsx|tsx)$/.test(file.name)) {
      let currentFileContent = fs.readFileSync(currentFilePath, "utf-8");
      let isContentModified = false;

      for (const conversion of conversions) {
        const { original, converted } = conversion;
        if (converted === original) continue;

        const originalRelativePath = path.relative(rootDir, original);
        const convertedRelativePath = path.relative(rootDir, converted);

        const pattern = new RegExp(
          originalRelativePath.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
          "g"
        );

        if (pattern.test(currentFileContent)) {
          console.log(
            `[Mini-Image] Replacing ${originalRelativePath} with ${convertedRelativePath}`
          );
          currentFileContent = currentFileContent.replace(
            pattern,
            convertedRelativePath
          );
          isContentModified = true;
        }
      }

      if (isContentModified)
        fs.writeFileSync(currentFilePath, currentFileContent);
    }
  }
}

/**
 * Convert all images in the directory
 */
async function processImages(sourceDir, targetFormat) {
  const imageFiles = await globby([
    `${sourceDir}/**/*.{png,jpg,jpeg}`,
    "!node_modules",
  ]);

  const convertedImages = [];

  for (const file of imageFiles) {
    const convertedImage = await convertImage(file, sourceDir, targetFormat);
    convertedImages.push(convertedImage);
  }

  return convertedImages;
}

/**
 * Determine which format is selected
 */
function getTargetFormat(flags) {
  if (flags.webp) return "webp";
  if (flags.avif) return "avif";

  console.error("[Mini-Image] Please provide --webp or --avif");
  process.exit(1);
}

/**
 * Main entry
 */
async function main() {
  const { positional, flags } = parseArgs(process.argv);
  const sourceDir = positional[0];
  const targetDir = positional[1];

  if (!sourceDir) {
    console.error("Usage: mini-image <sourceDir> <targetDir?> --webp|--avif");
    process.exit(1);
  }

  const targetFormat = getTargetFormat(flags);

  const processedImages = await processImages(sourceDir, targetFormat);

  if (!targetDir) {
    console.log(
      "[Mini-Image] No target directory provided. Skipping replacements."
    );
    return;
  }

  replaceImagePaths(path.resolve(targetDir), processedImages);
}

main().catch((err) => {
  console.error("[Mini-Image] Failed:", err);
  process.exit(1);
});
