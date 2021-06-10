var cambio2=false;
var maxK;


// append the svg object to the body of the page
var svgK = d3.select("#my_dataviz4")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
  .append("g")
    .attr("transform","translate(" + marginK.left + "," + marginK.top + ")");

//Read the data
manager.addListener('dataReady', function (e) {
    var data = k_getData();

  // Now I can use this dataset:
    var fqcsK2 = computeFrequencyK2(data);
    
    // Add X axis --> it is a date format
    var x = d3.scalePoint()
      .domain(fqcsK2.map(function(d) { return +d[0]; }))
      .range([ 0, widthP ]);

    xAxK = svgK.append("g")
      .attr("transform", "translate(0," + heightP + ")")
      .call(d3.axisBottom(x));

    xAxK.selectAll("text")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start")
    .attr("dx", ".71em");

    // maxK value observed:
    maxK = d3.max(fqcsK2.map(function(d) { return +d[1]; }))

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, maxK])
      .range([ heightP, 0 ]);
    svgK.append("g")
      .call(d3.axisLeft(y));

    // Set the gradient
    svgK.append("linearGradient")
      .attr("id", "line-gradientK")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", -50)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", y(maxK))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "#743dcc"},
          {offset: "100%", color: "#743dcc"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    // Add the line
    svgK.append("path")
      .datum(fqcsK2)
      .attr("class", "prK1")
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradientK)" )
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return x(d[0]) })
        .y(function(d) { return y(d[1]) })
        )

});

function divideData(data){
  d={}
  for (i = 0; i < data.length; i++) {
    place = data[i].place;
    if(d[place]==undefined){
      d[place]=[data[i]]
    }else{
      d[place].push(data[i])
    }
  }
  
  var datas = Object.keys(d).map(function (place) {
    return [place, d[place]];
  });

  return datas;
}


function computeFrequencyK2(data){
    var frequency = {"1970": 0 , "1971":0,"1972": 0 , "1973":0,"1974": 0 , "1975":0,
    "1976": 0 , "1977":0,"1978": 0 , "1979":0,"1980": 0 , "1981":0,"1982": 0 , "1983":0,
    "1984": 0 , "1985":0,"1986": 0 , "1987":0,"1988": 0 , "1989":0,
    "1990": 0 , "1991":0,"1992": 0 , "1993":0,"1994": 0 , "1995":0, "1996": 0 , "1997":0,
    "1998": 0 , "1999":0,"2000": 0 , "2001":0,"2002": 0 , "2003":0,"2004": 0 , "2005":0,
    "2006": 0 , "2007":0,"2008": 0 , "2009":0,"2010": 0 , "2011":0,"2012": 0 , "2013":0,
    "2014": 0 , "2015":0,"2016": 0 , "2017":0,};
    for (i = 0; i < data.length; i++) {
        year = data[i].iyear;
        frequency[year] += parseInt(data[i].nkill);
    }

    var items = Object.keys(frequency).map(function (year) {
        return [year, frequency[year]];
    });

    return items;
}

function k_getData(){
    return manager.getDataOriginal();
}

function k_getDataP(){
    return manager.getDataByPlace();
}

manager.addListener('placeChanged', function (e) {
  svgK.selectAll("*").remove();
  updateK();
});

manager.addListener('yearChanged', function (e) {
  svgK.selectAll("*").remove();
  updateK();
});

