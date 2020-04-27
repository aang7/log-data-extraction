const fs = require('fs');
const readline = require('readline');
const converter_to_csv = require('json-2-csv');
const DATA_DIR = 'GeneratedData';
const DIR_TO_PUT_CSV = 'GeneratedCSV';
const helper = require('./helper');


// read dir
fs.readdirSync(DATA_DIR).forEach(async (file) => {
    if (file.split('.').pop() === 'filtered') {
        await helper.processLineByLine(DATA_DIR + '/' + file)
            .then(decoded_data => {
                // create the new csv file which will contains the decoded GeneratedCSV
                converter_to_csv.json2csv(decoded_data, function (err, csv) {
                    if (err) throw err;
                    fs.writeFile(DIR_TO_PUT_CSV + '/' + file + '.csv', csv, 'utf8', (err) =>
                    {
                        if (err) {
                            console.log('Some error occured - file either not saved or corrupted file saved.');
                        } else {
                            console.log('It\'s saved!');
                        }
                    });
                });

            })
            .catch(reason => console.log(reason));
    }
});

