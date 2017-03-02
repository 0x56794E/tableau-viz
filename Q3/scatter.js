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
	
	var w = 750;
	var h = 300;
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
					  .innerTickSize(2 * padding - h)
					  .outerTickSize(0)
					  .tickPadding(10)
					  .orient("bottom")
					  .ticks(5);
	
	var yAxis = d3.svg.axis()
					 .scale(yScale)
					 .innerTickSize(3 * padding - w)
					 .outerTickSize(0)
					 .tickPadding(10)
					 .orient("left")
					 .ticks(5);

	//Create the chart
	var svg = d3.select("#chart1")
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
	svg.append("g")
		.selectAll("path")
		.data(dataMap['Lagomorpha'])
		.enter()
			.append("path")
				.attr("d", d3.svg.symbol().type("circle"))
				.attr("fill", "none")
				.attr("stroke", "red")
				.attr("transform", function(d) { return "translate(" + xScale(d[0]) + "," + yScale(d[1]) + ")"; });


	
	//Line 2 (new)
	svg.append("g")
		.selectAll("path")
		.data(dataMap['Didelphimorphia'])
		.enter()
			.append("path")
				.attr("d", d3.svg.symbol().type("square"))
				.attr("fill", "none")
				.attr("stroke", "blue")
				.attr("transform", function(d) { return "translate(" + xScale(d[0]) + "," + yScale(d[1]) + ")"; });

	//Line 3 - Dasyuromorphia (green triangle)
	svg.append("g")
		.selectAll("path")
		.data(dataMap['Dasyuromorphia'])
		.enter()
			.append("path")
				.attr("d", d3.svg.symbol().type("triangle-up"))
				.attr("fill", "none")
				.attr("stroke", "green")
				.attr("transform", function(d) { return "translate(" + xScale(d[0]) + "," + yScale(d[1]) + ")"; });

	//TODO: legend:
	//Loop thru datamap
	var legend = d3.select("#chart1")
					.append("svg")
						.attr("class", "legend")
						.attr("width", w/2)
						.attr("height", h)
					.append("rect")
					.attr("width", "20")
					.attr("height", "20")
					.attr("stroke", "blue")
					.attr("fill", "none")
					.text("hello")
//					.append(function (d) {
//						console.log("in d");
//						return "g";
//					})
//					
//					.attr("class", "legend")
//					.attr("transform", function (d, i) { 
//						return "translate(0," + (20 + i * 20) + ")"; 
//										})
					;
	
	
	//*************************
	//Chart #2 - Log scale *
	//*************************
	/*
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
	var svgLog = d3.select("#chart2")
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
				*/

});
