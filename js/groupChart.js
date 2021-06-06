var svg3 = d3.select("#my_dataviz2")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
  .append("g")
    .attr("transform","translate(" + marginG.left + "," + marginG.top + ")");

// Parse the Data
var data=[];
var fqcsg=[];
var p=false;
var aux=false;
var aux2=false;
function group_getData(){
    return manager.getDataFilteredByPlace();
}

function group_getDataAll(){
    return manager.getDataFilteredByYear();
}

function group_getDataT(){
    return manager.getDataFilteredByParallel();
}

function group_getDataG(){
    return manager.getDataFilteredByG();
}

function group_getDataP(){
    return manager.getDataFilteredByParallel();
}


function start2(){
    var fqcsg;
    if(p==true && manager.parallelFiltering==true){
        data = group_getDataP();
        fqcsg=computeFrequencyG(data);
        p=false;
    }
    else if(manager.place==undefined && manager.group==undefined){
        data =group_getDataT();
        fqcsg=computeFrequencyG(data);
    }else if(manager.place!=undefined && manager.group==undefined){
        //data =group_getData();
        data =group_getDataAll();
        fqcsg=computeFrequencyAux2(data);
    }else{
        //data = group_getDataG();
        data =group_getDataAll();
        fqcsg=computeFrequencyAux(data);
    }

  console.log(fqcsg);
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, d3.max(fqcsg.map(function(fcy) { return fcy[1]; }))])
    .range([ 0, widthG-marginG.left+30]);
  svg3.append("g")
    .attr("transform", "translate(0," + heightG + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, heightG ])
    .domain(fqcsg.map(function(fcy) { return fcy[0]; }))
    .padding(.1);
  svg3.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg3.selectAll("myRect")
    .data(fqcsg)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d[0]); })
    .attr("width", function(d) { return x(d[1]); })
    .attr("height", y.bandwidth() )
    .attr("fill", "#B80F0A")


    // .attr("x", function(d) { return x(d.Country); })
    // .attr("y", function(d) { return y(d.Value); })
    // .attr("width", x.bandwidth())
    // .attr("height", function(d) { return height - y(d.Value); })
    // .attr("fill", "#69b3a2")

}

function computeFrequencyG(data){
    var frequency = {};
    var items=[]
    sum=0;
    for (i = 0; i < data.length; i++) {
        target = data[i].targtype1_txt;
        selP=data[i].place;
        if (frequency[target] != undefined){
            if(manager.secondPlace!=undefined){
                if(selP==manager.place || selP==manager.secondPlace){
                    frequency[target] += 1;
                }      
            }else if(manager.place!=undefined){
                if(selP==manager.place){
                    frequency[target] += 1;
                }  
            }else{
                frequency[target] += 1;
            }       
        }
        else{
            if(manager.place!=undefined){
                if(selP==manager.place || selP==manager.secondPlace){
                    frequency[target] = 1;
                } 
            }else{
                frequency[target] = 1;
            }
        }
    }

    items = Object.keys(frequency).map(function (target) {
        return [target, frequency[target]];
    });

    items.sort(function(a, b) {
        return (a[1] < b[1]) ? 1 : -1;;
    });

    return items;
}

function computeFrequencyAux(data){
    if(NAT1==true && NAT2==true){
        var frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
            target = data[i].targtype1_txt;
          if(data[i].place==manager.place && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
          }else if(data[i].place==manager.secondPlace && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
          }
        }
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(NAT1==true && REG2==true){
        console.log("nr");
        frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
          target = data[i].targtype1_txt;
          if(data[i].place==manager.place && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
          }else if(diz[data[i].place][0]==manager.reg2 && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
          }
            
        }
        
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(NAT1==true && CON2==true){
        console.log("nc");
        frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
          target = data[i].targtype1_txt;
          if(data[i].place==manager.place && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
          }else if(diz[data[i].place][1]==manager.con2 && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
           
          }
            
        }
        
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(REG1==true && NAT2==true){
        console.log("rn");
        frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
          target = data[i].targtype1_txt;
          if(diz[data[i].place][0]==manager.reg1 && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }else if(data[i].place==manager.secondPlace && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }
            
        }
        
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(REG1==true && REG2==true){
        console.log("rr");
        frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
            target = data[i].targtype1_txt;
          if(diz[data[i].place][0]==manager.reg1 && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }else if(diz[data[i].place][0]==manager.reg2 && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }       
        }
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(REG1==true && CON2==true){
        console.log("rc");
        frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
            target = data[i].targtype1_txt;
          if(diz[data[i].place][0]==manager.reg1 && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }else if(diz[data[i].place][1]==manager.con2 && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
            
          }     
        }
        
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(CON1==true && NAT2==true){
        console.log("cn");
        frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
            target = data[i].targtype1_txt;
          if(diz[data[i].place][1]==manager.con1 && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }else if(data[i].place==manager.secondPlace && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
           
          }
           
        }
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(CON1==true && REG2==true){
        console.log("cr");
        frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
            target = data[i].targtype1_txt;
          if(diz[data[i].place][1]==manager.con1 && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }else if(diz[data[i].place][0]==manager.reg2 && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
           
          }
            
        }
        
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(CON1==true && CON2==true){
        console.log("cc");
        frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
            target = data[i].targtype1_txt;
          if(diz[data[i].place][1]==manager.con1 && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }else if(diz[data[i].place][1]==manager.con2 && data[i].gname==manager.group){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }      
        }
        
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }

}

