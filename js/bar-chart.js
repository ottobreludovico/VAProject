var media;
var xBar = d3.scaleBand()
.range([1.5, widthBar], .1)
.paddingInner(0.05);
var gg=false;
var yBar = d3.scaleLinear()    
.range([heightBar, 0]);

/*
var svgBar = d3.select("#barChart").append("svg")
                            .attr("width", widthBar + marginBar.left + marginBar.right)
                            .attr("height", heightBar + marginBar.top + marginBar.bottom)
                            .append("g")
                            .attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");
*/
var tip1 = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
      if(gg){
        return "<i>Country: </i><strong>"+d[1][0][2]+"</strong>";
      }else{
        return "<i>Country: </i><strong>"+d[1][1]+"</strong>";
      }
  });



var svgBar = d3.select("#barChart").append("svg")
                            .attr("width", "100%")
                            .attr("height", "100%")
                            .append("g")
                            .attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")")
                            .call(tip1);
// Parse the Data
var data=[];
var fqcs=[];
manager.addListener('dataReady', function (e) {
    data = bar_getData();
    fqcs = computeFrequency(data);
    xBar.domain(fqcs.map(function(fcy) { return fcy[0]; }));
    yBar.domain([0, d3.max(fqcs.map(function(fcy) { return fcy[1]; }))]);

    xAxisBar = svgBar.append("g")
    .attr("class", "x-axisBar")
    .attr("transform", "translate(0," + heightBar + ")")
    .call(d3.axisBottom(xBar))

    xAxisBar.selectAll("text")
    .style("fill", "#E8EDDF")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start")
    .attr("dx", ".71em");
    
    yAxisBar = svgBar.append("g")
    .attr("class", "y-axisBar")
    .attr("x",-5)
    .call(d3.axisLeft(yBar))

    yAxisBar.selectAll("text")
    .style("fill", "#E8EDDF")
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
    .attr("fill", "#B80F0A")
    .attr("margin-left", "1px").attr("selected",false)
    .on("click", function(d,i){})
    .on('mouseenter', function (actual, i) {
        d3.select(this).attr('opacity', 0.5)
    })
    .on('mouseleave', function (actual, i) {
        d3.select(this).attr('opacity', 1)
    });

    rectBar
        .append("text")
            .attr("class", "barValues")
            .attr("x", function(d) { return xBar(d[0]) + (xBar.bandwidth())/2; })
            .attr("y", function(d) { return yBar(d[1]) - 8; })
            .style("fill", "#E8EDDF")
            .style("text-anchor", "middle")
            .attr("dy", ".35em")
            .text(function(d) { return d[1]; });

    svgBar.append("line")
    .attr("id","limit")
    .attr("x1", xBar(1))
    .attr("x2", widthBar)
    .attr("y1", yBar(media))
    .attr("y2", yBar(media))
    .style("stroke", "white");
}); 

function computeFrequency(data){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        country = data[i].place;
        if (frequency[country] != undefined){
            frequency[country] += 1;
            sum+=1;
        }
        else{
            frequency[country] = 1;
            sum+=1
        }
    }


    items = Object.keys(frequency).map(function (country) {
        return [country, frequency[country]];
    });
    media=sum/Object.keys(frequency).length;

    items.sort(function(a, b) {
        return (a[1] < b[1]) ? 1 : -1;;
    });
    if(items.length>15){
        items.splice(15, items.length);      
    }

    return items;
}

function computeFrequencyR(data){
    var frequencyR = {};
    sum=0;
    var items2=[];
    for (i = 0; i < data.length; i++) {
        prov = data[i].provstate;

        if (frequencyR[prov] != undefined){
            frequencyR[prov][0] += 1;
            sum+=1;
        }
        else{
            frequencyR[prov] = [1,data[i].place];
            sum+=1
        }
    }

    var items2 = Object.keys(frequencyR).map(function (prov) {
        return [prov, frequencyR[prov]];
    });


    media=sum/Object.keys(frequencyR).length;
    items2.sort(function(a, b) {
        return (a[1][0] < b[1][0]) ? 1 : -1;;
    });

    if(items2.length>15){
        items2.splice(15, items2.length);      
    }
    return items2;
}

