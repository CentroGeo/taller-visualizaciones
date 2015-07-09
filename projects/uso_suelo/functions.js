
//Seleccionamos/creamos un elemento 'svg' y lo pegamos al body
var svg = d3.select('#chart').append('svg')
.attr('width', 600)
.attr('height', 600);
//Inicializamos la gráfica de radar
//Estas variablesa son globales para usarlas en las dos funciones
var chart = RadarChart.chart();
function hazRadar(data){
	//Hace la gráfica de radar inicial
	//data es un json con los valores promedio de las variables

	//TODO: el maxValue debería venir de una consulta

	RadarChart.defaultConfig.w = 500;
	RadarChart.defaultConfig.h = 500;
	RadarChart.defaultConfig.maxValue = 75;
	RadarChart.defaultConfig.tooltipRenderer = function(d){
		//console.log(d)
		if (d.length > 1){
			//hover:punto
			miHTML = "<strong> Variable:" + d[0].axis + "</strong> <br>" +
							 "<strong> Valor:" + d[0].value + "</strong>"
		}else{
			//hover:polígono
			miHTML = "<strong> Tipo:" + d.className + "</strong> "
		}
		return miHTML
	}

	//Los datos
	var d = [
		{
			className: 'promedios',
			axes: [
			{axis: "vivienda", value: 0.01*(data[0].v_pro)},
			{axis: "comercio", value: 0.1*(data[0].c_pro)},
			{axis: "servicios", value: data[0].e_pro},
			{axis: "ocio", value: data[0].o_pro}
			]
		}
	]

	//Hacemos la gráfica, le asignamos la clase 'fixed' para dejarla fija
	//y no actualizarla en el click sobre el mapa
	svg.append('g').classed('fixed', 1).datum(d).call(chart);


}

//actualiza la gráfica de radar. data es un json con el
//feature seleccionado (un feature collection con un sólo feature)
function updateRadar(data){
	variables = data.features[0].properties
	var d = [
		{
			className: 'colonia',
			axes: [
			{axis: "vivienda", value: 0.01*variables.vivienda},
			{axis: "comercio", value: 0.1*variables.comercio},
			{axis: "servicios", value: variables.equip},
			{axis: "ocio", value: variables.ocio}
			]
		}
	]

	var game = svg.selectAll('g.colonia').data([d]);
	game.enter().append('g').classed('colonia', 1);
	game.call(chart); //para actualizar chart - no es necesario llamar exit().remove()

}
