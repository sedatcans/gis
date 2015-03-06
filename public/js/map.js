/**
 * Created by TTSSONAT on 06/03/2015.
 */
function MapView(){
    var self =this;
    self.mapId=ko.observable();
    self.maps=ko.observableArray([]);
    self.init=function() {
        $.ajax({
            method:"GET",
            url:"http://localhost:8001/maps",
            success:function(maps)
            {
                self.maps(maps);
            }
        })
    };
    self.view=function()
        {
            console.log('clicked!!');
        };

}


var viewModel =new MapView();
$('document').ready(function(){
    ko.applyBindings(viewModel);
    viewModel.init();
})
