// DEFINE VARIABLES
// Define size of map group
// Full world map is 2:1 ratio
// Using 12:5 because we will crop top and bottom of map
w = 3000;
h = 2000;
op = 0.8;
raggio = 4;
// variables for catching min and max zoom factors
var minZoom;
var maxZoom;

var c1=document.getElementById("continent1");
var r1=document.getElementById("region1");
var n1=document.getElementById("nation1");
var c2=document.getElementById("continent2");
var r2=document.getElementById("region2");
var n2=document.getElementById("nation2");

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

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<i>Group name: </i><strong>"+d.gname+"</strong><p><i>Victims: </i><strong>"+d.nkill+"</strong></p>";
  })

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
});

// create an SVG
var svg1 = d3
  .select("#map-holder")
  .append("svg")
  // set to the same size as the "map-holder" div
  .attr("width", "100%")
  .attr("height", "100%")
  // add zoom functionality
  .call(zoom)
  .call(tip);


var data1=[];

manager.addListener('dataReady', function (e) {
  d3.json(
    "https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json", function(json) {
      //Bind data and create one path per GeoJSON feature
      data1=map_getData();
    
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
          if (manager.parallelFiltering){
            manager._updateDataFromYear();
            updatePoint2();
          }
          if (d.properties.name != manager.place && d.properties.name != manager.secondPlace){
            var selectedYear = yearSelector.value.split("-")[0];
          
            
            //
            if (!manager.compareMode){
              d3.selectAll(".country").classed("country-on", false);
            }
            else if (manager.secondPlace != undefined) {
                //d3.selectAll(".country").classed("country-on", function(d){
                // if(d.properties.name == manager.place) return true;
                  //return false;
                //});
              //}
                if(NAT1==true && NAT2==true){
                    d3.selectAll(".country").classed("country-on", function(d){
                                if(d.properties.name == manager.place) return true;
                                else if(d.properties.name == manager.secondPlace) return true;
                                else return false;
                              });
                }else if(NAT1==true && REG2==true){
                  d3.selectAll(".country").classed("country-on", function(d){
                                if(d.properties.name == manager.place) return true;
                                else if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                                else return false;
                              });  
                }else if(NAT1==true && CON2==true){
                  d3.selectAll(".country").classed("country-on", function(d){
                                if(d.properties.name == manager.place) return true;
                                else if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                                else return false;
                              });    
                }else if(REG1==true && NAT2==true){
                  d3.selectAll(".country").classed("country-on", function(d){
                                if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                                else if(d.properties.name == manager.secondPlace) return true;
                                else return false;
                              });    
                }else if(REG1==true && REG2==true){
                  d3.selectAll(".country").classed("country-on", function(d){
                                if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                                else if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                                else return false;
                              });    
                }else if(REG1==true && CON2==true){
                  d3.selectAll(".country").classed("country-on", function(d){
                                if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                                else if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                                else return false;
                              });    
                }else if(CON1==true && NAT2==true){
                  d3.selectAll(".country").classed("country-on", function(d){
                                if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                                else if(d.properties.name == manager.secondPlace) return true;
                                else return false;
                              });    
                }else if(CON1==true && REG2==true){
                  d3.selectAll(".country").classed("country-on", function(d){
                                if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                                else if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                                else return false;
                              });    
                }else if(CON1==true && CON2==true){
                  d3.selectAll(".country").classed("country-on", function(d){
                                if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                                else if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                                else return false;
                              });    
                  }
            }
            manager.triggerPlaceFilterEvent(d.properties.name, selectedYear);
            manager.notifyTriggerLudo()
    
            if(NAT1==true && NAT2==true){
                d3.selectAll(".country").classed("country-on", function(d){
                            if(d.properties.name == manager.place) return true;
                            else if(d.properties.name == manager.secondPlace) return true;
                            else return false;
                          });
            }else if(NAT1==true && REG2==true){
              d3.selectAll(".country").classed("country-on", function(d){
                            if(d.properties.name == manager.place) return true;
                            else if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                            else return false;
                          });  
            }else if(NAT1==true && CON2==true){
              d3.selectAll(".country").classed("country-on", function(d){
                            if(d.properties.name == manager.place) return true;
                            else if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                            else return false;
                          });    
            }else if(REG1==true && NAT2==true){
              d3.selectAll(".country").classed("country-on", function(d){
                            if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                            else if(d.properties.name == manager.secondPlace) return true;
                            else return false;
                          });    
            }else if(REG1==true && REG2==true){
              d3.selectAll(".country").classed("country-on", function(d){
                            if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                            else if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                            else return false;
                          });    
            }else if(REG1==true && CON2==true){
              d3.selectAll(".country").classed("country-on", function(d){
                            if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                            else if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                            else return false;
                          });    
            }else if(CON1==true && NAT2==true){
              d3.selectAll(".country").classed("country-on", function(d){
                            if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                            else if(d.properties.name == manager.secondPlace) return true;
                            else return false;
                          });    
            }else if(CON1==true && REG2==true){
              d3.selectAll(".country").classed("country-on", function(d){
                            if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                            else if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                            else return false;
                          });    
            }else if(CON1==true && CON2==true){
              d3.selectAll(".country").classed("country-on", function(d){
                            if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                            else if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                            else return false;
                          });    
            }
            if(!manager.compareMode)boxZoom(pathM.bounds(d), pathM.centroid(d), 20);
            else{
              initiateZoom();
            }
            d3.selectAll(".circleMap")
            .style("fill", function(d){return ccolor(d)})
            .style("stroke", function(d){return ccolor(d)})
            .style("opacity", op)
          }
          else{
            ("aooooooooooooooooooooooooooooooooooooooooooooooooooooo")
            var selectedYear = yearSelector.value.split("-")[0];
            if (d.properties.name == manager.place && manager.secondPlace != undefined){
              manager.place = manager.secondPlace;
             // place1Div.innerHTML = manager.place;
             // place2Div.innerHTML = "";
              manager.secondPlace = undefined;
              n2.innerHTML = "No selected place";
              r2.innerHTML = "No selected place";
              c2.innerHTML = "No selected place";
              if(NAT1==true && NAT2==true){
                d3.selectAll(".country").classed("country-on", function(d){
                             if(d.properties.name == manager.place) return true;
                             else if(d.properties.name == manager.secondPlace) return true;
                             else return false;
                           });
             }else if(NAT1==true && REG2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(d.properties.name == manager.place) return true;
                             else if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                             else return false;
                           });  
             }else if(NAT1==true && CON2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(d.properties.name == manager.place) return true;
                             else if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                             else return false;
                           });    
             }else if(REG1==true && NAT2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                             else if(d.properties.name == manager.secondPlace) return true;
                             else return false;
                           });    
             }else if(REG1==true && REG2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                             else if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                             else return false;
                           });    
             }else if(REG1==true && CON2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                             else if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                             else return false;
                           });    
             }else if(CON1==true && NAT2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                             else if(d.properties.name == manager.secondPlace) return true;
                             else return false;
                           });    
             }else if(CON1==true && REG2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                             else if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                             else return false;
                           });    
             }else if(CON1==true && CON2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                             else if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                             else return false;
                           });    
             }
              d3.selectAll(".circleMap")
              .style("fill", function(d){return ccolor(d)})
              .style("stroke", function(d){return ccolor(d)})
              .style("opacity", op)
              var nameCountry = manager.place
              manager.place = undefined;
             // place1Div.innerHTML = "";
              manager.triggerPlaceFilterEvent(nameCountry, selectedYear);
              manager.notifyTriggerLudo()
            }
            else if (d.properties.name == manager.place && manager.secondPlace == undefined){
              ("aooooooooo");
              manager.place = undefined;
              n1.innerHTML = "No selected place";
              r1.innerHTML = "No selected place";
              c1.innerHTML = "No selected place";
              //place1Div.innerHTML = "";
              d3.selectAll(".country").classed("country-on", function(d){
                return false;
              });   
              manager.triggerYearFilterEvent(selectedYear);
              manager.notifyTriggerLudo()
              updatePoint();
              updatePoint2();
            }
            else if (d.properties.name == manager.secondPlace){
              manager.secondPlace = undefined;
              //place2Div.innerHTML = "";
              n2.innerHTML = "No selected place";
              r2.innerHTML = "No selected place";
              c2.innerHTML = "No selected place";
              if(NAT1==true && NAT2==true){
                d3.selectAll(".country").classed("country-on", function(d){
                             if(d.properties.name == manager.place) return true;
                             else if(d.properties.name == manager.secondPlace) return true;
                             else return false;
                           });
             }else if(NAT1==true && REG2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(d.properties.name == manager.place) return true;
                             else if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                             else return false;
                           });  
             }else if(NAT1==true && CON2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(d.properties.name == manager.place) return true;
                             else if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                             else return false;
                           });    
             }else if(REG1==true && NAT2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                             else if(d.properties.name == manager.secondPlace) return true;
                             else return false;
                           });    
             }else if(REG1==true && REG2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                             else if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                             else return false;
                           });    
             }else if(REG1==true && CON2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                             else if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                             else return false;
                           });    
             }else if(CON1==true && NAT2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                             else if(d.properties.name == manager.secondPlace) return true;
                             else return false;
                           });    
             }else if(CON1==true && REG2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                             else if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                             else return false;
                           });    
             }else if(CON1==true && CON2==true){
               d3.selectAll(".country").classed("country-on", function(d){
                             if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                             else if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                             else return false;
                           });    
             }
              d3.selectAll(".circleMap")
              .style("fill", function(d){return ccolor(d)})
              .style("stroke", function(d){return ccolor(d)})
              .style("opacity", op)
              var nameCountry = manager.place
              manager.place = undefined;
              manager.triggerPlaceFilterEvent(nameCountry, selectedYear);
              manager.notifyTriggerLudo()
            }
          }
          
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
        .attr("cx", function (dM) { return projection([dM["longitude"], dM["latitude"]])[0]; })
        .attr("cy", function (dM) { return projection([dM["longitude"], dM["latitude"]])[1]; })
        .attr("r",raggio)
        .attr("stroke-width", 2)
        .style("fill", function(d){return ccolor(d)})
        .style("opacity", op)
        .style("stroke", function(d){return ccolor(d)})
        .on("mouseover", function(d, i) {
          tip.show(d);
        })
        .on("mouseout", function(d, i) {
           tip.hide();
        });
      
    }
  );  
});
// get map data
function map_getData(){
	return manager.getDataFilteredByParallel();
}