function updateK(){
  var m=false;
  if(manager.place!=undefined && (CON1==true || CON2==true)){
    data = k_getData();
    m=true;
  }
  else if(manager.place!=undefined && (REG2==true || REG1==true) && !(CON1 || CON2)){
    data = k_getData();
    m=true;
  }
  else if(manager.place==undefined){
    data = k_getData();

  }else{
    data = k_getDataP();
    m=true;
  }
  var ll=divideData2(data);
  console.log(ll);
  if(ll.length==2){
    data=[];
    data=ll[0][1];
    data2=ll[1][1]

    if((data[0].place==manager.place && NAT1) || (diz[data[0].place][0]==manager.reg1 && REG1) || (diz[data[0].place][1]==manager.con1 && CON1)){
      var fqcsK2 = computeFrequencyK2(data);
      var fqcsK3 = computeFrequencyK2(data2);
    }else{
      var fqcsK3 = computeFrequencyK2(data);
      var fqcsK2 = computeFrequencyK2(data2);
    }
    
    

   var x = d3.scalePoint()
      .domain(fqcsK2.map(function(d) { return +d[0]; }))
      .range([ 0, widthP ]);

    var x2 = d3.scalePoint()
    .domain(fqcsK3.map(function(d) { return +d[0]; }))
    .range([ 0, widthP ]);
      
    xAxK = svgK.append("g")
      .attr("transform", "translate(0," + heightP + ")")
      .call(d3.axisBottom(x));

    xAxK.selectAll("text")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start")
    .attr("dx", ".71em");

    // maxK value observed:
    maxK = d3.max(fqcsK2.map(function(d) { return +d[1]; }))
    maxK2 = d3.max(fqcsK3.map(function(d) { return +d[1]; }))

    if(maxK2>maxK){
      maxK=maxK2;
    }

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, maxK])
      .range([ heightP, 0 ]);
    svgK.append("g")
      .call(d3.axisLeft(y));
    
    // Set the gradient
    
    svgK.append("linearGradient")
    .attr("id", "line-gradientK")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", y(0))
    .attr("x2", 0)
    .attr("y2", y(maxK))
    .selectAll("stop")
      .data([
        {offset: "0%", color: "#ffff00"},
        {offset: "100%", color: "#ffff00"}
      ])
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return d.color; });

      svgK.append("linearGradient")
      .attr("id", "line-gradientK2")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", y(maxK))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "#00c29e"},
          {offset: "100%", color: "#00c29e"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });
    
    
    // Add the line
    svgK.append("path")
      .attr("class", "prK")
      .datum(fqcsK2)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradientK)" )
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return x(d[0]) })
        .y(function(d) { return y(d[1]) })
        )

        svgK.append("path")
      .attr("class", "prK2")
      .datum(fqcsK3)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradientK2)" )
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return x2(d[0]) })
        .y(function(d) { return y(d[1]) })
        )



  }else{
    if(manager.place!=undefined){
      data=ll[0][1];
    }else if(manager.place==undefined){
      m=false;
    }
    console.log(m);
    var fqcsK2 = computeFrequencyK2(data);

   var x = d3.scalePoint()
      .domain(fqcsK2.map(function(d) { return +d[0]; }))
      .range([ 0, widthP ]);
      
    xAxK = svgK.append("g")
      .attr("transform", "translate(0," + heightP + ")")
      .call(d3.axisBottom(x));

    xAxK.selectAll("text")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start")
    .attr("dx", ".71em");

    // maxK value observed:
    maxK = d3.max(fqcsK2.map(function(d) { return +d[1]; }))

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, maxK])
      .range([ heightP, 0 ]);
    svgK.append("g")
      .call(d3.axisLeft(y));

    // Set the gradient
    if(m==true){

      svgK.append("linearGradient")
      .attr("id", "line-gradientK")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", y(maxK))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "#ffff00"},
          {offset: "100%", color: "#ffff00"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });
    }if(m==false){
      svgK.append("linearGradient")
      .attr("id", "line-gradientK")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", y(maxK))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "#743dcc"},
          {offset: "100%", color: "#743dcc"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });
    }
    
    // Add the line
    svgK.append("path")
      .attr("class", "prK")
      .datum(fqcsK2)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradientK)" )
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return x(d[0]) })
        .y(function(d) { return y(d[1]) })
        )
  }

}

$(window).resize(function() {
  // Resize SVG
  svgK
    .attr("width", $("#my_dataviz4").width())
    .attr("height", $("#my_dataviz4").height())
  ;
});