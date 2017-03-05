var datamap = []; //key: zip code, value: array of buckets
var zipcodes = []; //contains the available zip codes - whatever works!

d3.csv("heatmap.csv", function (error, lines) 
{
	lines.forEach(function (d)
	{
		if (!datamap[d["Zip Code"]])
		{
			datamap[d["Zip Code"]] = [];
			zipcodes.push(d["Zip Code"]);
		}
		
		//Coerce data to num type
		datamap[d["Zip Code"]].push(
				{
					Month: +d.Month, 
					Year: +d.Year,
					Power: +d.Power
				});
	});
	
	//Fixed chart stuff
	var margin = {top: 100, right: 90, bottom: 30, left: 50};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

//	var parseDate = d3.time.format("%m").parse;
//	var formatDate = d3.time.format("%b");

	var months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]; //HACK: Add empty months b4 jan!!
	var x = d3.scale.ordinal()
				.domain(months.slice(1))
				.rangeBands([0, width]);
	
	var y = d3.scale.linear().range([height, 0]);
	var z = d3.scale.linear().range(["beige", "red"]); //Color scale
	
	var xStep = 1;
	var yStep = 1;

	//Selection:
	var select = d3.select("#zip-selector");
	select.on("change", function () {
		var selectedValue = d3.select('select').property('value');
		
		//onchange handler goes here
		var buckets = datamap[selectedValue];
		
		//Clear o ut prev chart
		d3.select("#chart-area").html("");
		
		var svg = d3.select("#chart-area")
					.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		//Comp the scale domains
		y.domain(d3.extent(buckets, function(d) {
			return d.Year; 
			}));
		
		z.domain([d3.min(buckets, function (d) {
					return d.Power;
				  }), 
				  d3.max(buckets, function(d) {
					return d.Power;
				  })]);

		// Extend the x and y dom 
		y.domain([y.domain()[0], y.domain()[1]]);
		
		//Show tiles for non-zero
		svg.selectAll(".tile")
			.data(buckets)
			.enter()
			.append("rect")
			.attr("class", "tile")
			.attr("x", function (d) { return x(months[d.Month]); })
			.attr("y", function (d) { return y(d.Year + yStep); })
			.attr("width", x(months[2]) - x(months[1]))
			.attr("height", y(0) - y(yStep))
			.style("fill", function (d) { return z(d.Power); })
			.style("stroke", "white")
			.attr("padding", "2");
		
		//Add a legend for color values
		var legend = svg.selectAll(".legend")
						.data(z.ticks(6).reverse())
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
		var xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(6, 0, 0);
		
		svg.append("g")
	      .attr("class", "x-axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	      //Label
		    .append("text")
		      .attr("class", "label")
		      .attr("x", width + 50)
		      .attr("y", 0)
		      .attr("text-anchor", "end")
		      .text("Month");
		  
		  svg.selectAll("path.domain")
		  		.attr("d", "M34,0V0H786V00");
		  
		  // Add a y-axis with label.
		  var yAxis = d3.svg.axis()
		  			.scale(y)
		  			.orient("left")
		  			.tickFormat(d3.format("000"));
		  svg.append("g")
		      .attr("class", "y-axis")
		      .attr("transform", "translate(0, -20)")
		      .call(yAxis)
			    .append("text")
			      .attr("class", "label")
			      .attr("y", -20)
			      .attr("dy", ".71em")
			      .attr("text-anchor", "end")
			      .text("Year");
	});
	
	var options = select.selectAll("option")
						.data(zipcodes)
						.enter()
						.append("option")
							.text(function (d) {return d;});
	
	//Trigger default change event 
	//so the page won't be empty on load
	select.on("change")();
	
});