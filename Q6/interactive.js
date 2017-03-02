d3.json("dataset.txt", function (error, data) {
	
	//Parse ea line here
	
	//Settings for the chart canvas
	var margin = {top: 20, right: 20, bottom: 20, left: 20};
	var width = 600 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;
	
	//Settings for the scales
	//Ordinal cuz finite num of products
	var yScale = d3.scale.ordinal().rangeRoundBands([height, 0], 0.5);
	var xScale = d3.scale.linear().range([0, width]);
	
	var xAxis = d3.svg.axis()
				.scale(xXcale)
				.orient("bottom");
	
	var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left");
	
	//Compute the domain for ea axis from the data
	//TODO:	
	var chart = d3.select("#chart")
				.attr("width", width)
				.attr("height", height);
	var bar = chart.selectAll("g")
					.data(data)
					.enter()
					.append("g")
					.attr("transform", function (d, i)
							{
								return "translate(<somex>, <somey>)";
							});
	
});