function computeFrequencyF(data){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        country = data[i].place;
        if (frequency[country] != undefined){
            frequency[country] += parseInt(data[i].nkill);
            sum+=parseInt(data[i].nkill);
        }
        else{
            frequency[country] = parseInt(data[i].nkill);
            sum+=parseInt(data[i].nkill);
        }
    }


    items = Object.keys(frequency).map(function (country) {
        return [country, frequency[country]];
    });
    media=sum/Object.keys(frequency).length;

    items.sort(function(a, b) {
        return (a[1] < b[1]) ? 1 : -1;;
    });
    if(items.length>15){
        items.splice(15, items.length);      
    }

    return items;
}

function computeFrequencyFR(data){
    var frequencyR = {};
    sum=0;
    var items2=[];
    for (i = 0; i < data.length; i++) {
        prov = data[i].provstate;

        if (frequencyR[prov] != undefined){
            frequencyR[prov][0] += parseInt(data[i].nkill);
            sum+=parseInt(data[i].nkill);
        }
        else{
            frequencyR[prov] = [parseInt(data[i].nkill),data[i].place];
            sum+=parseInt(data[i].nkill)
        }
    }

    var items2 = Object.keys(frequencyR).map(function (prov) {
        return [prov, frequencyR[prov]];
    });


    media=sum/Object.keys(frequencyR).length;
    items2.sort(function(a, b) {
        return (a[1][0] < b[1][0]) ? 1 : -1;;
    });

    if(items2.length>15){
        items2.splice(15, items2.length);      
    }
    return items2;
}

function cf(data){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        country = data[i].place;
        if (frequency[country] != undefined){
            if(data[i].gname==manager.group){
                frequency[country][0][0] += 1;
            }else{
                frequency[country][1][0] += 1;
            }   
            sum+=1
        }
        else{
            if(data[i].gname==manager.group){
                if(country==manager.place){
                    frequency[country] = [[1,"#B80F0A"],[0,"#ffd500"]];
                }else{
                    frequency[country] = [[1,"#B80F0A"],[0,"#8f00ff"]];
                }        
            }else{
                if(country==manager.place){
                    frequency[country] = [[0,"#B80F0A"],[1,"#ffd500"]];
                }else{
                    frequency[country] = [[0,"#B80F0A"],[1,"#8f00ff"]];
                }        
            }   
            sum+=1
        }
    }


    items = Object.keys(frequency).map(function (country) {
        return [country, frequency[country]];
    });
    media=sum/Object.keys(frequency).length;

    items.sort(function(a, b) {
        return ((a[1][0][0]+a[1][1][0]) < (b[1][0][0]+b[1][1][0])) ? 1 : -1;
    });

    if(items.length>15){
        items.splice(15, items.length);      
    }

    return items;
}

function cfR(data){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        country = data[i].provstate;
        if (frequency[country] != undefined){
            if(data[i].gname==manager.group){
                frequency[country][0][0] += parseInt(data[i].nkill);
            }else{
                frequency[country][1][0] += parseInt(data[i].nkill);
            }   
            sum+=parseInt(data[i].nkill)
        }
        else{
            if(data[i].gname==manager.group){
                if(data[i].place==manager.place){
                    frequency[country] = [[parseInt(data[i].nkill),"#B80F0A",data[i].place],[0,"#ffd500",data[i].place]];
                }else{
                    frequency[country] = [[parseInt(data[i].nkill),"#B80F0A",data[i].place],[0,"#8f00ff",data[i].place]];
                }        
            }else{
                if(data[i].place==manager.place){
                    frequency[country] = [[0,"#B80F0A",data[i].place],[parseInt(data[i].nkill),"#ffd500",data[i].place]];
                }else{
                    frequency[country] = [[0,"#B80F0A",data[i].place],[parseInt(data[i].nkill),"#8f00ff",data[i].place]];
                }        
            }   
            sum+=parseInt(data[i].nkill)
        }
    }


    items = Object.keys(frequency).map(function (country) {
        return [country, frequency[country]];
    });
    media=sum/Object.keys(frequency).length;

    items.sort(function(a, b) {
        return ((a[1][0][0]+a[1][1][0]) < (b[1][0][0]+b[1][1][0])) ? 1 : -1;
    });

    if(items.length>15){
        items.splice(15, items.length);      
    }
    console.log(items);
    return items;
}

