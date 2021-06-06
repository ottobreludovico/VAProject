var nkillDiv = document.getElementById("nkillPanel");
var showValues = document.getElementById("showValues");
var showValues2 = document.getElementById("showValues2");
var sv = document.getElementById("sv");
var sv2 = document.getElementById("sv2");
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var place1Div = document.getElementById("place1");
var place2Div = document.getElementById("place2");


var diz={
  "Azerbaijan":["Central Asia", "Asia"], "Kazakhstan":["Central Asia", "Asia"], "Georgia":["Central Asia", "Asia"], "Armenia":["Central Asia", "Asia"], "Tajikistan":["Central Asia", "Asia"], "Uzbekistan":["Central Asia", "Asia"], "Kyrgyzstan":["Central Asia", "Asia"], "Turkmenistan":["Central Asia", "Asia"], 
  "India":["South Asia", "Asia"], "Pakistan":["South Asia", "Asia"], "Sri Lanka":["South Asia", "Asia"], "Afghanistan":["South Asia", "Asia"], "Bangladesh":["South Asia", "Asia"], "Nepal":["South Asia", "Asia"], "Maldives":["South Asia", "Asia"], "Bhutan":["South Asia", "Asia"], 
  "Korea":["East Asia", "Asia"], "Japan":["East Asia", "Asia"], "China":["East Asia", "Asia"], "Taiwan":["East Asia", "Asia"], "Hong Kong":["East Asia", "Asia"], "Dem. Rep. Korea":["East Asia", "Asia"], "Macau":["East Asia", "Asia"], 
  "Philippines":["Southeast Asia", "Asia"], "Cambodia":["Southeast Asia", "Asia"], "South Vietnam":["Southeast Asia", "Asia"], "Thailand":["Southeast Asia", "Asia"], "Indonesia":["Southeast Asia", "Asia"], "Malaysia":["Southeast Asia", "Asia"], "Myanmar":["Southeast Asia", "Asia"], "Laos":["Southeast Asia", "Asia"], "Singapore":["Southeast Asia", "Asia"], "Vietnam":["Southeast Asia", "Asia"], "East Timor":["Southeast Asia", "Asia"], 
  "United States":["North America", "America"], "Canada":["North America", "America"], "Mexico":["North America", "America"], 
  "Paraguay":["South America", "America"], "Argentina":["South America", "America"], "Brazil":["South America", "America"], "Uruguay":["South America", "America"], "Colombia":["South America", "America"], "Paraguay":["South America", "America"], "Ecuador":["South America", "America"], "Venezuela":["South America", "America"], "Guyana":["South America", "America"], "Peru":["South America", "America"], "Chile":["South America", "America"], "Bolivia":["South America", "America"], "French Guiana":["South America", "America"], "Suriname":["South America", "America"], 
  "Dominican Republic":["Central America & Caribbean", "America"], "Guatemala":["Central America & Caribbean", "America"], "El Salvador":["Central America & Caribbean", "America"], "Nicaragua":["Central America & Caribbean", "America"], "Barbados":["Central America & Caribbean", "America"], "Dominican Republic":["Central America & Caribbean", "America"], "Jamaica":["Central America & Caribbean", "America"], "Costa Rica":["Central America & Caribbean", "America"], "Panama":["Central America & Caribbean", "America"], "Honduras":["Central America & Caribbean", "America"], "Grenada":["Central America & Caribbean", "America"], "Guadeloupe":["Central America & Caribbean", "America"], "Dominica":["Central America & Caribbean", "America"], "Haiti":["Central America & Caribbean", "America"], "Cuba":["Central America & Caribbean", "America"], "Belize":["Central America & Caribbean", "America"], "Trinidad and Tobago":["Central America & Caribbean", "America"], "Bahamas":["Central America & Caribbean", "America"], "St. Lucia":["Central America & Caribbean", "America"],
  "East Germany ":["Eastern Europe", "Europe"], "Yugoslavia":["Eastern Europe", "Europe"], "Soviet Union":["Eastern Europe", "Europe"], "Bulgaria":["Eastern Europe", "Europe"], "Romania":["Eastern Europe", "Europe"], "Poland":["Eastern Europe", "Europe"], "Croatia":["Eastern Europe", "Europe"], "Slovakia":["Eastern Europe", "Europe"], "Russia":["Eastern Europe", "Asia"], "Albania":["Eastern Europe", "Europe"], "Ukraine":["Eastern Europe", "Europe"], "Bosnia and Herz.":["Eastern Europe", "Europe"], "Moldova":["Eastern Europe", "Europe"], "Latvia":["Eastern Europe", "Europe"], "Slovenia":["Eastern Europe", "Europe"], "Czech Rep.":["Eastern Europe", "Europe"], "Macedonia":["Eastern Europe", "Europe"], "Estonia":["Eastern Europe", "Europe"], "Lithuania":["Eastern Europe", "Europe"], "Hungary":["Eastern Europe", "Europe"], "Belarus":["Eastern Europe", "Europe"], "Kosovo":["Eastern Europe", "Europe"], "Montenegro":["Eastern Europe", "Europe"], "Serbia-Montenegro":["Eastern Europe", "Europe"], "Serbia":["Eastern Europe", "Europe"], 
  "West Germany ":["Western Europe", "Europe"], "Switzerland":["Western Europe", "Europe"], "Ireland":["Western Europe", "Europe"], "United Kingdom":["Western Europe", "Europe"], "Greece":["Western Europe", "Europe"], "Netherlands":["Western Europe", "Europe"], "Sweden":["Western Europe", "Europe"], "Italy":["Western Europe", "Europe"], "Austria":["Western Europe", "Europe"], "Spain":["Western Europe", "Europe"], "France":["Western Europe", "Europe"], "Cyprus":["Western Europe", "Europe"], "Portugal":["Western Europe", "Europe"], "Belgium":["Western Europe", "Europe"], "Denmark":["Western Europe", "Europe"], "Malta":["Western Europe", "Europe"], "Norway":["Western Europe", "Europe"], "Germany":["Western Europe", "Europe"], "Finland":["Western Europe", "Europe"],
  "Australia":["Australasia & Oceania","Oceania"], "New Zealand":["Australasia & Oceania","Oceania"], "New Caledonia":["Australasia & Oceania","Oceania"], "Papua New Guinea":["Australasia & Oceania","Oceania"], "Fiji":["Australasia & Oceania","Oceania"], "Solomon Islands":["Australasia & Oceania","Oceania"],
  "Zambia":["Sub-Saharan Africa","Africa"], "Botswana":["Sub-Saharan Africa","Africa"], "Ethiopia":["Sub-Saharan Africa","Africa"], "Kenya":["Sub-Saharan Africa","Africa"], "Namibia":["Sub-Saharan Africa","Africa"], "Nigeria":["Sub-Saharan Africa","Africa"], "South Africa":["Sub-Saharan Africa","Africa"], "Zaire":["Sub-Saharan Africa","Africa"], "Mauritania":["Sub-Saharan Africa","Africa"], "Djibouti":["Sub-Saharan Africa","Africa"], "Rhodesia":["Sub-Saharan Africa","Africa"], "Mozambique":["Sub-Saharan Africa","Africa"], "Angola":["Sub-Saharan Africa","Africa"], "Tanzania":["Sub-Saharan Africa","Africa"], "Gabon":["Sub-Saharan Africa","Africa"], "Uganda":["Sub-Saharan Africa","Africa"], "Somalia":["Sub-Saharan Africa","Africa"], "Zimbabwe":["Sub-Saharan Africa","Africa"], "Guinea":["Sub-Saharan Africa","Africa"], "Sudan":["Sub-Saharan Africa","Africa"], "Central African Republic":["Sub-Saharan Africa","Africa"], "People's Republic of the Congo":["Sub-Saharan Africa","Africa"], "Lesotho":["Sub-Saharan Africa","Africa"], "Burkina Faso":["Sub-Saharan Africa","Africa"], "Swaziland":["Sub-Saharan Africa","Africa"], "Niger":["Sub-Saharan Africa","Africa"], "Togo":["Sub-Saharan Africa","Africa"], "Senegal":["Sub-Saharan Africa","Africa"], "Liberia":["Sub-Saharan Africa","Africa"], "Mali":["Sub-Saharan Africa","Africa"], "Sierra Leone":["Sub-Saharan Africa","Africa"], "Cameroon":["Sub-Saharan Africa","Africa"], "Chad":["Sub-Saharan Africa","Africa"], "Madagascar":["Sub-Saharan Africa","Africa"], "Burundi":["Sub-Saharan Africa","Africa"], "Rwanda":["Sub-Saharan Africa","Africa"], "Ivory Coast":["Sub-Saharan Africa","Africa"], "Malawi":["Sub-Saharan Africa","Africa"], "Comoros":["Sub-Saharan Africa","Africa"], "Republic of the Congo":["Sub-Saharan Africa","Africa"], "Ghana":["Sub-Saharan Africa","Africa"], "Gambia":["Sub-Saharan Africa","Africa"], "Eritrea":["Sub-Saharan Africa","Africa"], "Dem. Rep. Congo":["Sub-Saharan Africa","Africa"], "Guinea-Bissau":["Sub-Saharan Africa","Africa"],  "Equatorial Guinea":["Sub-Saharan Africa","Africa"], "South Sudan":["Sub-Saharan Africa","Africa"],
  "Somaliland":["Sub-Saharan Africa","Africa"],"S. Sudan":["Sub-Saharan Africa","Africa"],"Central African Rep.":["Sub-Saharan Africa","Africa"],"Congo":["Sub-Saharan Africa","Africa"],"Gabon":["Sub-Saharan Africa","Africa"],"Eq. Guinea":["Sub-Saharan Africa","Africa"],"Benin":["Sub-Saharan Africa","Africa"],"Côte d'Ivoire":["Sub-Saharan Africa","Africa"],"W. Sahara":["Sub-Saharan Africa","Africa"],
  "Iran":["Middle East & North Africa","Asia"], "Turkey":["Middle East & North Africa","Asia"], "Israel":["Middle East & North Africa","Asia"], "Egypt":["Middle East & North Africa","Africa"], "West Bank and Gaza Strip":["Middle East & North Africa","Asia"], "Jordan":["Middle East & North Africa","Asia"], "Lebanon":["Middle East & North Africa","Asia"], "Syria":["Middle East & North Africa","Asia"], "United Arab Emirates":["Middle East & North Africa","Asia"], "Iraq":["Middle East & North Africa","Asia"], "Kuwait":["Middle East & North Africa","Asia"], "North Yemen":["Middle East & North Africa","Asia"], "Morocco":["Middle East & North Africa","Africa"], "Saudi Arabia":["Middle East & North Africa","Asia"], "Tunisia":["Middle East & North Africa","Africa"], "Qatar":["Middle East & North Africa","Asia"], "Libya":["Middle East & North Africa","Africa"], "Algeria":["Middle East & North Africa","Africa"], "Yemen":["Middle East & North Africa","Asia"], "Bahrain":["Middle East & North Africa","Asia"], "International":["Middle East & North Africa","Asia"] 
  ,"Aruba":["Central America & Caribbean", "America"], 
  "Antigua and Barb.":["Central America & Caribbean", "America"], 
  "Anguilla":["Central America & Caribbean", "America"],
  "St-Barthélemy":["Central America & Caribbean","America"],
  "Bermuda":["North America","America"],
  "Curaçao":["Central America & Caribbean","America"],
  "Cayman Is.":["Central America & Caribbean","America"],
  "Dominican Rep.":["Central America & Caribbean","America"],
  "Greenland":["Europe & Central Asia","America"],
  "St. Kitts and Nevis":["Central America & Caribbean","America"],
  "Saint Lucia":["Central America & Caribbean","America"],
  "St-Martin":["Central America & Caribbean","America"],
  "Montserrat":["Central America & Caribbean","America"],
  "Puerto Rico":["Central America & Caribbean","America"],
  "St. Pierre and Miquelon":["North America","America"],
  "Sint Maarten":["Central America & Caribbean","America"],
  "Turks and Caicos Is.":["Central America & Caribbean","America"],
  "Trinidad and Tobago":["Central America & Caribbean","America"],
  "St. Vin. and Gren.":["Central America & Caribbean","America"],
  "British Virgin Is.":["Central America & Caribbean","America"],
  "U.S. Virgin Is.":["Central America & Caribbean","America"],
  "Falkland Is.":["Central America & Caribbean","America"],
  "Brunei":["East Asia","Asia"],
  "Bhutan":["South Asia","Asia"],
  "N. Cyprus":["Western Europe","Asia"],
  "Indian Ocean Ter.":["East Asia","Africa"],
  "Siachen Glacier":["South Asia","Asia"],
  "Lao PDR":["East Asia","Asia"],
  "Macao":["East Asia","Asia"],
  "Mongolia":["East Asia","Asia"],
  "Oman":["Middle East & North Africa","Asia"],
  "Palestine":["Middle East & North Africa","Asia"],
  "Timor-Leste":["East Asia","Asia"],
  "Cape Verde":["Sub-Saharan Africa","Africa"],
  "Somaliland":["Sub-Saharan Africa","Africa"],
  "São Tomé and Principe":["Sub-Saharan Africa","Africa"],
  "Aland":["Western Europe","Europe"],
  "Faeroe Is.":["Western Europe","Europe"],
  "Guernsey":["Western Europe","Europe"],
  "Isle of Man":["Western Europe","Europe"],
  "Jersey":["Western Europe","Europe"],
  "Monaco":["Western Europe","Europe"],
  "San Marino":["Western Europe","Europe"],
  "Vatican":["Western Europe","Europe"],
  "American Samoa":["East Asia","Oceania"],
  "Ashmore and Cartier Is.":["East Asia","Oceania"],
  "Cook Is.":["East Asia","Oceania"],
  "Fiji":["East Asia","Oceania"],
  "Micronesia":["East Asia","Oceania"],
  "Guam":["East Asia","Oceania"],
  "Kiribati":["East Asia","Oceania"],
  "New Caledonia":["East Asia","Oceania"],
  "N. Mariana Is.":["East Asia","Oceania"],
  "Marshall Is.":["East Asia","Oceania"],
  "Norfolk Island":["East Asia","Oceania"],
  "Niue":["East Asia","Oceania"],
  "Nauru":["East Asia","Oceania"],
  "Palau":["East Asia","Oceania"],
  "Pitcairn Is.":["East Asia","Oceania"],
  "Fr. Polynesia":["East Asia","Oceania"],
  "Solomon Is.":["East Asia","Oceania"],
  "Papua New Guinea":["East Asia","Oceania"],
  "Tonga":["East Asia","Oceania"],
  "Vanuatu":["East Asia","Oceania"],
  "Wallis and Futuna Is.":["East Asia","Oceania"],
  "Samoa":["East Asia","Oceania"],
  "Fr. S. Antarctic Lands":["Sub-Saharan Africa","Africa"],
  "Heard I. and McDonald Is.":["Sub-Saharan Africa","Africa"],
  "Br. Indian Ocean Ter.":["Sub-Saharan Africa","Africa"],
  "Mauritius":["Sub-Saharan Africa","Africa"],
  "S. Geo. and S. Sandw. Is.":["Antarctica","Africa"],
  "Saint Helena":["Sub-Saharan Africa","Africa"],
  "Seychelles":["Sub-Saharan Africa","Africa"],
  "Antarctica":["Antarctica","Antarctica"],
  "Andorra":["Western Europe","Europe"],
  "Iceland":["Western Europe","Europe"],
  "Liechtenstein":["Western Europe","Europe"],
  "Luxembourg":["Western Europe","Europe"],
}



