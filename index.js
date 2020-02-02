var https = require('https')
var request = require('request')
var sha1 = require('sha1')
var fs = require('fs')
var dotenv = require('dotenv')
var FormData = require('form-data')
dotenv.config()

const CONSTANT = require('./constants.json')
const token = process.env.TOKEN

console.log(' - INIT: APP')

function getJson (options) {
	let init = new Date()
	console.log(' - INIT: getJson')

	request.get({
		url: CONSTANT.get.url + token,
	}, function(error, response, body) {
		let json = JSON.stringify(editJson(JSON.parse(body)))
        saveFile(json)
	});
	
	console.log(' - END:  getJson', Math.abs(new Date() - init))
}

function sendJson () {
	let init = new Date()
	console.log(' - INIT: sendJson')
	const form = new FormData()
	form.append('answer', fs.createReadStream(CONSTANT.file))

	const options = {
		method: "POST",
		url: CONSTANT.post.url + token,
		port: 443,
		headers: form.getHeaders()
	};
	
	const req = request(options, function (err, res, body) {
		if(err) console.log(err);
		console.log(body);
	});

	form.pipe(req)
	
    console.log(' - END:  sendJson', Math.abs(new Date() - init))
}

function editJson (json) {
	let init = new Date()
    console.log(' - INIT: editJson')
    json.decifrado = decrypt(json.numero_casas, json.cifrado)
    json.resumo_criptografico = sha1(json.decifrado)
    console.log(' - END:  editJson', Math.abs(new Date() - init))
    return json
}

function saveFile (json) {
	let init = new Date()
	console.log(' - INIT: saveFile')
    fs.writeFile(
        CONSTANT.file,
        json,
        function (err) {
            if (err) throw err;
			console.log('File is created successfully.');
			sendJson({
				host: CONSTANT.host,
				path: CONSTANT.path + token
			});
        }
    )
    console.log(' - END:  saveFile', Math.abs(new Date() - init))
}

function decrypt (key, value) {
	let init = new Date
    console.log(' - INIT: decrypt')
    const alphabet = Array.from({length: 26}, (v, i) => String.fromCharCode(i + 97))
	let response = value.split('')
		.map(letter => 
				alphabet.indexOf(letter) == -1
				? letter
				: alphabet[alphabet.indexOf(letter) - key]
			)
		.join('')
	console.log(' - END:  decrypt', Math.abs(new Date() - init))
    return response
}


getJson({
	host: CONSTANT.host,
	path: CONSTANT.path + token,
	method: "GET",
	port: 443
});