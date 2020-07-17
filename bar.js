var barChart = {
    display: function () {
      var margin = {top: 10, right: 30, bottom: 90, left: 40},
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
  .style("opacity", 0)
    .attr("class", "tooltip")
    // .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  
  var mouseover = function(d) {
    tooltip
        .html("country: " + d.country + "<br>" + "excess deaths: " + d.excess)
        .style("opacity", 1)
        .style("left", xScale(d.desc) + (xScale.bandwidth() / 2 - (barWidth - barPadding) / 2) - 1 + 'px')
        .style('top', (height + margin.top + 8) + 'px');
  }
  var mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+10) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }

    // Parse the Data
d3.csv("https://raw.githubusercontent.com/faraz-ali/faraz-ali.github.io/master/excess_deaths.csv", function(data) {

  data.sort(function(a, b) {
    return b.excess - a.excess;
  });
  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.country; }))
    .padding(0.5);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
  
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 60000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  
  // Bars
  svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { 
        console.log(d.country, d.excess, d.actual)
        return x(d.country); 
      })
      .attr("width", x.bandwidth())
      .attr("fill", "#69b3a2")
      // no bar at the beginning thus:
      .attr("height", function(d) { return height - y(0); }) // always equal to 0
      .attr("y", function(d) { return y(0); })
      
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  
  // Animation
  svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { 
      if (d.excess <0) {
        return y(0);
      }
      return y(d.excess); 
    })
    // console.log(d.excess)
    .attr("height", function(d) { 
      if (d.excess <0) {
        return height - y(0);
      }
      return height - y(d.excess); 
    })
    .delay(function(d,i){console.log(i) ; return(i*100)})        
    
  })

    }
}