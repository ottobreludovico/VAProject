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
    .attr("fill", "#574cc2")
    .attr("margin-left", "1px").attr("selected",false)
    .on("click", function(d,i){
        manager.triggerPlaceFilterEvent(d[0],manager.year);
        updateColor();
    })
    .on('mouseenter', function (actual, i) {
        d3.select(this).attr('opacity', 0.5);
        mOver(actual,false);
    })
    .on('mouseleave', function (actual, i) {
        d3.select(this).attr('opacity', 1);
        mOut(actual);
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
    if(REG1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(data[i].region_txt==diz[manager.place][0]){
                country = data[i].region_txt;
                if (frequency[country] != undefined){
                    frequency[country] += 1;
                    sum+=1;
                }
                else{
                    frequency[country] = 1;
                    x+=1;
                }
            }
            if(data[i].place==manager.secondPlace){
                country = data[i].place;
                if (frequency[country] != undefined){
                    frequency[country] += 1;
                    sum+=1;
                }
                else{
                    frequency[country] = 1;
                    x+=1;
                }
            }
          if(x>=1){
              sum+=1;
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
    }else if(REG1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            country = data[i].region_txt;

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
    }else if(REG1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(data[i].region_txt==diz[manager.place][0]){
            
                country = data[i].region_txt;
                if (frequency[country] != undefined){
                    frequency[country] += 1;
                    sum+=1;
                }
                else{
                    x+=1;
                    frequency[country] = 1;
                }
            }if(diz[data[i].place][1]==diz[manager.secondPlace][1]){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    frequency[country] += 1;
                    sum+=1;
                }
                else{
                    x+=1;
                    frequency[country] = 1;
                }
            }
            if(x>=1){
                sum+=1;
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
    }else if(NAT1==true && NAT2==true){
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
    }else if(NAT1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(data[i].place==manager.place){
                country = data[i].place;
                if (frequency[country] != undefined){
                    frequency[country] += 1;
                    sum+=1;
                }
                else{
                    frequency[country] = 1;
                    x+=1;
                }
            }if(data[i].region_txt==diz[manager.secondPlace][0]){
                country = data[i].region_txt;
                if (frequency[country] != undefined){
                    frequency[country] += 1;
                    sum+=1;
                }
                else{
                    frequency[country] = 1;
                    x+=1;
                }
            }
            if(x>=1){
                sum+=1;
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
    }else if(NAT1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(data[i].place==manager.place){
                country = data[i].place;
                if (frequency[country] != undefined){
                    frequency[country] += 1;
                    sum+=1;
                }
                else{
                    frequency[country] = 1;
                    x+=1;
                }
            }if(diz[data[i].place][1]==diz[manager.secondPlace][1]){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    frequency[country] += 1;
                    sum+=1;
                }
                else{
                    frequency[country] = 1;
                    x+=1;
                }
            } 
            if(x>=1){
                sum+=1;
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
    }else if(CON1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][1]==diz[manager.place][1]){
                country = diz[data[i].place][1];
                x=0;
                if (frequency[country] != undefined){
                    frequency[country] += 1;
                    sum+=1;
                }
                else{
                    x+=1;
                    frequency[country] = 1;
                }
            }if(data[i].place==manager.secondPlace){
                country = data[i].place;
                if (frequency[country] != undefined){
                    frequency[country] += 1;
                    sum+=1;
                }
                else{
                    frequency[country] = 1;
                    x+=1;
                }
            }
            if(x>=1){
                sum+=1;
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
    }else if(CON1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][1]==diz[manager.place][1]){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    frequency[country] += 1;
                    sum+=1;
                }
                else{
                    frequency[country] = 1;
                    x+=1;
                }
            }if(data[i].region_txt==diz[manager.secondPlace][0]){
                country = data[i].region_txt;
                if (frequency[country] != undefined){
                    frequency[country] += 1;
                    sum+=1;
                }
                else{
                    frequency[country] = 1;
                    x+=1;
                }
            }
            if(x>1){
                sum+=1; 
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
    }else if(CON1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            country = diz[data[i].place][1];

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
}

function computeFrequencyR(data){
    if(manager.place==undefined){
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
    else if(REG1==true && NAT2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][0]==manager.reg1 || data[i].place==manager.secondPlace){
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

    }else if(REG1==true && REG2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][0]==manager.reg1 || diz[data[i].place][0]==manager.reg2){
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
    }else if(REG1==true && CON2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][0]==manager.reg1 || diz[data[i].place][1]==manager.con2){
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
    }else if(NAT1==true && NAT2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(data[i].place==manager.place || data[i].place==manager.secondPlace){
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
    }else if(NAT1==true && REG2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(data[i].place==manager.place || diz[data[i].place][0]==manager.reg2){
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
    }else if(NAT1==true && CON2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(data[i].place==manager.place || diz[data[i].place][1]==manager.con2){
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
    }else if(CON1==true && NAT2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][1]==manager.con1 || data[i].place==manager.secondPlace){
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
    }else if(CON1==true && REG2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][1]==manager.con1 || diz[data[i].place][0]==manager.reg2){
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
    }else if(CON1==true && CON2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][1]==manager.con1 || diz[data[i].place][1]==manager.con2){
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
}

