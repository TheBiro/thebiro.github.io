function plotPie() {

	var	width, height,
		outerRadius, innerRadius, radius;

	//////// SCALES ////////
	var color = d3.scaleOrdinal(d3.schemeCategory10);

	//////// CANVAS AND VARIABLES ////////
    var svg = d3.select("#chart_pie").append("svg");

    svg.append("g").attr("id", "gsvg");

	var arc = d3.arc();

	var outerArc = d3.arc();

	var labelArc = d3.arc();

	var arcOpacity = 0.8;

	var pie = d3.pie().padAngle(.01);

	var div = d3.select("#chart_pie").append("div").attr("class", "toolTip");

	var g = svg.select("#gsvg")
				.selectAll("arc").attr("id", "garc");

	var datum;

	//////// READ FILE ////////
	d3.csv("data/pie_chart.csv", function(d){
		d.var = +d.var;
		return d;
	}, function(error, data) {
		if (error) throw error;

		datum = data;

		pie.value(function(d) { return d.var; });

		// Compute angles
		function midAngle(d){
	        return d.startAngle + (d.endAngle - d.startAngle)/2;
	    }

	    g = g.select("#garc")
	    	.data(pie(datum)).enter().append("g")
				.attr("class", "arc");

		// Add forms
		g.append("path")
			.attr("d", arc)
			.style("fill", function(d) { return color(d.data.id); })
			.style("opacity", arcOpacity)
			.attr("class", function(d) { return "path_" + d.data.id } );

		// Add labels
		/*.append("text")
			.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
			.text(function(d) { return d.data.id;})	
			.style("fill", "#fff");*/

		updatePie();
		window.addEventListener("resize", updatePie);				

	});

	function updatePie() {

		var chartDim = document.getElementById("chart_pie");

		// Width, Height, Margin and Padding
		width = chartDim.clientWidth;
		height = chartDim.clientHeight;

		outerRadius = Math.min(width, height)/2 - 50,
		innerRadius = outerRadius/2,
		radius = Math.min(width, height) / 2;

		arc.outerRadius(outerRadius)
			.innerRadius(innerRadius);

		outerArc.outerRadius(outerRadius*1.1)
				.innerRadius(outerRadius*1.1);

		labelArc.outerRadius(outerRadius - 20)
				.innerRadius(outerRadius - 20);


		// Canvas dimensions
		svg.attr("width", width)
			.attr("height", height);

		svg.select("#gsvg")
			.attr("transform", "translate(" + width/2 + "," + height/2 + ")");

		// Arcs
		g.selectAll("path").attr("d", arc);


		/////////////////// SELECTIONS ///////////////////

		// Mouse interactions
		svg.selectAll("path")
			.on("mousemove", function(d) {
				// Arcs color and radius
				d3.selectAll(".path_" + d.data.id)
					.transition().attr("d", arc.outerRadius(outerRadius*1.05))
					.transition().style("opacity", 1);

				// Tooltip
				div.style("left", (width-66)/2+"px");
	            div.style("top", (height-38)/2+"px");
	            div.style("display", "inline-block");
	            div.html((d.data.id)+"<br>"+(d.data.var));
			})
			.on("mouseout", function(d) {
				// Arcs color and radius
				d3.selectAll(".path_" + d.data.id)
					.style("opacity", arcOpacity)
					.transition().attr("d", arc.outerRadius(outerRadius));
					//.transition().style("fill", function(d) { return color(d.data.id); })

				// Tooltip
				div.style("display", "none");
			});
			
		
	};

}
plotPie();