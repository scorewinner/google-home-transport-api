"use strict";

let request = require('request');
let express = require('express');
let bodyParser = require('body-parser');
let axios = require('axios');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.post('/', function(req, res) {
    console.log('Receives a post request');
    if(!req.body) return res.sendStatus(400);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('here is the post request from Dialogflow');
    console.log(req.body);
    let request = req.body;
    var city = request['queryResult']['parameters']['geo-city'];
    var city2 = request['queryResult']['parameters']['geo-city1'];
    var w = getConnections(res, city, city2);
})

function getConnections(res, city,city2){
    var pos1 = city;
    var pos2 = city2;

    axios.get(`http://transport.opendata.ch/v1/connections?from=${pos1}&to=${pos2}`).then(((response) => {
        let departuretime = response.data['connections'][0]['from']['departure'];
        let time = departuretime.replace(/.*?T([0-9]{2}):([0-9]{2}).*/, "$1 uhr $2");
        console.log(time);
        let webhookReply = {
            fulfillmentText: 'Die nächste Verbindung von ' + pos1 + ' nach ' + pos2 + ' fährt um ' + time + "."
        };

        res.send(JSON.stringify(webhookReply) + "\n");
    }));
}

const PORT = process.env.PORT || 5000
const HOST = '0.0.0.0';

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
