const fs = require('fs/promises');
const path = require('path');
const { stdout } = process;

const readFiles = async () => {
    const SecretFolder = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(SecretFolder, { withFileTypes: true });

    files.forEach(async (file) => {
        const filePath = path.join(SecretFolder, file.name);
        const data = await fs.stat(filePath);
        if (data.isFile()) {
            const name = file.name.slice(0, file.name.lastIndexOf('.'));
            const ext = path.extname(file.name).slice(1)
            const size = (data.size / 1024).toFixed(3) + 'kb';
            stdout.write(`${name} - ${ext} - ${size}\n`);
        }
    });
}

readFiles();