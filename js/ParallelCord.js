/*<meta charset="utf-8">
<title>Terrorism Attacks</title>
<!-- Load d3.js -->
<script src="https://d3js.org/d3.v4.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>

<!-- Create a div where the graph will take place -->
<div id="my_dataviz"></div>

<script>
*/
var names = [];

// set the dimensions and margins of the graph
var margin = {top: 30, right: 10, bottom: 10, left: 0},
  width = 500 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("Dataset/globalterrorismdb.csv", function(data) {

    var d = data.filter(function (d) { return d.iyear == "2000" });

  // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
  dimensions = ["attacktype1_txt", "targtype1_txt","gname","weaptype1_txt","nkill"]

    dimensions = [
    {
        name: "attacktype1_txt",
        key: "attack"
      },
      {
        name: "targtype1_txt",
        key: "target"
      },
      {
        name: "gname",
        key: "group"
      },
      {
        name: "weaptype1_txt",
        key: "weap"
      },
      {
        name: "nkill",
        key: "kills"
      },      
    ];

  var y = {}
  for (i in dimensions) {
    j = dimensions[i].key;
    names.push(dimensions[i].name);
    if (j == "attack") {
      attacks = [" "];
      d.forEach(element => {
        if (!attacks.includes(element[j])) {
          attacks.push(element[j])
        }
      });
      attacks.sort();
      attacks.push("  ");
      y[j] = d3.scalePoint()
        .domain(attacks)
        .range([0, height]);
        
    }else if (j == "target") {
      targets = [" "];
      d.forEach(element => {
        if (!targets.includes(element[j])) {
          targets.push(element[j])
        }
      });
      targets.sort();
      targets.push("  ");
      y[j] = d3.scalePoint()
        .domain(targets)
        .range([0, height]);
    }
    else if (j == "group"){
      groups = [" "];
      d.forEach(element => {
        if (!groups.includes(element[j])) {
          groups.push(element[j])
        }
      });
      groups.sort();
      groups.push("  ");
      y[j] = d3.scalePoint()
        .domain(groups)
        .range([0, height]);
    }else if (j == "weap"){
      weaps = [" "];
      d.forEach(element => {
        if (!weaps.includes(element[j])) {
          weaps.push(element[j])
        }
      });
      weaps.sort();
      weaps.push("  ");
      y[j] = d3.scalePoint()
        .domain(weaps)
        .range([0, height]); 
    }else if (j == "kills") {
      kills = [" "];
      d.forEach(element => {
        if (!kills.includes(element[j])) {
          kills.push(element[j])
        }
      });
      kills.sort();
      kills.push("  ");
      y[j] = d3.scalePoint()
        .domain(kills)
        .range([0, height]);  
    }
  
   x = d3.scalePoint()
      .range([0, width])
      .padding(1)
      .domain(names);

}



  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
function path(d) {
  points = [];
  for (i in dimensions) {
    n = dimensions[i].name;
    r = dimensions[i].key;
    points.push([x(n), y[r](d[r])]);
    }
  return d3.line()(points);
}

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(d)
    .enter().append("path")
    .attr("d",  path)
    .style("fill", "none")
    .style("stroke", "#69b3a2")
    .style("opacity", 0.5)

  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d.key])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d.name; })
      .style("fill", "black")

})

//</script>