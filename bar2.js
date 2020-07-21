var barChart = {
    display: function () {
        var margin = { top: 40, right: 50, bottom: 60, left: 50 },
            width = 960 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var tooltip = d3.select("body")
            .append("div")
            // .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .html("a simple tooltip")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "5px");


        var mouseover = function (d) {
            tooltip
                .html("country: " + d.country + "<br>" + "Excess Deaths: " + d.excess)
                .style("opacity", 1)
                .style("visibility", "visible")//set style to it
                .style("left", (d3.mouse(this)[0] + 70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mousemove = function (d) {
            tooltip
                .style("top", (d3.event.pageY-10)+"px")
                .style("left",(d3.event.pageX+10)+"px");
        }
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
                .style("stroke", "transparent")
                .style("visibility", "hidden")
        }

        var x = d3.scaleLinear()
            // .range([100, width - margin])
            .rangeRound([margin.left+20, width - margin.right])

        var colour = d3.scaleSequential(d3.interpolateRdBu);

        var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        function parse(d) {
            d.rank = +d.rank;
            d.annual_growth = +d.annual_growth;
            return d;
        }
        // Config
        var cfg = {
            labelMargin: 5,
            xAxisMargin: 10,
            legendRightMargin: 0
        }

        // Parse the Data
        d3.csv("https://raw.githubusercontent.com/faraz-ali/faraz-ali.github.io/master/excess_deaths.csv", function (data) {

            data.sort(function (a, b) {
                return a.excess - b.excess;
            });
            y.domain(data.map(function (d) { return d.country; }))
            x.domain([-1500, 70000]);
            var max = d3.max(data, function (d) { return d.excess; });

            // Y axis
            var yAxis = //d3.scaleBand()
                // .padding(0.5);
                svg.append("g")
                    .attr("class", "y-axis")
                    .attr("transform", "translate(" + x(0) + ",0)")
                    .append("line")
                    .attr("y1", 0)
                    .attr("y2", height)

            // Add X axis
            var xAxis =
                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(0," + (height + cfg.xAxisMargin) + ")")
                    .call(d3.axisBottom(x)
                        .tickSizeOuter(0))

            // Bars
            var bars = svg.append("g")
                .attr("class", "bars")

            bars.selectAll("rect")
                .data(data)
                .enter().append("rect")
                .attr("class", "excess-deaths")
                .attr("x", function (d) {
                    return x(Math.min(0, d.excess));
                })
                .attr("y", function (d) { return y(d.country); })
                .attr("height", y.bandwidth())
                .attr("width", function (d) {
                    return Math.abs(x(d.excess) - x(0))
                })
                .style("fill", function (d) {
                    return colour(-d.excess)
                })
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                ;

            var lables = svg.append("g")
                .attr("class", "labels");

            lables.selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .attr("class", "bar-label")
                .attr("x", x(0))
                .attr("y", function (d) { return y(d.country) })
                .attr("dx", function (d) {
                    return d.excess < 0 ? cfg.labelMargin : -cfg.labelMargin;
                })
                .attr("dy", y.bandwidth())
                .attr("text-anchor", function (d) {
                    return d.excess < 0 ? "start" : "end";
                })
                .text(function (d) { return d.country })
                .style("fill", "black")
                .style("font-size", "11px")

        })

    }
}