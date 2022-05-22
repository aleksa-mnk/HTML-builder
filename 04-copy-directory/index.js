const path = require('path');
const fs = require('fs/promises');

const dirPathIn = path.join(__dirname, 'files');
const dirPathOut = path.join(__dirname, 'files-copy');

const copyDirectory = async () => {
    await fs.rm(dirPathOut, { force: true, recursive: true });
    await fs.mkdir(dirPathOut);
    const files = await fs.readdir(dirPathIn, { withFileTypes: true });
    files.forEach(async (file) => {
        if (file.isFile()) {
            const filePathIn = path.join(dirPathIn, file.name);
            const filePathOut = path.join(dirPathOut, file.name);
            await fs.copyFile(filePathIn, filePathOut);
        }
    });
};

copyDirectory();