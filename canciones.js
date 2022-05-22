var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var path = require('path');

mongoose
  .connect(
    "mongodb+srv://mariapaz:***********@cluster0.eziig.mongodb.net/?retryWrites=true&w=majority"
  )
  .catch((error) => handleError(error));

  var modelSchema = mongoose.Schema({
	cancion: String,
	artista: String,
	album: String,
	anio: Number,
	pais: String,
	link: String
});

var Cancion = mongoose.model('Cancion', modelSchema);

// RUTAS
router.get('/canciones', function(req, res){
	Cancion.find(function(err,canciones){
		if (err)
			res.status(500).send('Error en la base de datos');
		else {
			res.status(200).jsonp(canciones);
		}
	})
});

router.get('/canciones/:id',function(req,res){
	Cancion.findById(req.params.id,function(err, cancion) {
		if (err)
			res.status(500).send('Error en la base de datos');
		else{
			if (cancion != null) {
				res.status(200).jsonp(cancion);
			}
			else
				res.status(404).send('No se encontro la cancion');
		}
	});
});

router.post('/canciones',function(req,res){
	var item = new Cancion({
		cancion: req.body.cancion,
		artista: req.body.artista,
		album: req.body.album,
		anio: req.body.anio,
		pais: req.body.pais,
		link: req.body.link,
	});

	item.save(function (error, item) {
		if (error) {
			res.status(500).send('No se ha podido agregar.');
		}
		else {
			res.status(200).jsonp({_id: item._id}); 
		}
	});
});

router.get('/cancionesxartista',function(req,res){
	Cancion.find({artista : req.query.artista}, function(err, items){
		if (err) {
			res.status(500).send('Error en la base de datos');
		}
		else {
			res.status(200).jsonp(items);
		}
	});
});

router.get('/cancionesxanio',function(req,res){
	Cancion.find({anio : req.query.anio}, function(err, items){
		if (err) {
			res.status(500).send('Error en la base de datos');
		}
		else {
			res.status(200).jsonp(items);
		}
	});
});

router.get('/cancionesxanios',function(req,res){
		Cancion.find({anio : { $gte: req.query['anio1'], $lte: req.query['anio2']}}, function(err, items){
		if (err) {
			res.status(500).send('Error en la base de datos');
		}
		else {
			res.status(200).jsonp(items);
		}
	});
});

router.put('/canciones/:id',function(req,res){
    Cancion.findById(req.params.id, function (err, cancion) {
        if (err) res.status(500).send("Error en la base de datos");
        else {
          if (cancion != null) {
            cancion.cancion = req.body.cancion;
            cancion.artista = req.body.artista;
            cancion.album = req.body.album;
            cancion.anio = req.body.anio;
            cancion.pais = req.body.pais;

            cancion.save(function (error, cancion1) {
              if (error) res.status(500).send("Error en la base de datos");
              else {
                res.status(200).send("Modificado exitosamente");
              }
            });
          } else res.status(404).send("No se encontro esa cancion");
        }
      });
});

router.delete('/canciones/:id',function(req,res){
	Cancion.findById(req.params.id, function (err, cancion) {
        if (err) res.status(500).send("Error en la base de datos");
        else {
          if (cancion != null) {
            cancion.remove(function (error, result) {
              if (error) res.status(500).send("Error en la base de datos");
              else {
                res.status(200).send("Eliminado exitosamente");
              }
            });
          } else res.status(404).send("No se encontro esa cancion");
        }
      });
});

router.get('/top5', function(req, res){
	Cancion.find({}).limit(5).sort({'anio': -1}).exec(function(err, items){
		if (err)
			res.status(500).send('Error en la base de datos');
		else
			res.status(200).jsonp(items);
	});

});

module.exports.router = router;