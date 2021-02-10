// DEFINE VARIABLES
// Define size of map group
// Full world map is 2:1 ratio
// Using 12:5 because we will crop top and bottom of map
w = 3000;
h = 1250;
// variables for catching min and max zoom factors
var minZoom;
var maxZoom;

// DEFINE FUNCTIONS/OBJECTS
// Define map projection
var projection = d3
  .geoEquirectangular()
  .center([0, 15]) // set centre to further North as we are cropping more off bottom of map
  .scale([w / (2 * Math.PI)]) // scale to fit group width
  .translate([w / 2, h / 2]) // ensure centred in group
;

// Define map path
var pathM = d3
  .geoPath()
  .projection(projection)
;

// Create function to apply zoom to countriesGroup
function zoomed() {
  t = d3
    .event
    .transform
  ;
  countriesGroup
    .attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")")
  ;
}

// Define map zoom behaviour
var zoom = d3
  .zoom()
  .on("zoom", zoomed)
;

function getTextBox(selection) {
  selection
    .each(function(d) {
      d.bbox = this
        .getBBox();
      })
  ;
}

// Function that calculates zoom/pan limits and sets zoom to default value 
function initiateZoom() {
  // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
  minZoom = Math.max($("#map-holder").width() / w, $("#map-holder").height() / h);
  // set max zoom to a suitable factor of this value
  maxZoom = 20 * minZoom;
  // set extent of zoom to chosen values
  // set translate extent so that panning can't cause map to move out of viewport
  zoom
    .scaleExtent([minZoom, maxZoom])
    .translateExtent([[0, 0], [w, h]])
  ;
  // define X and Y offset for centre of map to be shown in centre of holder
  midX = ($("#map-holder").width() - minZoom * w) / 2;
  midY = ($("#map-holder").height() - minZoom * h) / 2;
  // change zoom transform to min zoom and centre offsets
  svg1.call(zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(minZoom));
}

// zoom to show a bounding box, with optional additional padding as percentage of box size
function boxZoom(box, centroid, paddingPerc) {
  minXY = box[0];
  maxXY = box[1];
  // find size of map area defined
  zoomWidth = Math.abs(minXY[0] - maxXY[0]);
  zoomHeight = Math.abs(minXY[1] - maxXY[1]);
  // find midpoint of map area defined
  zoomMidX = centroid[0];
  zoomMidY = centroid[1];
  // increase map area to include padding
  zoomWidth = zoomWidth * (1 + paddingPerc / 100);
  zoomHeight = zoomHeight * (1 + paddingPerc / 100);
  // find scale required for area to fill svg
  maxXscale = $("svg").width() / zoomWidth;
  maxYscale = $("svg").height() / zoomHeight;
  zoomScale = Math.min(maxXscale, maxYscale);
  // handle some edge cases
  // limit to max zoom (handles tiny countries)
  zoomScale = Math.min(zoomScale, maxZoom);
  // limit to min zoom (handles large countries and countries that span the date line)
  zoomScale = Math.max(zoomScale, minZoom);
  // Find screen pixel equivalent once scaled
  offsetX = zoomScale * zoomMidX;
  offsetY = zoomScale * zoomMidY;
  // Find offset to centre, making sure no gap at left or top of holder
  dleft = Math.min(0, $("svg").width() / 2 - offsetX);
  dtop = Math.min(0, $("svg").height() / 2 - offsetY);
  // Make sure no gap at bottom or right of holder
  dleft = Math.max($("svg").width() - w * zoomScale, dleft);
  dtop = Math.max($("svg").height() - h * zoomScale, dtop);
  // set zoom
  svg1
    .transition()
    .duration(500)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
    );
}




// on window resize
$(window).resize(function() {
  // Resize SVG
  svg1
    .attr("width", $("#map-holder").width())
    .attr("height", $("#map-holder").height())
  ;
  initiateZoom();
});

// create an SVG
var svg1 = d3
  .select("#map-holder")
  .append("svg")
  // set to the same size as the "map-holder" div
  .attr("width", $("#map-holder").width())
  .attr("height", $("#map-holder").height())
  // add zoom functionality
  .call(zoom)
;


var data1=[];