function map_getDataMap(){
	return manager.getDataFilteredByMap();
}

function mapG_getData(){
  return manager.getDataFilteredByG();
}

manager.addListener('yearChanged', function (e) {
	updatePoint3()
})  

function updatePoint2(){
	circle=countriesGroup
	.selectAll(".circleMap")
	.style("fill", function(d){
    if(manager.parallelFiltering){
      if(manager.filteringByScatterplot(d) && manager.filteringByParallel(d)){
        return ccolor(d);
      }if(manager.filteringByParallel(d)){
        return ccolor(d);
      }else{
        if(NAT1==true && NAT2==true){
          if(d.place == manager.place) return "white";
          if(d.place == manager.secondPlace) return "white";
          else return "#b3b1b1";
        }else if(NAT1==true && REG2==true){
          if(d.place == manager.place) return "white";
          if(diz[d.place][0] == diz[manager.secondPlace][0]) return "white";
          else return "#b3b1b1";
        }else if(NAT1==true && CON2==true){
          if(d.place == manager.place) return "white";
          if(diz[d.place][1] == diz[manager.secondPlace][1]) return "white";
          else return "#b3b1b1";
        }else if(REG1==true && NAT2==true){
          if(diz[d.place][0] == diz[manager.place][0]) return "white";
          if(d.place == manager.secondPlace) return "white";
          else return "#b3b1b1";
        }else if(REG1==true && REG2==true){
          if(diz[d.place][0] == diz[manager.place][0]) return "white";
          if(diz[d.place][0] == diz[manager.secondPlace][0]) return "white";
          else return "#b3b1b1";
        }else if(REG1==true && CON2==true){   
          if(diz[d.place][0] == diz[manager.place][0]) return "white";
          if(diz[d.place][1] == diz[manager.secondPlace][1]) return "white";
          else return "#b3b1b1";
        }else if(CON1==true && NAT2==true){
          if(diz[d.place][1] == diz[manager.place][1]) return "white";
          if(d.place == manager.secondPlace) return "white"; 
          else return "#b3b1b1";          
        }else if(CON1==true && REG2==true){
          if(diz[d.place][1] == diz[manager.place][1]) return "white";
          if(diz[d.place][0] == diz[manager.secondPlace][0]) return "white"; 
          else return "#b3b1b1";
        }else if(CON1==true && CON2==true){
          if(diz[d.place][1] == diz[manager.place][1]) return "white";
          if(diz[d.place][1] == diz[manager.secondPlace][1]) return "white";
          else return "#b3b1b1";
        }
      }
    }else{
      if(manager.filteringByScatterplot(d)){
        return ccolor(d);
      }else{
        if(manager.place==undefined){
          return "#574cc2";
        }
        return "#b3b1b1"
        }
      }
  })
  .style("opacity", function(d){
    return opacityScatter(d);
  })/*
  .style("stroke-opacity", function(d){
    if(!manager.filteringByParallel(d)){
      return 0;
    }
  })*/
  .style("stroke", function(d){
    return strokeScatter(d);
  })
  .on("mouseover", function(d, i) {
    tip.show(d);
  })
  .on("mouseout", function(d, i) {
     tip.hide();
  });
			
	/*		
	circle=countriesGroup
		.selectAll(".circleMap")
		.data(newdataM)
		.enter()
		.append("circle")
		.attr("class","circleMap")
		.attr("cx", function (dM) { return projection([dM["longitude"], dM["latitude"]])[0]; })
		.attr("cy", function (dM) { return projection([dM["longitude"], dM["latitude"]])[1]; })
		.attr("r", 3).attr("stroke-width", 6)
		.style("fill", function(d){
			if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace!=undefined){
        if (d.place == manager.place && d.gname==manager.group) {return "#ffdd03";}
        else if (d.place == manager.place && d.gname!=manager.group) {return "#ff0000";}
        else if (d.place == manager.secondPlace && d.gname!=manager.group) {return "#ff0000";}
        else if (d.place == manager.secondPlace && d.gname==manager.group) return "#00c29e";
        else return "#b3b1b1";
      }
      else if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace==undefined){
        if (d.place == manager.place && d.gname==manager.group) {return "#ffdd03";}
        else if (d.place == manager.place && d.gname!=manager.group) {return "#ff0000";}
        else return "#b3b1b1";
      }else if(manager.group!=undefined && manager.place==undefined){
        if (d.gname == manager.group) {return "#ff0000";}
        else return "#b3b1b1";
      }else if(manager.group==undefined && manager.place!=undefined){
        if (d.place == manager.place) {return "#ffdd03";}
        else if (d.place == manager.secondPlace) return "#00c29e";
        else return "#b3b1b1";
      }else{
        return "#ff0000"
      }
		})
		.style("stroke", "#000")*/
}

