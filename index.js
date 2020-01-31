var https = require('https');
var sha1 = require('sha1')
var fs = require('fs')
var dotenv = require('dotenv')
dotenv.config()

const token = process.env.TOKEN
const fileName = 'answer.json'

var options = {
    host: "api.codenation.dev",
    path: "/v1/challenge/dev-ps/generate-data?token=" + token,
    method: "GET",
    port: 443
};

var req = https.get(options, function(res) {  
    res.on('data', function(data) {
        let response = JSON.parse(data);
        createFile(fileName, JSON.stringify(response, null, '\t'))

        response.decifrado = decrypt(response.numero_casas, response.cifrado)
        response.resumo_criptografico = sha1(response.decifrado)

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

function createFile (name, content) {
    fs.writeFile(name, content)
}
