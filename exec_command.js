const { exec } = require('child_process');

const dir = exec("ls -la", function(err, stdout, stderr) {
    if (err) {
        // should have err.code here?
        console.log('error ', err)
    }
    console.log(stdout);
});

dir.on('exit', function (code) {
    // exit code is code
    console.log('exit ', code);
});
