const fs = require('fs');
const path = require('path');

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/u;

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (!filePath.includes('node_modules') && !filePath.includes('.next')) {
                results = results.concat(walkDir(filePath));
            }
        } else {
            if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
                const content = fs.readFileSync(filePath, 'utf8');
                if (emojiRegex.test(content)) {
                    results.push(filePath);
                }
            }
        }
    });
    return results;
}

const files = walkDir(path.join(__dirname, 'src'));
console.log("Files with emojis:");
files.forEach(f => console.log(f));
