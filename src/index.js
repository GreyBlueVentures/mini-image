import path from "path";
import { globby } from "globby";
import sharp from "sharp";

async function convertImage(filePath, sourceDir) {
  const imageName = path.basename(filePath).split(".")[0];
  const outputPath = path.join(sourceDir, `${imageName}.webp`);

  await sharp(filePath).toFormat("webp").toFile(outputPath);

  //   const img = await loadImage(filePath);
  //   console.log(`Processing image: ${imageName}`);
  //   const { width, height } = img;
  //   const aspectRatio = width / height;
  //   let newWidth = width;
  //   let newHeight = height;

  //   const resolution = {
  //     length: 1080,
  //     breadth: 1920,
  //   };
  //   if (width > height) {
  //     newWidth = Math.min(resolution.breadth, width);
  //     newHeight = Math.min(resolution.length, height);
  //   } else {
  //     newWidth = Math.min(resolution.length, width);
  //     newHeight = Math.min(resolution.breadth, height);
  //   }
  //   if (newHeight * aspectRatio > newWidth) {
  //     newHeight = newWidth / aspectRatio;
  //   } else {
  //     newWidth = newHeight * aspectRatio;
  //   }

  //   const canvas = createCanvas(newWidth, newHeight);
  //   canvas.width = newWidth;
  //   canvas.height = newHeight;
  //   const ctx = canvas.getContext("2d");
  //   ctx.drawImage(img, 0, 0, newWidth, newHeight);
  //   const buffer = canvas.toBuffer("image/webp", { quality: 0.8 });

  //   const buffer = Buffer.from(await outputBlob.arrayBuffer());

  console.log(`Converting image: ${filePath}`);
}

async function processImages(sourceDir) {
  /** Fetch all images in source directory */
  const imageFiles = await globby([
    `${sourceDir}/**/*.{png,jpg,jpeg}`,
    "!node_modules",
  ]);

  const convertedImages = [];
  /** Convert each image to specified format */
  for (const file of imageFiles) {
    const convertedImage = await convertImage(file, sourceDir);
    convertedImages.push(convertedImage);
  }
  return convertedImages;
}

async function main() {
  /**
   * 1. Convert images
   * 2. Replace converted image paths in specified files
   */
  const sourceDir = process.argv[2];
  const targetDir = process.argv[3];
  if (!sourceDir) {
    console.error("Usage: node index.js <sourceDir> <targetDir>");
    process.exit(1);
  }

  const processedImages = await processImages(sourceDir);
}

main();
