/**
 * Created by Binnur Kurt on 2/3/2015.
 */
var express= require('express'),
    stylus= require('stylus'),
    mongoose= require('mongoose');

var app= express();

function compile(src,path){
    // css pre-processor like less
    return stylus(src).set('filename',path);
}

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');

app.use(stylus.middleware({
    "src": __dirname + '/public',
    "compile": compile
}));

app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/gis');

var mapSchema = new mongoose.Schema({
    "_id": mongoose.Schema.Types.ObjectId,
    "name": String,
    width: Number,
    height: Number,
    bbox: {
        "minx": Number,
        "miny": Number,
        "maxx": Number,
        "maxy": Number
    } ,
    wmsUrl: String,
    wmsLayer: String,
    zoom: Number,
    crs: String
});

var Map= mongoose.model('maps', mapSchema);

app.get('/maps/:name',function(req,res){
    Map.findOne( {"name": req.params.name} ,function(err,result){
        res.set('Content-Type','application/json');
        res.status(200).send(result);
    });
}) ;

app.get('/all/maps',function(req,res){
    Map.find( {} , {"name":1, "description":2, "_id":0 },function(err,result){
        res.set('Content-Type','application/json');
        res.status(200).send(result);
    });
}) ;

app.get('/',function(req,res){
    res.render('index');
});

var port= 8001;
app.listen(port);
console.log('Server is running.......');