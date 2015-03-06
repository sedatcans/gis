/**
 *  Created by Binnur Kurt on 6/17/2014.
 */
function getCRS(crs) {
    if (crs === "EPSG4326") {
        return L.CRS.EPSG4326;
    }
    if (crs === "EPSG3857") {
        return L.CRS.EPSG3857;
    }
    if (crs === "EPSG3395") {
        return L.CRS.EPSG3395;
    }
    if (crs === "Simple") {
        return L.CRS.Simple;
    }
}
/*
 * 
 * ko binding for data-bind="drawmap: "
 */

ko.bindingHandlers.drawmap = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return {'controlsDescendantBindings': true};
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var mvm = valueAccessor();
        if (!mvm.initialized()) return;
        if (viewModel.map.leafletMap === null) {
            viewModel.map.leafletMap =
                L.map($(element).attr('id'),
                    {
                        center: mvm.viewCenter(),
                        crs: getCRS(mvm.crs()),
                        attributionControl: false
                    }
                );
        }
        if (viewModel.map.drawnItems!==null) {
            viewModel.map.drawnItems = new L.geoJson(JSON.parse(mvm.markers()));
        } else {
            viewModel.map.drawnItems = new L.FeatureGroup();
        }
        viewModel.map.leafletMap.addLayer(viewModel.map.drawnItems);
        if (viewModel.map.drawControl === null) {
            viewModel.map.drawControl = new L.Control.Draw({
                    draw: {
                        position: 'topleft',
                        polygon: {
                            title: 'Draw a polygon!',
                            allowIntersection: false,
                            drawError: {
                                color: '#b00b00',
                                timeout: 1000
                            },
                            shapeOptions: {
                                color: '#bada55'
                            },
                            showArea: true
                        },
                        polyline: {
                            metric: false
                        },
                        circle: {
                            shapeOptions: {
                                color: '#662d91'
                            }
                        }
                    },
                    edit: {
                        featureGroup: viewModel.map.drawnItems
                    }
                }
            );
            viewModel.map.leafletMap.addControl(viewModel.map.drawControl);
            viewModel.map.leafletMap.on('draw:created', function(e) {
                var type = e.layerType, layer = e.layer;
                if (type === 'marker') {
                    layer.bindPopup('A popup!');
                }
                viewModel.map.drawnItems.addLayer(layer);
            });
        }
        if (viewModel.map.tileLayer !== null) {
            viewModel.map.leafletMap.removeLayer(viewModel.map.tileLayer);
        }
        viewModel.map.tileLayer = L.tileLayer.wms(
            mvm.wmsUrl(),
            {
                layers: mvm.wmsLayer(),
                format: 'image/png',
                transparent: true,
                version: '1.1.1',
                attributionControl: false
            }
        ).addTo(viewModel.map.leafletMap);

        var southWest = L.latLng(mvm.miny(), mvm.minx());
        var northEast = L.latLng(mvm.maxy(), mvm.maxx());

        var bounds = L.latLngBounds(southWest, northEast);
        viewModel.map.leafletMap.fitBounds(bounds);
    }
};

/*
 * 
 * ko binding for data-bind="map: "
 */
ko.bindingHandlers.map = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return {'controlsDescendantBindings': true};
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var mvm = valueAccessor();
        if (viewModel.map.leafletMap == null) {
            viewModel.map.leafletMap =  L.map($(element).attr('id') , { center: mvm.viewCenter() , minZoom:1 , maxZoom: 16 } );
        }
        if (viewModel.map.tileLayer != null) {
            viewModel.map.leafletMap.removeLayer(viewModel.map.tileLayer);
        }
        viewModel.map.tileLayer = L.tileLayer.wms(
            mvm.wmsUrl(),
            {
                layers: mvm.wmsLayer(),
                format: 'image/png',
                transparent: true,
                version: '1.1.0',
                center: mvm.viewCenter(),
                crs: getCRS(mvm.crs()),
                srs: getCRS(mvm.crs()),
                attributionControl: false
            }
        ).addTo(viewModel.map.leafletMap);
        var southWest = L.latLng(mvm.miny(), mvm.minx());
        var northEast = L.latLng(mvm.maxy(), mvm.maxx());
        var bounds = L.latLngBounds(southWest, northEast);
        viewModel.map.leafletMap.fitBounds(bounds);
    }
};