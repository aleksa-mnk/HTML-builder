const path = require('path');
const fs = require('fs');

const dirProject = path.join(__dirname, 'project-dist');
const assetsPathIn = path.join(__dirname, 'assets');
const assetsPathOut = path.join(dirProject, 'assets');

const start = async () => {
    await fs.promises.rm(dirProject, { force: true, recursive: true });
    await fs.promises.mkdir(dirProject);
    copyAssets(assetsPathIn, assetsPathOut);
    bundleStyles();
    replaceTemplateTags();
}

const copyAssets = async (dirPathIn, dirPathOut) => {
    await fs.promises.rm(dirPathOut, { force: true, recursive: true });
    await fs.promises.mkdir(dirPathOut);
    const files = await fs.promises.readdir(dirPathIn, { withFileTypes: true });
    files.forEach(async (file) => {
        const filePathIn = path.join(dirPathIn, file.name);
        const filePathOut = path.join(dirPathOut, file.name);
        (file.isFile()) ? await fs.promises.copyFile(filePathIn, filePathOut) : await copyAssets(filePathIn, filePathOut);
    });
};

function bundleStyles() {
    const bundlePath = path.join(dirProject, 'style.css');
    const sourceDirPath = path.join(__dirname, 'styles');
    const writeStream = fs.createWriteStream(bundlePath, 'utf-8');

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
}

const findTemplatesTags = async () => {
    const result = {};
    const componentsPath = path.join(__dirname, 'components');
    const components = await fs.promises.readdir(componentsPath, { withFileTypes: true });

    for (const file of components) {
        const filePath = path.join(componentsPath, file.name);
        if (file.isFile() && (path.extname(filePath) === '.html')) {
            const data = await fs.promises.readFile(filePath);
            result[file.name] = data.toString();
        }
    }

    return result;
};

const replaceTemplateTags = async () => {
    const components = await findTemplatesTags();
    const stream = fs.createWriteStream(path.join(dirProject, 'index.html'));

    fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data) => {
        if (err) throw err.message;
        let result = data;
        Object.keys(components).forEach(component => {
            result = result.replace(`{{${component.split('.')[0]}}}`, components[component]);
        });
        stream.write(result);
    });
}

start();