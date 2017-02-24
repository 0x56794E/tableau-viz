// Load data from file
var dataMap = []; //Key: name of species; Value: array of arrays
d3.tsv("data.tsv", function (error, data) 
{
	data.forEach(function (d) {
	
		//If same species has been added before
		if (!dataMap[d.Species]) 
			dataMap[d.Species] = [];
			
		dataMap[d.Species].push([d.BodyMass, d.Distribution]);
		
	});
});

//Charts
var w = 600;
var h = 500;
var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);


//Chart 1 - Lagomorpha (red circle)
var lagoData = svg.selectAll("circle").data(dataMap['Lagomorpha']);

lagoData.enter()
	.append("circle")
	.attr("stroke", "red")
	.attr("fill", "white")
	.attr("cx", function (d) {
		return d[1];
	})
	.attr("cy", function (d) {
		return d[0];
	})
	.attr("r", 2);

console.log("done chart 1");

////Chart 2 - Didelphimorphia (blue square)
//svg.selectAll("square")
//	.data(dataMap['Didelphimorphia'])
//	.enter()
//	.append("square")
//	.attr("stroke", "blue")
//	.attr("fill", "white")
//	.attr("x", function (d) {
//		return d[1];
//	})
//	.attr("y", function (d) {
//		return d[0];
//	})
//	.attr("width", 2);

//Chart 3 - Dasyuromorphia (green triangle)