function cfF(data){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        country = data[i].place;
        if (frequency[country] != undefined){
            if(data[i].gname==manager.group){
                frequency[country][0][0] += parseInt(data[i].nkill);
            }else{
                frequency[country][1][0] += parseInt(data[i].nkill);
            }   
            sum+=parseInt(data[i].nkill)
        }
        else{
            if(data[i].gname==manager.group){
                if(country==manager.place){
                    frequency[country] = [[parseInt(data[i].nkill),"#B80F0A"],[0,"#ffd500"]];
                }else{
                    frequency[country] = [[parseInt(data[i].nkill),"#B80F0A"],[0,"#8f00ff"]];
                }        
            }else{
                if(country==manager.place){
                    frequency[country] = [[0,"#B80F0A"],[parseInt(data[i].nkill),"#ffd500"]];
                }else{
                    frequency[country] = [[0,"#B80F0A"],[parseInt(data[i].nkill),"#8f00ff"]];
                }        
            }   
            sum+=parseInt(data[i].nkill)
        }
    }


    items = Object.keys(frequency).map(function (country) {
        return [country, frequency[country]];
    });
    media=sum/Object.keys(frequency).length;

    items.sort(function(a, b) {
        return ((a[1][0][0]+a[1][1][0]) < (b[1][0][0]+b[1][1][0])) ? 1 : -1;
    });

    if(items.length>15){
        items.splice(15, items.length);      
    }

    return items;
}

function cfFR(data){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        country = data[i].provstate;
        if (frequency[country] != undefined){
            if(data[i].gname==manager.group){
                frequency[country][0][0] += 1;
            }else{
                frequency[country][1][0] += 1;
            }   
            sum+=1
        }
        else{
            if(data[i].gname==manager.group){
                if(data[i].place==manager.place){
                    frequency[country] = [[1,"#B80F0A",data[i].place],[0,"#ffd500",data[i].place]];
                }else{
                    frequency[country] = [[1,"#B80F0A",data[i].place],[0,"#8f00ff",data[i].place]];
                }        
            }else{
                if(data[i].place==manager.place){
                    frequency[country] = [[0,"#B80F0A",data[i].place],[1,"#ffd500",data[i].place]];
                }else{
                    frequency[country] = [[0,"#B80F0A",data[i].place],[1,"#8f00ff",data[i].place]];
                }        
            }   
            sum+=1
        }
    }


    items = Object.keys(frequency).map(function (country) {
        return [country, frequency[country]];
    });
    media=sum/Object.keys(frequency).length;

    items.sort(function(a, b) {
        return ((a[1][0][0]+a[1][1][0]) < (b[1][0][0]+b[1][1][0])) ? 1 : -1;
    });

    if(items.length>15){
        items.splice(15, items.length);      
    }
    console.log(items);
    return items;
}


