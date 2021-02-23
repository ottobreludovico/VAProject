var x_Scatter = d3.scaleLinear().range([0, widthScatter]),
    y_Scatter = d3.scaleLinear().range([heightScatter, 0])

    var color = {
        "nkill < 5.0":    "#ffffff",
        "nkill < 20.0":    "#EF7215",
        "nkill < 50.0":    "#B80F0A",
        "nkill 50.0+":  "#8f00ff",  
    };

var xAxis = d3.axisBottom(x_Scatter);

var yAxis = d3.axisLeft(y_Scatter);

    
var brushTot=d3.brush()
    .extent([[0,0],[widthScatter, heightScatter]])
    .on("start brush", selected);
    
var focus;

var svgScatter = d3.select("#scatter_area").append("svg")
    .attr("width", "99%")
    .attr("height", "100%")
    .append("g")
    .attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")");

manager.addListener('dataReady', function (e) {

    data = scatter_getData();
    var minX = d3.extent(data, function(d) { return +d["PCA_1"]; })[0] , maxX = d3.extent(data, function(d) { return +d["PCA_1"]; })[1];
    var minY = d3.extent(data, function(d) { return +d["PCA_2"]; })[0] , maxY = d3.extent(data, function(d) { return +d["PCA_2"]; })[1];
    x_Scatter.domain([minX - 1 ,maxX + 1]);
    y_Scatter.domain([minY - 1,maxY + 1]);

    svgScatter.append("defs").append("clipPath")
        .attr("id", "clip")
    .append("rect")
        .attr("width", widthScatter)
        .attr("height", heightScatter);

        

    focus = svgScatter.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")");

    // append scatter plot to main chart area 
    var dots = focus.append("g")
                    .attr("class", "circleCont");
        dots.attr("clip-path", "url(#clip)");
        dots.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr('class', 'dot')
            .attr("r",3.5)
            .attr("fill","#2e4352")
            .attr("opacity",".3")
            .style("stroke", "#000")
            .attr("cx", function(d) { return x_Scatter(d["PCA_1"]); })
            .attr("cy", function(d) { return y_Scatter(d["PCA_2"]); })
            .style("fill", function(d) { return color[computeNkill(d.nkill)]; })
          

    focus.append("g")
        .attr("class", "x-axisScatter")
        .attr("transform", "translate(0," + heightScatter + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y-axisScatter")
        .call(yAxis);
        
    svgScatter.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 30 - marginScatter.left)
        .attr("x",0 - (heightScatter / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("PCA Component 2")
        .style("fill","#E8EDDF");  

                
    svgScatter.append("text")             
        .attr("transform",
            "translate(" + ((widthScatter + marginScatter.right + marginScatter.left)/2) + " ," + 
                            (heightScatter + marginScatter.top + marginScatter.bottom - 30)+ ")")
        .style("text-anchor", "middle")
        .text("PCA Component 1")
        .style("fill","#E8EDDF");

    focus.append("g")
        .attr("class", "brushT")
        .call(brushTot);    

    var legend = svgScatter.selectAll(".legend")
            .data(["nkill 50.0+", "nkill < 50.0",  "nkill < 20.0", "nkill < 5.0"])
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { 
                return "translate(50," + i * 20 + ")"; 
            });

    legend.append("rect")
        .attr("x", widthScatter - 66)
        .attr("width", 2)
        .attr("height", 18)
        .style("fill", function (d) { return color[d] });

    legend.append("text")
        .attr("x", 0)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("fill", "#ffffff")
        .text(function(d) { return d; });



/*
	// add legend   
	var legend = svg.append("g")
	  .attr("class", "legend")
	  .attr("x", w)
	  // .attr("y", 10)
	  .attr("height", 50)
	  .attr("width", 300)
	  .attr("transform", "translate(" + (w - 200) + ", -50)");

	legend.selectAll('g').data(dataset)
      .enter()
      .append('g')
      .each(function(d, i) {
        var g = d3.select(this);
        g.append("rect")
          .attr("x", i * 60)
          .attr("y", 65)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", color_hash[String(i)][1]);
        
       g.append("text")
          .attr("x", i * 60 + 15)
          .attr("y", 73)
          .attr("height",30)
          .attr("width",100)
          .style("fill", color_hash[String(i)][1])
          .text(color_hash[String(i)][0]);

      });
*/    

    
});
    /**/

