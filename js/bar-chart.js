var others = [];

var xBar = d3.scaleBand()
.range([1.5, widthBar], .1)
.paddingInner(0.05);

var yBar = d3.scaleLinear()    
.range([heightBar, 0]);

/*
var svgBar = d3.select("#barChart").append("svg")
                            .attr("width", widthBar + marginBar.left + marginBar.right)
                            .attr("height", heightBar + marginBar.top + marginBar.bottom)
                            .append("g")
                            .attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");
*/
var svgBar = d3.select("#barChart").append("svg")
                            .attr("width", "100%")
                            .attr("height", "100%")
                            .append("g")
                            .attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");
// Parse the Data
manager.addListener('dataReady', function (e) {
    data = bar_getData();

    var fqcs = computeFrequency(data);
    xBar.domain(fqcs.map(function(fcy) { return fcy[0]; }));
    yBar.domain([0, d3.max(fqcs.map(function(fcy) { return fcy[1]; }))]);

    xAxisBar = svgBar.append("g")
    .attr("class", "x-axisBar")
    .attr("transform", "translate(0," + heightBar + ")")
    .call(d3.axisBottom(xBar))

    xAxisBar.selectAll("text")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start")
    .attr("dx", ".71em");
    
    yAxisBar = svgBar.append("g")
    .attr("class", "y-axisBar")
    .attr("x",-5)
    .call(d3.axisLeft(yBar))

    yAxisBar.selectAll("text")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")

    var rectBar = svgBar.selectAll(".bar")
                        .data(fqcs)
                        .enter();
    
    rectBar.append("rect")
    .attr("class", "barRect")
    .attr("x", function(fcy) {return xBar(fcy[0]); })
    .attr("width", xBar.bandwidth)
    .attr("y", function(fcy) { return yBar(fcy[1]); })
    .attr("height", function(fcy) { return heightBar - yBar(fcy[1]); })
    .attr("fill", "#2e4352")
    .attr("margin-left", "1px").attr("selected",false)
    .on("click", function(d,i){});

    rectBar
        .append("text")
            .attr("class", "barValues")
            .attr("x", function(d) { return xBar(d[0]) + (xBar.bandwidth())/2; })
            .attr("y", function(d) { return yBar(d[1]) - 8; })
            .style("fill", "black")
            .style("text-anchor", "middle")
            .attr("dy", ".35em")
            .text(function(d) { return d[1]; });
}); 

function bar_getData(){
    return manager.getDataFilteredByYear();
}

function computeFrequency(data){
    frequency = {};
    for (i = 0; i < data.length; i++) {
        country = data[i].place;
        if (frequency[country] != undefined){
            frequency[country] += 1;
        }
        else{
            frequency[country] = 1;
        }
    }


    var items = Object.keys(frequency).map(function (country) {
        return [country, frequency[country]];
    });

    if(!showValues.checked && items.length > 0){
        tot_others = 0
        others = [];

        for (var i = items.length - 1; i >= 0; i--){
            var el = items[i];
            if (el[1] <= 4){
                if (! (others.includes(el[0]))) others.push(el[0]);
                tot_others += el[1];
                items.splice(i, 1);
            }
        }
        if (tot_others > 0)
            items.push(["Others", tot_others])
    }

    items.sort(function(first, second) {
        return second[1] - first[1];
    });



    return items;
}

manager.addListener('yearChanged', function (e) {
	updateBarChart()
})  


function updateBarChart(){ 
    data = bar_getData()

    var fqcs = computeFrequency(data);
    xBar.domain(fqcs.map(function(fcy) { return fcy[0]; }));
    yBar.domain([0, d3.max(fqcs.map(function(fcy) { return fcy[1]; }))]);

    xAxisBar = svgBar.select(".x-axisBar")
        .call(d3.axisBottom(xBar))
    
    yAxisBar = svgBar.select(".y-axisBar")
        .call(d3.axisLeft(yBar))

    xAxisBar.selectAll("text")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start")
    .attr("dx", ".71em");
        
    yAxisBar.selectAll("text")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")

    svgBar.selectAll(".barRect").data(fqcs).exit().remove();
    svgBar.selectAll(".barValues").data([]).exit().remove();
    

    svgBar.selectAll(".bar")
    .data(fqcs)
    .enter().append("rect")
    .attr("class", "barRect")
    .attr("x", function(fcy) {return xBar(fcy[0]); })
    .attr("width", xBar.bandwidth)
    .attr("y", function(fcy) { return yBar(fcy[1]); })
    .attr("height", function(fcy) { return heightBar - yBar(fcy[1]); })
    .attr("margin-left", "1px").attr("selected",false)
    .style("fill", "#2e4352")
    .on("click", function(d,i){
    
    });


    svgBar.selectAll(".bar")
    .data(fqcs)
    .enter()
    .append("text")
            .attr("class", "barValues")
            .attr("x", function(d) { return xBar(d[0]) + (xBar.bandwidth())/2; })
            .attr("y", function(d) { return yBar(d[1]) - 8; })
            .style("fill", "black")
            .style("text-anchor", "middle")
            .attr("dy", ".35em")
            .text(function(d) {return d[1]; });


    svgBar.selectAll(".barRect").data(fqcs).transition().duration(500)
            .attr("x", function (d) { return xBar(d[0]); })
            .attr("y", function (d) { return yBar(d[1]); })
            .attr("width",  xBar.bandwidth)
            .attr("height", function(fcy) { return heightBar - yBar(fcy[1]);});

    svgBar.selectAll(".barValues").data(fqcs).transition().duration(500)
            .attr("x", function(d) { return xBar(d[0]) + (xBar.bandwidth())/2; })
            .attr("y", function(d) { return yBar(d[1]) - 8; })
            .style("text-anchor", "middle")


}