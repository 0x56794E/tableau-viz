var margin = {top: 20, right: 90, bottom: 30, left: 50};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%m").parse;
var formatDate = d3.time.format("%b");

var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var z = d3.scale.linear().range(["white", "red"]);

var xStep = 1;
var yStep = 1;

var datamap = []; //key: zip code, value: array of buckets
var svg = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("heatmap.csv", function (error, lines) 
{
	lines.forEach(function (d)
	{
		if (!datamap[d["Zip Code"]])
			datamap[d["Zip Code"]] = [];
		
		//Coerce data to num type
		datamap[d["Zip Code"]].push(
				{
					Month: +d.Month, 
					Year: +d.Year,
					Power: +d.Power
				});
	});
	
	var buckets = datamap["90077"];
	
	//Comp the scale domains
	x.domain(d3.extent(buckets, function(d) {
		return d.Month;
		}));
	y.domain(d3.extent(buckets, function(d) {
		return d.Year; 
		}));
	z.domain([0, d3.max(buckets, function(d) {
		return d.Power;
		})]);

	// Extend the x and y dom 
	x.domain([x.domain()[0], +x.domain()[1] + xStep]);
	y.domain([y.domain()[0], y.domain()[1] + yStep]);
	
	//Show tiles for non-zero
	svg.selectAll(".tile")
		.data(buckets)
		.enter()
		.append("rect")
		.attr("class", "tile")
		.attr("x", function (d) { return x(d.Month); })
		.attr("y", function (d) { return y(d.Year + yStep); })
		.attr("width", x(xStep) - x(0))
		.attr("height", y(0) - y(yStep))
		.style("fill", function (d) { return z(d.Power); })
		.style("stroke", "white");
	
	//Add a legend for color values
	var legend = svg.selectAll(".legend")
					.data(z.ticks(8).slice(1).reverse())
					.enter().append("g")
					.attr("class", "legend")
					.attr("transform", function (d, i) { 
						return "translate(" + (width + 20) + "," + (20 + i * 20) + ")"; 
					});
	
	legend.append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .style("stroke", "white")
    .style("fill", z);

	legend.append("text")
	    .attr("x", 26)
	    .attr("y", 10)
	    .attr("dy", ".35em")
	    .text(String);
	
	svg.append("text")
	    .attr("class", "label")
	    .attr("x", width + 20)
	    .attr("y", 10)
	    .attr("dy", ".35em")
	    .text("kWh");
	
	// Add an x-axis with label.
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.svg.axis().scale(x).orient("bottom"))
	    .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .attr("text-anchor", "end")
	      .text("Date");

	  // Add a y-axis with label.
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(d3.svg.axis().scale(y).orient("left"))
	    .append("text")
	      .attr("class", "label")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .attr("text-anchor", "end")
	      .attr("transform", "rotate(-90)")
	      .text("Value");
});