var R=false;
var F=false;
var tutte=true;
function updateChart(){
    if(manager.place==undefined && manager.group!=undefined){
        gg==false;
        data=[];
        data = bar_getDataL();
        tutte=false;
        showValues.checked = true;
    }else if(manager.place!=undefined && (manager.group!=undefined || manager.group==undefined)){
        data=[];
        data = bar_getDT();
        fqcs=[];
        tutte=false;
        showValues.checked = true;
    }else{
        data=[];
        data = bar_getData();
        tutte=true;
        showValues.checked = false;
    }
    if(gg==true){
        if(R){
            if(F){
                fqcs=[];
                fqcs = cfFR(data);
            }else{
                fqcs=[];
                fqcs = cfR(data);
            }   
        }else{
            if(F){
                fqcs=[];
                fqcs = cfF(data);
            }else{
                fqcs=[];
                fqcs = cf(data);
            }    
        } 
        xBar.domain(fqcs.map(function(fcy) { return fcy[0]; }));
        yBar.domain([0, d3.max(fqcs.map(function(fcy) { return fcy[1][0][0]+fcy[1][1][0]; }))]);

        xAxisBar = svgBar.append("g")
        .attr("class", "x-axisBar")
        .attr("transform", "translate(0," + heightBar + ")")
        .call(d3.axisBottom(xBar))
    
        xAxisBar.selectAll("text")
        .style("fill", "#E8EDDF")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start")
        .attr("dx", ".71em");
        
        yAxisBar = svgBar.append("g")
        .attr("class", "y-axisBar")
        .attr("x",-5)
        .call(d3.axisLeft(yBar))
    
        yAxisBar.selectAll("text")
        .style("fill", "#E8EDDF")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")


       rectBar=svgBar.selectAll('.group')
        .data(fqcs)
        .attr('class', 'group')
        .enter().append('g')
        .each(function(d, i) {
            var m=0;
            d[1].map( (a,b,c) => {
                d3.select(this)
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('data-index', j)
                    .attr('x', function(e) { return xBar(d[0]); })
                    .attr('width', xBar.bandwidth())
                    .style('fill', function(e) { return a[1]; })
                    .attr('y', function(e) {m+=a[0]; return yBar(m);})
                    .attr('height', function(e) { return heightBar - yBar(a[0]); })
                    .on("click", function(d,i){})
                    .on('mouseenter', function (actual, i) {
                        d3.select(this).attr('opacity', 0.5)
                    })
                    .on('mouseleave', function (actual, i) {
                        d3.select(this).attr('opacity', 1)
                    });
            });
        });

        if(R){
            svgBar.selectAll('rect')
            .on("mouseover", function(d, i) {
                tip1.show(d);
                })
            .on("mouseout", function(d, i) {
                tip1.hide();
            });
        }
        rectBar
            .append("text")
                .attr("class", "barValues")
                .attr("x", function(d) { return xBar(d[0]) + (xBar.bandwidth())/2; })
                .attr("y", function(d) { return yBar(d[1][0][0]+d[1][1][0]) - 8; })
                .style("fill", "#E8EDDF")
                .style("text-anchor", "middle")
                .attr("dy", ".35em")
                .text(function(d) { return d[1][0][0]+d[1][1][0]; }); 
    
        svgBar.append("line")
        .attr("id","limit")
        .attr("x1", xBar(1))
        .attr("x2", widthBar)
        .attr("y1", yBar(media))
        .attr("y2", yBar(media))
        .style("stroke", "white");
        

    }else{
        if(R){
            if(F){
                fqcs=[];
                fqcs = computeFrequencyFR(data);
                xBar.domain(fqcs.map(function(fcy) { return fcy[0]; }));
                yBar.domain([0, d3.max(fqcs.map(function(fcy) { return fcy[1][0]; }))]);
            }else{
                fqcs=[];
                fqcs = computeFrequencyR(data);
                xBar.domain(fqcs.map(function(fcy) { return fcy[0]; }));
                yBar.domain([0, d3.max(fqcs.map(function(fcy) { return fcy[1][0]; }))]);
            }     
        }else{
            if(F){
                fqcs=[];
                fqcs = computeFrequencyF(data);
                xBar.domain(fqcs.map(function(fcy) { return fcy[0]; }));
                yBar.domain([0, d3.max(fqcs.map(function(fcy) { return fcy[1]; }))]);
            }else{
                fqcs=[];
                fqcs = computeFrequency(data);
                xBar.domain(fqcs.map(function(fcy) { return fcy[0]; }));
                yBar.domain([0, d3.max(fqcs.map(function(fcy) { return fcy[1]; }))]);
            }
        }
    
    
        xAxisBar = svgBar.append("g")
        .attr("class", "x-axisBar")
        .attr("transform", "translate(0," + heightBar + ")")
        .call(d3.axisBottom(xBar))
    
        xAxisBar.selectAll("text")
        .style("fill", "#E8EDDF")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start")
        .attr("dx", ".71em");
        
        yAxisBar = svgBar.append("g")
        .attr("class", "y-axisBar")
        .attr("x",-5)
        .call(d3.axisLeft(yBar))
    
        yAxisBar.selectAll("text")
        .style("fill", "#E8EDDF")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
    
        var rectBar = svgBar.selectAll(".bar")
                            .data(fqcs)
                            .enter();
        
        if(R){
            rectBar.append("rect")
        .attr("class", "barRect")
        .attr("x", function(fcy) {return xBar(fcy[0]); })
        .attr("width", xBar.bandwidth)
        .attr("y", function(fcy) { return yBar(fcy[1][0]); })
        .attr("height", function(fcy) { return heightBar - yBar(fcy[1][0]); })
        .attr("fill", function(d){
            if(tutte){
                return "#B80F0A";
            }else{
                if(d[1][1] == manager.place) return "#ffd500";
                else if(d[1][1] == manager.secondPlace) return"#8f00ff";
                else return "#B80F0A";
            }
        })
        .attr("margin-left", "1px").attr("selected",false)
        .on("click", function(d,i){})
        .on('mouseenter', function (actual, i) {
            d3.select(this).attr('opacity', 0.5)
        })
        .on('mouseleave', function (actual, i) {
            d3.select(this).attr('opacity', 1)
        });
    
        rectBar
            .append("text")
                .attr("class", "barValues")
                .attr("x", function(d) { return xBar(d[0]) + (xBar.bandwidth())/2; })
                .attr("y", function(d) { return yBar(d[1][0]) - 8; })
                .style("fill", "#E8EDDF")
                .style("text-anchor", "middle")
                .attr("dy", ".35em")
                .text(function(d) { return d[1][0]; }); 
    
        svgBar.append("line")
        .attr("id","limit")
        .attr("x1", xBar(1))
        .attr("x2", widthBar)
        .attr("y1", yBar(media))
        .attr("y2", yBar(media))
        .style("stroke", "white");
    
        svgBar.selectAll('rect')
            .on("mouseover", function(d, i) {
                tip1.show(d);
                })
            .on("mouseout", function(d, i) {
                tip1.hide();
            });
        }else{
            rectBar.append("rect")
        .attr("class", "barRect")
        .attr("x", function(fcy) {return xBar(fcy[0]); })
        .attr("width", xBar.bandwidth)
        .attr("y", function(fcy) { return yBar(fcy[1]); })
        .attr("height", function(fcy) { return heightBar - yBar(fcy[1]); })
        .attr("fill", function(d){
            if(tutte){
                return "#B80F0A";
            }else{
                if(d[0] == manager.place) return "#ffd500";
                else if(d[0] == manager.secondPlace) return"#8f00ff";
                else return "#B80F0A";
            }
        })
        .attr("margin-left", "1px").attr("selected",false)
        .on("click", function(d,i){})
        .on('mouseenter', function (actual, i) {
            d3.select(this).attr('opacity', 0.5)
        })
        .on('mouseleave', function (actual, i) {
            d3.select(this).attr('opacity', 1)
        });
    
        rectBar
            .append("text")
                .attr("class", "barValues")
                .attr("x", function(d) { return xBar(d[0]) + (xBar.bandwidth())/2; })
                .attr("y", function(d) { return yBar(d[1]) - 8; })
                .style("fill", "#E8EDDF")
                .style("text-anchor", "middle")
                .attr("dy", ".35em")
                .text(function(d) { return d[1]; }); 
    
        svgBar.append("line")
        .attr("id","limit")
        .attr("x1", xBar(1))
        .attr("x2", widthBar)
        .attr("y1", yBar(media))
        .attr("y2", yBar(media))
        .style("stroke", "white");
        }
    } 
}

