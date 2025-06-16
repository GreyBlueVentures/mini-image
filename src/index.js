import path from "path";
import { globby } from "globby";
import sharp from "sharp";

async function convertImage(filePath, sourceDir, targetFormat) {
  const imageName = path.basename(filePath).split(".")[0];
  const outputPath = path.join(sourceDir, `${imageName}.${targetFormat}`);

  await sharp(filePath).toFormat(targetFormat).toFile(outputPath);
  console.log(`Converting image: ${filePath}, output: ${outputPath}`);
  return {
    original: filePath,
    converted: outputPath,
    format: targetFormat,
  };
}

async function processImages(sourceDir, targetFormat) {
  /** Fetch all images in source directory */
  const imageFiles = await globby([
    `${sourceDir}/**/*.{png,jpg,jpeg}`,
    "!node_modules",
  ]);

  const convertedImages = [];
  /** Convert each image to specified format */
  for (const file of imageFiles) {
    const convertedImage = await convertImage(file, sourceDir, targetFormat);
    convertedImages.push(convertedImage);
  }
  return convertedImages;
}

function getTargetFormat(optionFlags = "") {
  if (optionFlags.includes("--webp")) {
    return "webp";
  } else if (optionFlags.includes("--avif")) {
    return "avif";
  } else if (optionFlags.includes("--jpeg")) {
    return "jpeg";
  } else if (optionFlags.includes("--png")) {
    return "png";
  } else {
    console.error(
      "Invalid format option. Use --webp, --avif, --jpeg, or --png."
    );
    process.exit(1);
  }
}

async function main() {
  /**
   * 1. Convert images
   * 2. Replace converted image paths in specified files
   */
  const sourceDir = process.argv[2];
  const optionFlags = process.argv[3];

  const targetFormat = getTargetFormat(optionFlags);

  if (!sourceDir) {
    console.error("Usage: node index.js <sourceDir> <targetDir>");
    process.exit(1);
  }

  const processedImages = await processImages(sourceDir, targetFormat);
  console.log("Processed images:", processedImages);
}

main();