function updatePoint3(){
  newdataM = [];

  data1=[]
	data1 = map_getDataMap();
	circle=countriesGroup
	.selectAll(".circleMap")
	.remove()
	.exit();
  
	circle=countriesGroup
		.selectAll(".circleMap")
		.data(data1)
		.enter()
		.append("circle")
		.attr("class","circleMap")
		.attr("cx", function (dM) { return projection([dM["longitude"], dM["latitude"]])[0]; })
		.attr("cy", function (dM) { return projection([dM["longitude"], dM["latitude"]])[1]; })
		.attr("r",raggio)
    .attr("stroke-width", 2)
    .style("opacity", op)
    .style("fill", function(d){return ccolor(d)})
    .style("stroke", function(d){return ccolor(d)})
    .on("mouseover", function(d, i) {
      tip.show(d);
    })
    .on("mouseout", function(d, i) {
       tip.hide();
    });
}

manager.addListener('groupChanged', function (e) {
  if(manager.group==undefined){
      d3.selectAll(".circleMap")
      .data(data1)
      .transition()
      .duration(130)
      .style("opacity", op)
      .style("fill", function(d){return ccolor(d)})
      .style("stroke", function(d){return ccolor(d)})
      .on("mouseover", function(d, i) {
        tip.show(d);
      })
      .on("mouseout", function(d, i) {
         tip.hide();
      });
  }else{
    d3.selectAll(".circleMap")
    .data(data1)
    .transition()
    .duration(130)
    .style("opacity", op)
    .style("stroke", function(d){return ccolor(d)})
    .style("fill", function(d){return ccolor(d)})
    .on("mouseover", function(d, i) {
      tip.show(d);
    })
    .on("mouseout", function(d, i) {
       tip.hide();
    });
  }
});

manager.addListener('scatterplotBrushing', function (e) {
	d3.selectAll(".circleMap")
	.transition()
	.duration(130)
	.style('stroke', function(d){return strokeScatter(d)})
  .style('opacity', function(d){return opacityScatter(d)})
});

manager.addListener('parallelBrushing', function (e) { 
  updatePoint2(); 
});

