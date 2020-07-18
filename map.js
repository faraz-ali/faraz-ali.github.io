var worldMap = {
    display: function () {
        var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 100
        },
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;



    // The svg
    // var svg = d3.select("svg"),
    // width = +svg.attr("width"),
    // height = +svg.attr("height");

        // The svg
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
  // Map and projection
  var path = d3.geoPath();
  var projection = d3.geoMercator()
    
  // .scale(200)
    .center([0,30])
    .translate([width / 2, height / 2]);
  
  // Data and color scale
  var data = d3.map();
  var colorScale = d3.scaleLinear()
    .domain([-10000, 0, 500, 1000, 2000])
    .range(["green", "beige", "yellow", "orange", "red"])

 function total(s) {
    if (s == undefined) {
       s = "N/A";
    }
    return s;
 }

  var tooltip = d3.select("body")
  .append("div")
  .attr("id", "mytooltip")
  .style("position", "absolute")
 //  .style("z-index", "10")
  .style("visibility", "hidden")
  .html("a simple tooltip")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "5px");
  
  // Load external data and boot
  d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "https://raw.githubusercontent.com/faraz-ali/faraz-ali.github.io/master/excess_deaths.csv", function(d) { data.set(d.country, +d.excess); })
    .await(ready);
  function ready(error, topo) {
  
    let mouseOver = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", 0.8)
      d3.select(this)
        .transition()
        .duration(200)
        //.style("background", "grey")
        .style("stroke", "black")
      d3.select("#mytooltip")
        .style("opacity", 1)
        .style("visibility", "visible")//set style to it
       .html(d.properties.name + "<br>" + "excess deaths: " + total(data.get(d.properties.name)))
    .style("left", (d3.mouse(this)[0]+70) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
          
    }
  
    let mouseLeave = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")
        tooltip.style("visibility", "hidden")
    }

    // Draw the map
    svg.append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )
        
        // set the color of each country
        .attr("fill", function (d) {
             d.total = data.get(d.properties.name) || 0;
          return colorScale(d.total);
        })
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", 1)
        .on("mouseover", mouseOver )
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseleave", mouseLeave )
      }
  
    }
    
}