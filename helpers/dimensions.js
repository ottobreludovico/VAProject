var margin_parallel = { top: 30, right: 30, bottom: 10, left: 55 },
 width_parallel = (document.getElementById("parallel_area").clientWidth - margin_parallel.left - margin_parallel.right),
 height_parallel = (document.getElementById("parallel_area").clientHeight - margin_parallel.top -margin_parallel.bottom);

var marginBar = {top: 20, right: 25, bottom: 120, left: 40},
 widthBar = (document.getElementById("barChart").clientWidth - marginBar.left - marginBar.right),
 heightBar = (document.getElementById("barChart").clientHeight - marginBar.top - marginBar.bottom);

var marginScatter = {top: 25, right: 60, bottom: 70, left: 40},
 widthScatter = (document.getElementById("scatter_area").clientWidth - marginScatter.left - marginScatter.right),
 heightScatter = (document.getElementById("scatter_area").clientHeight - marginScatter.top - marginScatter.bottom);
 
var marginP = {top: 25, right: 30, bottom: 100, left: 50},
 widthP = (document.getElementById("my_dataviz").clientWidth - marginP.left - marginP.right),
 heightP = (document.getElementById("my_dataviz").clientHeight - marginP.top - marginP.bottom);

 var marginG = {top: 10, right: 0, bottom: 50, left: 150},
 widthG = (document.getElementById("my_dataviz").clientWidth - marginP.left - marginP.right),
 heightG = (document.getElementById("my_dataviz").clientHeight - marginP.top - marginP.bottom);

 var marginL = {top: 25, right: 30, bottom: 100, left: 50},
 widthL = (document.getElementById("my_dataviz").clientWidth - marginL.left - marginL.right),
 heightL = (document.getElementById("my_dataviz").clientHeight - marginL.top - marginL.bottom);

 var marginK = {top: 25, right: 30, bottom: 100, left: 50},
 widthK = (document.getElementById("my_dataviz").clientWidth - marginK.left - marginK.right),
 heightK = (document.getElementById("my_dataviz").clientHeight - marginK.top - marginK.bottom);

 var marginN = {top: 25, right: 30, bottom: 100, left: 50},
 widthN = (document.getElementById("my_dataviz").clientWidth - marginN.left - marginN.right),
 heightN = (document.getElementById("my_dataviz").clientHeight - marginN.top - marginN.bottom);

 /*var marginC = {top: 30, right: 30, bottom: 30, left: 30},
 widthC = (clientWidth - marginC.left - marginC.right)*1,
 heightC = (clientHeight - marginC.top - marginC.bottom)*1;*/