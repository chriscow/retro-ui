#!/usr/bin/env node

/**
 * Simple build script for RetroUI Vanilla
 * Minifies CSS and JS files without dependencies
 */

const fs = require('fs');
const path = require('path');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

/**
 * Simple CSS minifier
 */
function minifyCSS(css) {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove unnecessary whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around certain characters
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        // Remove trailing semicolons
        .replace(/;}/g, '}')
        // Remove leading/trailing whitespace
        .trim();
}

/**
 * Simple JavaScript minifier
 */
function minifyJS(js) {
    return js
        // Remove single-line comments (but preserve URLs)
        .replace(/\/\/(?![^\n]*:\/\/).*$/gm, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove unnecessary whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around certain characters
        .replace(/\s*([{}();,=+\-*/])\s*/g, '$1')
        // Remove leading/trailing whitespace
        .trim();
}

/**
 * Combine and minify CSS files
 */
function buildCSS() {
    console.log('Building CSS...');
    
    // Class-based CSS bundle
    const classCSSFiles = [
        'css/retro-ui.css',
        'css/retro-ui-components.css'
    ];
    
    // Classless CSS bundle
    const classlessCSSFiles = [
        'css/retro-ui-classless.css',
        'css/retro-ui-components.css',
        'css/retro-ui-utilities.css'
    ];
    
    // Build class-based version
    let combinedClassCSS = '';
    let combinedClassMinCSS = '';
    
    classCSSFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            combinedClassCSS += content + '\n';
            combinedClassMinCSS += minifyCSS(content) + '\n';
        }
    });
    
    // Build classless version
    let combinedClasslessCSS = '';
    let combinedClasslessMinCSS = '';
    
    classlessCSSFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            combinedClasslessCSS += content + '\n';
            combinedClasslessMinCSS += minifyCSS(content) + '\n';
        }
    });
    
    // Write combined files
    fs.writeFileSync(path.join(distDir, 'retro-ui.css'), combinedClassCSS);
    fs.writeFileSync(path.join(distDir, 'retro-ui.min.css'), combinedClassMinCSS);
    
    fs.writeFileSync(path.join(distDir, 'retro-ui-classless.css'), combinedClasslessCSS);
    fs.writeFileSync(path.join(distDir, 'retro-ui-classless.min.css'), combinedClasslessMinCSS);
    
    console.log('✓ CSS built successfully (both class-based and classless versions)');
}

/**
 * Minify JavaScript files
 */
function buildJS() {
    console.log('Building JavaScript...');
    
    const jsFile = path.join(__dirname, 'js/retro-ui.js');
    
    if (fs.existsSync(jsFile)) {
        const content = fs.readFileSync(jsFile, 'utf8');
        const minified = minifyJS(content);
        
        // Write files
        fs.writeFileSync(path.join(distDir, 'retro-ui.js'), content);
        fs.writeFileSync(path.join(distDir, 'retro-ui.min.js'), minified);
    }
    
    console.log('✓ JavaScript built successfully');
}

/**
 * Copy fonts
 */
function copyFonts() {
    console.log('Copying fonts...');
    
    const fontsDir = path.join(__dirname, 'fonts');
    const distFontsDir = path.join(distDir, 'fonts');
    
    if (!fs.existsSync(distFontsDir)) {
        fs.mkdirSync(distFontsDir, { recursive: true });
    }
    
    if (fs.existsSync(fontsDir)) {
        const files = fs.readdirSync(fontsDir);
        files.forEach(file => {
            const srcPath = path.join(fontsDir, file);
            const destPath = path.join(distFontsDir, file);
            fs.copyFileSync(srcPath, destPath);
        });
    }
    
    console.log('✓ Fonts copied successfully');
}

/**
 * Generate CDN documentation
 */
