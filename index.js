var https = require('https');
var sha1 = require('sha1')
var fs = require('fs')
var dotenv = require('dotenv')
dotenv.config()

const CONSTANT = require('./constants.json')

const token = process.env.TOKEN
const fileName = 'archive/answer.json'

var options = {
    host: CONSTANT.host,
    path: CONSTANT.path + token,
    method: "GET",
    port: 443
};

var req = https.get(options, function(res) {  
    res.on('data', function(data) {
        let response = JSON.parse(data);
        response.decifrado = decrypt(response.numero_casas, response.cifrado)
        response.resumo_criptografico = sha1(response.decifrado)
        fs.writeFile(CONSTANT.file, JSON.stringify(response, null, '\t'), function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        })
    });
});

req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
});

req.end();

function decrypt (key, value) {
    const alphabet = Array.from({length: 26}, (v, i) => String.fromCharCode(i + 97))
    return value.split('')
        .map(letter => alphabet.indexOf(letter) == -1 ? letter : alphabet[alphabet.indexOf(letter) - key])
        .join('')
}
