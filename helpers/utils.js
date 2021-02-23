var nkillDiv = document.getElementById("nkillPanel");
var showValues = document.getElementById("showValues");
var showValues2 = document.getElementById("showValues2");
var sv = document.getElementById("sv");
var sv2 = document.getElementById("sv2");
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var place1Div = document.getElementById("place1");
var place2Div = document.getElementById("place2");


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