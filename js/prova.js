var cambio2=false;
var max;
var data;

// append the svg object to the body of the page
var svgP = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
  .append("g")
    .attr("transform","translate(" + marginP.left + "," + marginP.top + ")");

//Read the data
manager.addListener('dataReady', function (e) {
    var data = prova_getData();

  // Now I can use this dataset:
    var fqcs2 = computeFrequency2(data);
    
    // Add X axis --> it is a date format
    var x = d3.scalePoint()
      .domain(fqcs2.map(function(d) { return +d[0]; }))
      .range([ 0, widthP ]);

    xAx = svgP.append("g")
      .attr("transform", "translate(0," + heightP + ")")
      .call(d3.axisBottom(x));

    xAx.selectAll("text")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start")
    .attr("dx", ".71em");

    // Max value observed:
    max = d3.max(fqcs2.map(function(d) { return +d[1]; }))

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, max])
      .range([ heightP, 0 ]);
    svgP.append("g")
      .call(d3.axisLeft(y));

    // Set the gradient
    svgP.append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", -50)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", y(max))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "#574cc2"},
          {offset: "100%", color: "#574cc2"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    // Add the line
    svgP.append("path")
      .datum(fqcs2)
      .attr("class", "pr1")
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradient)" )
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return x(d[0]) })
        .y(function(d) { return y(d[1]) })
        )

});

function divideData2(data){
  console.log("divide");
  if(NAT1==true && NAT2==true){
    console.log("nn");
    d={}
    for (i = 0; i < data.length; i++) {
      place = data[i].place;
      if(d[place]==undefined){
        d[place]=[data[i]]
      }else{
        d[place].push(data[i])
      }
    }
    
    var datas = Object.keys(d).map(function (key) {
      return [key, d[key]];
    });
  
    return datas;
  }else if(NAT1==true && REG2==true){
    console.log("nr");
    d={}
    for (i = 0; i < data.length; i++) {
      if(data[i].place==manager.place){
        place = data[i].place;
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }if(diz[data[i].place][0]==manager.reg2){
        place = diz[data[i].place][0];
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }
        
    }
    
    var datas = Object.keys(d).map(function (key) {
      return [key, d[key]];
    });
  
    return datas;
  }else if(NAT1==true && CON2==true){
    console.log("nc");
    d={}
    for (i = 0; i < data.length; i++) {
      if(data[i].place==manager.place){
        place = data[i].place;
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }if(diz[data[i].place][1]==manager.con2){
        place = diz[data[i].place][1];
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }
        
    }
    
    var datas = Object.keys(d).map(function (key) {
      return [key, d[key]];
    });
  
    return datas;
  }else if(REG1==true && NAT2==true){
    console.log("rn");
    d={}
    for (i = 0; i < data.length; i++) {
      if(diz[data[i].place][0]==manager.reg1){
        place = diz[data[i].place][0];
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }if(data[i].place==manager.secondPlace){
        place = data[i].place;
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }
        
    }
    
    var datas = Object.keys(d).map(function (key) {
      return [key, d[key]];
    });
    console.log(datas);
  
    return datas;
  }else if(REG1==true && REG2==true){
    console.log("rr");
    d={}
    for (i = 0; i < data.length; i++) {
      if(diz[data[i].place][0]==manager.reg1){
        place = diz[data[i].place][0];
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }if(diz[data[i].place][0]==manager.reg2){
        place = diz[data[i].place][0];
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }       
    }
    var datas = Object.keys(d).map(function (key) {
      return [key, d[key]];
    });
  
    return datas;
  }else if(REG1==true && CON2==true){
    console.log("rc");
    d={}
    for (i = 0; i < data.length; i++) {
      if(diz[data[i].place][0]==manager.reg1){
        place = diz[data[i].place][0];
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }if(diz[data[i].place][1]==manager.con2){
        place = diz[data[i].place][1];
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }     
    }
    
    var datas = Object.keys(d).map(function (key) {
      return [key, d[key]];
    });
  
    return datas;
  }else if(CON1==true && NAT2==true){
    console.log("cn");
    d={}
    for (i = 0; i < data.length; i++) {
      if(diz[data[i].place][1]==manager.con1){
        place = diz[data[i].place][1];
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }if(data[i].place==manager.secondPlace){
        place = data[i].place;
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }
       
    }
    var datas = Object.keys(d).map(function (key) {
      return [key, d[key]];
    });
  
    return datas;
  }else if(CON1==true && REG2==true){
    console.log("cr");
    d={}
    for (i = 0; i < data.length; i++) {
      if(diz[data[i].place][1]==manager.con1){
        place = diz[data[i].place][1];
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }if(diz[data[i].place][0]==manager.reg2){
        place = diz[data[i].place][0];
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }
        
    }
    
    var datas = Object.keys(d).map(function (key) {
      return [key, d[key]];
    });
  
    return datas;
  }else if(CON1==true && CON2==true){
    console.log("cc");
    d={}
    for (i = 0; i < data.length; i++) {
      if(diz[data[i].place][1]==manager.con1){
        place = diz[data[i].place][1];
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }if(diz[data[i].place][1]==manager.con2){
        place = diz[data[i].place][1];
        if(d[place]==undefined){
          d[place]=[data[i]]
        }else{
          d[place].push(data[i])
        }
      }      
    }
    
    var datas = Object.keys(d).map(function (key) {
      return [key, d[key]];
    });
  
    return datas;
  }
  
}