manager.addListener('dataReady', function (e) {
  d3.json(
    "https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json", function(json) {
      //Bind data and create one path per GeoJSON feature
      data1=map_getData();
      console.log(data1);
      countriesGroup = svg1.append("g").attr("id", "map");
      // add a background rectangle
      countriesGroup
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h);
  
      // draw a path for each feature/country
      countries = countriesGroup
        .selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", pathM)
        .attr("id", function(d, i) {
          return "country" + d.properties.iso_a3;
        })
        .attr("class", "country")
  //      .attr("stroke-width", 10)
  //      .attr("stroke", "#ff0000")
        // add a mouseover action to show name label for feature/country
        .on("mouseover", function(d, i) {
            d3.select("#countryLabel" + d.properties.iso_a3).style("display", "block");
        })
        .on("mouseout", function(d, i) {
            d3.select("#countryLabel" + d.properties.iso_a3).style("display", "none");
        })
        // add an onclick action to zoom into clicked country
        .on("click", function(d, i) {
            d3.selectAll(".country").classed("country-on", false);
            d3.select(this).classed("country-on", true);
        boxZoom(pathM.bounds(d), pathM.centroid(d), 20);
        });
      // Add a label group to each feature/country. This will contain the country name and a background rectangle
      // Use CSS to have class "countryLabel" initially hidden
      countryLabels = countriesGroup
        .selectAll("g")
        .data(json.features)
        .enter()
        .append("g")
        .attr("class", "countryLabel")
        .attr("id", function(d) {
          return "countryLabel" + d.properties.iso_a3;
        })
        .attr("transform", function(d) {
          return (
            "translate(" + pathM.centroid(d)[0] + "," + pathM.centroid(d)[1] + ")"
          );
        })
        // add mouseover functionality to the label
        .on("mouseover", function(d, i) {
            d3.select(this).style("display", "block");
        })
        .on("mouseout", function(d, i) {
             d3.select(this).style("display", "none");
       })
        // add an onlcick action to zoom into clicked country
        .on("click", function(d, i) {
            d3.selectAll(".country").classed("country-on", false);
            d3.select("#country" + d.properties.iso_a3).classed("country-on", true);
          boxZoom(pathM.bounds(d), pathM.centroid(d), 20);
        });
      // add the text to the label group showing country name
      countryLabels
        .append("text")
        .attr("class", "countryName")
        .style("text-anchor", "middle")
        .attr("dx", 0)
        .attr("dy", 0)
        .text(function(d) {
          return d.properties.name;
        })
        .call(getTextBox);
      // add a background rectangle the same size as the text
      countryLabels
        .insert("rect", "text")
        .attr("class", "countryLabelBg")
        .attr("transform", function(d) {
          return "translate(" + (d.bbox.x - 2) + "," + d.bbox.y + ")";
        })
        .attr("width", function(d) {
          return d.bbox.width + 4;
        })
        .attr("height", function(d) {
          return d.bbox.height;
        });
      initiateZoom();
  
      circle=countriesGroup
        .selectAll(".circleMap")
        .data(data1)
        .enter()
        .append("circle")
        .attr("class","circleMap")
        .attr("cx", function (dM) { return projection([+dM["longitude"], +dM["latitude"]])[0]; })
        .attr("cy", function (dM) { return projection([+dM["longitude"], +dM["latitude"]])[1]; })
        .attr("r", 5)
        .style("fill", function(d){
          return "#B80F0A";
        })
        .style("stroke", "#000")
      
    }
  );  
});
// get map data
function map_getData(){
	return manager.getDataFilteredByParallel();
}

manager.addListener('yearChanged', function (e) {
	updatePoint3()
})  

function updatePoint3(){
	newdataM = [];
	newdataM = map_getData();

	circle=countriesGroup
	.selectAll(".circleMap")
	.remove()
	.exit();

	circle=countriesGroup
		.selectAll(".circleMap")
		.data(newdataM)
		.enter()
		.append("circle")
		.attr("class","circleMap")
		.attr("cx", function (dM) { return projection([+dM["longitude"], +dM["latitude"]])[0]; })
		.attr("cy", function (dM) { return projection([+dM["longitude"], +dM["latitude"]])[1]; })
		.attr("r", 5)
		.style("fill", "#B80F0A")
		.style("stroke", "#000")
	
}