function movingMean(dati)
{ 
  var sum=0
  var len=dati.length
  for (i=0;i<len;i++)
  { 
    sum=sum+dati[i];
  }
  var result=sum/parseFloat(len)
  return result
}

function freq(dat)
{
   var freqData=[]
   for (i=0;i<dat.length;i++)
   {
   		freqData.push(+dat[i][0])
   }
   return freqData
}


function unique(origArr) {
  var newArr = [],
      origLen = origArr.length,
      found, x, y;

  for (x = 0; x < origLen; x++) {
      found = undefined;
      for (y = 0; y < newArr.length; y++) {
          if (origArr[x] === newArr[y]) {
              found = true;
              break;
          }
      }
      if (!found) {
          newArr.push(origArr[x]);
      }
  }
  return newArr;
}

function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

function list_push(data){
  var list = document.querySelector("select[name='select']");
  var l = list.options.length;
  for (i = l-1; i >= 0 ; i--){
    list.options[i]=null
  }
  for (i = 0; i < data.length; i++){
    list.options[list.options.length] = new Option(data[i], data[i]);
    if (data[i] == "2020"){
      list.options[list.options.length-1].checked = true;
      manager.triggerYearFilterEvent(data[i]);
    } 
  }
}

function count(el,a){
  var c=0;
  for(var i=0;i<a.length;i++){
    if(a[i]==el){
      c++;}
  }
  return c;
}