function computeFrequencyF(data){
    if(REG1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][0]==manager.reg1){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1
                }
            }if(data[i].place==manager.secondPlace){
                country = data[i].place;
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }
            if(x>=1){
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
    }else if(REG1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][0]==manager.reg1){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }if(diz[data[i].place][0]==manager.reg2){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1
                }
            }
            if(x>=1){
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
    }else if(REG1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][0]==manager.reg1){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }if(diz[data[i].place][1]==manager.con2){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }
            if(x>=1){
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
    }else if(NAT1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0
        for (i = 0; i < data.length; i++) {
            x=0;
            country = data[i].place;
            if (frequency[country] != undefined){
                frequency[country] += parseInt(data[i].nkill);
                sum+=parseInt(data[i].nkill);
            }
            else{
                frequency[country] = parseInt(data[i].nkill);
                x+=1;
                
            }
            if(x>=1){
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
    }else if(NAT1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(data[i].place==manager.place){
                country = data[i].place;
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }if(diz[data[i].place][0]==manager.reg2){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }
            if(x>=1){
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
    }else if(NAT1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(data[i].place==manager.place){
                country = data[i].place;
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }if(diz[data[i].place][1]==manager.con2){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }
            if(x>=1){
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
    }else if(CON1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][1]==manager.con1){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }if(data[i].place==manager.secondPlace){
                country = data[i].place;
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }
            if(x>=1){
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
    }else if(CON1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][1]==manager.con1){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }if(diz[data[i].place][0]==manager.reg2){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }
            if(x>=1){
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
    }else if(CON1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][1]==manager.con1){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }if(diz[data[i].place][1]==manager.con2){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    frequency[country] += parseInt(data[i].nkill);
                    sum+=parseInt(data[i].nkill);
                }
                else{
                    frequency[country] = parseInt(data[i].nkill);
                    x+=1;
                }
            }
            if(x>=1){
                sum+=parseInt(data[i].nkill);
            }
        }


        items = Object.keys(frequency).map(function (country) {
            return [country, frequency[country]];
        });
        media=sum/Object.keys(frequency).length;

        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;
        });
        if(items.length>15){
            items.splice(15, items.length);      
        }

        return items;
    }
}

