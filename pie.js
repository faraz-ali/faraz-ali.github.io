var pieChart = {
    display: function () {
        var margin = { top: 40, right: 50, bottom: 60, left: 50 },
            width = 960 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

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
                .html("country: " + d.data.country + "<br>" + "excess deaths: " + d.data.excess)
                .style("opacity", 1)
                .style("visibility", "visible")//set style to it
                .style("left", (d3.mouse(this)[0] + 70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mousemove = function (d) {
            tooltip
                .style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        }
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
                .style("stroke", "transparent")
                .style("visibility", "hidden")
        }


        d3.csv("https://raw.githubusercontent.com/faraz-ali/faraz-ali.github.io/master/excess_deaths.csv", function (data) {
            data.sort(function (a, b) {
                return a.excess - b.excess;
            });

            var data_clean = d3.map(function (d) {
                if (d.excess > 0) {
                    d.country = +d.excess;
                }
            })

            console.log(data_clean)

            // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
            var radius = Math.min(width, height) / 2 - margin.top

            var svg = d3.select("body").append("svg")
                // .attr("width", width)
                // .attr("height", height)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            // set the color scale
            var color = d3.scaleOrdinal()
                .domain(data.map(function (d) {
                    if (d.excess > 0) {
                        return d.country;
                    }
                }))
                .range(d3.schemeDark2);

            // Compute the position of each group on the pie:
            var pie = d3.pie()
                .sort(null) // Do not sort group by size
                .value(function (d) {
                    if (d.excess > 0) {
                        return d.excess;
                    }
                })
            var data_ready = pie(data)

            // The arc generator
            var arc = d3.arc()
                .innerRadius(radius * 1)         // This is the size of the donut hole
                .outerRadius(radius * 1.2)

            // Another arc that won't be drawn. Just for labels positioning
            var outerArc = d3.arc()
                .innerRadius(radius * 0.9)
                .outerRadius(radius * 0.9)

            // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
            svg
                .selectAll('allSlices')
                .data(data_ready)
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', function (d) { return (color(d.data.country)) })
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 0.7)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)

            // Add the polylines between chart and labels:
            svg
                .selectAll('allPolylines')
                .data(data_ready)
                .enter()
                .append('polyline')
                .attr("stroke", "black")
                .style("fill", "none")
                .attr("stroke-width", 1)
                .attr('points', function (d) {
                    if (d.data.excess > 5000) {
                        var posA = arc.centroid(d) // line insertion in the slice
                        var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                        var posC = outerArc.centroid(d); // Label position = almost the same as posB
                        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                        posC[0] = radius * 1.5 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                        return [posA, posB, posC]
                    }
                })

            // Add the polylines between chart and labels:
            svg
                .selectAll('allLabels')
                .data(data_ready)
                .enter()
                .append('text')
                .text(function (d) {
                    console.log(d.data.country);
                    if (d.data.excess > 5000)
                        return d.data.country;
                })
                .attr('transform', function (d) {
                    var pos = outerArc.centroid(d);
                    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                    pos[0] = radius * 1.5 * (midangle < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                })
                .style('text-anchor', function (d) {
                    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                    return (midangle < Math.PI ? 'start' : 'end')
                })
        })
    }
}