var x_Scatter = d3.scaleLinear().range([0, widthScatter]),
    y_Scatter = d3.scaleLinear().range([heightScatter, 0])

    var color = {
        "Asia":    "#fd1cec",
        "Africa":    "#1df1fe",
        "America":    "#ffffff",
        "Oceania":  "#004bff",  
        "Europe":  "#ffa900",
    };

var xAxis = d3.axisBottom(x_Scatter);

var yAxis = d3.axisLeft(y_Scatter);

    
var brushTot=d3.brush()
    .extent([[0,0],[widthScatter, heightScatter]])
    .on("start brush", selected);
    
var focus;

var svgScatter = d3.select("#scatter_area").append("svg")
    .attr("width", "100%")
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
            .style("fill", function(d) { return color[computeContinent(d.region_txt)]; })
          

    focus.append("g")
        .attr("class", "x-axisScatter")
        .attr("transform", "translate(0," + heightScatter + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y-axisScatter")
        .call(yAxis);
        
    svgScatter.append("text")
        .attr("class", "pcatext")
        .attr("transform", "rotate(-90)")
        .attr("y", 30 - marginScatter.left)
        .attr("x",0 - (heightScatter / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("PCA Component 2")
        .style("fill","#E8EDDF");  

                
    svgScatter.append("text")
        .attr("class", "pcatext")             
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
            .data(["Oceania", "Africa",  "Asia", "Europe", "America"])
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { 
                return "translate(" + i * 80 + ")"; 
            });

    legend.append("rect")
        .attr("x", 60)
        .attr("width", 6)
        .attr("height", 13)
        .style("fill", function (d) { return color[d] });

    legend.append("text")
        .attr("x", 20)
        .attr("y", 5)
        .attr("dy", ".35em")
        .style("class", "l")
        .style("text-anchor", "start")
        .style("fill", "#ffffff")
        .text(function(d) { return d; });
    
});

var cond=false;
function updateScatter(){
    if(cond==true){
        data = scatter_getDataC();
        cond=false;
    }else{
        data = scatter_getData();
    }
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
        .style("fill", function(d) { return color[computeContinent(d.region_txt)]; })
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
        .style("fill", function(d) { return color[computeContinent(d.region_txt)]; })
        .attr('class', function (d) {
            if (filteringByScatterplot(d)) return 'selected'
            else return '';
        });
    
}

function computeContinent(region){
    if (region == "Central Asia" || region == "South Asia" || region == "East Asia" || region == "Southeast Asia") return "Asia";
    else if (region == "North America" || region == "South America" || region == "Central America & Caribbean") return "America";
    else if (region == "Eastern Europe" || region == "Western Europe") return "Europe";
    else if (region == "Australasia & Oceania") return "Oceania";
    else return "Africa";
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

function scatter_getDataC(){
    return manager.getDataFilteredByPlace();
}

manager.addListener('yearChanged', function (e) {
    updateScatter();
});

manager.addListener('placeChanged', function (e) {
    cond=true;
    updateScatter();
});

manager.addListener('parallelBrushing', function (e) {
    if (manager.filteringByYear)
        updateScatter();
});