function computeFrequencyFR(data){
    if(manager.place==undefined){
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
    else if(REG1==true && NAT2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][0]==manager.reg1 || data[i].place==manager.secondPlace){
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
    }else if(REG1==true && REG2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][0]==manager.reg1 || diz[data[i].place][0]==manager.reg2){
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
    }else if(REG1==true && CON2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][0]==manager.reg1 || diz[data[i].place][1]==manager.con2){
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

    }else if(NAT1==true && NAT2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(data[i].place==manager.place || data[i].place==manager.secondPlace){
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
    }else if(NAT1==true && REG2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(data[i].place==manager.place || diz[data[i].place][0]==manager.reg2){
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
    }else if(NAT1==true && CON2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(data[i].place==manager.place || diz[data[i].place][1]==manager.con2){
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
    }else if(CON1==true && NAT2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][1]==manager.con1 || data[i].place==manager.secondPlace){
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
    }else if(CON1==true && REG2==true){
        var frequencyR = {};
    sum=0;
    var items2=[];
    for (i = 0; i < data.length; i++) {
        if(diz[data[i].place][1]==manager.con1 || diz[data[i].place][0]==manager.reg2){
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
    }else if(CON1==true && CON2==true){
        var frequencyR = {};
        sum=0;
        var items2=[];
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][1]==manager.con1 || diz[data[i].place][1]==manager.con2){
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
}

function cf(data){
    if(REG1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][0]==manager.reg1){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.reg1){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }
                        sum+=1;          
                    }else{
                        if(country==manager.reg1){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }
                        sum+=1;          
                    }
                     
                }
            }if(data[i].place==manager.secondPlace){
                country = data[i].place;
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.secondPlace){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }
                        sum+=1;          
                    }else{
                        if(country!=manager.secondPlace){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        } 
                        sum+=1;         
                    }   
                }
            }
            if(x>=1){
                sum=sum+1;
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
    }else if(REG1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][0]==manager.reg1){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.reg1){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        } 
                        sum+=1;        
                    }else{
                        if(country==manager.reg1){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        } 
                        sum+=1;       
                    }   
                
                }
            }if(diz[data[i].place][0]==manager.reg2){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.reg2){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }
                        sum+=1;        
                    }else{
                        if(country!=manager.reg2){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }   
                }
            }
            if(x>=1){
                sum=sum+1;
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
    }else if(REG1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][0]==manager.reg1){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.reg1){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }else{
                        if(country==manager.reg1){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        } 
                        sum+=1;       
                    }   
                }
            }if(diz[data[i].place][1]==manager.con2){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.con2){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }   
                        sum+=1;     
                    }else{
                        if(country!=manager.con2){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }   
                }
            }
            if(x>=1){
                sum=sum+1;
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

    }else if(NAT1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(data[i].place==manager.place){
                country = data[i].place;
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.place){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }   
                        sum+=1;     
                    }else{
                        if(country==manager.place){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        } 
                        sum+=1;       
                    }   

                }
            }if(data[i].place==manager.secondPlace){
                country = data[i].place;
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.secondPlace){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }        
                        sum+=1;
                    }else{
                        if(country!=manager.secondPlace){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }    
                        sum+=1;    
                    }              
                }
            }
            if(x>=1){
                sum=sum+1;
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
    }else if(NAT1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(data[i].place==manager.place){
                country = data[i].place;
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.place){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }else{
                        if(country==manager.place){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }    
                        sum+=1;    
                    }   

                }
            }if(diz[data[i].place][0]==manager.reg2){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.reg2){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }else{
                        if(country!=manager.reg2){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        } 
                        sum+=1;       
                    }   
                   
                }
            }
            if(x>=1){
                sum=sum+1;
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
    }else if(NAT1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(data[i].place==manager.place){
                country = data[i].place;
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.place){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        } 
                        sum+=1;       
                    }else{
                        if(country==manager.place){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }   
                }
            }if(diz[data[i].place][1]==manager.con2){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.con2){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }else{
                        if(country!=manager.con2){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }   
                }
            }
            if(x>=1){
                sum=sum+1;
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
    }else if(CON1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][1]==manager.con1){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.con1){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }
                        sum+=1;        
                    }else{
                        if(country==manager.con1){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }   
                        sum+=1;     
                    }   
                }
            }if(data[i].place==manager.secondPlace){
                country = data[i].place;
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.secondPlace){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }
                        sum+=1;        
                    }else{
                        if(country!=manager.secondPlace){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }   
                }
            }
            if(x>=1){
                sum=sum+1;
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
    }else if(CON1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][1]==manager.con1){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.con1){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }else{
                        if(country==manager.con1){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }   
                        sum+=1;     
                    }   
                }
            }if(diz[data[i].place][0]==manager.reg2){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.reg2){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        } 
                        sum+=1;       
                    }else{
                        if(country!=manager.reg2){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }   
                }
            }
            if(x>=1){
                sum=sum+1;
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
    }else if(CON1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][1]==manager.con1){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.con1){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }else{
                        if(country==manager.con1){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }   

                }
            }if(diz[data[i].place][1]==manager.con2){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += 1;
                    }else{
                        frequency[country][1][0] += 1;
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.con2){
                            frequency[country] = [[1,"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[1,"#ff0000"],[0,"#00ffd0"]];
                        } 
                        sum+=1;       
                    }else{
                        if(country!=manager.con2){
                            frequency[country] = [[0,"#ff0000"],[1,"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[1,"#00ffd0"]];
                        }  
                        sum+=1;      
                    }   
                }
            }
            if(x>=1){
                sum=sum+1;
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
}

function cfR(data){   
    if(manager.place==undefined){
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
                    if(data[i].place!=manager.secondPlace){
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(data[i].place!=manager.secondPlace){
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#00ffd0",data[i].place]];
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
    else if(REG1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][0]==manager.reg1 || data[i].place==manager.secondPlace){
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
                    if(data[i].place!=manager.secondPlace){
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(data[i].place!=manager.secondPlace){
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=parseInt(data[i].nkill)
            }
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
    }else if(REG1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][0]==manager.reg1 || diz[data[i].place][0]==manager.reg2){
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
                    if(diz[data[i].place][0]==manager.reg1){
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(diz[data[i].place][0]==manager.reg1){
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=parseInt(data[i].nkill)
            }
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
    }else if(REG1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][0]==manager.reg1 || diz[data[i].place][1]==manager.con2){
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
                    if(diz[data[i].place][0]==manager.reg1){
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(diz[data[i].place][0]==manager.reg1){
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=parseInt(data[i].nkill)
            }
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

    }else if(NAT1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(data[i].place==manager.place || data[i].place==manager.secondPlace){
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
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(data[i].place==manager.place){
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=parseInt(data[i].nkill)
            }
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
    }else if(NAT1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(data[i].place==manager.place || diz[data[i].place][0]==manager.reg2){
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
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(data[i].place==manager.place){
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=parseInt(data[i].nkill)
            }
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
    }else if(NAT1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(data[i].place==manager.place || diz[data[i].place][1]==manager.con2){
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
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(data[i].place==manager.place){
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=parseInt(data[i].nkill)
            }
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
    }else if(CON1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][1]==manager.con1 || data[i].place==manager.secondPlace){
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
                    if(data[i].place!=manager.secondPlace){
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(data[i].place!=manager.secondPlace){
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=parseInt(data[i].nkill)
            }
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
    }else if(CON1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][1]==manager.con1 || diz[data[i].place][0]==manager.reg2){
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
                    if(diz[data[i].place][0]!=manager.reg2){
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(diz[data[i].place][0]!=manager.reg2){
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=parseInt(data[i].nkill)
            }
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
    }else if(CON1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][1]==manager.con1 || diz[data[i].place][1]==manager.con2){
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
                    if(diz[data[i].place][1]==manager.con1){
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[parseInt(data[i].nkill),"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(diz[data[i].place][1]==manager.con1){
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[parseInt(data[i].nkill),"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=parseInt(data[i].nkill)
            }
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
}

function cfF(data){
    if(REG1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][0]==manager.reg1){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.reg1){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        } 
                        sum+=parseInt(data[i].nkill);     
                    }else{
                        if(country==manager.reg1){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }
                        sum+=parseInt(data[i].nkill);        
                    }   
                }
            }if(data[i].place==manager.secondPlace){
                country = data[i].place;
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.secondPlace){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }
                        sum+=parseInt(data[i].nkill);        
                    }else{
                        if(country!=manager.secondPlace){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }
                        sum+=parseInt(data[i].nkill);        
                    }   
                }
            }
            if(x>=1) sum+=parseInt(data[i].nkill)
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
    }else if(REG1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][0]==manager.reg1){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.reg1){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }   
                        sum+=parseInt(data[i].nkill);     
                    }else{
                        if(country==manager.reg1){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }    
                        sum+=parseInt(data[i].nkill);    
                    }   
                }
            }if(diz[data[i].place][0]==manager.reg2){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.reg2){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }    
                        sum+=parseInt(data[i].nkill);    
                    }else{
                        if(country!=manager.reg2){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }  
                        sum+=parseInt(data[i].nkill);      
                    }   
                }
            }
            if(x>=1) sum+=parseInt(data[i].nkill)
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
    }else if(REG1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][0]==manager.reg1){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.reg1){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        } 
                        sum+=parseInt(data[i].nkill);       
                    }else{
                        if(country==manager.reg1){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }  
                        sum+=parseInt(data[i].nkill);      
                    }   
                }
            }if(diz[data[i].place][1]==manager.con2){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.con2){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }   
                        sum+=parseInt(data[i].nkill);     
                    }else{
                        if(country!=manager.con2){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }  
                        sum+=parseInt(data[i].nkill);      
                    }   
                }
            }
            if(x>=1) sum+=parseInt(data[i].nkill)
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

    }else if(NAT1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(data[i].place==manager.place){
                country = data[i].place;
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.place){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }   
                        sum+=parseInt(data[i].nkill);     
                    }else{
                        if(country==manager.place){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }  
                        sum+=parseInt(data[i].nkill);      
                    }   
                }
            }if(data[i].place==manager.secondPlace){
                country = data[i].place;
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.secondPlace){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }  
                        sum+=parseInt(data[i].nkill);      
                    }else{
                        if(country!=manager.secondPlace){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }   
                        sum+=parseInt(data[i].nkill);     
                    }   

                }
            }
            if(x>=1) sum+=parseInt(data[i].nkill)
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
    }else if(NAT1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(data[i].place==manager.place){
                country = data[i].place;
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.place){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }   
                        sum+=parseInt(data[i].nkill);     
                    }else{
                        if(country==manager.place){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }  
                        sum+=parseInt(data[i].nkill);      
                    }   
                }
            }if(diz[data[i].place][0]==manager.reg2){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.reg2){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }       
                        sum+=parseInt(data[i].nkill); 
                    }else{
                        if(country!=manager.reg2){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }       
                        sum+=parseInt(data[i].nkill); 
                    }   
                }
            }
            if(x>=1) sum+=parseInt(data[i].nkill)
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
    }else if(NAT1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(data[i].place==manager.place){
                country = data[i].place;
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.place){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }     
                        sum+=parseInt(data[i].nkill);   
                    }else{
                        if(country==manager.place){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }   
                        sum+=parseInt(data[i].nkill);     
                    }   
                }
            }if(diz[data[i].place][1]==manager.con2){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.con2){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }  
                        sum+=parseInt(data[i].nkill);      
                    }else{
                        if(country!=manager.con2){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }  
                        sum+=parseInt(data[i].nkill);      
                    }   
                }
            }
            if(x>=1) sum+=parseInt(data[i].nkill);
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
    }else if(CON1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][1]==manager.con1){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.con1){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }   
                        sum+=parseInt(data[i].nkill);     
                    }else{
                        if(country==manager.con1){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }  
                        sum+=parseInt(data[i].nkill);      
                    }   
                }
            }if(data[i].place==manager.secondPlace){
                country = data[i].place;
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.secondPlace){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }      
                        sum+=parseInt(data[i].nkill);  
                    }else{
                        if(country!=manager.secondPlace){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }    
                        sum+=parseInt(data[i].nkill);    
                    }   

                }
            }
            if(x>=1) sum+=parseInt(data[i].nkill);  
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
    }else if(CON1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][1]==manager.con1){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.con1){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }    
                        sum+=parseInt(data[i].nkill);    
                    }else{
                        if(country==manager.con1){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }  
                        sum+=parseInt(data[i].nkill);      
                    }   

                }
            }if(diz[data[i].place][0]==manager.reg2){
                country = diz[data[i].place][0];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.reg2){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }     
                        sum+=parseInt(data[i].nkill);   
                    }else{
                        if(country!=manager.reg2){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }  
                        sum+=parseInt(data[i].nkill);      
                    }   
                }
            }
            if(x>=1) sum+=parseInt(data[i].nkill);
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
    }else if(CON1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        x=0;
        for (i = 0; i < data.length; i++) {
            x=0;
            if(diz[data[i].place][1]==manager.con1){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country==manager.con1){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }    
                        sum+=parseInt(data[i].nkill);    
                    }else{
                        if(country==manager.con2){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }else{   
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }   
                        sum+=parseInt(data[i].nkill);     
                    }   
                }
            }if(diz[data[i].place][1]==manager.con2){
                country = diz[data[i].place][1];
                if (frequency[country] != undefined){
                    if(data[i].gname==manager.group){
                        frequency[country][0][0] += parseInt(data[i].nkill);
                    }else{
                        frequency[country][1][0] += parseInt(data[i].nkill);
                    }   
                    x+=1;
                }
                else{
                    if(data[i].gname==manager.group){
                        if(country!=manager.con2){
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#ffdd03"]];
                        }else{
                            frequency[country] = [[parseInt(data[i].nkill),"#ff0000"],[0,"#00ffd0"]];
                        }      
                        sum+=parseInt(data[i].nkill);  
                    }else{
                        if(country==manager.con2){
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#00ffd0"]];
                        }else{
                            frequency[country] = [[0,"#ff0000"],[parseInt(data[i].nkill),"#ffdd03"]];
                        }  
                        sum+=parseInt(data[i].nkill);      
                    }   
                }
            }
            if(x>=1) sum+=parseInt(data[i].nkill);
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
    
}

