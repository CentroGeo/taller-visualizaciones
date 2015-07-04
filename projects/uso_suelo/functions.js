function main() {
cartodb.createVis('map', 'https://plabloedu.cartodb.com/api/v2/viz/4f90b07c-1f88-11e5-81f6-0e853d047bba/viz.json', {
	//shareable: true,
	title: true,
	description: true,
	//search: true,
	tiles_loader: true,
	center_lat: 19.411,
	center_lon: -99.16,
	zoom: 16
})
.done(function(vis, layers) {
	// layer 0 is the base layer, layer 1 is cartodb layer
	// setInteraction is disabled by default
	/*layers[0].setInteraction(true);
	layers[0].on('featureOver', function(e, latlng, pos, data) {
	cartodb.log.log(e, latlng, pos, data);
	});*/
	layers[1].setInteraction(true);
	layers[1].getSubLayer(0).setInteractivity("cartodb_id, the_geom")
	//alert("Layer has " + layers[1].getSubLayerCount() + " layer(s).");
	//console.log(layers[1].getSubLayer(0));
	layers[1].getSubLayer(0).on('featureClick', function(e, latlng, pos, data) {
          alert("Hey! You clicked " + data.the_geom);
    });
	// you can get the native map to work with it
	var map = vis.getNativeMap();
	// now, perform any operations you need
	// map.setZoom(3);
	// map.panTo([50.5, 30.5]);
})
.error(function(err) {
  console.log(err);
});

var sql = new cartodb.SQL({ user: 'plabloedu' });
var sqlStr = "SELECT avg(vivienda) as v_pro, avg(comercio) as c_pro, avg(equip) as e_pro, avg(ocio) as o_pro FROM usos_colonia"
sql.execute(sqlStr)
  .done(function(data) {
	//console.log(data.rows);
	hazRadar(data.rows);
  })
  .error(function(errors) {
	// errors contains a list of errors
	console.log("errors:" + errors);
  })

}
 window.onload = main;
//
// hacer radar

function hazRadar(data){
	var w = 500,
		h = 500;

	var colorscale = d3.scale.category10();
	den = 1/(data[0].e_pro + data[0].c_pro + data[0].o_pro + data[0].v_pro)
	var d = [[//{'axis':'vivienda','value':data[0].v_pro*den},
			 {'axis':'comercio','value':data[0].c_pro*den},
			 {'axis':'servicios','value': data[0].e_pro*den},
			 {'axis':'ocio','value':data[0].o_pro*den}]]

	console.log(data[0].v_pro)
	//Data
	// d = [];
	// inner = [];
	// var maximo = 0;
	// for (var i = 0; i < datos.length; i++){
	// 	maximo = Math.max(maximo, datos[i].count);
	// 	inner.push({"axis": datos[i].categoria, "value": datos[i].count});
	// }
	// d.push(inner);
	// console.log(d);
	//
	// //Options for the Radar chart, other than default
	var mycfg = {
	  w: w,
	  h: h,
	  maxValue: 0.1,
	  //maxValue: Math.max(data[0].e_pro,data[0].c_pro,data[0].o_pro),
	  levels: 6,
	  ExtraWidthX: 300
	}
	//
	// //Call function to draw the Radar chart
	// //Will expect that data is in %'s
	RadarChart.draw("#chart", d, mycfg);
}
