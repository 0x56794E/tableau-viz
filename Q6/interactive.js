//Data
var data = [{product:'Product A',freq:{Q1:576, Q2:1176, Q3:1009, Q4:494}},
{product:'Product B',freq:{Q1:959, Q2:1653, Q3:1999, Q4:697}},
{product:'Product C',freq:{Q1:3210, Q2:4220, Q3:1648, Q4:919}},
{product:'Product D',freq:{Q1:589, Q2:2043, Q3:1153, Q4:911}},
{product:'Product E',freq:{Q1:2599, Q2:1333, Q3:818, Q4:1713}},
{product:'Product F',freq:{Q1:431, Q2:324, Q3:715, Q4:421}},
{product:'Product G',freq:{Q1:1457, Q2:2557, Q3:2245, Q4:762}},
{product:'Product H',freq:{Q1:2573, Q2:3357, Q3:1598, Q4:1287}}];

//Modify data to add sum attr
data.forEach(function (prod) {
	prod.sum = +prod.freq.Q1 + prod.freq.Q2 + prod.freq.Q3 + prod.freq.Q4;
});

//Settings for the chart canvas
var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = 600 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;
var barH = 20;

//Settings for the scales
//Ordinal cuz finite num of products
var yScale = d3.scale.ordinal()
			//	.domain()
				.rangeRoundBands([height, 0], 0.5);
var xScale = d3.scale.linear()
				.domain([0, d3.max(data, function (d) {
					return d.sum;
				})])
				.range([0, width]);

var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom");

var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left");

var chart = d3.select("#chart-area")
			.attr("width", width)
			.attr("height", barH * data.length);

var bar = chart.selectAll("g")
				.data(data)
				.enter()
				.append("g")
				.attr("transform", function(d, i) { return "translate(0," + i * barH + ")"; });

bar.append("rect")
	.attr("width", function (d) {
		return xScale(d.sum);
	})
	.attr("height", barH);
	
bar.append("text")
	.attr("x", function(d) {
		return xScale(d.sum) - 10;
	})
	.attr("y", function (d) {
		return barH/2;
	})
	.text(function (d) {
		return "$" + d.sum;
	});
