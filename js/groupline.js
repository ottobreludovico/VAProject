var maxxx;


// append the svg object to the body of the page
var svgL = d3.select("#my_dataviz3")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
  .append("g")
    .attr("transform","translate(" + marginL.left + "," + marginL.top + ")");

//Read the data
manager.addListener('dataReady', function (e) {
    var dataL = groupline_getData();

  // Now I can use this dataset:
    var fqcsL = computefrequencyL(dataL);
    
    // Add xL axis --> it is a date format
    var xL = d3.scalePoint()
      .domain(fqcsL.map(function(d) { return +d[0]; }))
      .range([ 0, widthL ]);

    xAxx = svgL.append("g")
      .attr("transform", "translate(0," + heightL + ")")
      .call(d3.axisBottom(xL));

    xAxx.selectAll("text")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start")
    .attr("dx", ".71em");

    // maxxx value observed:
    maxxx = d3.max(fqcsL.map(function(d) { return +d[1]; }))

    // Add yL axis
    var yL = d3.scaleLinear()
      .domain([0, maxxx])
      .range([ heightL, 0 ]);
    svgL.append("g")
      .call(d3.axisLeft(yL));

    // Set the gradient
    svgL.append("linearGradient")
      .attr("id", "line-gradient3")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", -50)
      .attr("y1", yL(0))
      .attr("x2", 0)
      .attr("y2", yL(maxxx))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "#ff0000"},
          {offset: "100%", color: "#ff0000"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    // Add the line
    svgL.append("path")
      .datum(fqcsL)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradient3)" )
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return xL(d[0]) })
        .y(function(d) { return yL(d[1]) })
        )

});


function computefrequencyL(data){
    var frequencyL = {"1970": 0 , "1971":0,"1972": 0 , "1973":0,"1974": 0 , "1975":0,
    "1976": 0 , "1977":0,"1978": 0 , "1979":0,"1980": 0 , "1981":0,"1982": 0 , "1983":0,
    "1984": 0 , "1985":0,"1986": 0 , "1987":0,"1988": 0 , "1989":0,
    "1990": 0 , "1991":0,"1992": 0 , "1993":0,"1994": 0 , "1995":0, "1996": 0 , "1997":0,
    "1998": 0 , "1999":0,"2000": 0 , "2001":0,"2002": 0 , "2003":0,"2004": 0 , "2005":0,
    "2006": 0 , "2007":0,"2008": 0 , "2009":0,"2010": 0 , "2011":0,"2012": 0 , "2013":0,
    "2014": 0 , "2015":0,"2016": 0 , "2017":0,};
    for (i = 0; i < data.length; i++) {
        year = data[i].iyear;
        frequencyL[year] += 1;
    }

    var items = Object.keys(frequencyL).map(function (year) {
        return [year, frequencyL[year]];
    });

    return items;
}

function groupline_getData(){
    return manager.getDataFilteredByGG();
}

/*
manager.addListener('placeChanged', function (e) {
  svgL.selectAll("*").remove();
  updateProva();
});*/

manager.addListener('yearChanged', function (e) {
  svgL.selectAll("*").remove();
  updateLine();
});

manager.addListener('groupChanged', function (e) {
    svgL.selectAll("*").remove();
    updateLine();
});

function updateLine(){
    var dataL = groupline_getData();
    // Now I can use this dataset:
      var fqcsL = computefrequencyL(dataL);
      // Add xL axis --> it is a date format
      var xL = d3.scalePoint()
        .domain(fqcsL.map(function(d) { return +d[0]; }))
        .range([ 0, widthL ]);
  
      xAxx = svgL.append("g")
        .attr("transform", "translate(0," + heightL + ")")
        .call(d3.axisBottom(xL));
  
      xAxx.selectAll("text")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start")
      .attr("dx", ".71em");
  
      // maxxx value observed:
      maxxx = d3.max(fqcsL.map(function(d) { return +d[1]; }))
  
      // Add yL axis
      var yL = d3.scaleLinear()
        .domain([0, maxxx])
        .range([ heightL, 0 ]);
      svgL.append("g")
        .call(d3.axisLeft(yL));
  
      // Set the gradient
      svgL.append("linearGradient")
        .attr("id", "line-gradient3")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", -50)
        .attr("y1", yL(0))
        .attr("x2", 0)
        .attr("y2", yL(maxxx))
        .selectAll("stop")
          .data([
            {offset: "0%", color: "#ff0000"},
            {offset: "100%", color: "#ff0000"}
          ])
        .enter().append("stop")
          .attr("offset", function(d) { return d.offset; })
          .attr("stop-color", function(d) { return d.color; });
  
      // Add the line
      svgL.append("path")
        .datum(fqcsL)
        .attr("fill", "none")
        .attr("stroke", "url(#line-gradient3)" )
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x(function(d) { return xL(d[0]) })
          .y(function(d) { return yL(d[1]) })
          )

}

$(window).resize(function() {
  // Resize SVG
  svgL
    .attr("width", $("#my_dataviz3").width())
    .attr("height", $("#my_dataviz3").height())
  ;
});