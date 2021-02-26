var yearSelector = document.querySelector("select[name='select']");
/*yearSelector.addEventListener('change', function () {
    var selectedYear = yearSelector.value.split("-")[0];
    var selectedGroup = String(groupSelector.value);
    if(selectedGroup=="Tutti"){
        manager.triggerYearFilterEvent(selectedYear);
    }else{
        manager.triggerGroupFilterEvent(selectedGroup,selectedYear);
    }   
});*/

yearSelector.addEventListener('change', function () {
    var selectedYear = yearSelector.value.split("-")[0];
    manager.triggerYearFilterEvent(selectedYear);
});

var compareSelector = document.getElementById("compareCheck");

compareSelector.addEventListener("change", function(){
	if (manager.compareMode== false)
	{
		    manager.compareMode = true;

	}else
	{
		    manager.compareMode = false;
		    

	}
})
var click=false;

Vue.component('v-select', VueSelect.VueSelect);
var vm;

manager.addListener("dataReady", function(d){
    vm = new Vue({
        el: '#selector',
        data: {
          reasons: manager.groupsNames,
          selectedludo: "Tutti",
        },
        methods: {
            onChange(event) {
                this.selectedludo=event;
                manager.triggerGroupFilterEvent(event);
            } 
        }
      }) 
})


var q=document.getElementById("my_dataviz");
var q1=document.getElementById("my_dataviz2");
var q2=document.getElementById("my_dataviz3");
var q3=document.getElementById("my_dataviz4");
var q4=document.getElementById("my_datavizz");

var sel = document.querySelector("select[name='select2']");
sel.addEventListener('change', function () {
    var selected = sel.value;
    console.log(selected);
    if (selected=="Global trend"){
        sel.value="Global trend";
    }else if(selected=="Terroristic group target"){
        q.style.display="none";
        q1.style.display="block";
        sel.value="Global trend";
    }else if(selected=="Terroristic group trend"){
        q.style.display="none";
        q2.style.display="block";
        sel.value="Global trend";
    }else if(selected=="Global kill trend"){
        q.style.display="none";
        q3.style.display="block";
        sel.value="Global trend";
    }else if(selected=="Killer natility"){
        q.style.display="none";
        q4.style.display="block";
        sel.value="Global trend";
    }
});

var sel2 = document.querySelector("select[name='select3']");
sel2.addEventListener('change', function () {
    var selected2 = sel2.value;
    if (selected2=="Global trend"){
        q1.style.display="none";
        q.style.display="block";
        sel2.value="Terroristic group target";
    }else if(selected2=="Terroristic group target"){
        sel2.value="Terroristic group target";
    }else if(selected2=="Terroristic group trend"){
        q1.style.display="none";
        q2.style.display="block";
        sel2.value="Terroristic group target";
    }else if(selected2=="Global kill trend"){
        q1.style.display="none";
        q3.style.display="block";
        sel2.value="Terroristic group target";
    }else if(selected2=="Killer natility"){
        q1.style.display="none";
        q4.style.display="block";
        sel2.value="Terroristic group target";
    }
});

var sel3 = document.querySelector("select[name='select4']");
sel3.addEventListener('change', function () {
    var selected3 = sel3.value;
    if (selected3=="Global trend"){
        q2.style.display="none";
        q.style.display="block";
        sel3.value="Terroristic group trend";
    }else if(selected3=="Terroristic group target"){
        q2.style.display="none";
        q1.style.display="block";
        sel3.value="Terroristic group trend";
    }else if(selected3=="Terroristic group trend"){
        sel3.value="Terroristic group trend";
    }else if(selected3=="Global kill trend"){
        q2.style.display="none";
        q3.style.display="block";
        sel3.value="Terroristic group trend";
    }else if(selected3=="Killer natility"){
        q2.style.display="none";
        q4.style.display="block";
        sel3.value="Terroristic group trend";
    }
});

var sel4 = document.querySelector("select[name='select5']");
sel4.addEventListener('change', function () {
    var selected4 = sel4.value;
    if (selected4=="Global trend"){
        q3.style.display="none";
        q.style.display="block";
        sel4.value="Global kill trend";
    }else if(selected4=="Terroristic group target"){
        q3.style.display="none";
        q1.style.display="block";
        sel4.value="Global kill trend";
    }else if(selected4=="Terroristic group trend"){
        q3.style.display="none";
        q2.style.display="block";
        sel4.value="Global kill trend";
    }else if(selected4=="Global kill trend"){
        sel4.value="Global kill trend";
    }else if(selected4=="Killer natility"){
        q3.style.display="none";
        q4.style.display="block";
        sel4.value="Global kill trend";
    }
});

var sel5 = document.querySelector("select[name='select6']");
sel5.addEventListener('change', function () {
    var selected5 = sel5.value;
    if (selected5=="Global trend"){
        q4.style.display="none";
        q.style.display="block";
        sel5.value="Killer natility";
    }else if(selected5=="Terroristic group target"){
        q4.style.display="none";
        q1.style.display="block";
        sel5.value="Killer natility";
    }else if(selected5=="Terroristic group trend"){
        q4.style.display="none";
        q2.style.display="block";
        sel5.value="Killer natility";
    }else if(selected5=="Global kill trend"){
        q4.style.display="none";
        q3.style.display="block";
        sel5.value="Killer natility";
    }else if(selected5=="Killer natility"){
        sel5.value="Killer natility";
    }
});