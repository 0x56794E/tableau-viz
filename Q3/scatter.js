var w = 600;
var h = 500;
var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

//**** CHART 1 ******

//Data set 
var dataset1 = 
	[
		[5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
        [410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
	];

svg.selectAll("rect")
	.data(dataset1)
	.enter()
	.append("rect")
	.attr("stroke", "red")
	.attr("fill", "white")
	.attr("x", function(d){
		return d[0];
	})
	.attr("y", function(d){
		return d[1];
	})
	.attr("width", 10)
	.attr("height", 10);


//****** CHART 2 ******
//Data set
var dataset2 = 
	[
		[0, 0], [10, 10], [40, 50], [520, 33], [130, 95],
        [400, 120], [405, 440], [230, 100], [618, 20], [20, 98]
	];

svg.selectAll("circle")
	.data(dataset2)
	.enter()
	.append("circle")
	.attr("stroke", "green")
	.attr("fill", "white")
	.attr("cx", function (d) {
		return d[0];
	})
	.attr("cy", function (d) {
		return d[1];
	})
	.attr("r", 10);


//******** CHART 3 **********
// Read from file
var datamap = []; //Key: name of species; Value: array of arrays
d3.tsv("data.tsv", function (error, data) 
{
	data.forEach(function (d) {
		console.log("BodyMass = " + d.BodyMass);
		console.log("| Species = " + d.Species);
		console.log("| Distribution = " + d.Distribution);
		console.log("\n");
	});
	console.log("\n");
});