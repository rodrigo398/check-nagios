var express = require('express');
var app = express();
var sql = require('mssql')

var request = require('request'),
    username = "myuser2",
    password = "esmipass",
    url = "http://my.server.com";

var json = "";
var second = "";

//curl -i -X GET -H "Content-Type: application/json" http://localhost:3000/checkmonedas

function checkMoneda() {

    request.post({
            url: url,

        },

        function(error, response, body) {
            if (error) {
                console.log(error);
                return -1;
            } else {
                console.log('sin error');
            }
            json = body;
            var obj = JSON.parse(json);
            console.dir(obj)
            var jsonvalor = obj[0]['UltimaActualizacion'];

            var sistema = new Date();

            console.log("SISTEMA: " + sistema);

            var datejson = new Date(jsonvalor);
            console.log("JSON DATE PARSE RES: " + datejson);
            console.log("JSON RES: " + jsonvalor);

            var diff = sistema.getTime() - datejson.getTime();

            second = Math.floor((diff) / (1000));

            second = second - 10800;

        }

    );
    return second


};

//var diff = checkMoneda();

app.get('/checkmonedas', function(req, res) {

    var limite = 1800;

    diff = checkMoneda();

    if (diff < limite && diff != -1) {

        res.status(200).jsonp({ error: 'SERVER UP: ' + diff });

    } else {

        res.status(500).jsonp({ error: 'SERVER DOWN: ' + diff });

    };

});

/* BEGIN INTRANET */

var intranet = {
    driver: 'tedious',
    user: 'user1',
    password: 'mypass',
    server: 'my.server.com',
    database: 'suscripcion',
    options: {
        encrypt: false
    }
}

var connectionIntranet = new sql.Connection(intranet, function(err) {
    if (err) {
        console.log('SQL INTRANET NOT CONNECTED', err);
        return false
    }
    console.log('SQL INTRANET CONNECTED');
});



app.get('/suscripciones/check/ConveniosMPSinIntentoDeCobro', (req, res) => {
    new sql.Request(connectionIntranet)
        .query('EXEC CHECK_ConveniosMPSinIntentoDeCobro', function(err, recordset) {
            if (err)
                res.send(500, err);
            else
            if (recordset.length > 0)
                res.status(500).json(recordset);
            else
                res.status(200).send("OK");
        });
});

app.get('/suscripciones/check/ConveniosMPConIntentodeCobroSinRespuestaSatisfactoria', (req, res) => {
    new sql.Request(connectionIntranet)
        .query('EXEC CHECK_ConveniosMPConIntentodeCobroSinRespuestaSatisfactoria', function(err, recordset) {
            if (err)
                res.send(500, err);
            else
            if (recordset.length > 0)
                res.status(500).json(recordset);
            else
                res.status(200).send("OK");
        });
});

app.get('/suscripciones/check/ConveniosConClientesSinCondicionImpositiva', (req, res) => {
    new sql.Request(connectionIntranet)
        .query('EXEC CHECK_ConveniosConClientesSinCondicionImpositiva', function(err, recordset) {
            if (err)
                res.send(500, err);
            else
            if (recordset.length > 0)
                res.status(500).json(recordset);
            else
                res.status(200).send("OK");
        });
});

/* END INTRANET */

app.listen(8000);
var diff = checkMoneda();