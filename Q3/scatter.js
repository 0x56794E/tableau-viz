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
	var h = 400;
	var padding = 30;
	
	//*************************
	//Chart #1 - Linear scale *
	//*************************	
	//Scale
	//Calc maxX and maxY (and min)
	var maxX = d3.max([dataMap['Lagomorpha'], dataMap['Didelphimorphia'], dataMap['Dasyuromorphia']].map(function (array) {
		return d3.max(array, function (d) {
			return d[0];
		})
	}));
	
	var minX = d3.min([dataMap['Lagomorpha'], dataMap['Didelphimorphia'], dataMap['Dasyuromorphia']].map(function (array) {
		return d3.min(array, function (d) {
			return d[0];
		})
	}));
	
	var maxY = d3.max([dataMap['Lagomorpha'], dataMap['Didelphimorphia'], dataMap['Dasyuromorphia']].map(function (array) {
		return d3.max(array, function (d) {
			return d[1];
		})
	}))
	
	var minY = d3.min([dataMap['Lagomorpha'], dataMap['Didelphimorphia'], dataMap['Dasyuromorphia']].map(function (array) {
		return d3.min(array, function (d) {
			return d[1];
		})
	}))
	
	
	var xScale = d3.scale.linear()
						.domain([minY, maxX])
						.range([padding, w - padding * 2]);
	
	var yScale = d3.scale.linear()
						 .domain([minY, maxY])
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
					 .ticks(7);

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
	
	//ADD backwards for z-index issue
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

	//TODO: make this smarter:
	var legend = d3.select("#chart1")
					.append("svg")
						.attr("class", "legend")
						.attr("width", w/2)
						.attr("height", h)
						.attr("transform", "translate(" + padding + "," + padding + ")");
	
	var redCircle = legend.append("g");
	redCircle.append("path")
				.attr("d", d3.svg.symbol().type("circle"))
				.attr("fill", "none")
				.attr("stroke", "red");
	redCircle.append("text")
				.text("Lagomorpha")
				.attr("x", 10)
				.attr("y", 5);
	
	var blueSq = legend.append("g").
					attr("transform", "translate(0, 20)");
	blueSq.append("path")
				.attr("d", d3.svg.symbol().type("square"))
				.attr("fill", "none")
				.attr("stroke", "blue");
	blueSq.append("text")
				.text("Didelphimorphia")
				.attr("x", 10)
				.attr("y", 5);
	
	var greenTria = legend.append("g").
					attr("transform", "translate(0, 40)");
	greenTria.append("path")
				.attr("d", d3.svg.symbol().type("triangle-up"))
				.attr("fill", "none")
				.attr("stroke", "green");
	blueSq.append("text")
				.text("Dasyuromorphia")
				.attr("x", 10)
				.attr("y", 25);
	//*************************
	//Chart #2 - Log scale *
	//*************************
	var xLogScale = d3.scale.log()
							.clamp(true)
							.domain([minX, maxX])
							.range([ padding, w - padding * 2 ])
							.nice();

	var yLogScale = d3.scale.log()
							.clamp(true)
							.domain([minY, maxY])
							.range([ h - padding, padding ])
							.nice();

	//Set up the axes
	var xAxisLog = d3.svg.axis()
						.scale(xLogScale)
						.orient("bottom")
						.innerTickSize(2 * padding - h)
						.outerTickSize(0)
						.tickPadding(10)
						.ticks(5);

	var yAxisLog = d3.svg.axis()
						.scale(yLogScale)
						.orient("left")
						.ticks(5);

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
	svgLog.append("g")
		.selectAll("path")
		.data(dataMap['Lagomorpha'])
		.enter()
			.append("path")
				.attr("d", d3.svg.symbol().type("circle"))
				.attr("fill", "none")
				.attr("stroke", "red")
				.attr("transform", function(d) { return "translate(" + xLogScale(d[0]) + "," + yLogScale(d[1]) + ")"; });

	//Line 2 - Didelphimorphia (blue square)
	svgLog.append("g")
		.selectAll("path")
		.data(dataMap['Didelphimorphia'])
		.enter()
			.append("path")
				.attr("d", d3.svg.symbol().type("square"))
				.attr("fill", "none")
				.attr("stroke", "blue")
				.attr("transform", function(d) { return "translate(" + xLogScale(d[0]) + "," + yLogScale(d[1]) + ")"; });


	//Line 3 - Dasyuromorphia (green triangle)
	svgLog.append("g")
		.selectAll("path")
		.data(dataMap['Dasyuromorphia'])
		.enter()
			.append("path")
				.attr("d", d3.svg.symbol().type("triangle-up"))
				.attr("fill", "none")
				.attr("stroke", "green")
				.attr("transform", function(d) { return "translate(" + xLogScale(d[0]) + "," + yLogScale(d[1]) + ")"; });



});
