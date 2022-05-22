const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;

const pathText = path.join(__dirname, 'text.txt');
const WriteStream = fs.createWriteStream(pathText);

stdout.write('Enter text until you get bored :)\n');

stdin.on('data', data => (!data.includes('exit')) ? WriteStream.write(data.toString()) : process.exit());
stdin.on('error', error => console.log(error.message));

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Well, is it time to check the third task?)'));