var svgParallel = d3.select(".parallel_area").append("svg")
  .attr("width", '100%')
  .attr("height", '100%')
  .append("g")
  .attr("transform", "translate(" + margin_parallel.left + "," + margin_parallel.top + ")");
  

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}
var cambio=false;

function cancelSelection() {
  key = this.__data__.key;
  children = this.childNodes;
  hide = false;
  for (i = 0; i < children.length; i++) {
    if (children[i].__data__.type == 'selection' && children[i].y.animVal.value == 0) hide = true;
  }
  if (!hide) return;
  for (i in dimensions) {
    if (key == dimensions[i].key) {
      extents[i] = [0, 0];
      brushParallel()
    }
  }
}

function parallelFiltering(d) {
  var rangeC = y["place"].range();
  var rangeT = y["attacktype1_txt"].range();
  var rangeT2 = y["weaptype1_txt"].range();
  var rangeT3 = y["targtype1_txt"].range();
  var rangePointsC = d3.range(rangeC[0], rangeC[1], y["place"].step());
  var rangePointsT = d3.range(rangeT[0], rangeT[1], y["attacktype1_txt"].step());
  var rangePointsT2 = d3.range(rangeT2[0], rangeT2[1], y["weaptype1_txt"].step());
  var rangePointsT3 = d3.range(rangeT3[0], rangeT3[1], y["targtype1_txt"].step());
  value = dimensions.every(function (p, i) {
    if (extents[i][0] == 0 && extents[i][1] == 0) {
      return true;
    }
    if (p.key == "place") {
      if (country_selection == undefined) return true;
      dValue = rangePointsC[places.indexOf(d[p.key])];
      return dValue >= country_selection[0] && dValue <= country_selection[1];
    }
    else if (p.key == "attacktype1_txt") {
      if (type_selection == undefined) return true;
      dValue = rangePointsT[types.indexOf(d[p.key])];
      return dValue >= type_selection[0] && dValue <= type_selection[1];
    }
    else if (p.key == "weaptype1_txt") {
      if (type2_selection == undefined) return true;
      dValue = rangePointsT2[types2.indexOf(d[p.key])];
      return dValue >= type2_selection[0] && dValue <= type2_selection[1];
    }
    else if (p.key == "targtype1_txt") {
      if (type3_selection == undefined) return true;
      dValue = rangePointsT3[types3.indexOf(d[p.key])];
      return dValue >= type3_selection[0] && dValue <= type3_selection[1];
    }else {
      return extents[i][1] <= d[p.key] && d[p.key] <= extents[i][0];
    }
    
  });
  return value;
}


function brushParallel() {
  for (i in dimensions) {
    if (d3.event.target == y[dimensions[i].key].brush) {
      if (dimensions[i].key == "place") {
        country_selection = d3.event.selection;
        extents[i] = d3.event.selection.map(scalePointInverseC, y[dimensions[i].key]);
      }
      else if (dimensions[i].key == "attacktype1_txt") {
        type_selection = d3.event.selection;
        extents[i] = d3.event.selection.map(scalePointInverseT, y[dimensions[i].key]);
      }
      else if (dimensions[i].key == "weaptype1_txt") {
        type2_selection = d3.event.selection;
        extents[i] = d3.event.selection.map(scalePointInverseT2, y[dimensions[i].key]);
      }
      else if (dimensions[i].key == "targtype1_txt") {
        type3_selection = d3.event.selection;
        extents[i] = d3.event.selection.map(scalePointInverseT3, y[dimensions[i].key]);
      }
      else {
        extents[i] = d3.event.selection.map(y[dimensions[i].key].invert, y[dimensions[i].key]);
      }
    }
  }
  manager.notifyParallelBrushing();
  foreground.style("display", function (d) {
      value = parallelFiltering(d);
      if (value) {
        return null;
      }
      return "none";
  });
}

