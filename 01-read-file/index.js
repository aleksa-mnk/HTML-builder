const fs = require('fs');
const path = require('path');

const pathText = path.join(__dirname, 'text.txt');
const ReadStream = fs.createReadStream(pathText, 'utf-8');

ReadStream.on('data', chunk => console.log(chunk));
ReadStream.on('error', error => console.log(error.message));