function strokeScatter(d){
  if(manager.parallelFiltering){
    if(manager.filteringByScatterplot(d) && manager.filteringByParallel(d)){
      if(NAT1==true && NAT2==true){
        if(manager.place!=undefined){
          if(d.place == manager.place) return "#22ff00";
          if(d.place == manager.secondPlace) return "#22ff00";
          else return "#b3b1b1";
        }else{
          return "#22ff00"
        }  
      }else if(NAT1==true && REG2==true){
        if(d.place == manager.place) return "#22ff00";
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return "#22ff00";
        else return "#b3b1b1";
      }else if(NAT1==true && CON2==true){
        if(d.place == manager.place) return "#22ff00";
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return "#22ff00";
        else return "#b3b1b1";
      }else if(REG1==true && NAT2==true){
        if(diz[d.place][0] == diz[manager.place][0]) return "#22ff00";
        if(d.place == manager.secondPlace) return "#22ff00";
        else return "#b3b1b1";
      }else if(REG1==true && REG2==true){
        if(diz[d.place][0] == diz[manager.place][0]) return "#22ff00";
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return "#22ff00";
        else return "#b3b1b1";
      }else if(REG1==true && CON2==true){   
        if(diz[d.place][0] == diz[manager.place][0]) return "#22ff00";
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return "#22ff00";
        else return "#b3b1b1";
      }else if(CON1==true && NAT2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return "#22ff00";
        if(d.place == manager.secondPlace) return "#22ff00"; 
        else return "#b3b1b1";    
      }else if(CON1==true && REG2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return "#22ff00";
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return "#22ff00";
        else return "#b3b1b1";
      }else if(CON1==true && CON2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return "#22ff00";
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return "#22ff00";
        else return "#b3b1b1";
      }
    }if(manager.filteringByParallel(d)){
      return ccolor(d);
    }else{
      if(NAT1==true && NAT2==true){
        if(manager.place!=undefined){
          if(d.place == manager.place) return "white";
          if(d.place == manager.secondPlace) return "white";
          else return "#b3b1b1";
        }else{
          return "#b3b1b1";
        }   
      }else if(NAT1==true && REG2==true){
        if(d.place == manager.place) return "white";
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return "white";
        else return "#b3b1b1";
      }else if(NAT1==true && CON2==true){
        if(d.place == manager.place) return "white";
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return "white";
        else return "#b3b1b1";
      }else if(REG1==true && NAT2==true){
        if(diz[d.place][0] == diz[manager.place][0]) return "white";
        if(d.place == manager.secondPlace) return "white";
        else return "#b3b1b1";
      }else if(REG1==true && REG2==true){
        if(diz[d.place][0] == diz[manager.place][0]) return "white";
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return "white";
        else return "#b3b1b1";
      }else if(REG1==true && CON2==true){   
        if(diz[d.place][0] == diz[manager.place][0]) return "white";
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return "white";
        else return "#b3b1b1";
      }else if(CON1==true && NAT2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return "white";
        if(d.place == manager.secondPlace) return "white";       
        else return "#b3b1b1";    
      }else if(CON1==true && REG2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return "white";
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return "white"; 
        else return "#b3b1b1";
      }else if(CON1==true && CON2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return "white";
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return "white";
        else return "#b3b1b1";
      }
    }
  }else{
    if(manager.filteringByScatterplot(d)){
      if(NAT1==true && NAT2==true){
        if(manager.place!=undefined){
          if(d.place == manager.place) return "#22ff00";
          if(d.place == manager.secondPlace) return "#22ff00";
          else return "#b3b1b1";
        }else{
          return "#22ff00";
        }  
      }else if(NAT1==true && REG2==true){
        if(d.place == manager.place) return "#22ff00";
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return "#22ff00";
        else return "#b3b1b1";
      }else if(NAT1==true && CON2==true){
        if(d.place == manager.place) return "#22ff00";
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return "#22ff00";
        else return "#b3b1b1";
      }else if(REG1==true && NAT2==true){
        if(diz[d.place][0] == diz[manager.place][0]) return "#22ff00";
        if(d.place == manager.secondPlace) return "#22ff00";
        else return "#b3b1b1";
      }else if(REG1==true && REG2==true){
        if(diz[d.place][0] == diz[manager.place][0]) return "#22ff00";
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return "#22ff00";
        else return "#b3b1b1";
      }else if(REG1==true && CON2==true){   
        if(diz[d.place][0] == diz[manager.place][0]) return "#22ff00";
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return "#22ff00";
        else return "#b3b1b1";
      }else if(CON1==true && NAT2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return "#22ff00";
        if(d.place == manager.secondPlace) return "#22ff00"; 
        else return "#b3b1b1";    
      }else if(CON1==true && REG2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return "#22ff00";
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return "#22ff00";
        else return "#b3b1b1";
      }else if(CON1==true && CON2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return "#22ff00";
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return "#22ff00";
        else return "#b3b1b1";
      }
    }else{
      if(NAT1==true && NAT2==true){
        if(manager.place!=undefined){
          if(d.place == manager.place) return ccolor(d);
          if(d.place == manager.secondPlace) return ccolor(d);
          else return "#b3b1b1";
        }else{
          return "#574cc2";
        }
      }else if(NAT1==true && REG2==true){
        if(d.place == manager.place) return ccolor(d);
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return ccolor(d);
        else return "#b3b1b1";
      }else if(NAT1==true && CON2==true){
        if(d.place == manager.place) return ccolor(d);
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return ccolor(d);
        else return "#b3b1b1";
      }else if(REG1==true && NAT2==true){
        if(diz[d.place][0] == diz[manager.place][0]) return ccolor(d);
        if(d.place == manager.secondPlace) return ccolor(d);
        else return "#b3b1b1";
      }else if(REG1==true && REG2==true){
        if(diz[d.place][0] == diz[manager.place][0]) return ccolor(d);
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return ccolor(d);
        else return "#b3b1b1";
      }else if(REG1==true && CON2==true){   
        if(diz[d.place][0] == diz[manager.place][0]) return ccolor(d);
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return ccolor(d);
        else return "#b3b1b1";
      }else if(CON1==true && NAT2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return ccolor(d);
        if(d.place == manager.secondPlace) return ccolor(d);
        else return "#b3b1b1";    
      }else if(CON1==true && REG2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return ccolor(d);
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return ccolor(d);
        else return "#b3b1b1";
      }else if(CON1==true && CON2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return ccolor(d);
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return ccolor(d);
        else return "#b3b1b1";
      }
    }
  }
  
}

