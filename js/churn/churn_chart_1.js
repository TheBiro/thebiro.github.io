function plotChurn() {

    var margin = {},
    	padding = {},
    	outerWidth, outerHeight,
        innerWidth, innerHeight,
        width, height;

	//////// SCALES ////////
	var x0Scale = d3.scaleBand()
	    .rangeRound([0, width])
	    .paddingInner(0.1);

	var x1Scale = d3.scaleBand()
	    .padding(0.05);

	var yScale = d3.scaleLinear()
	    .rangeRound([height, 0]);    

	var colorScale = d3.scaleOrdinal()
	    .range(["#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	//////// CANVAS AND VARIABLES ////////
	var svg = d3.select("#chart_churn_1").append("svg");

	var g = svg.append("g");

	var datum;
	var keys;
	var dif;


	//////// READ FILE ////////
	d3.csv("data/churn_chart_1.csv", function(d, i, columns) {
		for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];		// need to understand
		return d;
	}, function(error, data) {
		if (error) throw error;

		keys = data.columns.slice(1);

		datum = data;

		// FAZER CONDICAO PARA FILTRAR OS DADOS DE ACORDO COM O MOUSE NO PIE CHART

		// Set domains based on data
		x0Scale.domain(datum.map(function(d) { return d.lead; }));
		x1Scale.domain(keys).rangeRound([0, x0Scale.bandwidth()]);
		yScale.domain([0, d3.max(datum, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();	// WOOT?

		/////////////////// ENTER ///////////////////

		// BARS	
		g.append("g")
			.selectAll("g")
			.data(datum)
			.enter().append("g")
				.attr("id", "churnChrt")
			// rects
			.selectAll("rect")
			.data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
			.enter().append("rect")
				.attr("class", function(d) { return d.key; })
				.attr("id", "churnBar")
				.attr("fill", function(d) { return colorScale(d.key); });

		// AXES
		g.append("g")
			.attr("class", "x axis");

		g.append("g")
			.attr("class", "y axis")
		.append("text")
			.attr("x", 2)
			.attr("dy", "0.32em")
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "start")
			.text("Qtde");

		// LEGEND
		var legend = g.append("g")
				.attr("font-family", "sans-serif")
				.attr("font-size", 10)
				.attr("text-anchor", "end")
				.attr("transform", "translate(5,-20)")
			.selectAll("g")
				.data(keys)
				.enter().append("g")			
					.attr("class", "lgd")
					.attr("transform", function(d, i) { return "translate(0," + i * 13 + ")"; });

		legend.append("rect")
			.attr("class", function(d, i) { return "lgd_" + datum.columns.slice(1)[i]; })
			.attr("width", 12)
			.attr("height", 12)
			.attr("fill", colorScale);

		legend.append("text")
			.attr("y", 7)
			.attr("dy", "0.32em")
			.text(function(d) { return d; });

		updateChurn();
		window.addEventListener("resize", updateChurn);

		/////////////////// SELECTIONS ///////////////////

		// BARS SELECTION	
		svg.selectAll("rect")
			.on("mousemove", function(d) {
				d3.selectAll("." + d.key).style("fill", "#0da4d3")
				d3.selectAll(".lgd_" + d.key).style("fill", "#0da4d3")
			})
			.on("mouseout", function(d) {
				d3.selectAll("." + d.key).style("fill", function(d) { return colorScale(d.key); });
				d3.selectAll(".lgd_" + d.key).style("fill", function(d, i) { return colorScale[i]; });
			});

		// LEGEND SELECTION
		svg.selectAll("g.lgd")
			.on("mousemove", function(d) {			
				d3.selectAll("." + d).style("fill", "#0da4d3")
				d3.selectAll(".lgd_" + d).style("fill", "#0da4d3")
			})
			.on("mouseout", function(d) {			
				d3.selectAll("." + d).style("fill", function(d, i) { return colorScale[i]; })
				d3.selectAll(".lgd_" + d).style("fill", function(d, i) { return colorScale[i]; });
			});

	});

	function updateChurn() {

		var chartDim = document.getElementById("chart_churn_1");

		
		var margin = {top: 20, right: 0, bottom: 0, left: 40},
			padding = {top: 20, right: 10, bottom: 10, left: 0},
			outerWidth = chartDim.clientWidth,
		    outerHeight = chartDim.clientHeight,
		    innerWidth = outerWidth - margin.left - margin.right,
		    innerHeight = outerHeight - margin.top - margin.bottom,
		    width = innerWidth - padding.left - padding.right,
		    height = innerHeight - padding.top - padding.bottom;

		// Canvas dimensions
		svg.attr("width", outerWidth)
			.attr("height", outerHeight);	

		g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Update scales range
		x0Scale.rangeRound([0, width]);
		yScale.rangeRound([height, 0]);
		x1Scale.domain(keys).rangeRound([0, x0Scale.bandwidth()]);



		// Update Bars
		//
		g.selectAll("#churnChrt")
			.attr("transform", function(d) { return "translate(" + x0Scale(d.lead) + ",0)"; });

		g.selectAll("#churnBar")
				.attr("x", function(d) { return x1Scale(d.key); })
				.attr("y", function(d) { return yScale(d.value); })
				.attr("width", x1Scale.bandwidth())
				.attr("height", function(d) { return height - yScale(d.value); });


		// Update Axes
		// xaxis
		g.selectAll("g.x.axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x0Scale));

		// yaxis
		g.selectAll("g.y.axis")
			.call(d3.axisLeft(yScale).ticks(null, "s"))
		// text	
		.selectAll("g.y.axis.text")
			.attr("y", yScale(yScale.ticks().pop()) + 0.5);

		// Update Legend
		g.selectAll("g.lgd rect")
			.attr("x", width - 10)

		g.selectAll("g.lgd text")
			.attr("x", width - 15)
		
	};

}
plotChurn();