var dataFechas, fechas, categorias, datos, series;
var sql = new cartodb.SQL({ user: 'rtapia' });
sql.execute("SELECT DISTINCT fecha::date, categoria, COUNT(categoria) OVER (PARTITION BY fecha::date, categoria) FROM levantamiento_final ORDER BY fecha::date")
.done(function(data) {
  cats = data.rows;
  categorias = d3.nest().key(
      function(d) { return d.categoria;
    })
    .key(
      function(d) { return d.fecha;
    })
    .rollup(
      function(v) { return d3.sum(v, function(d) { return d.count; });
    })
    .map(cats);
  // cuando hagas el query de las categorias, traete todas las fechas
  sql.execute("WITH mima AS ( "+
          "SELECT MIN(fecha) as mi "+
          ", MAX(fecha) as ma "+
          "FROM levantamiento_final "+
        ") "+
  "SELECT generate_series( mima.mi, mima.ma, '1 day':: interval)::date as fecha "+
  "FROM mima;")
  .done(function(data) {
    fechas = data.rows.map(function(i){
      return i.fecha;
    });

    series = fixDataStream(categorias, fechas);
    doStreamGraph(d3.values(series));
  })
  .error(function(errors) {
    // errors contains a list of errors
    console.log("errors:" + errors);
  });
  // una vez que ya tengas esos datos, ejecuta el cambio de tiempo de la
  // capa de torque de cartoDB
  //timeChange(layer);
})
.error(function(errors) {
  // errors contains a list of errors
  console.log("errors:" + errors);
});

function fixDataStream(cats, dates){
  // arregla datos para que haya una coleccion completa de fechas y datos
  // para cada categoria

  var categorias = d3.keys(cats);
  dates.forEach( function(thisDate, i){ // itera sobre las fechas completas
    categorias.forEach( function(thisCat, ii){ // itera sobre las categorias
      if (d3.keys(cats[thisCat]).indexOf(thisDate) == -1 ) { // si no esta la fecha en la categoria, que sea 0
        cats[thisCat][thisDate] = 0
      }
    });
  });

  // hacer los arrays de datos para cada serie de datos - i.e. cada categoria
  var serieLocal = {}
  categorias.forEach( function(thisCat, i){ // itera sobre las categorias
    serieLocal[thisCat] = [];
    dates.forEach( function(thisDate, ii){ //lee la fechas en orden y crea el array de datos para cada categoria en orden
      serieLocal[thisCat].push({'x': ii, 'y': cats[thisCat][thisDate]});
    });
  });
  return serieLocal;
}
  //por categoria: [{x: fecha, y: valor}, {x: fecha, y: valor},...]
  // var porFechasCatsSum = d3.nest().key(function(d) { return d.categoria; }).key(function(d) { return d.fecha; }).rollup(function(v) { return d3.sum(v, function(d) { return d.count; }); }).map(categorias);

function doStreamGraph(series) {
  stack = d3.layout.stack().offset("zero"),
  layers0 = stack(series);
  console.log(layers0);
var width = 960,
  height = 500;

  m = 54;
  n = 6;

var x = d3.scale.linear()
  .domain([0, m - 1])
  .range([0, width]);

var y = d3.scale.linear()
  .domain([0, d3.max(layers0.concat(layers0), function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
  .range([height, 0]);

var color = d3.scale.ordinal()
  //.range(["#aad", "#556"]);
  .range(["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"]);


var area = d3.svg.area()
  .x(function(d) { return x(d.x); })
  .y0(function(d) { return y(d.y0); })
  .y1(function(d) { return y(d.y0 + d.y); });

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

svg.selectAll("path")
  .data(layers0)
.enter().append("path")
  .attr("d", area)
  .style("fill", function() { return color(Math.random()); });

}
