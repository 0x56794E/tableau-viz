//Data
var data = [{product:'Product A',freq:{Q1:576, Q2:1176, Q3:1009, Q4:494}},
{product:'Product B',freq:{Q1:959, Q2:1653, Q3:1999, Q4:697}},
{product:'Product C',freq:{Q1:3210, Q2:4220, Q3:1648, Q4:919}},
{product:'Product D',freq:{Q1:589, Q2:2043, Q3:1153, Q4:911}},
{product:'Product E',freq:{Q1:2599, Q2:1333, Q3:818, Q4:1713}},
{product:'Product F',freq:{Q1:431, Q2:324, Q3:715, Q4:421}},
{product:'Product G',freq:{Q1:1457, Q2:2557, Q3:2245, Q4:762}},
{product:'Product H',freq:{Q1:2573, Q2:3357, Q3:1598, Q4:1287}}];

var margin = {top: 50, right: 20, bottom: 70, left: 100},
width = 600 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

//Parse the date / time
var y = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var x = d3.scale.linear().range([height, 0]);

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");


var svg = d3.select("#chart-area")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", 
			      "translate(" + margin.left + "," + margin.top + ")");

data.forEach(function(d) 
{
    d.value = +d.freq.Q1 + d.freq.Q2 + d.freq.Q3 + d.freq.Q4;
});

y.domain(data.map(function(d) { return d.product; }));
x.domain([0, d3.max(data, function(d) { return d.value; })]);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
	.selectAll("text")
	  .style("text-anchor", "end")
	  .attr("dx", "-.8em")
	  .attr("dy", "-.55em");

var bar = svg.selectAll(".bar")
			 .data(data)
			 .enter()
			 	.append("g")
			 	.attr("class", "bar")
			 	.attr("transform", function (d) {
			 		return "translate(0," + (y(d.product) - 10) + ")";
			 	});
var textFmt = d3.format("0,000");

bar.append("rect")
	.attr("width", function (d) {
		return height - x(d.value);
	})
	.attr("height", y.rangeBand() - 5);

bar.append("text")
	.attr("x", "50")
	.attr("y", (y.rangeBand() - 5)/ 2)
	.attr("dy", ".35em")
	.text(function(d) { return "$" + textFmt(d.value); });

//svg.selectAll("rect")
//  .data(data)
//  .enter()
//  	.append("rect")
//	  .style("fill", "steelblue")
//	  .attr("x", "0")
//	  .attr("height", y.rangeBand())
//	  .attr("y", function(d) { return y(d.product); })
//	  .attr("width", function(d) { return height - x(d.value); });
//
//svg.selectAll("text")
//	.data(data)
//	.enter()
//	.append("text")
//	  .attr("x", "0")
//	  .attr("y", function (d) { return y(d.product); })
//	  .attr("dy", "1em")
////	  .attr("text-anchor", "end")
//	  .text(function(d) 
//			  {
//		  		return "test";
//			  });
//














/*
//Modify data to add sum attr and comp domain


//Settings for the chart canvas
var margin = {top: 20, right: 20, bottom: 20, left: 20};
var barH = 20;
var width = 600 - margin.left - margin.right;
var height = barH * data.length + 100;

//Settings for the scales
//Ordinal cuz finite num of products
var yScale = d3.scale.ordinal()
				.domain(domain)
				.rangeBands([0, barH * data.length]);
				//.rangeRoundBands([0, height], 0.1);

var xScale = d3.scale.linear()
				.domain([0, d3.max(data, function (d) {
					return d.sum;
				})])
				.range([0, width]);

var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left");

var chart = d3.select("#chart-area")
			.attr("width", width)
			.attr("height", height)
			.attr("transform", "translate(" + margin.left + "," + margin.top +")");

//Use the axis
chart.append("g")
	.attr("class", "axis")
	.call(yAxis);

var bar = chart.selectAll(".bar")
				.data(data)
				.enter()
				.append("g")
				.attr("class", "bar")
				.attr("transform", function(d, i) { return "translate(0," + i * barH + ")"; });

bar.append("rect")
	.attr("width", function (d) {
		return xScale(d.sum);
	})
	.attr("height", barH)
	.attr("stroke", "white");
	
bar.append("text")
	.attr("x", function(d) {
		return xScale(d.sum) - 10;
	})
	.attr("y", function (d) {
		return barH/2 + 2;
	})
	.text(function (d) {
		return "$" + d.sum;
	});
*/