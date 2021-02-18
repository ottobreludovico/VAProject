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
          selectedludo: "Tutti"
        },
        methods: {
            onChange(event) {
                this.selectedludo=event;
                manager.triggerGroupFilterEvent(event);
            } 
        }
      })   
})