function scalePointInverseC(pos) {
  var xPos = pos;
  var domainC = y["place"].domain();
  var rangeC = y["place"].range();
  var rangePointsC = d3.range(rangeC[0], rangeC[1], y["place"].step());
  var inverseC = domainC[d3.bisect(rangePointsC, xPos)];
  return inverseC;
}

function scalePointInverseT(pos) {
  var xPos = pos;
  var domainT = y["attacktype1_txt"].domain();
  var rangeT = y["attacktype1_txt"].range();
  var rangePointsT = d3.range(rangeT[0], rangeT[1], y["attacktype1_txt"].step());
  var inverseT = domainT[d3.bisect(rangePointsT, xPos)];
  return inverseT;
}

function scalePointInverseT2(pos) {
  var xPos = pos;
  var domainT = y["weaptype1_txt"].domain();
  var rangeT = y["weaptype1_txt"].range();
  var rangePointsT = d3.range(rangeT[0], rangeT[1], y["weaptype1_txt"].step());
  var inverseT = domainT[d3.bisect(rangePointsT, xPos)];
  return inverseT;
}

function scalePointInverseT3(pos) {
  var xPos = pos;
  var domainT = y["targtype1_txt"].domain();
  var rangeT = y["targtype1_txt"].range();
  var rangePointsT = d3.range(rangeT[0], rangeT[1], y["targtype1_txt"].step());
  var inverseT = domainT[d3.bisect(rangePointsT, xPos)];
  return inverseT;
}


function draw(d) {
  points = [];
  for (i in dimensions) {
    n = dimensions[i].name;
    r = dimensions[i].key;
    points.push([x(n), y[r](d[r])]);
  }
  return d3.line()(points);
}

var background;
var foreground;
var country_selection;
var type_selection;
var type2_selection;
var type3_selection;

var y = {};
var names = [];
var data;

function parallel_getData(){
	  return manager.getDataFilteredByParallel();
}

function start(){
  data = parallel_getData();

  dimensions = [
    {
      name: "place",
      key: "place"
    },
    {
      name: "nkill",
      key: "nkill"
    },
    {
      name: "attacktype1_txt",
      key: "attacktype1_txt"
    },
    {
      name: "weaptype1_txt",
      key: "weaptype1_txt"
    },
    {
      name: "targtype1_txt",
      key: "targtype1_txt"
    }
           
    ];


  for (i in dimensions) {
    j = dimensions[i].key;
    names.push(dimensions[i].name);
    if (j == "place") {
   
      places = [" "];
      data.forEach(element => {
        if (!places.includes(element[j])) {
          places.push(element[j])
        }
      });
      places.sort();
      places.push("  ");
    
      y[j] = d3.scalePoint()
        .domain(places)
        .range([0, height_parallel]);
        
    }
    else if (j == "nkill"){
      var low = d3.extent(data, function(d) { return +d.nkill; })[0];
      var high = d3.extent(data, function(d) { return +d.nkill; })[1];

      y[j] = d3.scaleLinear().domain([low - 1, high + 1]).range([height_parallel, 0]);
      
    }else if (j == "attacktype1_txt"){
      types = [" "];
      data.forEach(element => {
        if (!types.includes(element[j])) {
          types.push(element[j])
        }
      });
      types.push("  ");

      y[j] = d3.scalePoint()
        .domain(types)
        .range([0, height_parallel]);
      
    }else if (j == "weaptype1_txt"){
      types2 = [" "];
      data.forEach(element => {
        if (!types2.includes(element[j])) {
          types2.push(element[j])
        }
      });
      types2.push("  ");

      y[j] = d3.scalePoint()
        .domain(types2)
        .range([0, height_parallel]);
      
    }else if (j == "targtype1_txt"){
      types3 = [" "];
      data.forEach(element => {
        if (!types3.includes(element[j])) {
          types3.push(element[j])
        }
      });
      types3.push("  ");

      y[j] = d3.scalePoint()
        .domain(types3)
        .range([0, height_parallel]);
      
    }
  
   x = d3.scalePoint()
      .range([0, width_parallel])
      .padding(1)
      .domain(names);
  }

    
  extents = dimensions.map(function (p) { return [0, 0]; });

  background = svgParallel.append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", draw)
    .attr("class", "path_background")
    .style("stroke", "#FFFFFF");


  foreground = svgParallel.append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", draw)
    .attr('class', 'path_foreground path_normal')
    .style("stroke", function(d){
      if(manager.compareMode){
        if (d.place == manager.place) {return "#ffd500";}
        else if (d.place == manager.secondPlace) return "#8f00ff";
        else return "#B80F0A";
      }
      else if (d.place == manager.secondPlace) return "#8f00ff";
      else return "#B80F0A";
    });
    

  svgParallel.selectAll('.path_highlighted').raise();

  var gP = svgParallel.selectAll("axis")
      .data(dimensions)
      .enter().append("g")
      .attr("class", "axis")
      .attr("transform", function (d) { return "translate(" + x(d.name) + ")"; })
      .style("fill","#E8EDDF");


  gP.append("g")
    .attr("class", "axis")
    .each(function (p) { d3.select(this).call(d3.axisLeft().scale(y[p.key])); })
    .append("text")
    .style("fill", "#E8EDDF")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function (p) { return p.name; });
      
      
  gP.append("g")
  .attr("class", "brushParallel")
  .each(function (p) {
    d3.select(this).call(y[p.key].brush = d3.brushY().extent([[-8, 0], [8, height_parallel]]).
      on("start", brushstart).
      on("brush", brushParallel)).
      on("click", cancelSelection)
  })
  .selectAll("rect")
  .attr("x", -8)
  .attr("width", 16);
      
  manager.filteringByParallel = parallelFiltering;  
}

