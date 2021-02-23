var svg3 = d3.select("#my_dataviz2")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
  .append("g")
    .attr("transform","translate(" + marginG.left + "," + marginG.top + ")");

// Parse the Data
var data=[];
var fqcsg=[];

function group_getData(){
    return manager.getDataFilteredByPlace();
}

function group_getDataT(){
return manager.getDataFilteredByYear();
}

function group_getDataG(){
return manager.getDataFilteredByG();
}


function start2(){
    if(manager.place==undefined && manager.group==undefined){
        data =group_getDataT();
    }else{
    data = group_getDataG();
    }
  fqcsg=computeFrequencyG(data);
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

function groupchart_getdata(){
    return manager.getDataFilteredByG();
}

manager.addListener('groupChanged', function (e){
    var q=document.getElementById("my_dataviz");
    var q1=document.getElementById("my_dataviz2");
    if(manager.group!=undefined && manager.place!=undefined){
        q.style.display="none";
        q1.style.display="block";
        svg3.selectAll("*").remove();
        start2();
    }else{
        q.style.display="block";
        q1.style.display="none";
    }
}) 

manager.addListener('yearChanged', function (e){
    svg3.selectAll("*").remove();
    start2();
}) 

manager.addListener('placeChanged', function (e){
    svg3.selectAll("*").remove();
    start2();
}) 