function opacityScatter(d){
  if(manager.parallelFiltering){
    if(manager.filteringByScatterplot(d) && manager.filteringByParallel(d)){
      if(NAT1==true && NAT2==true){
        if(manager.place!=undefined){
          if(d.place == manager.place) return 1;
          if(d.place == manager.secondPlace) return 1;
          else return op;
        }else{
          return 1;
        }
      }else if(NAT1==true && REG2==true){
        if(d.place == manager.place) return 1;
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return 1;
        else return op;
      }else if(NAT1==true && CON2==true){
        if(d.place == manager.place) return 1;
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return 1;
        else return op;
      }else if(REG1==true && NAT2==true){
        if(diz[d.place][0] == diz[manager.place][0]) return 1;
        if(d.place == manager.secondPlace) return 1;
        else return op;
      }else if(REG1==true && REG2==true){
        if(diz[d.place][0] == diz[manager.place][0]) return 1;
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return 1;
        else return op;
      }else if(REG1==true && CON2==true){   
        if(diz[d.place][0] == diz[manager.place][0]) return 1;
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return 1;
        else return op;
      }else if(CON1==true && NAT2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return 1;
        if(d.place == manager.secondPlace) return 1;
        else return op;
      }else if(CON1==true && REG2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return 1;
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return 1;
        else return op;
      }else if(CON1==true && CON2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return 1;
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return 1;
        else return op;
      }
    }else if(manager.filteringByParallel(d)){
      return op;
    }else{
      return op;
    }
  }else{
    if(manager.filteringByScatterplot(d)){
       if(NAT1==true && NAT2==true){
        if(manager.place!=undefined){
          if(d.place == manager.place) return 1;
          if(d.place == manager.secondPlace) return 1;
          else return op;
        }else{
          return 1;
        }
      }else if(NAT1==true && REG2==true){
        if(d.place == manager.place) return 1;
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return 1;
        else return op;
      }else if(NAT1==true && CON2==true){
        if(d.place == manager.place) return 1;
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return 1;
        else return op;
      }else if(REG1==true && NAT2==true){
        if(diz[d.place][0] == diz[manager.place][0]) return 1;
        if(d.place == manager.secondPlace) return 1;
        else return op;
      }else if(REG1==true && REG2==true){
        if(diz[d.place][0] == diz[manager.place][0]) return 1;
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return 1;
        else return op;
      }else if(REG1==true && CON2==true){   
        if(diz[d.place][0] == diz[manager.place][0]) return 1;
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return 1;
        else return op;
      }else if(CON1==true && NAT2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return 1;
        if(d.place == manager.secondPlace) return 1;
        else return op;
      }else if(CON1==true && REG2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return 1;
        if(diz[d.place][0] == diz[manager.secondPlace][0]) return 1;
        else return op;
      }else if(CON1==true && CON2==true){
        if(diz[d.place][1] == diz[manager.place][1]) return 1;
        if(diz[d.place][1] == diz[manager.secondPlace][1]) return 1;
        else return op;
      }
    }else{
      return op;
    }
  }
   
}

function updatePoint(){

	d3.json(
		"https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json",
		function(json) {

			countriesM = countriesGroup
				.selectAll("path")
				.data(json.features)
				.attr("id", function(dM, i) {
				  	d3.selectAll(".country").classed("country-on", false);
					boxZoom(pathM.bounds(dM), pathM.centroid(dM), 10);
				});
		}
	);
}

function update() {
	d3.selectAll(".circleMap")
		.attr("cx", function (dM) { return projection([dM["longitude"], dM["latitude"]])[0]; })
		.attr("cy", function (dM) { return projection([dM["longitude"], dM["latitude"]])[1]; })
}

function updateColor(){
  if(NAT1==true && NAT2==true){
      d3.selectAll(".country").classed("country-on", function(d){
                  if(d.properties.name == manager.place) return true;
                  if(d.properties.name == manager.secondPlace) return true;
                  return false;
                });
  }if(NAT1==true && REG2==true){
    d3.selectAll(".country").classed("country-on", function(d){
                  if(d.properties.name == manager.place) return true;
                  if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                  return false;
                });  
  }if(NAT1==true && CON2==true){
    d3.selectAll(".country").classed("country-on", function(d){
                  if(d.properties.name == manager.place) return true;
                  if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                  return false;
                });    
  }if(REG1==true && NAT2==true){
    d3.selectAll(".country").classed("country-on", function(d){
                  if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                  if(d.properties.name == manager.secondPlace) return true;
                  return false;
                });    
  }if(REG1==true && REG2==true){
    d3.selectAll(".country").classed("country-on", function(d){
                  if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                  if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                });    
  }if(REG1==true && CON2==true){
    d3.selectAll(".country").classed("country-on", function(d){
                  if(diz[d.properties.name][0] == diz[manager.place][0]) return true;
                  if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                  return false;
                });    
  }if(CON1==true && NAT2==true){
    d3.selectAll(".country").classed("country-on", function(d){
                  if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                  if(d.properties.name == manager.secondPlace) return true;
                  return false;
                });    
  }if(CON1==true && REG2==true){
    d3.selectAll(".country").classed("country-on", function(d){
                  if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                  if(diz[d.properties.name][0] == diz[manager.secondPlace][0]) return true;
                  return false;
                });    
  }if(CON1==true && CON2==true){
    d3.selectAll(".country").classed("country-on", function(d){
                  if(diz[d.properties.name][1] == diz[manager.place][1]) return true;
                  if(diz[d.properties.name][1] == diz[manager.secondPlace][1]) return true;
                  return false;
                });    
  }
  if(manager.group==undefined){
    d3.selectAll(".circleMap")
    .data(data1)
    .transition()
    .duration(130)
    .style("opacity", op)
    .style("fill", function(d){return ccolor(d)})
    .style("stroke", function(d){return ccolor(d)})
    .on("mouseover", function(d, i) {
      tip.show(d);
    })
    .on("mouseout", function(d, i) {
       tip.hide();
    });
}else{
  d3.selectAll(".circleMap")
  .data(data1)
  .transition()
  .duration(130)
  .style("opacity", op)
  .style("stroke", function(d){return ccolor(d)})
  .style("fill", function(d){return ccolor(d)})
  .on("mouseover", function(d, i) {
    tip.show(d);
  })
  .on("mouseout", function(d, i) {
     tip.hide();
  });
}
}

