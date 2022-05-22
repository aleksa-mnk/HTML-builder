const path = require('path');
const fs = require('fs');

const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(bundlePath, 'utf-8');

const sourceDirPath = path.join(__dirname, 'styles');

const mergeStyles = async () => {
    const files = await fs.promises.readdir(sourceDirPath, { withFileTypes: true });
    files.forEach(async (file) => {
        const filePath = path.join(sourceDirPath, file.name);
        if (file.isFile() && (path.extname(filePath) === '.css')) {
            const stream = fs.createReadStream(filePath, 'utf-8');
            const fileData = await new Promise((resolve) => {
                let data = '';
                stream.on('data', (chunk) => data += chunk);
                stream.on('end', () => resolve(`${data}\n`));
            });
            writeStream.write(fileData);
        }
    });
};

mergeStyles();