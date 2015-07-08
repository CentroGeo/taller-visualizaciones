var dataFechas;

// funcion para detectar cmabio en el tiempo de la capa de torque de cartoDB y
// llamar actualizacion del radar
function timeChange(torqueLayer) {
	RadarChart.defaultConfig.tickLabels = true;
	var torqueTime = $('#torque-time');
	// each time time changes, move the slider
	var currentDate = "2015-02-25";
	torqueLayer.on('change:time', function(changes) {
	  //convertir fecha de mm/dd/aaaa a aaaa-mm-dd
	  var date = jQuery.datepicker.formatDate( "yy-mm-dd", new Date(changes.time));
	  torqueTime.text(date);
		// casi al principio cartoDB no trae bien la fecha y salen NaNs...
	  if (date != "NaN-NaN-NaN" && date != currentDate){
		  updateRadar(dataFechas, date);
			currentDate = jQuery.datepicker.formatDate( "yy-mm-dd", new Date(changes.time));
	  }
	});
}

function main() {
	// crear mapa de Leaflet
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
		// cuando acabes de crear la capa, agregala al mapa
		map.addLayer(layer);
		// luego haz el query de los datos de esa capa
		hazQuery(layer);
		// y haz un radar inicial
		hazRadar();
	 });
}
// correr todo el show desde el prinicipio
window.onload = main;

// funcion que hace un query de la capa de cartoDB y regresa un json
// de cuantas entradas hay por categoria, por cada dia
function hazQuery(layer) {
	var sql = new cartodb.SQL({ user: 'rtapia' });
	sql.execute("SELECT DISTINCT fecha::date, categoria, COUNT(categoria) OVER (PARTITION BY fecha::date, categoria) FROM levantamiento_final ORDER BY fecha::date")
	.done(function(data) {
		// asigna el json de respuesta a una variable global
		dataFechas = fixData(data.rows);
		// una vez que ya tengas esos datos, ejecuta el cambio de tiempo de la
		// capa de torque de cartoDB
		timeChange(layer);
	})
	.error(function(errors) {
		// errors contains a list of errors
		console.log("errors:" + errors);
	})
}

//Seleccionamos/creamos un elemento 'svg' y lo pegamos al body
var svg = d3.select('#chart').append('svg')
	.attr('width', 600)
	.attr('height', 600);
//Inicializamos la gráfica de radar
//Estas variables son globales para usarlas en las dos funciones
var chart = RadarChart.chart();
// maxValue importante para que no tenga conflicto con los datos iniciales
// que son puros 0s
RadarChart.defaultConfig.maxValue = 100;
RadarChart.defaultConfig.transitionDuration = 250;
RadarChart.defaultConfig.tickLabels = false;

// funcion para hacer radar inicial
function hazRadar(){
	var w = 500,
		h = 500;

	var colorscale = d3.scale.category10();
	var d = [
		{
			className: 'diario',
			axes: [
				{axis: "Establecimientos Comerciales", value: 0},
				{axis: "Servicios", value: 0},
				{axis: "Bienes Inmuebles",	value: 0},
				{axis: "Seguridad", value: 0},
				{axis: "Movilidad", value: 0},
				{axis: "Basura", value: 0}
			]
		}
	];

	//Hacemos la gráfica, le asignamos la clase 'fixed' para dejarla fija
	//y no actualizarla en el click sobre el mapa
	svg.append('g').classed('diario', 1).datum(d).call(chart);
}

// arreglas los datos del json que regresa el query de cartoDB para
// hacer un array decente que le pueda mandar al radar
function fixData(datos){
	var maximo = 0;
	var data = [];

	for (var i = 0; i < datos.length; i++){

		var groups = {};

		var cats = ["Establecimientos Comerciales", "Servicios", "Bienes Inmuebles", "Seguridad", "Movilidad", "Basura"];

		for (var i = 0; i < datos.length; i++){
			maximo = Math.max(maximo, datos[i].count);
			var item = datos[i];

			if(!groups[item.fecha]) {
				//groups[item.fecha] = [];
				// crear array asociativo para cada fecha
				groups[item.fecha] = [
					{
						className: 'diario',
						axes: [
							{axis: "Establecimientos Comerciales", value: 0},
							{axis: "Servicios", value: 0},
							{axis: "Bienes Inmuebles",	value: 0},
							{axis: "Seguridad", value: 0},
							{axis: "Movilidad", value: 0},
							{axis: "Basura", value: 0}
						]
					}
				];
			}
			// ver si traigo datos de cada categoria para cada fecha
			// y si si, actualizar el value del array anterior
			groups[item.fecha][0].axes[cats.indexOf(item.categoria)].value= item.count;

		}
		/*var result = [];
			for(var x in groups) {
    	if(groups.hasOwnProperty(x)) {
        	var obj = {};
        	obj[x] = groups[x];
        	result.push(obj);
    	}
		}
		//return result;
		*/
		// actualiza el maximo del radar chart de acuerdo al maximo de los datos
		// que vienen del query
		RadarChart.defaultConfig.maxValue = maximo;
		return groups;
	}
}

// funcion para actualizar radar
function updateRadar(datos, date){
	// si hay datos para la fecha que se esta desplegando
	if (datos[$('#torque-time').text()+"T00:00:00Z"] != undefined) {
		radarData = datos[$('#torque-time').text()+"T00:00:00Z"];
	} else { // si no, mandale puros 0s
		radarData = [
			{
				className: 'diario',
				axes: [
					{axis: "Establecimientos Comerciales", value: 0},
					{axis: "Servicios", value: 0},
					{axis: "Bienes Inmuebles",	value: 0},
					{axis: "Seguridad", value: 0},
					{axis: "Movilidad", value: 0},
					{axis: "Basura", value: 0}
				]
			}
		];
	}
	// actualiza el radar
	var game = svg.selectAll('g.diario').data([radarData]);
	game.enter().append('g').classed('diario', 1);
	game.call(chart);
}