function generateCDNDocs() {
    console.log('Generating CDN documentation...');
    
    const cdnContent = `# CDN Usage

## Quick Start

Include the minified files directly from a CDN:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Retro UI Example</title>
    
    <!-- Include CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/retro-ui-vanilla@1.0.0/dist/retro-ui.min.css">
</head>
<body class="retro-ui">
    
    <div class="retro-card">
        <h1>Hello Retro World!</h1>
        <button class="retro-button">Click me!</button>
    </div>
    
    <!-- Include JavaScript (optional) -->
    <script src="https://cdn.jsdelivr.net/npm/retro-ui-vanilla@1.0.0/dist/retro-ui.min.js"></script>
</body>
</html>
\`\`\`

## Available Files

### CSS Files
- \`dist/retro-ui.css\` - Full class-based CSS with comments
- \`dist/retro-ui.min.css\` - Minified class-based CSS
- \`dist/retro-ui-classless.css\` - Full classless CSS with comments
- \`dist/retro-ui-classless.min.css\` - Minified classless CSS

### JavaScript Files
- \`dist/retro-ui.js\` - Full JavaScript with comments
- \`dist/retro-ui.min.js\` - Minified JavaScript

### Fonts
- \`dist/fonts/Minecraft.otf\` - Regular Minecraft font
- \`dist/fonts/Minecraft-Bold.otf\` - Bold Minecraft font

## Version-specific URLs

### Latest Version
\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/retro-ui-vanilla@latest/dist/retro-ui.min.css">
<script src="https://cdn.jsdelivr.net/npm/retro-ui-vanilla@latest/dist/retro-ui.min.js"></script>
\`\`\`

### Specific Version
\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/retro-ui-vanilla@1.0.0/dist/retro-ui.min.css">
<script src="https://cdn.jsdelivr.net/npm/retro-ui-vanilla@1.0.0/dist/retro-ui.min.js"></script>
\`\`\`

## Font Loading

The CSS includes font-face declarations that reference the CDN:

\`\`\`css
@font-face {
    font-family: 'Minecraft';
    src: url('https://cdn.jsdelivr.net/npm/retro-ui-vanilla@1.0.0/dist/fonts/Minecraft.otf') format('opentype');
}
\`\`\`

## File Sizes

- \`retro-ui.min.css\`: ~15KB gzipped
- \`retro-ui.min.js\`: ~8KB gzipped
- \`Minecraft.otf\`: ~25KB
- \`Minecraft-Bold.otf\`: ~25KB

## Alternative CDNs

### unpkg
\`\`\`html
<link rel="stylesheet" href="https://unpkg.com/retro-ui-vanilla@1.0.0/dist/retro-ui.min.css">
<script src="https://unpkg.com/retro-ui-vanilla@1.0.0/dist/retro-ui.min.js"></script>
\`\`\`

### GitHub Pages (if available)
\`\`\`html
<link rel="stylesheet" href="https://your-username.github.io/retro-ui-vanilla/dist/retro-ui.min.css">
<script src="https://your-username.github.io/retro-ui-vanilla/dist/retro-ui.min.js"></script>
\`\`\`
`;

    fs.writeFileSync(path.join(__dirname, 'CDN.md'), cdnContent);
    console.log('✓ CDN documentation generated');
}

/**
 * Generate file size report
 */
function generateSizeReport() {
    console.log('Generating size report...');
    
    const getFileSize = (filePath) => {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            return (stats.size / 1024).toFixed(2) + ' KB';
        }
        return 'N/A';
    };
    
    const report = `
# File Size Report

## CSS Files
- retro-ui.css: ${getFileSize(path.join(distDir, 'retro-ui.css'))}
- retro-ui.min.css: ${getFileSize(path.join(distDir, 'retro-ui.min.css'))}
- retro-ui-classless.css: ${getFileSize(path.join(distDir, 'retro-ui-classless.css'))}
- retro-ui-classless.min.css: ${getFileSize(path.join(distDir, 'retro-ui-classless.min.css'))}

## JavaScript Files
- retro-ui.js: ${getFileSize(path.join(distDir, 'retro-ui.js'))}
- retro-ui.min.js: ${getFileSize(path.join(distDir, 'retro-ui.min.js'))}

## Font Files
- Minecraft.otf: ${getFileSize(path.join(distDir, 'fonts/Minecraft.otf'))}
- Minecraft-Bold.otf: ${getFileSize(path.join(distDir, 'fonts/Minecraft-Bold.otf'))}

Generated: ${new Date().toISOString()}
`;
    
    fs.writeFileSync(path.join(distDir, 'SIZE_REPORT.md'), report);
    console.log('✓ Size report generated');
}

/**
 * Main build function
 */
function build() {
    console.log('🎮 Building RetroUI Vanilla...\n');
    
    try {
        buildCSS();
        buildJS();
        copyFonts();
        generateCDNDocs();
        generateSizeReport();
        
        console.log('\n🎉 Build completed successfully!');
        console.log('📁 Files are available in the dist/ directory');
        console.log('🌐 Ready for CDN deployment');
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

// Run build if called directly
if (require.main === module) {
    build();
}

module.exports = { build, minifyCSS, minifyJS };