function bar_getData(){
    return manager.getDataFilteredByParallel();
}

function bar_getDataL(){
    return manager.getDataFilteredByG();
}


function bar_getDT(){
    return manager.getDataFilteredByPlace();
}

manager.addListener('parallelBrushing', function (e) {
    if (manager.filteringByYear){
        svgBar.selectAll("*").remove();
        showValues.checked = false;
        updateChart();
    }
});

manager.addListener('groupChanged', function (e) {
    showValues.checked = false;
    svgBar.selectAll("*").remove();
    if(manager.group==undefined){
        gg=false;
    }
    if(manager.place!=undefined && manager.group!=undefined){
        gg=true;
    }
    updateChart();
});

manager.addListener('yearChanged', function (e) {
    showValues.checked = false;
    svgBar.selectAll("*").remove();
    updateChart();
});

manager.addListener("ludoChanged", function(){
    svgBar.selectAll("*").remove();
    if(manager.place==undefined){
        gg=false;
    }
    if(manager.place!=undefined && manager.group!=undefined){
        gg=true;
    }
    updateChart();
})

showValues.addEventListener("change", function(){
    if(R==true){
        R=false;
        sv.innerHTML="Show Cities";
    }else{
        sv.innerHTML="Show Countries";
        R=true;
    }
    svgBar.selectAll("*").remove();
    updateChart();
})

showValues2.addEventListener("change", function(){
    if(F==true){
        F=false;
        sv2.innerHTML="Show kill";
    }else{
        sv2.innerHTML="Show freq";
        F=true;
    }
    svgBar.selectAll("*").remove();
    updateChart();
})