manager.addListener('dataReady', function (e) {
  	start();
});

manager.addListener('scatterplotBrushing', function (e) {
  svgParallel.selectAll('.path_foreground')
  .style("stroke", setColorByScatterplot)
  .attr("class", setClass)
  .style("opacity", setOpacityByScatterplot);
  svgParallel.selectAll('.path_highlighted').raise();
});


manager.addListener('yearChanged', function (e) {
	cambio=false;
  d3.select(".parallel_area").select("svg").remove();
  svgParallel = d3.select(".parallel_area").append("svg")
    .attr("width", width_parallel + margin_parallel.left + margin_parallel.right)
    .attr("height", height_parallel + margin_parallel.top + margin_parallel.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_parallel.left + "," + margin_parallel.top + ")");
	start();
	
});

function updateParallel(){
  d3.select(".parallel_area").select("svg").remove();
  svgParallel = d3.select(".parallel_area").append("svg")
  .attr("width", '100%')
  .attr("height", '100%')
  .append("g")
  .attr("transform", "translate(" + margin_parallel.left + "," + margin_parallel.top + ")");
  start()
}


manager.addListener('placeChanged', function (e) {
	  cambio=true;
	  updateParallel();
});


function setColorByScatterplot(d) {
  if (manager.filteringByScatterplot == undefined){ return "#B80F0A";}
  if (manager.filteringByScatterplot(d)){
	  console.log(1)
    if (d.place == manager.place) {return "#ffd500";}
    else if (d.place == manager.secondPlace) return "#8f00ff";
    else {return "#008000"}
  }
  else{
    return "#B80F0A";
  }
}

function setOpacityByScatterplot(d){
  if (manager.filteringByScatterplot == undefined) return 1;
  value = manager.filteringByScatterplot(d);
  if (value) {
    return 1
  }
  return 0.6;
}

function setClass(d) {
  if (manager.filteringByScatterplot == undefined) return 'path_foreground path_normal';
  value = manager.filteringByScatterplot(d);
  if (value){
    return 'path_foreground path_highlighted';
  }
  else return 'path_foreground path_normal';
}


manager.addListener('placeChanged', function (e) {
	  cambio=true;
	  updateParallel();
});

$(window).resize(function() {
  // Resize SVG
  svgParallel
    .attr("width", $("#map-holder").width())
    .attr("height", $("#map-holder").height())
  ;
});