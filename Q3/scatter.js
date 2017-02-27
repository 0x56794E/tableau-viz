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
	
	//Custom max func
	var max = d3.max(dataMap.map(function() {
		return d3.max(array);
	}));
	
	//Scale
	var xScale = d3.scale.linear()
						.domain([0, d3.max(dataMap.map(function (array) {
							return d3.max(array, function (d) 
									{
										return d[0];
									});
						}))])
						.range([padding, w - padding * 2]);
	
	var yScale = d3.scale.linear()
						 .domain([0], d3.max(dataMap.map(function (array) {
							 return d3.max(array, function (d) {
								 return d[1];
							 })
						 })))
						 .range([h - padding, padding]);
	
	//Set up the axes
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom")
					  .ticks(2);
	
	var yAxis = d3.svg.axis()
					 .scale(yScale)
					 .orient("left")
					 .ticks(2);

	//Create the chart
	var svg = d3.select("body")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	//Use the axes
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);
	
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);
	
	//Chart 1 - Lagomorpha (red circle)
	svg.selectAll("circle")
		.data(dataMap['Lagomorpha'])
		.enter()
		.append("circle")
		.attr("stroke", "red")
		.attr("fill", "white")
		.attr("cx", function (d) {
			return d[0];
		})
		.attr("cy", function (d) {
			return d[1];
		})
		.attr("r", 4);
	
	//Chart 2 - Didelphimorphia (blue square)
	svg.selectAll("rect")
	.data(dataMap['Didelphimorphia'])
	.enter()
	.append("rect")
	.attr("stroke", "blue")
	.attr("fill", "none")
	.attr("x", function (d) {
		return d[0];
	})
	.attr("y", function (d) {
		return d[1];
	})
	.attr("width", 4)
	.attr("height", 4);

	//Chart 3 - Dasyuromorphia (green triangle)
	svg.selectAll("polygon")
		.data(dataMap['Dasyuromorphia'])
		.enter()
			.append("polygon")
			.attr("fill", "none")
			.attr("stroke", "green")
			.attr("points", function (d) {
				return (d[0] - 2) + ' ' + (d[1] - 2) 
					+ ',' + (d[0] + 2) + ' ' + (d[1] + 2)
					+ ',' + d[0] + ' ' + (d[1] + 2); 
			});
	
	svg.selectAll("circle")
	.data(dataMap['Didelphimorphia'])
	.enter()
	.append("circle")
	.attr("stroke", "blue")
	.attr("fill", "white")
	.attr("cx", function (d) {
		return d[1];
	})
	.attr("cy", function (d) {
		return d[0];
	})
	.attr("r", 2);

});

