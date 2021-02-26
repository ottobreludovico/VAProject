// append the svgN object to the body of the page
var svgN = d3.select("#my_datavizz")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
  .append("g")
    .attr("transform","translate(" + marginN.left + "," + marginN.top + ")");

//Read the data

function boxPlot_getData(){
    return manager.getDataFilteredByPlace();
}


function aaaaaaaaaa() {
  var dataN=boxPlot_getData();
    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
  .key(function(dd) { return dd.place;})
  .rollup(function(dd) {
    qq1 = d3.quantile(dd.map(function(gg) { return parseInt(gg.nkill);}).sort(d3.ascending),.25)
    mmedian = d3.quantile(dd.map(function(gg) { return parseInt(gg.nkill);}).sort(d3.ascending),.5)
    qq3 = d3.quantile(dd.map(function(gg) { return parseInt(gg.nkill);}).sort(d3.ascending),.75)
    iinterQuantileRange = qq3 - qq1
    mmin = qq1 - 1.5 * iinterQuantileRange
    if (mmin<0){
        mmin=0
    }
    mmax = qq3 + 1.5 * iinterQuantileRange
    return({q1: qq1, median: mmedian, q3: qq3, interQuantileRange: iinterQuantileRange, min: mmin, max: mmax})
  })
  .entries(dataN)


var a=sumstat[0].value.max;
// Show the xN scale
var xN = d3.scaleBand()
  .range([ 0, widthN ])
  .domain([manager.place])
  .paddingInner(1)
  .paddingOuter(.5)
svgN.append("g")
  .attr("transform", "translate(0," + heightN + ")")
  .call(d3.axisBottom(xN))

// Show the yN scale
var yN = d3.scaleLinear()
  .domain([-5,a+5])
  .range([heightN, 0])
svgN.append("g").call(d3.axisLeft(yN))

// Show the main vertical line
svgN
  .selectAll("vertLines")
  .data(sumstat)
  .enter()
  .append("line")
    .attr("x1", function(d){return(xN(d.key))})
    .attr("x2", function(d){return(xN(d.key))})
    .attr("y1", function(d){return(yN(d.value.min))})
    .attr("y2", function(d){return(yN(d.value.max))})
    .attr("stroke", "yellow")
    .style("width", 40)

// rectangle for the main box
var boxWidthh = 100
svgN
  .selectAll("boxes")
  .data(sumstat)
  .enter()
  .append("rect")
      .attr("x", function(d){return(xN(d.key)-boxWidthh/2)})
      .attr("y", function(d){return(yN(d.value.q3))})
      .attr("height", function(d){return(yN(d.value.q1)-yN(d.value.q3))})
      .attr("width", boxWidthh )
      .attr("stroke", "yellow")
      .style("fill", "#69b3a2")

// Show the median
svgN
  .selectAll("medianLines")
  .data(sumstat)
  .enter()
  .append("line")
  .attr("x1", function(d){center1=xN(d.key)-boxWidthh/2; return(xN(d.key)-boxWidthh/2) })
  .attr("x2", function(d){center2=xN(d.key)+boxWidthh/2; return(xN(d.key)+boxWidthh/2) })
    .attr("y1", function(d){return(yN(d.value.median))})
    .attr("y2", function(d){return(yN(d.value.median))})
    .attr("stroke", "yellow")
    .style("width", 80)

    svgN
    .selectAll("toto")
    .data([sumstat[0].value.min, sumstat[0].value.median, sumstat[0].value.max])
    .enter()
    .append("line")
    .attr("x1", center1)
    .attr("x2", center2)
    .attr("y1", function(d){ return(yN(d))} )
    .attr("y2", function(d){ return(yN(d))} )
    .attr("stroke", "yellow")

};

manager.addListener('placeChanged', function (e) {
    svgN.selectAll("*").remove();
    aaaaaaaaaa();
});