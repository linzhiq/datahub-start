const express = require('express');
const app = express();
const port = 8082;
const {spawn} = require('child_process');

var output = "";
var process = null;

var run = () => {
    process = spawn('datalab', ['connect', 'lab']);
    output = "";

    process.stdout.on('data', (chunk) => {
        chunk = chunk.toString('utf8');
        output += chunk + "\n";
    });

    process.stderr.on('data', (chunk) => {
        chunk = chunk.toString('utf8');
        console.log(chunk);
    });

    process.on('exit', function (code) {
        process = null;
        output += "\n EXITED \n\n\n";
        console.log("EXITED " + code);
    });
};

app.get('/start', (req, res) => {
    if (process === null) {
        run();
    }

    res.render('status.ejs', {
        lines: output.split("\n")
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

