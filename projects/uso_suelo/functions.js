
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

	//Los datos
	den = 1/(data[0].e_pro + data[0].c_pro + data[0].o_pro + data[0].v_pro)
	var d = [
		{
			className: 'promedios',
			axes: [
			{axis: "comercio", value: 0.1*(data[0].c_pro*den)},
			{axis: "servicios", value: data[0].e_pro*den},
			{axis: "ocio", value: data[0].o_pro*den}
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
	//console.log(variables)
	//den = 1/(variables.e_pro + variables.c_pro + variables.o_pro + variables.v_pro)
	var d = [
		{
			className: 'colonia',
			axes: [
			{axis: "comercio", value: 0.1*(variables.comercio)},
			{axis: "servicios", value: variables.ocio},
			{axis: "ocio", value: variables.equip}
			]
		}
	]

	console.log(d);

	var game = svg.selectAll('g.colonia').data([d]);
	game.enter().append('g').classed('colonia', 1);
	game.call(chart); //para actualizar chart - no es necesario llamar exit().remove()

}
