function MapModel(width,height){
    var self = this;

    self.initialized= ko.observable(false);
    self.wmsUrl = ko.observable("");
    self.wmsLayer = ko.observable("");
    self.minx= ko.observable(0);
    self.maxx= ko.observable(0);
    self.miny= ko.observable(0);
    self.maxy= ko.observable(0);
    self.zoom= ko.observable(8);
    self.crs= ko.observable("");
    self.width= ko.observable(width);
    self.height= ko.observable(height);
    self.leafletMap= null;
    self.tileLayer= null;
    self.markers = ko.observable('{ "type" : "FeatureCollection", "features" : [] }');
    self.drawnItems = null;
    self.drawControl = null;
    self.viewCenter= ko.computed(function(){
        return new L.LatLng((self.maxy() + self.miny()) / 2.0, (self.maxx() + self.minx()) / 2.0);
    });
}

function MapViewModel(width,height) {
    var self = this;

    self.name = ko.observable("");
    self.maps = ko.observableArray([]);
    self.map= new MapModel(width,height);
    self.show = function () {
        $.ajax({
            "method": "GET",
            "url": "http://localhost:8001/maps/"+self.name(),
            success: function(map){
                self.map.wmsUrl(map.wmsUrl);
                self.map.wmsLayer(map.wmsLayer);
                self.map.zoom(map.zoom);
                self.map.minx(map.bbox.minx);
                self.map.miny(map.bbox.miny);
                self.map.maxx(map.bbox.maxx);
                self.map.maxy(map.bbox.maxy);
                self.map.crs(map.crs);
                self.map.initialized(true);
            }
        });
    };
    self.init = function () {
        $.ajax({
           "method": "GET",
            "url": "http://localhost:8001/all/maps",
            success: function(maps){
                self.maps(maps);
            }
        });
    }
}

var viewModel = new MapViewModel(512,512);

$('document').ready(function () {
    ko.applyBindings(viewModel);
    viewModel.init();
});