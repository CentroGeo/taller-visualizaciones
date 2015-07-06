var dataFechas;

function init_slider(torqueLayer) {
	var torqueTime = $('#torque-time');
	$("#torque-slider").slider({
		min: 0,
		max: torqueLayer.options.steps,
		value: 0,
		step: 1,
		slide: function(event, ui){
		  var step = ui.value;
		  torqueLayer.setStep(step);
		}
	});
	// each time time changes, move the slider
	torqueLayer.on('change:time', function(changes) {
	  $("#torque-slider" ).slider({ value: changes.step });
	  //var date = changes.time.toString().substr(4).split(' ');
	  //convertir fecha de mm/dd/aaaa a aaaa-mm-dd
	  var date = jQuery.datepicker.formatDate( "yy-mm-dd", new Date(changes.time));
	  torqueTime.text(date);
	  //if (date != "NaN-NaN-NaN"){
		  hazRadar(dataFechas);
	  //}
	});
	
	// play-pause toggle
	$("#torque-pause").click(function(){
	  torqueLayer.toggle();
	  $(this).toggleClass('playing');
	});
  };

function main() {
	var map = new L.Map('map', {
		zoomControl: true,
		center: [19.415278137895385, -99.16188955307007],
		zoom: 16
	});

	L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
		attribution: '\u00a9 <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors \u00a9 <a href=\"http://cartodb.com/attributions#basemaps\">CartoDB</a>'
	}).addTo(map);
	
	var CARTOCSS = [
		'Map {',
		'-torque-frame-count:1024;',
		'-torque-animation-duration:30;',
		'-torque-time-attribute:\"fecha\";',
		'-torque-aggregation-function:"round(avg(cat_number))";',
		'-torque-resolution:1;',
		'-torque-data-aggregation:cumulative;',
		'}',
		'#levantamiento{',
		'comp-op: lighter;',
		'marker-fill-opacity: 0.5;',
		'marker-line-color: #FFF;',
		'marker-line-width: 0;',
		'marker-line-opacity: 1;',
		'marker-type: ellipse;',
		'marker-width: 3;',
		//'marker-fill: #3E7BB6;',
		'}',
		//establecimientos
		'#levantamiento[value = 1] { marker-fill: #229A00; }',
		//servicios
		'#levantamiento[value = 2]{ marker-fill: #50a3f4; }',
		//bienes
		'#levantamiento[value = 3]{ marker-fill: #ff00b5; }',
		//seguridad
		'#levantamiento[value = 4]{ marker-fill: #777474; }',
		//movilidad
		'#levantamiento[value = 5]{ marker-fill: #0F3B82; }',
		//basura
		'#levantamiento[value = 6]{ marker-fill: #B40903; }'
	].join('\n');
	
	 cartodb.createLayer(map, {
		type: "torque",
		order: 1,
		"legend": {
			"type": "custom",
			"show_title": false,
			"title": "",
			"template": "<div class='cartodb-legend custom'>\t\n\n<ul>\n\t\n\t<li>\n\n\t\t<div class=\"bullet\" style=\"background:#229A00\"></div>\n\t\tEstablecimientos Comerciales\n\t\n\t</li>\n\t\n\t<li>\n\n\t\t<div class=\"bullet\" style=\"background:#50a3f4\"></div>\n\t\tServicios\n\t\n\t</li>\n\t\n\t<li>\n\n\t\t<div class=\"bullet\" style=\"background:#ff00b5\"></div>\n\t\tBienes Inmuebles\n\t\n\t</li>\n\t\n\t<li>\n\n\t\t<div class=\"bullet\" style=\"background:#777474\"></div>\n\t\tSeguridad\n\t\n\t</li>\n\t\n\t<li>\n\n\t\t<div class=\"bullet\" style=\"background:#0F3B82\"></div>\n\t\tMovilidad\n\t\n\t</li>\n\t\n\t<li>\n\n\t\t<div class=\"bullet\" style=\"background:#B40903\"></div>\n\t\tBasura\n\t\n\t</li>\n\n</ul>\n\n</div>",
			"visible": true,
			"items": []
		},
		options: {
			query: "SELECT *,\nCASE \nWHEN categoria='Establecimientos Comerciales' THEN 1\nWHEN categoria='Servicios' THEN 2\nWHEN categoria='Bienes Inmuebles' THEN 3\nWHEN categoria='Seguridad' THEN 4\nWHEN categoria='Movilidad' THEN 5\nWHEN categoria='Basura' THEN 6\nEND as cat_number\nFROM levantamiento_final",
			table_name: "levantamiento_final",
			user_name: "rtapia",
			tile_style: CARTOCSS
        }
	 }).done(function(layer) {
		map.addLayer(layer);
		init_slider(layer);
	 });
	 
	/*
	var torqueLayer = new L.TorqueLayer({
        query: "SELECT *,\nCASE \nWHEN categoria='Establecimientos Comerciales' THEN 1\nWHEN categoria='Servicios' THEN 2\nWHEN categoria='Bienes Inmuebles' THEN 3\nWHEN categoria='Seguridad' THEN 4\nWHEN categoria='Movilidad' THEN 5\nWHEN categoria='Basura' THEN 6\nEND as cat_number\nFROM levantamiento_final",
		user: 'rtapia',
        //table: 'levantamiento_final',
        cartocss: CARTOCSS
      });
      torqueLayer.addTo(map);
      torqueLayer.play();
	  init_slider(torqueLayer);
	*/
	var CARTOCSS2 = [
          'Map {',
          '-torque-time-attribute: "date";',
          '-torque-aggregation-function: "count(cartodb_id)";',
          '-torque-frame-count: 760;',
          '-torque-animation-duration: 15;',
          '-torque-resolution: 2',
          '}',
          '#layer {',
          '  marker-width: 3;',
          '  marker-fill-opacity: 0.8;',
          '  marker-fill: #FEE391; ',
          '  comp-op: "lighten";',
          '  [value > 2] { marker-fill: #FEC44F; }',
          '  [value > 3] { marker-fill: #FE9929; }',
          '  [value > 4] { marker-fill: #EC7014; }',
          '  [value > 5] { marker-fill: #CC4C02; }',
          '  [value > 6] { marker-fill: #993404; }',
          '  [value > 7] { marker-fill: #662506; }',
          '  [frame-offset = 1] { marker-width: 10; marker-fill-opacity: 0.05;}',
          '  [frame-offset = 2] { marker-width: 15; marker-fill-opacity: 0.02;}',
          '}'
      ].join('\n');
	
	/*var torqueLayer2 = new L.TorqueLayer({
        user       : 'viz2',
        table      : 'ow',
        cartocss: CARTOCSS2
      });*/
      //torqueLayer2.addTo(map);
      //torqueLayer2.play()	
	
	var sql = new cartodb.SQL({ user: 'rtapia' });
	/*sql.execute("SELECT categoria, COUNT(*) FROM levantamiento_final GROUP BY categoria")
	// para la evolucion del radar por dia
	//"SELECT DISTINCT fecha::date, categoria, COUNT(categoria) OVER (PARTITION BY fecha::date) FROM levantamiento_final ORDER BY fecha::date"
	.done(function(data) {
		//console.log(data.rows);
		hazRadar(data.rows);
	})
	.error(function(errors) {
		// errors contains a list of errors
		console.log("errors:" + errors);
	})*/
	
	// para la evolucion del radar por dia
	sql.execute("SELECT DISTINCT fecha::date, categoria, COUNT(categoria) OVER (PARTITION BY fecha::date, categoria) FROM levantamiento_final ORDER BY fecha::date")
	.done(function(data) {
		//console.log($('#torque-time').text());
		//hazRadar(data.rows);
		//console.log(data.rows);
		dataFechas = data.rows;
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
	// throws error at first run cause I get a weird date: NaN-NaN-NaN
	// maybe use a try catch or if condition
	for (var i = 0; i < datos.length; i++){
		
		var groups = {};
	
		var cats = ["Establecimientos Comerciales", "Servicios", "Bienes Inmuebles", "Seguridad", "Movilidad", "Basura"];
		
		for (var i = 0; i < datos.length; i++){
			maximo = Math.max(maximo, datos[i].count);
			var item = datos[i];
			
			if(!groups[item.fecha]) {
				//groups[item.fecha] = [];
				groups[item.fecha] = [ 
					{axis: "Establecimientos Comerciales", value: 0},
					{axis: "Servicios", value: 0},
					{axis: "Bienes Inmuebles",	value: 0},
					{axis: "Seguridad", value: 0},
					{axis: "Movilidad", value: 0},
					{axis: "Basura", value: 0}
				];
			}
			
			groups[item.fecha][cats.indexOf(item.categoria)].axis = item.categoria;
			groups[item.fecha][cats.indexOf(item.categoria)].value= item.count;
			
		}
		
		//console.log(groups);	

	}
	
	if (groups[$('#torque-time').text()+"T00:00:00Z"] != undefined) {
		radarData = [groups[$('#torque-time').text()+"T00:00:00Z"]];
	} else {
		radarData = [[ 
					{axis: "Establecimientos Comerciales", value: 0},
					{axis: "Servicios", value: 0},
					{axis: "Bienes Inmuebles",	value: 0},
					{axis: "Seguridad", value: 0},
					{axis: "Movilidad", value: 0},
					{axis: "Basura", value: 0}
				]];
	}
	
	// [ [ {fecha { {axis, value}, {axis, value}, ...} ] ]
	// d = [ [ {axis, value}, {axis, value}, ...  ] ]
	
	//Options for the Radar chart, other than default
	var mycfg = {
	  w: w,
	  h: h,
	  //maxValue: 0.6,
	  maxValue:  Math.ceil(maximo/5)*5,
	  levels: 5,
	  ExtraWidthX: 300
	}

	//Call function to draw the Radar chart
	//Will expect that data is in %'s
	RadarChart.draw("#chart", radarData, mycfg);	
}