var clickk=false;
function underline(x){
  if(clickk==false){
    clickk=true;
  }else{
    clickk=false;
  }
  if(clickk==true){
    d3.selectAll(".circleMap")
    .data(data1)
    .transition()
    .duration(130)
    .style("opacity",function(d){
      if(x.min<=d.nkill<=x.max){
      
      }
    })
    .style("fill", function(d){return ccolor(d)})
    .style("stroke", function(d){return ccolor(d)})
    .on("mouseover", function(d, i) {
      tip.show(d);
    })
    .on("mouseout", function(d, i) {
       tip.hide();
    });
  }else{
    d3.selectAll(".circleMap")
    .data(data1)
    .transition()
    .duration(130)
    .style("opacity",function(d){
        
    })
    .style("fill", function(d){return ccolor(d)})
    .style("stroke", function(d){return ccolor(d)})
    .on("mouseover", function(d, i) {
      tip.show(d);
    })
    .on("mouseout", function(d, i) {
       tip.hide();
    });
  }
 
}

function ccolor(d){
    if(REG1==true && NAT2==true){
      if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (diz[d.place][0] == diz[manager.place][0] && d.gname==manager.group) {return "#ff0000";}
          else if (diz[d.place][0] == diz[manager.place][0] && d.gname!=manager.group && d.place!=manager.secondPlace) {return "#ffdd03";}
          else if (d.place == manager.secondPlace && d.gname!=manager.group) {return "#00c29e";}
          else if (d.place == manager.secondPlace && d.gname==manager.group) return "#ff0000";
          else return "#b3b1b1";
        }
        else if(manager.group==undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (diz[d.place][0] == diz[manager.place][0] && d.place!=manager.secondPlace) {return "#ffdd03";}
          else if (d.place == manager.secondPlace) return "#00c29e";
          else return "#b3b1b1";
        }
        else if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace==undefined){
          if (diz[d.place][0] == diz[manager.place][0] && d.gname==manager.group) {return "#ff0000";}
          else if (diz[d.place][0] == diz[manager.place][0] && d.gname!=manager.group && d.place!=manager.secondPlace) {return "#ffdd03";}
          else return "#b3b1b1";
        }else if(manager.group!=undefined && manager.place==undefined){
          if (d.gname == manager.group) {return "#ff0000";}
          else return "#b3b1b1";
        }else if(manager.group==undefined && manager.place!=undefined){
          if (diz[d.place][0] == diz[manager.place][0] && d.place!=manager.secondPlace) {return "#ffdd03";}
          else if (d.place == manager.secondPlace) return "#00c29e";
          else return "#b3b1b1";
        }else{
          return "#574cc2";
        }
  }else if(REG1==true && REG2==true){
    if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace!=undefined){
        if (diz[d.place][0] == diz[manager.place][0] && d.gname==manager.group) {return "#ff0000";}
        else if (diz[d.place][0] == diz[manager.place][0] && d.gname!=manager.group) {return "#ffdd03";}
        else if (diz[d.place][0] == diz[manager.secondPlace][0] && d.gname!=manager.group) {return "#00c29e";}
        else if (diz[d.place][0] == diz[manager.secondPlace][0] && d.gname==manager.group) return "#ff0000";
        else return "#b3b1b1";
        }
        else if(manager.group==undefined && manager.place!=undefined && manager.secondPlace!=undefined){
        if (diz[d.place][0] == diz[manager.place][0]) {return "#ffdd03";}
        else if (diz[d.place][0] == diz[manager.secondPlace][0]) return "#00c29e";
        else return "#b3b1b1";
        }
        else if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace==undefined){
        if (diz[d.place][0] == diz[manager.place][0] && d.gname==manager.group) {return "#ff0000";}
        else if (diz[d.place][0] == diz[manager.place][0] && d.gname!=manager.group) {return "#ffdd03";}
        else return "#b3b1b1";
        }else if(manager.group!=undefined && manager.place==undefined){
        if (d.gname == manager.group) {return "#ff0000";}
        else return "#b3b1b1";
        }else if(manager.group==undefined && manager.place!=undefined){
        if (diz[d.place][0] == diz[manager.place][0]) {return "#ffdd03";}
        else if (diz[d.place][0] == diz[manager.secondPlace][0]) return "#00c29e";
        else return "#b3b1b1";
        }else{
        return "#574cc2";
        }
  }else if(REG1==true && CON2==true){
      if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (diz[d.place][0] == diz[manager.place][0] && d.gname==manager.group) {return "#ff0000";}
          else if (diz[d.place][0] == diz[manager.place][0] && d.gname!=manager.group) {return "#ffdd03";}
          else if (diz[d.place][1] == diz[manager.secondPlace][1] && d.gname!=manager.group && diz[d.place][0]!=diz[manager.place][0]) {return "#00c29e";}
          else if (diz[d.place][1] == diz[manager.secondPlace][1] && d.gname==manager.group) return "#ff0000";
          else return "#b3b1b1";
        }
        else if(manager.group==undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (diz[d.place][0] == diz[manager.place][0]) {return "#ffdd03";}
          else if (diz[d.place][1] == diz[manager.secondPlace][1] && diz[d.place][0]!=diz[manager.place][0]) return "#00c29e";
          else return "#b3b1b1";
        }
        else if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace==undefined){
          if (diz[d.place][0] == diz[manager.place][0] && d.gname==manager.group) {return "#ff0000";}
          else if (diz[d.place][0] == diz[manager.place][0] && d.gname!=manager.group) {return "#ffdd03";}
          else return "#b3b1b1";
        }else if(manager.group!=undefined && manager.place==undefined){
          if (d.gname == manager.group) {return "#ff0000";}
          else return "#b3b1b1";
        }else if(manager.group==undefined && manager.place!=undefined){
          if (diz[d.place][0] == diz[manager.place][0]) {return "#ffdd03";}
          else if (diz[d.place][1] == diz[manager.secondPlace][1] && diz[d.place][0]!=diz[manager.place][0]) return "#00c29e";
          else return "#b3b1b1";
        }else{
          return "#574cc2";
        }
  }else if(NAT1==true && NAT2==true){
      if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (d.place == manager.place && d.gname==manager.group) {return "#ff0000";}
          else if (d.place == manager.place && d.gname!=manager.group) {return "#ffdd03";}
          else if (d.place == manager.secondPlace && d.gname!=manager.group) {return "#00c29e";}
          else if (d.place == manager.secondPlace && d.gname==manager.group) return "#ff0000";
          else return "#b3b1b1";
        }
        else if(manager.group==undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (d.place == manager.place) {return "#ffdd03";}
          else if (d.place == manager.secondPlace) return "#00c29e";
          else return "#b3b1b1";
        }
        else if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace==undefined){
          if (d.place == manager.place && d.gname==manager.group) {return "#ff0000";}
          else if (d.place == manager.place && d.gname!=manager.group) {return "#ffdd03";}
          else return "#b3b1b1";
        }else if(manager.group!=undefined && manager.place==undefined){
          if (d.gname == manager.group) {return "#ff0000";}
          else return "#b3b1b1";
        }else if(manager.group==undefined && manager.place!=undefined){
          if (d.place == manager.place) {return "#ffdd03";}
          else if (d.place == manager.secondPlace) return "#00c29e";
          else return "#b3b1b1";
        }else{
          return "#574cc2";
        }
  }else if(NAT1==true && REG2==true){
      if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (d.place == manager.place && d.gname==manager.group) {return "#ff0000";}
          else if (d.place == manager.place && d.gname!=manager.group) {return "#ffdd03";}
          else if (diz[d.place][0] == diz[manager.secondPlace][0] && d.gname!=manager.group && d.place!=manager.place) {return "#00c29e";}
          else if (diz[d.place][0] == diz[manager.secondPlace][0] && d.gname==manager.group) return "#ff0000";
          else return "#b3b1b1";
        }
        else if(manager.group==undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (d.place == manager.place) {return "#ffdd03";}
          else if (diz[d.place][0] == diz[manager.secondPlace][0] && d.place!=manager.place) return "#00c29e";
          else return "#b3b1b1";
        }
        else if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace==undefined){
          if (d.place == manager.place && d.gname==manager.group) {return "#ff0000";}
          else if (d.place == manager.place && d.gname!=manager.group) {return "#ffdd03";}
          else return "#b3b1b1";
        }else if(manager.group!=undefined && manager.place==undefined){
          if (d.gname == manager.group) {return "#ff0000";}
          else return "#b3b1b1";
        }else if(manager.group==undefined && manager.place!=undefined){
          if (d.place == manager.place) {return "#ffdd03";}
          else if (diz[d.place][0] == diz[manager.secondPlace][0] && d.place!=manager.place) return "#00c29e";
          else return "#b3b1b1";
        }else{
          return "#574cc2";
        }
  }else if(NAT1==true && CON2==true){
      if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (d.place == manager.place && d.gname==manager.group) {return "#ff0000";}
          else if (d.place == manager.place && d.gname!=manager.group) {return "#ffdd03";}
          else if (diz[d.place][1] == diz[manager.secondPlace][1] && d.gname!=manager.group && d.place!=manager.place) {return "#00c29e";}
          else if (diz[d.place][1] == diz[manager.secondPlace][1] && d.gname==manager.group) return "#ff0000";
          else return "#b3b1b1";
        }
        else if(manager.group==undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (d.place == manager.place) {return "#ffdd03";}
          else if (diz[d.place][1] == diz[manager.secondPlace][1] && d.place!=manager.place) return "#00c29e";
          else return "#b3b1b1";
        }
        else if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace==undefined){
          if (d.place == manager.place && d.gname==manager.group) {return "#ff0000";}
          else if (d.place == manager.place && d.gname!=manager.group) {return "#ffdd03";}
          else return "#b3b1b1";
        }else if(manager.group!=undefined && manager.place==undefined){
          if (d.gname == manager.group) {return "#ff0000";}
          else return "#b3b1b1";
        }else if(manager.group==undefined && manager.place!=undefined){
          if (d.place == manager.place) {return "#ffdd03";}
          else if (diz[d.place][1] == diz[manager.secondPlace][1] && d.place!=manager.place) return "#00c29e";
          else return "#b3b1b1";
        }else{
          return "#574cc2";
        }
  }else if(CON1==true && NAT2==true){
      if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (diz[d.place][1] == diz[manager.place][1] && d.gname==manager.group) {return "#ff0000";}
          else if (diz[d.place][1] == diz[manager.place][1] && d.gname!=manager.group && d.place!=manager.secondPlace) {return "#ffdd03";}
          else if (d.place == manager.secondPlace && d.gname!=manager.group) {return "#00c29e";}
          else if (d.place == manager.secondPlace && d.gname==manager.group) return "#ff0000";
          else return "#b3b1b1";
        }
        else if(manager.group==undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (diz[d.place][1] == diz[manager.place][1] && d.place!=manager.secondPlace) {return "#ffdd03";}
          else if (d.place == manager.secondPlace) return "#00c29e";
          else return "#b3b1b1";
        }
        else if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace==undefined){
          if (diz[d.place][1] == diz[manager.place][1] && d.gname==manager.group) {return "#ff0000";}
          else if (diz[d.place][1] == diz[manager.place][1] && d.gname!=manager.group && d.place!=manager.secondPlace) {return "#ffdd03";}
          else return "#b3b1b1";
        }else if(manager.group!=undefined && manager.place==undefined){
          if (d.gname == manager.group) {return "#ff0000";}
          else return "#b3b1b1";
        }else if(manager.group==undefined && manager.place!=undefined){
          if (diz[d.place][1] == diz[manager.place][1] && d.place!=manager.secondPlace) {return "#ffdd03";}
          else if (d.place == manager.secondPlace) return "#00c29e";
          else return "#b3b1b1";
        }else{
          return "#574cc2";
        }
  }else if(CON1==true && REG2==true){
      if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (diz[d.place][1] == diz[manager.place][1] && d.gname==manager.group) {return "#ff0000";}
          else if (diz[d.place][1] == diz[manager.place][1] && d.gname!=manager.group && diz[d.place][0]!=manager.reg2) {return "#ffdd03";}
          else if (diz[d.place][0] == diz[manager.secondPlace][0] && d.gname!=manager.group) {return "#00c29e";}
          else if (diz[d.place][0] == diz[manager.secondPlace][0] && d.gname==manager.group) return "#ff0000";
          else return "#b3b1b1";
        }
        else if(manager.group==undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (diz[d.place][1] == diz[manager.place][1] && diz[d.place][0]!=manager.reg2) {return "#ffdd03";}
          else if (diz[d.place][0] == diz[manager.secondPlace][0]) return "#00c29e";
          else return "#b3b1b1";
        }
        else if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace==undefined){
          if (diz[d.place][1] == diz[manager.place][1] && d.gname==manager.group ) {return "#ff0000";}
          else if (diz[d.place][1] == diz[manager.place][1] && d.gname!=manager.group && diz[d.place][0]!=manager.reg2) {return "#ffdd03";}
          else return "#b3b1b1";
        }else if(manager.group!=undefined && manager.place==undefined){
          if (d.gname == manager.group) {return "#ff0000";}
          else return "#b3b1b1";
        }else if(manager.group==undefined && manager.place!=undefined){
          if (diz[d.place][1] == diz[manager.place][1] && diz[d.place][0]!=manager.reg2) {return "#ffdd03";}
          else if (diz[d.place][0] == diz[manager.secondPlace][0]) return "#00c29e";
          else return "#b3b1b1";
        }else{
          return "#574cc2";
        }
      
  }else if(CON1==true && CON2==true){
      if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (diz[d.place][1] == diz[manager.place][1] && d.gname==manager.group) {return "#ff0000";}
          else if (diz[d.place][1] == diz[manager.place][1] && d.gname!=manager.group) {return "#ffdd03";}
          else if (diz[d.place][1] == diz[manager.secondPlace][1] && d.gname!=manager.group) {return "#00c29e";}
          else if (diz[d.place][1] == diz[manager.secondPlace][1] && d.gname==manager.group) return "#ff0000";
          else return "#b3b1b1";
        }
        else if(manager.group==undefined && manager.place!=undefined && manager.secondPlace!=undefined){
          if (diz[d.place][1] == diz[manager.place][1]) {return "#ffdd03";}
          else if (diz[d.place][1] == diz[manager.secondPlace][1]) return "#00c29e";
          else return "#b3b1b1";
        }
        else if(manager.group!=undefined && manager.place!=undefined && manager.secondPlace==undefined){
          if (diz[d.place][1] == diz[manager.place][1] && d.gname==manager.group) {return "#ff0000";}
          else if (diz[d.place][1] == diz[manager.place][1] && d.gname!=manager.group) {return "#ffdd03";}
          else return "#b3b1b1";
        }else if(manager.group!=undefined && manager.place==undefined){
          if (d.gname == manager.group) {return "#ff0000";}
          else return "#b3b1b1";
        }else if(manager.group==undefined && manager.place!=undefined){
          if (diz[d.place][1] == diz[manager.place][1]) {return "#ffdd03";}
          else if (diz[d.place][1] == diz[manager.secondPlace][1]) return "#00c29e";
          else return "#b3b1b1";
        }else{
          return "#574cc2";
        }
  }
}