function cfFR(data){
    if(manager.place==undefined){
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
                    if(data[i].place!=manager.secondPlace){
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(data[i].place!=manager.secondPlace){
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#00ffd0",data[i].place]];
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
    else if(REG1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][0]==manager.reg1 || data[i].place==manager.secondPlace){
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
                    if(data[i].place!=manager.secondPlace){
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(data[i].place!=manager.secondPlace){
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=1
            }
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
    }else if(REG1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][0]==manager.reg1 || diz[data[i].place][0]==manager.reg2){
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
                    if(diz[data[i].place][0]==manager.reg1){
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(diz[data[i].place][0]==manager.reg1){
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=1
            }
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
    }else if(REG1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][0]==manager.reg1 || diz[data[i].place][1]==manager.con2){
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
                    if(diz[data[i].place][0]==manager.reg1){
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(diz[data[i].place][0]==manager.reg1){
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=1
            }
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

    }else if(NAT1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(data[i].place==manager.place || data[i].place==manager.secondPlace){
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
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(data[i].place==manager.place){
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=1
            }
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
    }else if(NAT1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(data[i].place==manager.place || diz[data[i].place][0]==manager.reg2){
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
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(data[i].place==manager.place){
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=1
            }
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
    }else if(NAT1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(data[i].place==manager.place || diz[data[i].place][1]==manager.con2){
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
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(data[i].place==manager.place){
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=1
            }
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
    }else if(CON1==true && NAT2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][1]==manager.con1 || data[i].place==manager.secondPlace){
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
                    if(data[i].place!=manager.secondPlace){
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(data[i].place!=manager.secondPlace){
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=1
            }
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
    }else if(CON1==true && REG2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][1]==manager.con1 || diz[data[i].place][0]==manager.reg2){
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
                    if(diz[data[i].place][0]!=manager.reg2){
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(diz[data[i].place][0]!=manager.reg2){
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=1
            }
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
    }else if(CON1==true && CON2==true){
        var frequency = {};
        var items=[]
        sum=0;
        for (i = 0; i < data.length; i++) {
            if(diz[data[i].place][1]==manager.con1 || diz[data[i].place][1]==manager.con2){
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
                    if(diz[data[i].place][1]==manager.con1){
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[1,"#ff0000",data[i].place],[0,"#00ffd0",data[i].place]];
                    }        
                }else{
                    if(diz[data[i].place][1]==manager.con1){
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#ffdd03",data[i].place]];
                    }else{
                        frequency[country] = [[0,"#ff0000",data[i].place],[1,"#00ffd0",data[i].place]];
                    }        
                }   
                sum+=1
            }
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
    
}


var R=false;
var F=false;
var tutte=true;
function updateChart(){
    svgBar.selectAll("*").remove();
    if(CON1==true || CON2==true){
        data=[];
        data = bar_getDataC();
        tutte=false;
        showValues.checked = false;
    }
    else if((REG2==true || REG1==true) && !(CON1 || CON2)){
        data=[];
        data = bar_getDataR();
        tutte=false;
        showValues.checked = false;
    }
    else if(manager.place==undefined && manager.group!=undefined){
        //gg==false;
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
                fqcs = cfR(data);
            }else{
                fqcs=[];
                fqcs = cfFR(data);
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
                        d3.select(this).attr('opacity', 0.5);
                        if(R){
                            mOver(actual,true);
                        }
                    })
                    .on('mouseleave', function (actual, i) {
                        d3.select(this).attr('opacity', 1);
                        if(R){
                            mOut();
                        }
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
                return "#574cc2";
            }else if(manager.place==undefined){
                if(manager.group!=undefined){
                    return "#ff0000";
                }
            }else if(NAT1==true && NAT2==true){
                if(d[1][1] == manager.place) return "#ffdd03";
                else if(d[1][1] == manager.secondPlace) return "#00ffd0";
                else return "#574cc2";
             }else if(NAT1==true && REG2==true){
                if(d[1][1] == manager.place) return "#ffdd03";
                else if(diz[d[1][1]][0] == manager.reg2) return "#00ffd0";
                else return "#574cc2";
             }else if(NAT1==true && CON2==true){
                if(d[1][1] == manager.place) return "#ffdd03";
                else if(diz[d[1][1]][1] == manager.con2) return "#00ffd0";
                else return "#574cc2";
             }else if(REG1==true && NAT2==true){
                if(diz[d[1][1]][0] == manager.reg1) return "#ffdd03";
                else if(d[1][1] == manager.secondPlace) return "#00ffd0";
                else return "#574cc2";
             }else if(REG1==true && REG2==true){
                if(diz[d[1][1]][0] == manager.reg1) return "#ffdd03";
                else if(diz[d[1][1]][0] == manager.reg2) return "#00ffd0";
                else return "#574cc2";
             }else if(REG1==true && CON2==true){
                if(diz[d[1][1]][0] == manager.reg1) return "#ffdd03";
                else if(diz[d[1][1]][1] == manager.con2) return "#00ffd0";
                else return "#574cc2";
             }else if(CON1==true && NAT2==true){
                if(diz[d[1][1]][1] == manager.con1) return "#ffdd03";
                else if(d[1][1] == manager.secondPlace) return "#00ffd0";
                else return "#574cc2";
             }else if(CON1==true && REG2==true){
                if(diz[d[1][1]][1] == manager.con1) return "#ffdd03";
                else if(diz[d[1][1]][0] == manager.reg2) return "#00ffd0";
                else return "#574cc2";
             }else if(CON1==true && CON2==true){
                if(diz[d[1][1]][1] == manager.con1) return "#ffdd03";
                else if(diz[d[1][1]][1] == manager.con2) return "#00ffd0";
                else return "#574cc2";
            }
        })
        .attr("margin-left", "1px").attr("selected",false)
        .on("click", function(d,i){})
        .on('mouseenter', function (actual, i) {
            d3.select(this).attr('opacity', 0.5);
            mOver(actual,true);
        })
        .on('mouseleave', function (actual, i) {
            d3.select(this).attr('opacity', 1);
            mOut(actual);
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
                if(manager.group!=undefined){
                    return "#ff0000";
                }
                return "#574cc2";
            }else if(manager.place==undefined){
                if(manager.group!=undefined){
                    return "#ff0000";
                }
            }else if(NAT1==true && NAT2==true){
                if(d[0] == manager.place) return "#ffdd03";
                else if(d[0] == manager.secondPlace) return "#00ffd0";
                else return "#574cc2";
             }else if(NAT1==true && REG2==true){
                if(d[0] == manager.place) return "#ffdd03";
                else if(d[0] == manager.reg2) return "#00ffd0";
                else return "#574cc2";
             }else if(NAT1==true && CON2==true){
                if(d[0] == manager.place) return "#ffdd03";
                else if(d[0] == manager.con2) return "#00ffd0";
                else return "#574cc2";
             }else if(REG1==true && NAT2==true){
                if(d[0] == manager.reg1) return "#ffdd03";
                else if(d[0] == manager.secondPlace) return "#00ffd0";
                else return "#574cc2";
             }else if(REG1==true && REG2==true){
                if(d[0] == manager.reg1) return "#ffdd03";
                else if(d[0] == manager.reg2) return "#00ffd0";
                else return "#574cc2";
             }else if(REG1==true && CON2==true){
                if(d[0] == manager.reg1) return "#ffdd03";
                else if(d[0] == manager.con2) return "#00ffd0";
                else return "#574cc2";
             }else if(CON1==true && NAT2==true){
                if(d[0] == manager.con1) return "#ffdd03";
                else if(d[0] == manager.secondPlace) return "#00ffd0";
                else return "#574cc2";
             }else if(CON1==true && REG2==true){
                if(d[0] == manager.con1) return "#ffdd03";
                else if(d[0] == manager.reg2) return "#00ffd0";
                else return "#574cc2";
             }else if(CON1==true && CON2==true){
                if(d[0] == manager.con1) return "#ffdd03";
                else if(d[0] == manager.con2) return "#00ffd0";
                else return "#574cc2";
            }
        })
        .attr("margin-left", "1px").attr("selected",false)
        .on("click", function(d,i){})
        .on('mouseenter', function (actual, i) {
            d3.select(this).attr('opacity', 0.5);
            if(manager.group!=undefined && manager.place==undefined){
                mOver(actual,false);
            }
        })
        .on('mouseleave', function (actual, i) {
            d3.select(this).attr('opacity', 1);
            if(manager.group!=undefined && manager.place==undefined){
                mOut();
            }
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

function bar_getDataR(){
    return manager.getDataByRegion();
}

function bar_getDataC(){
    return manager.getDataByContinent();
}

function bar_getDT(){
    return manager.getDataFilteredByPlace();
}

manager.addListener('parallelBrushing', function (e) {
    if (manager.filteringByYear){
        showValues.checked = false;
        if(ratepop.value=="nuova"){
            mostraPop();
            ratepop.value="nuova";
        }else{
            updateChart();
            ratepop.value="normale";
        } 
    }
});

manager.addListener('groupChanged', function (e) {
    showValues.checked = false;

    if(manager.group==undefined){
        gg=false;
    }
    if(manager.place!=undefined && manager.group!=undefined){
        gg=true;
    }
    if(ratepop.value=="nuova"){
        mostraPop();
        ratepop.value="nuova";
    }else{
        updateChart();
        ratepop.value="normale";
    } 
});

manager.addListener('yearChanged', function (e) {
    showValues.checked = false;
    if(ratepop.value=="nuova"){
        mostraPop();
        ratepop.value="nuova";
    }else{
        updateChart();
        ratepop.value="normale";
    } 
});

/*
manager.addListener("ludoChanged", function(){
    svgBar.selectAll("*").remove();
    if(manager.place==undefined){
        gg=false;
    }
    if(manager.place!=undefined && manager.group!=undefined){
        gg=true;
    }
    updateChart();
})*/

showValues.addEventListener("change", function(){
    if(R==true){
        R=false;
        sv.innerHTML="Show Cities";
    }else{
        sv.innerHTML="Show Countries";
        R=true;
    }

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

    updateChart();
})

function GT(){
    svgBar.selectAll("*").remove();
    if(CON1==true || CON2==true){

       data=[];
       data = bar_getDataC();
       tutte=false;
       showValues.checked = false;
   }
   else if((REG2==true || REG1==true) && !(CON1 || CON2)){

       data=[];
       data = bar_getDataR();
       tutte=false;
       showValues.checked = false;
   }
   else if(manager.place==undefined && manager.group!=undefined){

       gg==false;
       data=[];
       data = bar_getDataL();
       tutte=false;
       showValues.checked = true;
   }else if(manager.place!=undefined && (manager.group!=undefined || manager.group==undefined)){

       data=[];
       data = bar_getDT();
       tutte=false;
       showValues.checked = true;
   }else{

       data=[];
       data = bar_getData();
       tutte=true;
       showValues.checked = false;
   }
   fqcs = computeGT(data);
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
   .attr("fill", "#ff0000")
   .attr("margin-left", "1px").attr("selected",false)
   .on("click", function(d,i){
       vm.$children[0].onChange(d[0])
       sv3.innerHTML="Show GT";
   })
   .on('mouseenter', function (actual, i) {
       d3.select(this).attr('opacity', 0.5);
       mOverGR(actual);
   })
   .on('mouseleave', function (actual, i) {
       d3.select(this).attr('opacity', 1);
       mOut();
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

function computeGT(data){
   if(REG1==true && NAT2==true){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        if(data[i].region_txt==diz[manager.place][0]){
            country = data[i].gname;
            if (frequency[country] != undefined){
                frequency[country] += 1;
                sum+=1;
            }
            else{
                frequency[country] = 1;
                sum+=1
            }
        }
        if(data[i].place==manager.secondPlace){
            country = data[i].gname;
            if (frequency[country] != undefined){
                frequency[country] += 1;
                sum+=1;
            }
            else{
                frequency[country] = 1;
                sum+=1
            }
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
}else if(REG1==true && REG2==true){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        country = data[i].gname;

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
}else if(REG1==true && CON2==true){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        if(data[i].region_txt==diz[manager.place][0]){
            country = data[i].gname;
            if (frequency[country] != undefined){
                frequency[country] += 1;
                sum+=1;
            }
            else{
                frequency[country] = 1;
                sum+=1
            }
        }if(diz[data[i].place][1]==diz[manager.secondPlace][1]){
            country = data[i].gname;
            if (frequency[country] != undefined){
                frequency[country] += 1;
                sum+=1;
            }
            else{
                frequency[country] = 1;
                sum+=1
            }
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
}else if(NAT1==true && NAT2==true){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        country = data[i].gname;
        
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
}else if(NAT1==true && REG2==true){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        if(data[i].place==manager.place){
            country = data[i].gname;
            if (frequency[country] != undefined){
                frequency[country] += 1;
                sum+=1;
            }
            else{
                frequency[country] = 1;
                sum+=1
            }
        }if(data[i].region_txt==diz[manager.secondPlace][0]){
            country = data[i].gname;
            if (frequency[country] != undefined){
                frequency[country] += 1;
                sum+=1;
            }
            else{
                frequency[country] = 1;
                sum+=1
            }
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
}else if(NAT1==true && CON2==true){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        if(data[i].place==manager.place){
            country = data[i].gname;
            if (frequency[country] != undefined){
                frequency[country] += 1;
                sum+=1;
            }
            else{
                frequency[country] = 1;
                sum+=1
            }
        }if(diz[data[i].place][1]==diz[manager.secondPlace][1]){
            country = data[i].gname;
            if (frequency[country] != undefined){
                frequency[country] += 1;
                sum+=1;
            }
            else{
                frequency[country] = 1;
                sum+=1
            }
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
}else if(CON1==true && NAT2==true){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        if(diz[data[i].place][1]==diz[manager.place][1]){
            country = data[i].gname;
            if (frequency[country] != undefined){
                frequency[country] += 1;
                sum+=1;
            }
            else{
                frequency[country] = 1;
                sum+=1
            }
        }if(data[i].place==manager.secondPlace){
            country = data[i].gname;
            if (frequency[country] != undefined){
                frequency[country] += 1;
                sum+=1;
            }
            else{
                frequency[country] = 1;
                sum+=1
            }
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
}else if(CON1==true && REG2==true){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        if(diz[data[i].place][1]==diz[manager.place][1]){
            country = data[i].gname;
            if (frequency[country] != undefined){
                frequency[country] += 1;
                sum+=1;
            }
            else{
                frequency[country] = 1;
                sum+=1
            }
        }if(data[i].region_txt==diz[manager.secondPlace][0]){
            country = data[i].gname;
            if (frequency[country] != undefined){
                frequency[country] += 1;
                sum+=1;
            }
            else{
                frequency[country] = 1;
                sum+=1
            }
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
}else if(CON1==true && CON2==true){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        country = data[i].gname;

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
}


var GT_=false;
showValues3.addEventListener("change", function(){
    if(GT_==true){
        GT_=false;
        sv3.innerHTML="Show GT";
        svgBar.selectAll("*").remove();
        updateChart();
    }else{
        sv3.innerHTML="Hide GT";
        GT_=true;
        svgBar.selectAll("*").remove();
        GT();      
    }
})

var ratepop = document.getElementById("ratepop");
ratepop.addEventListener("change", function(){
    if(ratepop.value=="nuova"){
        document.getElementById("showDiv").style.display = "none";
        document.getElementById("showDiv2").style.display = "none";
        document.getElementById("showDiv3").style.display = "none";
        mostraPop();
    }else{
        document.getElementById("showDiv").style.display = null;
        document.getElementById("showDiv2").style.display = null;
        document.getElementById("showDiv3").style.display = null;
        updateChart();
    }
    
})



function mostraPop(){
    svgBar.selectAll("*").remove();
    var data = bar_getData();
    tutte=true;
    showValues.checked = false;
    fqcs = computeRate(data);
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
    .attr("fill", "#95AEC9")
    .attr("margin-left", "1px").attr("selected",false)
 
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
    .attr("y1", yBar(media2))
    .attr("y2", yBar(media2))
    .style("stroke", "white");
}

var media2;

function computeRate(data){
    var ccc=0;
    var sum2=0.0;
    var frequency = {};
    var items=[];
    for (i = 0; i < data.length; i++) {
        country = data[i].place;
        if (frequency[country] != undefined){
            frequency[country] += parseInt(data[i].nkill);
        }
        else{
            frequency[country] = parseInt(data[i].nkill);
        }
    }

    items = Object.keys(frequency).map(function (country) {
        if(manager.mrate[country]!=undefined && manager.pop[country]!=undefined){
            sum2+=parseFloat(((((frequency[country]*100000/parseInt(manager.pop[country]))/(manager.mrate[country]))* 100) / 100).toFixed(2));
            ccc+=1;
            return [country, (Math.round(((frequency[country]*100000/parseInt(manager.pop[country]))/(manager.mrate[country])) * 100) / 100).toFixed(2)];
        }else{
            return [country, 0];
        }
    });
    
    console.log(sum2);
    console.log(ccc);
    media2=sum2/ccc;

    items.sort(function(a, b) {
        return (a[1] < b[1]) ? 1 : -1;;
    });
    if(items.length>15){
        items.splice(15, items.length);      
    }

    return items;
}