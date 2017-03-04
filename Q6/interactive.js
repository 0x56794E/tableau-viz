//Data
var data = [{product:'Product A',freq:{Q1:576, Q2:1176, Q3:1009, Q4:494}},
{product:'Product B',freq:{Q1:959, Q2:1653, Q3:1999, Q4:697}},
{product:'Product C',freq:{Q1:3210, Q2:4220, Q3:1648, Q4:919}},
{product:'Product D',freq:{Q1:589, Q2:2043, Q3:1153, Q4:911}},
{product:'Product E',freq:{Q1:2599, Q2:1333, Q3:818, Q4:1713}},
{product:'Product F',freq:{Q1:431, Q2:324, Q3:715, Q4:421}},
{product:'Product G',freq:{Q1:1457, Q2:2557, Q3:2245, Q4:762}},
{product:'Product H',freq:{Q1:2573, Q2:3357, Q3:1598, Q4:1287}}];

//Add total val attr
data.forEach(function(d) 
{
    d.value = +d.freq.Q1 + d.freq.Q2 + d.freq.Q3 + d.freq.Q4;
});

var margin = {top: 50, right: 20, bottom: 70, left: 100},
width = 600 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var infoL = 10;
var infoT = 20;
var infoW = 400;
var infoH = 200;

var textFmt = d3.format("0,000");

var infoSVG = d3.select("#info")
				.attr("width", infoW)
				.attr("height", infoH)
				.append("g")
				.attr("transform", "translate(" + infoL + "," + infoT + ")");

var chartSVG = d3.select("#chart-area")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", 
			      "translate(" + margin.left + "," + margin.top + ")");


//Set up x and y scales
var x = d3.scale.linear().range([0, width])
		.domain([0, d3.max(data, function(d) { return d.value; })]);

var y = d3.scale.ordinal()
		.rangeRoundBands([0, height], .05)
		.domain(data.map(function(d) { return d.product; }));


var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

chartSVG.append("g")
  .attr("class", "y axis")
  .call(yAxis)
	.selectAll("text")
	  .style("text-anchor", "end")
	  .attr("dx", "-.8em")
	  .attr("dy", "-.55em");

var bar = chartSVG.selectAll(".bar")
			 .data(data)
			 .enter()
			 	.append("g")
			 	.attr("class", "bar")
			 	.attr("transform", function (d) {
			 		return "translate(0," + (y(d.product) - 10) + ")";
			 	});

bar.append("rect")
	.attr("width", function (d) {
		return x(d.value);
	})
	.attr("height", y.rangeBand() - 5)
	.on("mouseover", function (d) {
		d3.select(this).attr("class", "hover");
		var subW = infoW - 2*infoL;
		var subH = infoH - infoT;
		var subDt = [{qt: "Q1", value: d.freq.Q1},
					 {qt: "Q2", value: d.freq.Q2},
					 {qt: "Q3", value: d.freq.Q3},
					 {qt: "Q4", value: d.freq.Q4}];
		
		
		//Set up scales and axis
		var subX = d3.scale.linear().range([subW, 0])
					.domain([0, d3.max(subDt, function(d) { return d.value; })]);

		var subY = d3.scale.ordinal()
					.rangeRoundBands([0, subH], .02)
					.domain(subDt.map(function(d) { return d.qt; }));
		
		var subYAxis = d3.svg.axis()
							.scale(subY)
							.orient("left");
		
		infoSVG.append("g")
		  .attr("class", "y axis")
		  .call(subYAxis)
			.selectAll("text")
			  .style("text-anchor", "end")
			  .attr("dx", "-.8em")
			  .attr("dy", "-.55em");
		

		var subBar = infoSVG.selectAll(".bar")
					 .data(subDt)
					 .enter()
					 	.append("g")
					 	.attr("class", "bar")
					 	.attr("transform", function (d) {
					 		return "translate(0," + (subY(d.qt) - 10) + ")";
					 	});
		

		subBar.append("rect")
			.attr("width", function (d) {
				return subW - subX(d.value);
			})
			.attr("height", subY.rangeBand() - 5);
		subBar.append("text")
				.attr("x", "10")
				.attr("y", (subY.rangeBand() - 5) / 2)
				.attr("dy", ".35em")
				.text(function(d) { return "$" + textFmt(d.value); });


	})
	.on("mouseout", function (d) {
		d3.select(this)
			.classed("hover", false);
		
		d3.select("#info g").html("");
	});

bar.append("text")
	.attr("x", "10")
	.attr("y", (y.rangeBand() - 5)/ 2)
	.attr("dy", ".35em")
	.text(function(d) { return "$" + textFmt(d.value); });
