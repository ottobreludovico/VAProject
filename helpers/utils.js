var nkillDiv = document.getElementById("nkillPanel");
var showValues = document.getElementById("showValues");
var showValues2 = document.getElementById("showValues2");
var sv = document.getElementById("sv");
var sv2 = document.getElementById("sv2");
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var place1Div = document.getElementById("place1");
var place2Div = document.getElementById("place2");

var Central_Asia = [ "Azerbaijan", "Kazakhstan", "Georgia", "Armenia", "Tajikistan", "Uzbekistan", "Kyrgyzstan", "Turkmenistan" ];
var South_Asia = [ "India", "Pakistan", "Sri Lanka", "Afghanistan", "Bangladesh", "Nepal", "Maldives", "Bhutan" ];
var East_Asia = [ "Korea", "Japan", "China", "Taiwan", "Hong Kong", "Dem. Rep. Korea", "Macau" ] ;
var Southeast_Asia = [ "Philippines", "Cambodia", "South Vietnam", "Thailand", "Indonesia", "Malaysia", "Myanmar", "Laos", "Singapore", "Vietnam", "East Timor" ];
var Asia = [Central_Asia, South_Asia, East_Asia, Southeast_Asia];


var North_America = [ "United States", "Canada", "Mexico" ];
var South_America = [ "Paraguay", "Argentina", "Brazil", "Uruguay", "Colombia", "Paraguay", "Ecuador", "Venezuela", "Guyana", "Peru", "Chile", "Bolivia", "French Guiana", "Suriname" ];
var Central_America_Caribbean = [ "Dominican Republic", "Guatemala", "El Salvador", "Nicaragua", "Barbados", "Dominican Republic", "Jamaica", "Costa Rica", "Panama", "Honduras", "Grenada", "Guadeloupe", "Dominica", "Haiti", "Cuba", "Belize", "Trinidad and Tobago", "Bahamas", "St. Lucia" ];
var America = [ North_America, South_America, Central_America_Caribbean ];

var Eastern_Europe = [ "East Germany", "Yugoslavia", "Soviet Union", "Bulgaria", "Romania", "Poland", "Croatia", "Slovakia", "Russia", "Albania", "Ukraine", "Bosnia and Herz.", "Moldova", "Latvia", "Slovenia", "Czech Rep.", "Macedonia", "Estonia", "Lithuania", "Hungary", "Belarus", "Kosovo", "Montenegro", "Serbia-Montenegro", "Serbia" ];
var Western_Europe = [ "West Germany", "Switzerland", "Ireland", "United Kingdom", "Greece", "Netherlands", "Sweden", "Italy", "Austria", "Spain", "France", "Cyprus", "Portugal", "Belgium", "Denmark", "Malta", "Norway", "Germany", "Finland" ];
var Europe = [Eastern_Europe, Western_Europe ]; 

var Australasia_Oceania = [ "Australia", "New Zealand", "New Caledonia", "Papua New Guinea", "Fiji", "Solomon Islands" ];
var Oceania = [ Australasia_Oceania ];

var Sub_Saharan = [ "Zambia", "Botswana", "Ethiopia", "Kenya", "Namibia", "Nigeria", "South Africa", "Zaire", "Mauritania", "Djibouti", "Rhodesia", "Mozambique", "Angola", "Tanzania", "Gabon", "Uganda", "Somalia", "Zimbabwe", "Guinea", "Sudan", "Central African Republic", "People's Republic of the Congo", "Lesotho", "Burkina Faso", "Swaziland", "Niger", "Togo", "Senegal", "Liberia", "Mali", "Sierra Leone", "Cameroon", "Chad", "Madagascar", "Burundi", "Rwanda", "Ivory Coast", "Malawi", "Comoros", "Republic of the Congo", "Ghana", "Gambia", "Eritrea", "Dem. Rep. Congo", "Guinea-Bissau",  "Equatorial Guinea", "South Sudan" ];
var Middle_East_North = [ "Iran", "Turkey", "Israel", "Egypt", "West Bank and Gaza Strip", "Jordan", "Lebanon", "Syria", "United Arab Emirates", "Iraq", "Kuwait", "North Yemen", "Morocco", "Saudi Arabia", "Tunisia", "Qatar", "Libya", "Algeria", "Yemen", "Bahrain", "International" ];
var Africa = [ Middle_East_North, Sub_Saharan];

var diz={}

for(i=0;i<Asia.length;i++){
  for(j=0;j<Asia[i].length;j++){
    var z;
    if(i==0){
      z="Central_Asia";
    }else if(i==1){
      z="South_Asia";
    }else if(i==2){
      z="East_Asia";
    }else{
      z="Southeast_Asia";
    }
    console.log(Asia[i][j]);
    console.log(z);
    diz[Asia[i][j]]=[z,"Asia"];
  }
}

for(i=0;i<America.length;i++){
  for(j=0;j<America[i].length;j++){
    var z;
    if(i==0){
      z="North_America";
    }else if(i==1){
      z="South_America";
    }else{
      z="Central_America_Caribbean";
    }
    diz[America[i][j]]=[z,"America"];
  }
}

for(i=0;i<Europe.length;i++){
  for(j=0;j<Europe[i].length;j++){
    var z;
    if(i==0){
      z="Eastern_Europe";
    }else{
      z="Western_Europe";
    }
    diz[Europe[i][j]]=[z,"Europe"];
  }
}

for(i=0;i<Oceania.length;i++){
  for(j=0;j<Oceania[i].length;j++){
    diz[Oceania[i][j]]=["Australasia_Oceania","Oceania"];
  }
}

for(i=0;i<Africa.length;i++){
  for(j=0;j<Africa[i].length;j++){
    var z;
    if(i==0){
      z="Middle_East_North";
    }else{
      z="Sub_Saharan";
    }
    diz[Africa[i][j]]=[z,"Africa"];
  }
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