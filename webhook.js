const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const REQUIRE_AUTH = true
const AUTH_TOKEN = '37636629465042229962eaec864614b9'

    if (REQUIRE_AUTH) {
    if (req.headers['auth-token'] !== AUTH_TOKEN) {
        return res.status(401).send('Unauthorized')
    }
}

if (!req.body || !req.body.queryResult || !req.body.queryResult.parameters) {
    return res.status(400).send('Bad Request')
}
else{

    var pos1 = req.body.queryResult.parameters.geo-city
    var pos2 = req.body.queryResult.parameters.geo-city1
    apicall(pos1, pos2);
    // the most basic response
}


function apicall(pos1, pos2) {

    var pos1 = pos1;
    var pos2 = pos2;

    let request = new XMLHttpRequest();
    let url = `http://transport.opendata.ch/v1/connections?from=${pos1}&to=${pos2}`;

    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            getElements(response);
        }
    }

    request.open("GET", url, true);
    request.send();

    getElements = function(response) {
        console.log(response);
    }

    var departuretime = response['connections'][0]['from']['departure']

    var webhookReply = 'Die nächste Verbindung von ' + pos1 + 'nach ' + pos2 + 'fährt um ' + departuretime

    res.status(200).json({
        source: 'webhook',
        speech: webhookReply,
        displayText: webhookReply
    })
}