function setOpacity(s){
  op=s;
  if(op<=0.20){
   raggio=7;
  }else if(op<=0.4){
   raggio=6;
  }else if(op<=0.6){
   raggio=5;
  }else if(op<=0.8){
    raggio=4;
  }else{
   raggio=3;
  }
  d3.selectAll(".circleMap")
  .transition()
  .duration(130)
  .attr("r", raggio)
  .style("opacity", function(d){
    return opacityScatter(d);
  })
}

function mOver(dd,c){
  console.log(dd);
  d3.selectAll(".circleMap")
    .transition()
    .duration(130)
    .style("opacity",function(d){
      if(c){
        if(d.provstate!=dd[0]){
          return 0;
        }
      }else{
        if(d.place!=dd[0]){
          return 0;
        }
      }  
    })
    .style("fill", function(d){return ccolor(d)})
    .style("stroke", function(d){return ccolor(d)})
    .on("mouseover", function(d, i) {
      tip.show(d);
    })
    .on("mouseout", function(d, i) {
       tip.hide();
    });
}

function mOverG(dd){
  console.log(dd);
  d3.selectAll(".circleMap")
    .transition()
    .duration(130)
    .style("opacity",function(d){
      if(d.targtype1_txt!=dd[0]){
        return 0;
      }
    })
    .style("fill", function(d){return ccolor(d)})
    .style("stroke", function(d){return ccolor(d)})
    .on("mouseover", function(d, i) {
      tip.show(d);
    })
    .on("mouseout", function(d, i) {
       tip.hide();
    });
}


function mOverGR(dd){
  console.log(dd);
  d3.selectAll(".circleMap")
    .transition()
    .duration(130)
    .style("opacity",function(d){
      if(d.gname!=dd[0]){
        return 0;
      }
    })
    .style("fill", function(d){return ccolor(d)})
    .style("stroke", function(d){return ccolor(d)})
    .on("mouseover", function(d, i) {
      tip.show(d);
    })
    .on("mouseout", function(d, i) {
       tip.hide();
    });
}



function mOut(dd){
  d3.selectAll(".circleMap")
    .transition()
    .duration(130)
    .style("opacity",function(d){
      return opacityScatter(d);
    })
    .style("fill", function(d){return ccolor(d)})
    .style("stroke", function(d){return ccolor(d)})
    .on("mouseover", function(d, i) {
      tip.show(d);
    })
    .on("mouseout", function(d, i) {
       tip.hide();
    });
}