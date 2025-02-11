const fs = require('fs');
const path = require('path');

function removeComments(content) {
    // Remove HTML comments
    content = content.replace(/<!--[\s\S]*?-->/g, '');
    
    // Remove single-line comments
    content = content.replace(/\/\/.*/g, '');
    
    // Remove multi-line comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove empty lines
    content = content.replace(/^\s*[\r\n]/gm, '');
    
    return content;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else {
            const content = fs.readFileSync(filePath, 'utf8');
            const cleanContent = removeComments(content);
            fs.writeFileSync(filePath, cleanContent);
        }
    });
}

// Start processing from root directory
processDirectory('./'); 