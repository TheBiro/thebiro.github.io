function plotOv2() {

    var margin = {},
    	padding = {},
    	outerWidth, outerHeight,
        innerWidth, innerHeight,
        width, height;
     
    //////// SCALES ////////
    var x0Scale = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.2);

    var x1Scale = d3.scaleBand()
        .padding(0.15);

    var yScale = d3.scaleLinear()
        .rangeRound([this.height, 0]);

    var colorScale = d3.scaleOrdinal()
        .range(["#7b6888", "#7b6888", "#6b486b", "#6b486b", "#a05d56", "#a05d56", "#d0743c", "#d0743c"]);


    //////// CANVAS AND VARIABLES ////////
    var svg = d3.select("#ov_chart_2").append("svg");

    var g = svg.append("g");

    var div = d3.select("#ov_chart_2").append("div").attr("class", "toolTip");

    var yBegin;

    var innerColumns = {
        "column1" : ["plano_a_15","plano_b_15","plano_c_15","plano_d_15"],
        "column2" : ["plano_a_16","plano_b_16","plano_c_16","plano_d_16"]
    };


    //////// READ FILE ////////
    d3.csv("data/overview/overview_2.csv", function(error, data) {
        if (error) throw error;

        var columnHeaders = d3.keys(data[0]).filter(function(key) { return key !== "mes"; });

        data.forEach(function(d) {
            var yColumn = new Array();
            d.columnDetails = columnHeaders.map(function(name) {
                for (ic in innerColumns) {
                    if($.inArray(name, innerColumns[ic]) >= 0){
                        if (!yColumn[ic]){
                            yColumn[ic] = 0;
                        }
                        yBegin = yColumn[ic];
                        yColumn[ic] += +d[name];
                        return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin,};
                    }
                }
            });
            d.total = d3.max(d.columnDetails, function(d) { return d.yEnd; });
        });

        x0Scale.domain(data.map(function(d) { return d.mes; }));
        x1Scale.domain(d3.keys(innerColumns)).rangeRound([0, x0Scale.bandwidth()]);
        yScale.domain( [0, d3.max(data, function(d) { return d.total; })] );
        colorScale.domain(d3.keys(data[0]).filter(function(key) { return key !== "mes"; }));

        /////////////////// ENTER ///////////////////
        console.log(data[0].columnDetails[0])

        // BARS
        g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            	.attr("id", "gChrt")
            // rects
            .selectAll("rect")
            .data(function(d) { return d.columnDetails; })
            .enter().append("rect")
                .attr("class", "gBar")
            	.attr("id", function(d) { return d.name.slice(0,-3); })
                .style("fill", function(d) { return colorScale(d.name); });

        // AXES
        //
        // X Axis
        g.append("g")
            .attr("class", "x axis");

        update();
    	window.addEventListener("resize", update);

    });

    function update() {

    	var chartDim = document.getElementById("ov_chart_2");

        margin = {top: 40, right: 10, bottom: 40, left: 10},
        padding = {top: 0, right: 0, bottom: 0, left: 0},
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
    	x1Scale.domain(d3.keys(innerColumns)).rangeRound([0, x0Scale.bandwidth()]);

    	// Update Bars
    	g.selectAll("#gChrt")
    		.attr("transform", function(d) { return "translate(" + x0Scale(d.mes) + ",0)"; })

    	g.selectAll(".gBar")
    			.attr("x", function(d) { return x1Scale(d.column); })
                .attr("y", function(d) { return yScale(d.yEnd); })            
                .attr("width", x1Scale.bandwidth())
                .attr("height", function(d) { return yScale(d.yBegin) - yScale(d.yEnd); });

        // Update Axes
    	// xaxis
    	g.selectAll("g.x.axis")
    		.attr("transform", "translate(0," + height + ")")
    		.call(d3.axisBottom(x0Scale));




        svg.selectAll("rect")
            .on("mouseover", function(d) {
                // Tooltip
                div.style("left", (width)/2+"px");
                div.style("top", (height-10)/2+"px");
                div.style("display", "inline-block");
                div.text(d.yEnd - d.yBegin);
            })
            .on("mouseout", function(d) {
                div.style("display", "none");
            })


    };

}
plotOv2();