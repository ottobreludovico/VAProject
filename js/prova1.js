var data;
var margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 460 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
var svg1 = d3.select("#prova2")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
  .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")")
    .call(d3.zoom().on("zoom", function () {
        svg1.attr("transform", d3.event.transform)
     }));


manager.addListener('dataReady', function (e) {
    dataa = prova1_getdata();
    console.log(dataa);
    var fq=computeFrequency3(dataa);
    console.log(fq);
    // X scale: common for 2 data series
    var x = d3.scaleBand()
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing
        .domain(fq.map(function(d) { return d[0]; })); // The domain of the X axis is the list of states.

    var maxF = d3.max(fq.map(function(d) { return +d[1]; }))
    var maxK = d3.max(fq.map(function(d) { return +d[2]; }))
    // Y scale outer variable
    var y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, maxF]); // Domain of Y is from 0 to the max seen in the data

    // Second barplot Scales
    var ybis = d3.scaleRadial()
        .range([innerRadius, 0])   // Domain will be defined later.
        .domain([0, maxK]);

    // Add the bars
    svg1.append("g")
        .selectAll("path")
        .data(fq)
        .enter()
        .append("path")
        .attr("fill", "#69b3a2")
        .attr("class", "yo")
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
            .innerRadius(innerRadius)
            .outerRadius(function(d) { return y(d[1]); })
            .startAngle(function(d) { return x(d[0]); })
            .endAngle(function(d) { return x(d[0]) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius))

    // Add the labels
    svg1.append("g")
        .selectAll("g")
        .data(fq)
        .enter()
        .append("g")
            .attr("text-anchor", function(d) { return (x(d[0]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function(d) { return "rotate(" + ((x(d[0]) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d[1])+10) + ",0)"; })
        .append("text")
            .text(function(d){return(d[0])})
            .attr("transform", function(d) { return (x(d[0]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            .style("font-size", "11px")
            .attr("alignment-baseline", "middle")

    // Add the second series
    svg1.append("g")
        .selectAll("path")
        .data(fq)
        .enter()
        .append("path")
        .attr("fill", "red")
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
            .innerRadius( function(d) { return ybis(0) })
            .outerRadius( function(d) { return ybis(d[2]); })
            .startAngle(function(d) { return x(d[0]); })
            .endAngle(function(d) { return x(d[0]) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius))

});


function computeFrequency3(data){
    frequency = {};
    kills = {};
    for (i = 0; i < data.length; i++) {
        place = data[i].place;
        if (frequency[place] != undefined){
            frequency[place] += 1;
            kills[place] += +(data[i].nkill);
        }
        else{
            frequency[place] = 1;
            kills[place] = +(data[i].nkill);
        }
    }


    var items = Object.keys(frequency).map(function (place) {
        return [place, frequency[place], kills[place]];
    });

    items.sort(function(first, second) {
        return second[1] - first[1];
    });

    return items;
}

function prova1_getdata(){
   return manager.getDataFilteredByG();
}