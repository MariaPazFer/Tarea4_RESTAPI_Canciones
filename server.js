var express = require('express');
var bodyParser = require('body-parser');
var index = require('./index').router;
var canciones = require('./canciones').router;
var app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function () {
	console.log('App escuchando en el puerto 3000!');
});

app.use('/api', canciones);
app.use('/', index);

app.use(function(req,res,next){
    res.status(404).send('La pagina que solicita no existe')
})
