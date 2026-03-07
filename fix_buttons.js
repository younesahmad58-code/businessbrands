const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;

const string1 = 'style="margin-top: 0.75rem; font-size: 0.8rem; padding: 0.5rem 1.2rem"';
const string2 = 'style="margin-top: 0.5rem; font-size: 0.75rem; padding: 0.4rem 1rem; display: inline-flex; align-items: center; gap: 0.4rem;"';

const replacement1 = 'style="margin-top: 0.8rem; font-size: 0.8rem; padding: 0.5rem 1.2rem; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; min-height: 42px;"';
const replacement2 = 'style="margin-top: 0.8rem; font-size: 0.8rem; padding: 0.5rem 1.2rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; box-sizing: border-box; min-height: 42px;"';

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        if (path.extname(file) === '.html') {
            const filePath = path.join(directoryPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let updated = false;
            
            if (content.includes(string1)) {
                content = content.replace(string1, replacement1);
                updated = true;
            }
            if (content.includes(string2)) {
                content = content.replace(string2, replacement2);
                updated = true;
            }
            
            if (updated) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated ${file}`);
            }
        }
    });
});
