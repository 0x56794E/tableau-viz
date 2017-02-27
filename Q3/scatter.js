// Load data from file
var dataMap = []; //Key: name of species; Value: array of arrays
d3.tsv("data.tsv", function (error, data) 
{
	data.forEach(function (d) {
	
		//If same species has been added before
		if (!dataMap[d.Species]) 
		{
			dataMap[d.Species] = [];
		}
			
		dataMap[d.Species].push([parseFloat(d.BodyMass), parseFloat(d.Distribution)]);
	});
	
	//MUST BE INSIDE the anon. fuc!!!
	//Charts
	var w = 600;
	var h = 500;
	var padding = 30;
	
	//Scale
	//Calc maxX and maxY
	var maxX = d3.max([dataMap['Lagomorpha'], dataMap['Didelphimorphia'], dataMap['Dasyuromorphia']].map(function (array) {
		return d3.max(array, function (d) {
			return d[0];
		})
	}));
	
	var maxY = d3.max([dataMap['Lagomorpha'], dataMap['Didelphimorphia'], dataMap['Dasyuromorphia']].map(function (array) {
		return d3.max(array, function (d) {
			return d[1];
		})
	}))
	
	var xScale = d3.scale.linear()
						.domain([0, maxX])
						.range([padding, w - padding * 2]);
	
	var yScale = d3.scale.linear()
						 .domain([0, maxY])
						 .range([h - padding, padding]);
	
	//Set up the axes
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom")
					  .ticks(5000);
	
	var yAxis = d3.svg.axis()
					 .scale(yScale)
					 .orient("left")
					 .ticks(0.5);

	//Create the chart
	var svg = d3.select("body")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	
	
	//Chart 1 - Lagomorpha (red circle)
	svg.selectAll("circle")
		.data(dataMap['Lagomorpha'])
		.enter()
		.append("circle")
		.attr("stroke", "red")
		.attr("fill", "white")
		.attr("cx", function (d) {
			return xScale(d[0]);
		})
		.attr("cy", function (d) {
			return yScale(d[1]);
		})
		.attr("r", 4);
	
//	//Chart 2 - Didelphimorphia (blue square)
	svg.selectAll("rect")
	.data(dataMap['Didelphimorphia'])
	.enter()
	.append("rect")
	.attr("stroke", "blue")
	.attr("fill", "none")
	.attr("x", function (d) {
		return xScale(d[0]);
	})
	.attr("y", function (d) {
		return yScale(d[1]);
	})
	.attr("width", 4)
	.attr("height", 4);

//	//Chart 3 - Dasyuromorphia (green triangle)
	svg.selectAll("polygon")
		.data(dataMap['Dasyuromorphia'])
		.enter()
			.append("polygon")
			.attr("fill", "none")
			.attr("stroke", "green")
			.attr("points", function (d) {
				var scaledX = xScale(d[0]);
				var scaledY = yScale(d[1]);
				
				var pts =  (scaledX - 2) + ' ' + (scaledY - 2) 
					+ ',' + (scaledX + 2) + ' ' + (scaledY - 2)
					+ ',' + scaledX + ' ' + (scaledY + 2); 
				return pts;
			});       


	//Use the axes
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);
	
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);
});




"30.722500000000004 504.375" +
"30.790499999999998 111.51785714285717" +
"30.7565 111.51785714285717"