function computeFrequencyAux2(data){
    if(NAT1==true && NAT2==true){
        var frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
            target = data[i].targtype1_txt;
            if(data[i].place==manager.place){
                if (frequency[target] != undefined){
                    frequency[target] += 1;  
                }
                else{
                    frequency[target] = 1;
                }
            }else if(data[i].place==manager.secondPlace){
                if (frequency[target] != undefined){
                    frequency[target] += 1;  
                }
                else{
                    frequency[target] = 1;
                }
            }
        }
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(NAT1==true && REG2==true){
        console.log("nr");
        var frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
          target = data[i].targtype1_txt;
          if(data[i].place==manager.place){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
          }else if(diz[data[i].place][0]==manager.reg2){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
          }
            
        }
        
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(NAT1==true && CON2==true){
        console.log("nc");
        var frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
          target = data[i].targtype1_txt;
          if(data[i].place==manager.place){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
          }else if(diz[data[i].place][1]==manager.con2){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
           
          }
            
        }
        
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(REG1==true && NAT2==true){
        console.log("rn");
        var frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
          target = data[i].targtype1_txt;
          if(diz[data[i].place][0]==manager.reg1){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }else if(data[i].place==manager.secondPlace){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }
            
        }
        
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(REG1==true && REG2==true){
        console.log("rr");
        var frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
            target = data[i].targtype1_txt;
          if(diz[data[i].place][0]==manager.reg1){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }else if(diz[data[i].place][0]==manager.reg2){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }       
        }
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(REG1==true && CON2==true){
        console.log("rc");
        var frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
            target = data[i].targtype1_txt;
          if(diz[data[i].place][0]==manager.reg1){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }else if(diz[data[i].place][1]==manager.con2){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
            
          }     
        }
        
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(CON1==true && NAT2==true){
        console.log("cn");
        var frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
            target = data[i].targtype1_txt;
          if(diz[data[i].place][1]==manager.con1){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }else if(data[i].place==manager.secondPlace){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
           
          }
           
        }
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(CON1==true && REG2==true){
        console.log("cr");
        var frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
            target = data[i].targtype1_txt;
          if(diz[data[i].place][1]==manager.con1){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }else if(diz[data[i].place][0]==manager.reg2){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
           
          }
            
        }
        
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }else if(CON1==true && CON2==true){
        console.log("cc");
        var frequency = {};
        var items=[];
        for (i = 0; i < data.length; i++) {
            target = data[i].targtype1_txt;
          if(diz[data[i].place][1]==manager.con1){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }else if(diz[data[i].place][1]==manager.con2){
            if (frequency[target] != undefined){
                frequency[target] += 1;  
            }
            else{
                frequency[target] = 1;
            }
            
          }      
        }
        
        items = Object.keys(frequency).map(function (target) {
            return [target, frequency[target]];
        });
    
        items.sort(function(a, b) {
            return (a[1] < b[1]) ? 1 : -1;;
        });
    
        return items;
      }

}


function groupchart_getdata(){
    return manager.getDataFilteredByG();
}

manager.addListener('groupChanged', function (e){
    svg3.selectAll("*").remove();
    start2();
}) 

manager.addListener('yearChanged', function (e){
    svg3.selectAll("*").remove();
    start2();
}) 

manager.addListener('placeChanged', function (e){
    svg3.selectAll("*").remove();
    start2();
}) 

manager.addListener('dataReady', function (e){
    svg3.selectAll("*").remove();
    start2();
}) 

manager.addListener('parallelBrushing', function (e) {
    if (manager.filteringByYear){
        svg3.selectAll("*").remove();
        p=true;
        start2();
    }
});