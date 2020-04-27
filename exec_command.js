
const { exec, execSync } = require('child_process');
const fs = require('fs');
const converter_to_csv = require('json-2-csv');

const DATA_DIR = 'GeneratedData';
const DIR_TO_PUT_CSV = 'GeneratedCSV';
const DIR_TO_LOG_DATA = 'bash/mediciones';
const helper =  require('./helper.js');


fs.readdirSync(DIR_TO_LOG_DATA).forEach( async (file) => {
    console.log(file);
    const command = exec("bash logextract_ver2.sh " + file, { cwd: './bash' }, function(err, stdout, stderr) {
        if (err)
            Promise.reject('error');

        console.log(stdout);
        helper.processLineByLine(DATA_DIR + `/${file}` + '.filtered')
            .then(decoded_data => {

                    // once we received the created csv we want to write a new file with it
                    converter_to_csv.json2csv(decoded_data, function (err, csv) {
                        if (err) throw err;
                        fs.writeFile(DIR_TO_PUT_CSV + '/' + file + '.csv', csv, 'utf8', (err) =>
                        {
                            if (err) {
                                console.log('Some error occured - file either not saved or corrupted file saved.');
                                console.log(err);
                            } else {
                                console.log('It\'s saved!');
                            }
                        });
                    });

            });

    });

    command.on('exit', async (code) => {
        // exit code is code
        // once finish the bash script to be processed
        console.log(`exit with code on file: ${file}`, code);
    });
});

return 0;