function computeFrequency2(data){
    var frequency = {"1970": 0 , "1971":0,"1972": 0 , "1973":0,"1974": 0 , "1975":0,
    "1976": 0 , "1977":0,"1978": 0 , "1979":0,"1980": 0 , "1981":0,"1982": 0 , "1983":0,
    "1984": 0 , "1985":0,"1986": 0 , "1987":0,"1988": 0 , "1989":0,
    "1990": 0 , "1991":0,"1992": 0 , "1993":0,"1994": 0 , "1995":0, "1996": 0 , "1997":0,
    "1998": 0 , "1999":0,"2000": 0 , "2001":0,"2002": 0 , "2003":0,"2004": 0 , "2005":0,
    "2006": 0 , "2007":0,"2008": 0 , "2009":0,"2010": 0 , "2011":0,"2012": 0 , "2013":0,
    "2014": 0 , "2015":0,"2016": 0 , "2017":0,};
    for (i = 0; i < data.length; i++) {
        year = data[i].iyear;
        frequency[year] += 1;
    }

    var items = Object.keys(frequency).map(function (year) {
        return [year, frequency[year]];
    });

    return items;
}

function prova_getData(){
    return manager.getDataOriginal();
}

function prova_getDataP(){
    return manager.getDataByPlace();
}

function prova_getDataR(){
  return manager.getDataByRegion();
}

function prova_getDataC(){
  return manager.getDataByContinent();
}

manager.addListener('placeChanged', function (e) {
  svgP.selectAll("*").remove();
  updateProva();
});

manager.addListener('yearChanged', function (e) {
  svgP.selectAll("*").remove();
  updateProva();
});

function updateProva(){
  var m=false;
  if(manager.place!=undefined && (CON1==true || CON2==true)){
    data = prova_getData();
    m=true;
    console.log("1");
  }
  else if(manager.place!=undefined && (REG2==true || REG1==true) && !(CON1 || CON2)){
    data = prova_getData();
    m=true;
    console.log("2");
  }
  else if(manager.place==undefined){
    data = prova_getData();
    console.log("3");
  }else{
    data = prova_getDataP();
    console.log("4");
    m=true;
  }
  var ll=divideData2(data);
  console.log(ll);
  if(ll.length==2){
    data=[];
    data=ll[0][1];
    data2=ll[1][1]

    if((data[0].place==manager.place && NAT1) || (diz[data[0].place][0]==manager.reg1 && REG1) || (diz[data[0].place][1]==manager.con1 && CON1)){
      var fqcs2 = computeFrequency2(data);
      var fqcs3 = computeFrequency2(data2);
    }else{
      var fqcs3 = computeFrequency2(data);
      var fqcs2 = computeFrequency2(data2);
    }
    
    

   var x = d3.scalePoint()
      .domain(fqcs2.map(function(d) { return +d[0]; }))
      .range([ 0, widthP ]);

    var x2 = d3.scalePoint()
    .domain(fqcs3.map(function(d) { return +d[0]; }))
    .range([ 0, widthP ]);
      
    xAx = svgP.append("g")
      .attr("transform", "translate(0," + heightP + ")")
      .call(d3.axisBottom(x));

    xAx.selectAll("text")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start")
    .attr("dx", ".71em");

    // Max value observed:
    max = d3.max(fqcs2.map(function(d) { return +d[1]; }))
    max2 = d3.max(fqcs3.map(function(d) { return +d[1]; }))

    if(max2>max){
      max=max2;
    }

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, max])
      .range([ heightP, 0 ]);
    svgP.append("g")
      .call(d3.axisLeft(y));
    
    // Set the gradient
    
    svgP.append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", y(0))
    .attr("x2", 0)
    .attr("y2", y(max))
    .selectAll("stop")
      .data([
        {offset: "0%", color: "#ffdd03"},
        {offset: "100%", color: "#ffdd03"}
      ])
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return d.color; });

      svgP.append("linearGradient")
      .attr("id", "line-gradient2")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", y(max))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "#00c29e"},
          {offset: "100%", color: "#00c29e"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });
    
    
    // Add the line
    svgP.append("path")
      .attr("class", "pr")
      .datum(fqcs2)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradient)" )
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return x(d[0]) })
        .y(function(d) { return y(d[1]) })
        )

        svgP.append("path")
      .attr("class", "pr2")
      .datum(fqcs3)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradient2)" )
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
    
    var fqcs2 = computeFrequency2(data);

   var x = d3.scalePoint()
      .domain(fqcs2.map(function(d) { return +d[0]; }))
      .range([ 0, widthP ]);
      
    xAx = svgP.append("g")
      .attr("transform", "translate(0," + heightP + ")")
      .call(d3.axisBottom(x));

    xAx.selectAll("text")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start")
    .attr("dx", ".71em");

    // Max value observed:
    max = d3.max(fqcs2.map(function(d) { return +d[1]; }))

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, max])
      .range([ heightP, 0 ]);
    svgP.append("g")
      .call(d3.axisLeft(y));
    
    // Set the gradient
    if(m){
      svgP.append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", y(max))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "#ffdd03"},
          {offset: "100%", color: "#ffdd03"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });
    }else{
      svgP.append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", y(max))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "#574cc2"},
          {offset: "100%", color: "#574cc2"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });
    }
    
    // Add the line
    svgP.append("path")
      .attr("class", "pr")
      .datum(fqcs2)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradient)" )
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return x(d[0]) })
        .y(function(d) { return y(d[1]) })
        )
  }

}

$(window).resize(function() {
  // Resize SVG
  svgP
    .attr("width", $("#my_dataviz").width())
    .attr("height", $("#my_dataviz").height())
  ;
});