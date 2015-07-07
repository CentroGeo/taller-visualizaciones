var data = [
      {
        className: 'germany', // optional can be used for styling
        axes: [
          {axis: "strength", value: 13},
          {axis: "intelligence", value: 6},
          {axis: "charisma", value: 5},
          {axis: "dexterity", value: 9},
          {axis: "luck", value: 2}
        ]
      },
	  {
        className: 'bla', // optional can be used for styling
        axes: [
          {axis: "strength", value: 43},
          {axis: "intelligence", value: 5},
          {axis: "charisma", value: 35},
          {axis: "dexterity", value: 39},
          {axis: "luck", value: 24}
        ]
      }
    ];

	var chart = RadarChart.chart();
	var svg = d3.select('body').append('svg')
	.attr('width', 600)
	.attr('height', 800);

// draw one
svg.append('g').classed('focus', 1).datum(data).call(chart);

var data2 = [
      {
        className: 'germany', // optional can be used for styling
        axes: [
          {axis: "strength", value: 13},
          {axis: "intelligence", value: 6},
          {axis: "charisma", value: 5},
          {axis: "dexterity", value: 9},
          {axis: "luck", value: 2}
        ]
      },
	  {
        className: 'argentina', // optional can be used for styling
        axes: [
          {axis: "strength", value: 43},
          {axis: "intelligence", value: 22},
          {axis: "charisma", value: 7},
          {axis: "dexterity", value: 8},
          {axis: "luck", value: 29}
        ]
      }
    ];

	var game = svg.selectAll('g.focus').data([data2]);
	game.enter().append('g').classed('focus', 1);
	//game.call(chart); //para actualizar chart - no es necesario llamar exit().remove()


	var data3 = [
      {
        className: 'bla', // optional can be used for styling
        axes: [
          {axis: "strength", value: 14},
          {axis: "intelligence", value: 52},
          {axis: "charisma", value: 78},
          {axis: "dexterity", value: 38},
          {axis: "luck", value: 9}
        ]
      }]








/*
	function randomDataset() {
      return data.map(function(d) {
        return {
          className: d.className,
          axes: d.axes.map(function(axis) {
            return {axis: axis.axis, value: Math.ceil(Math.random() * 10)};
          })
        };
      });
    }

	 var chart = RadarChart.chart();
  var cfg = chart.config(); // retrieve default config
  var svg = d3.select('body').append('svg')
    .attr('width', cfg.w)
    .attr('height', cfg.h + cfg.h / 4);
  svg.append('g').classed('single', 1).datum(data2).call(chart);
  // many radars
  chart.config({w: cfg.w / 4, h: cfg.h / 4, axisText: false, levels: 0, circles: false});
  cfg = chart.config();
  function render() {
    var game = svg.selectAll('g.game').data(
      [
        randomDataset(),
        randomDataset(),
        randomDataset(),
        randomDataset()
      ]
	  data2
    );
    game.enter().append('g').classed('game', 1);
    game
      .attr('transform', function(d, i) { return 'translate('+(i * cfg.w)+','+ (cfg.h * 4) +')'; })
      .call(chart);
    setTimeout(render, 1000);
  }

  render();

  */
