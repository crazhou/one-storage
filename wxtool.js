const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');

const parser = new xml2js.Parser();

function parseEnXML(filename, fn) {
    fs.readFile(path.resolve(__dirname, filename), (err, data) => {
        if(err==null) {
            parser.parseString(data, (err2, res) => {
                if(err2) {
                    return fn&&fn(err2, null);
                }

                let ToUserName = res.xml.ToUserName[0].trim();
                let Encrypt = res.xml.Encrypt[0].trim();

                fn&&fn(null, {
                    ToUserName:ToUserName,
                    Encrypt:Encrypt
                });
            })
        } else {
            // console.log('FS ERR->', err);
            throw err;
        }
    })
}


parseEnXML('data/event.xml', (err, data) => {
    console.log('OK->', err, data);
})