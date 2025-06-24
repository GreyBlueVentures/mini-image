
# 🖼️ mini-image-cli

**mini-image-cli** is a blazing-fast CLI tool that converts images (`.png`, `.jpg`, `.jpeg`) to modern formats like `webp` or `avif` using [sharp](https://github.com/lovell/sharp), and automatically replaces image paths in your source code. It’s ideal for developers looking to optimize image delivery and modernize asset handling in JavaScript/TypeScript projects.

---

## ✨ Features

- ✅ **Convert images** to `webp` or `avif` using `sharp`
- 🔁 **Replace image paths** in `.js`, `.ts`, `.jsx`, `.tsx` files
- 🧠 **Supports path aliasing** for frameworks like Next.js or Vite (e.g. `@/assets/logo.png`)
- 📁 **Recursively processes** nested image folders and source files
- ⚙️ **Customizable output** and flexible directory structure

---

## 📦 Installation

```bash
npm install mini-image-cli
```

## Usage
```bash
mini-image <sourceDir> <targetDir?> <replacementDir?> <aliasPathSymbol?> <rootPath?> --webp|--avif
```
### Required:
-   `<sourceDir>`: Directory containing images to convert
    
-   `--webp` or `--avif`: Choose one target format
    

### Optional:
-   `<targetDir>`: Where to save converted images (defaults to `<sourceDir>`)
    
-   `<replacementDir>`: Directory to scan and update image path references
    
-   `<aliasPathSymbol>`: Alias used in code (e.g. `@`)
    
-   `<rootPath>`: Real path that corresponds to alias (e.g. `src`)

## Examples

### ✅ Convert Images Only

```bash
mini-image src/assets --webp
``` 

Converts all `.png`, `.jpg`, `.jpeg` files inside `src/assets` to `.webp`.

### 🔄 Convert and Replace Paths

```bash
mini-image src/images public/optimized src/components --webp
``` 

-   Converts `src/images/*` to `.webp`
    
-   Saves to `public/optimized`
    
-   Replaces original paths in `src/components` with new ones

### With Alias Support

```bash
mini-image src/images public/optimized src/pages @ src --avif
``` 

Assuming your project uses aliases like:

`import hero from  '@/images/hero.jpg';` 

They'll be replaced with:

`import hero from  '@/optimized/hero.avif';`