
//Hace la gráfica de radar inicial
//data es un json con los valores promedio de las variables
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

//actualiza la gráfica de radar. data es un json con el
//feature seleccionado (un feature collection con un sólo feature)
function updateRadar(data){
	console.log(data.features[0].properties);
	variables = data.features[0].properties
	//den = 1/(variables.e_pro + variables.c_pro + variables.o_pro + variables.v_pro)
	var d = [[//{'axis':'vivienda','value':variables.v_pro*den},
			 {'axis':'comercio','value':variables.c_pro*den},
			 {'axis':'servicios','value': variables.e_pro*den},
			 {'axis':'ocio','value':variables.o_pro*den}]]

	// var text = d3.select("#chart").selectAll(".axis")
	//   .data(data, function(d) { return d; });
	// console.log(text)
	 var radar = d3.select("#chart")
	 var ejes = radar.selectAll(".axis")
	// ejes.data(data).enter().append(d)
	 console.log(ejes.data(['comercio']))
	// //console.log()
}
