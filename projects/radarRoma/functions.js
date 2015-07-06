function main() {
	cartodb.createVis('map', 'https://rtapia.cartodb.com/api/v2/viz/d2673aee-f9a3-11e4-a29c-0e9d821ea90d/viz.json', {
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
	  // you can get the native map to work with it
	  var map = vis.getNativeMap();
	  // now, perform any operations you need
	  // map.setZoom(3);
	  // map.panTo([50.5, 30.5]);
	})
	.error(function(err) {
	  console.log(err);
	});

	var sql = new cartodb.SQL({ user: 'rtapia' });
	sql.execute("SELECT categoria, COUNT(*) FROM levantamiento_final GROUP BY categoria")
	// para la evolucion del radar por dia
	//"SELECT DISTINCT fecha::date, categoria, COUNT(categoria) OVER (PARTITION BY fecha::date) FROM levantamiento_final ORDER BY fecha::date"
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

// hacer radar

function hazRadar(datos){
	var w = 500,
		h = 500;

	var colorscale = d3.scale.category10();
	
	//Data	
	d = [];
	inner = [];
	var maximo = 0;
	for (var i = 0; i < datos.length; i++){
		maximo = Math.max(maximo, datos[i].count);
		inner.push({"axis": datos[i].categoria, "value": datos[i].count});
	}
	d.push(inner);
	console.log(d);
	
	//Options for the Radar chart, other than default
	var mycfg = {
	  w: w,
	  h: h,
	  //maxValue: 0.6,
	  maxValue: maximo,
	  levels: 6,
	  ExtraWidthX: 300
	}

	//Call function to draw the Radar chart
	//Will expect that data is in %'s
	RadarChart.draw("#chart", d, mycfg);	
}
