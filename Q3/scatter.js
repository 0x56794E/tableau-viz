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
	
	var w = 600;
	var h = 500;
	var padding = 30;
	
	//*************************
	//Chart #1 - Linear scale *
	//*************************	
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
					  .ticks(5);
	
	var yAxis = d3.svg.axis()
					 .scale(yScale)
					 .orient("left")
					 .ticks(5);

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
	
	
	//Line 1 - Lagomorpha (red circle)
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
	
	//Line 2 - Didelphimorphia (blue square)
	svg.selectAll("rect")
	.data(dataMap['Didelphimorphia'])
	.enter()
	.append("rect")
	.attr("stroke", "blue")
	.attr("fill", "none")
	.attr("x", function (d) {
		return xScale(d[0]) - 3;
	})
	.attr("y", function (d) {
		return yScale(d[1]) - 3;
	})
	.attr("width", 6)
	.attr("height", 6);

	//Line 3 - Dasyuromorphia (green triangle)
	svg.selectAll("polygon")
		.data(dataMap['Dasyuromorphia'])
		.enter()
			.append("polygon")
			.attr("fill", "none")
			.attr("stroke", "green")
			.attr("points", function (d) {
				var scaledX = xScale(d[0]);
				var scaledY = yScale(d[1]);
				
				var pts =  (scaledX - 3) + ' ' + (scaledY + 3) 
					+ ',' + (scaledX + 3) + ' ' + (scaledY + 3)
					+ ',' + scaledX + ' ' + (scaledY - 3); 
				return pts;
			});       

	
	


	//*************************
	//Chart #2 - Log scale *
	//*************************
	var xLogScale = d3.scale.log()
							.clamp(true)
							.domain([0.1, maxX])
							.range([ padding, w - padding * 2 ])
							.nice();

	var yLogScale = d3.scale.log()
							.clamp(true)
							.domain([0.1, maxY])
							.range([ h - padding, padding ])
							.nice();

	//Set up the axes
	var xAxisLog = d3.svg.axis().scale(xLogScale).orient("bottom").ticks(5);

	var yAxisLog = d3.svg.axis().scale(yLogScale).orient("left").ticks(5);

	//Create the chart
	var svgLog = d3.select("body")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

	//Use the axes
	svgLog.append("g")
			.attr("class", "axis")
			.attr("transform","translate(0," + (h - padding) + ")")
			.call(xAxisLog);

	svgLog.append("g")
			.attr("class", "axis")
			.attr("transform",	"translate(" + padding + ",0)")
			.call(yAxisLog);

	//Line 1 - Lagomorpha (red circle)
	svgLog.selectAll("circle")
			.data(dataMap['Lagomorpha'])
			.enter()
			.append("circle")
				.attr("stroke", "red")
				.attr("fill", "white")
				.attr("cx", function(d) {
					return xLogScale(d[0]);
						})
				.attr("cy", function(d) {
					return yLogScale(d[1]);
				})
				.attr("r", 4);

	//Line 2 - Didelphimorphia (blue square)
	svgLog.selectAll("rect")
			.data(dataMap['Didelphimorphia'])
			.enter()
			.append("rect")
				.attr("stroke", "blue")
				.attr("fill", "none").attr("x", function(d) {
					return xLogScale(d[0]) - 3;
					})
				.attr("y", function(d) {
					return yLogScale(d[1]) - 3;
					})
				.attr("width", 6).attr("height", 6);

	//Line 3 - Dasyuromorphia (green triangle)
	svgLog.selectAll("polygon")
			.data(dataMap['Dasyuromorphia'])
			.enter()
			.append("polygon")
				.attr("fill", "none")
				.attr("stroke", "green")
				.attr("points", function(d) {
					var scaledX = xLogScale(d[0]);
					var scaledY = yLogScale(d[1]);
	
					var pts = (scaledX - 3) + ' ' + (scaledY + 3) + ','
							+ (scaledX + 3) + ' ' + (scaledY + 3) + ',' + scaledX
							+ ' ' + (scaledY - 3);
					return pts;
				});       

});
