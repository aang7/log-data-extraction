const fs = require('fs');
const readline = require('readline');
const converter_to_csv = require('json-2-csv');
const DATA_DIR = 'GeneratedData';
const DIR_TO_PUT_CSV = 'GeneratedCSV';

function filter_data_in_line(line, array_to_fill) {

    //Remove all the characters in even position in the string
    splitted_data = line.split('-');
    data = splitted_data[1];
    data = data.replace(/.(.)/g, '$1');
    //Get the GeneratedCSV from the each position
    var decoded = {
        "name":  data.substr(8 , 8),
        "kwhtot":data.substr(16, 8),
        "volt1": data.substr(23 + 73, 3) + "." + data.substr(26 + 73, 1),
        "volt2": data.substr(27 + 73, 3) + "." + data.substr(30 + 73, 1),
        "volt3": data.substr(31 + 73, 3) + "." + data.substr(34 + 73, 1),
        "amp1":  data.substr(35 + 73, 4) + "." + data.substr(39 + 73, 1),
        "amp2":  data.substr(40 + 73, 4) + "." + data.substr(44 + 73, 1),
        "amp3":  data.substr(45 + 73, 4) + "." + data.substr(49 + 73, 1),
        "watts1":data.substr(50 + 73, 6) + "." + data.substr(56 + 73, 1),
        "watts2":data.substr(57 + 73, 6) + "." + data.substr(63 + 73, 1),
        "watts3":data.substr(64 + 73, 6) + "." + data.substr(70 + 73, 1),
        "date": splitted_data[2]
    };
    array_to_fill.push(decoded)
}


async function processLineByLine(file) {
    const fileStream = fs.createReadStream(file);

    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let decoded_data = [];

    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        console.log(`Line from file: ${line}`);
        filter_data_in_line(line, decoded_data)
    }

    return decoded_data;
}

// read dir
fs.readdirSync(DATA_DIR).forEach(async (file) => {
    if (file.split('.').pop() === 'filtered') {
        await processLineByLine(DATA_DIR + '/' + file)
            .then(decoded_data => {
                // create the new csv file which will contains the decoded GeneratedCSV
                converter_to_csv.json2csv(decoded_data, function (err, csv) {
                    // once we received the created csv we want to write a new file with it
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

                });

            })
            .catch(reason => console.log(reason));
    }
});
