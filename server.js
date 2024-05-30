const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve the HTML upload form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/execute', upload.fields([{ name: 'code' }, { name: 'input' }]), (req, res) => {
    const codeFile = req.files['code'][0];
    const inputFile = req.files['input'][0];

    const codePath = codeFile.path;
    const inputPath = inputFile.path;
    const outputPath = 'output.txt';

    // Change this command according to the language of the code file
    const command = `timeout 2s python3 ${codePath} < ${inputPath} > ${outputPath}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            if (error.code === 124) { // 124 is the exit code for timeout
                return res.status(500).send('Error: Time limit exceeded');
            }
            return res.status(500).send(`Error: ${stderr}`);
        }
        fs.readFile(outputPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send(`Error reading output: ${err.message}`);
            }
            res.send(data);
        });
    });
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
