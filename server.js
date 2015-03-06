var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gis');

var mapSchema = new mongoose.Schema({
    "_id": Number,
    "name": String,
    "description": String,
    "wmsUrl": String,
    "wmsLayer": String,
    "zoom":  Number,
    "crs": String,
    "width" :Number,
    "height" :Number,
    "bbox": {"minx":Number,
        "maxx":Number,
        "miny":Number,
        "maxy":Number}
});

var Map = mongoose.model('maps', mapSchema);

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/server/views');
app.use(express.static(__dirname + '/public'));

app.get('/maps', function(req, res){
    Map.find({},{"name":1,"_id":0}, function (err, maps){
        res.set('Content-Type', 'application/json');
        res.status(200).send(maps);
    });
});
app.get('/map/:id', function(req, res){
    Map.findOne({"_id": req.params.id}, function (err, map){
        res.set('Content-Type', 'application/json');
        res.status(200).send(map);
    });
});


var port = 8001;
app.listen(port);
console.log('Server is running...');