function updateScatter(){
    data = scatter_getData();
    var minX = d3.extent(data, function(d) { return +d["PCA_1"]; })[0] , maxX = d3.extent(data, function(d) { return +d["PCA_1"]; })[1];
    var minY = d3.extent(data, function(d) { return +d["PCA_2"]; })[0] , maxY = d3.extent(data, function(d) { return +d["PCA_2"]; })[1];
    x_Scatter.domain([minX - 1 ,maxX + 1]);
    y_Scatter.domain([minY - 1,maxY + 1]);

    focus.select(".x-axisScatter")
      .attr("transform", "translate(0," + heightScatter + ")")
      .transition().duration(100)
      .call(d3.axisBottom(x_Scatter));

    focus.select(".y-axisScatter")
      .transition().duration(100)
      .call(d3.axisLeft(y_Scatter));

    svgScatter.select('.focus')
            .select(".circleCont")
            .selectAll("circle").data(data).exit().remove();
        
    // append scatter plot to main chart area 
    var dots = focus.select("g").selectAll("circle").data(data)
    dots.exit().remove();
    dots.enter().append("circle")
        .attr('class', 'dot')
        .attr("r",3.5)
        .attr("fill","#2e4352")
        .attr("opacity",".3")
        .attr("cx", function(d) { return x_Scatter(d["PCA_1"]); })
        .attr("cy", function(d) { return y_Scatter(d["PCA_2"]); })
        .style("fill", function(d) { return color[computeNkill(d.nkill)]; })
        .style("stroke", "#000")
        .merge(dots);

    focus.select("g").selectAll("circle")
        .data(data).transition().duration(500)
        .attr("r",3.5)
        .attr("fill","#2e4352")
        .attr("opacity",".3")
        .attr("stroke","#000")
        .attr("cx", function(d) { return x_Scatter(d["PCA_1"]); })
        .attr("cy", function(d) { return y_Scatter(d["PCA_2"]); })
        .style("fill", function(d) { return color[computeNkill(d.nkill)]; })
        .attr('class', function (d) {
            if (filteringByScatterplot(d)) return 'selected'
            else return '';
        });
    
}

function computeNkill(nkill){
    if (nkill < 5.0) return "nkill < 5.0";
    else if (nkill < 20.0) return "nkill < 20.0";
    else if (nkill < 50.0) return "nkill < 50.0";
    else return "nkill 50.0+";
}



//create brush function redraw scatterplot with selection
function brushed() {
    var selection = d3.event.selection;
    focus.selectAll(".dot")
          .attr("cx", function(d) { return x_Scatter(d["PCA_1"]); })
          .attr("cy", function(d) { return y_Scatter(d["PCA_2"]); });
    focus.select(".x-axisScatter").call(xAxis);
}

var scatterplot_brushing_last;

function filteringByScatterplot(d) {
    brush_coords = scatterplot_brushing_last;
    if (brush_coords == undefined) return false;
    cx = x_Scatter(d["PCA_1"]);
    cy = y_Scatter(d["PCA_2"]);
    var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
}
manager.filteringByScatterplot = filteringByScatterplot;


function selected(){
    scatterplot_brushing_last = d3.event.selection;
    focus.selectAll("circle").data(scatter_getData).classed("selected", function (d) {
        if (filteringByScatterplot(d)){
            return true;
        }
        else return false;
    })
    manager.notifyScatterplotBrushing();
}

function scatter_getData(){
    return manager.getDataFilteredByParallel();
}

manager.addListener('yearChanged', function (e) {;
    updateScatter();
});

manager.addListener('parallelBrushing', function (e) {
    if (manager.filteringByYear)
        updateScatter();
});

