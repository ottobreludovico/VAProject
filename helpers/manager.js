Manager = function () {
    this.dataLoaded = false;
    this.filteringByYear = true;
    this.parallelFiltering = false;
    this.placesNames = ["---"];
    this.dataOriginal = [];
    this.dataYear = [];
    this.data = [];
    this.mrate={};
    this.pop={};
    this.dataMap = [];
    this.dataplaceludo=[];
    this.dataScattered = [];
    this.dataplace=[];
    this.dataRegion=[];
    this.dataContinent=[];
    this.dataGroupYear=[];
    this.dataGroup=[];
    this.groupsNames=[];
    this.places=[];
    this.group=undefined;
    this.place= undefined;
    this.reg1=undefined;
    this.reg2=undefined;
    this.con1=undefined;
    this.con2=undefined;
    this.year=2017;
    this.filteredByParallel = undefined;
    this.listenersContainer = new EventTarget();
    this.filteringByScatterplot = undefined;
    this.filteringByParallel = undefined;
    this.filteredByGroup=undefined;
    this.secondPlace = undefined;
    this.compareMode = false;
}

Manager.prototype.loadData = function () {
    _obj = this;
    d3.csv("./Dataset/pronto.csv", function (data) {
        currData = []
        places = ["---"]
        groups = ["Tutti"]
        data.forEach(d => {
            if (d.iyear == _obj.year) {
                currData.push(d);
                places.push(d.place);
                groups.push(d.gname);
            }
        });
        _obj.placesNames = unique(places);
        _obj.groupsNames = unique(groups);
        _obj.data = currData;
        _obj.dataRegion = currData;
        _obj.dataOriginal = data;
        _obj.dataYear = currData;
        _obj.dataMap = currData;
        _obj.dataLoaded = true;
        _obj.listenersContainer.dispatchEvent(new Event('dataReady'))
    })
    d3.csv("./Dataset/mrate.csv", function (data) {
        rate={}
        data.forEach(d => {
            rate[d["place"]]= d[_obj.year];
        });
        _obj.mrate = rate;
    })
    d3.csv("./Dataset/pop.csv", function (data) {
        popo=[]
        data.forEach(d => {
            popo[d["place"]]= d[_obj.year];
        });
        _obj.pop = popo;
        console.log(_obj.pop);
    })
    
}

Manager.prototype.addListener = function (nameEvent, functionz) {
    if (this.dataLoaded && nameEvent == 'dataReady') functionz();
    else this.listenersContainer.addEventListener(nameEvent, functionz);
}

Manager.prototype.notifyScatterplotBrushing = function () {
    this.listenersContainer.dispatchEvent(new Event('scatterplotBrushing'));
}

Manager.prototype.notifyParallelBrushing = function () {
    this.filteredByParallel = [];
    this.parallelFiltering = true;
    for (i = 0; i < this.data.length; i++) {
        if (this.filteringByParallel != undefined && this.filteringByParallel(this.data[i])) this.filteredByParallel.push(this.data[i]);
    }
    this.listenersContainer.dispatchEvent(new Event('parallelBrushing'));
}

Manager.prototype.notifyYearChanged = function () {
    this.listenersContainer.dispatchEvent(new Event('yearChanged'));
}

Manager.prototype.notifyPlaceChanged = function () {
    this.listenersContainer.dispatchEvent(new Event('placeChanged'));
    if(ratepop.value=="nuova"){
        mostraPop();
        ratepop.value="nuova";
    }else{
        updateChart();
        ratepop.value="normale";
    } 
}

Manager.prototype.notifyGroupChanged = function () {
    this.listenersContainer.dispatchEvent(new Event('groupChanged'));
}

Manager.prototype.notifyUpdatedDataFiltering = function () {
    this.listenersContainer.dispatchEvent(new Event('updatedDataFiltering'));
}

Manager.prototype.notifyColorChanged = function () {
    this.listenersContainer.dispatchEvent(new Event('colorChanged'));
}

Manager.prototype.notifyTriggerLudo = function () {
    this.listenersContainer.dispatchEvent(new Event('ludoChanged'));
}

Manager.prototype.notifyGroupsNames = function () {
    this.listenersContainer.dispatchEvent(new Event('groupsNamesChanged'));
}

Manager.prototype.getDataFilteredByParallel = function () {
    if (this.filteredByParallel == undefined) return this.data;
    else return this.filteredByParallel;
}

Manager.prototype.getDataFilteredByMap = function () {
    if (this.dataMap == undefined) return this.filteredByParallel;
    else return this.dataMap;
}

Manager.prototype.getDataFilteredByScatter = function () {
    if (this.dataScattered.length > 0){ return this.dataScattered;}
    else if (this.filteredByParallel != undefined) {return this.filteredByParallel;}
    else return this.data;
}

Manager.prototype.getDataOriginal = function () {
    return this.dataOriginal;
}

Manager.prototype.getDataPop = function () {
    return this.pop;
}

Manager.prototype.getDataRate = function () {
    return this.mRate;
}

Manager.prototype.getDataFilteredByYear = function () {
    return this.dataYear; //CONTROLLARE BENE
}

Manager.prototype.getDataFilteredByG = function () {
    return this.dataGroupYear;
}

Manager.prototype.getDataByRegion = function () {
    return this.dataRegion;
}

Manager.prototype.getDataFilteredByGG = function () {
    return this.dataGroup;
}

Manager.prototype.getDataByContinent = function () {
    return this.dataContinent;
}


Manager.prototype.getDataFilteredByPlace = function () {
    return this.dataplace;
}

Manager.prototype.getDataByPlace = function () {
    return this.dataplaceludo;
}

Manager.prototype.triggerFilterEvent = function () {
    this._updateDataFromWeek();
    this.notifyUpdatedDataFiltering();
}

Manager.prototype.triggerLudo = function () {
    this.notifyTriggerLudo();
}


Manager.prototype.triggerGroupFilterEvent = function (selectedGroup) {
    if(selectedGroup!="Tutti" && selectedGroup!="" && selectedGroup!=null){
        this.group=selectedGroup;
        this.dataGroupYear = [];
        this.dataGroup=[];
        for (i = 0; i < this.dataYear.length; i++) {
            d = this.dataYear[i];    
            foundGroup = d.gname;
            if (selectedGroup == foundGroup ){
                this.dataGroupYear.push(d);
            }
        }
        for (i = 0; i < this.dataOriginal.length; i++) {   
            if (selectedGroup == this.dataOriginal[i].gname ){
                this.dataGroup.push(this.dataOriginal[i]);
            }
        }
        this._updateDataFromGroupYear();
        this.notifyGroupChanged();
    }else{
        this.group=undefined;
        this.dataGroupYear = this.dataYear;
        if(manager.place!=undefined){
            if(manager.secondPlace!=undefined){
                this.triggerPlaceFilterEvent(manager.secondPlace,manager.year);
            }else{
                this.triggerPlaceFilterEvent(manager.place,manager.year);
            }
        }
        this._updateDataFromGroupYear();
        this.notifyGroupChanged();   
    }
   
}

Manager.prototype.triggerYearFilterEvent = function (selectedYear) {
    this.year=selectedYear;
    this.dataYear = [];
    this.dataMap = [];
    this.dataplace=[];
    this.dataContinent=[];
    this.dataRegion=[];
    this.groupsNames=["Tutti"];
    if (this.place != undefined){
        for (i = 0; i < this.dataOriginal.length; i++) {
            d = this.dataOriginal[i];
            foundYear = d.iyear
            foundplace = d.place   
            if((this.con1==diz[foundplace][1] || this.con2==diz[foundplace][1]) && selectedYear == foundYear){
                this.dataContinent.push(d);
            }
            if((diz[foundplace][0]==this.reg1|| diz[foundplace][0]==this.reg2 )&& selectedYear == foundYear){
                this.dataRegion.push(d);
            } 
            if (selectedYear == foundYear ){
                if(NAT1 && NAT2 && (foundplace == this.place || foundplace == this.secondPlace)){
                    this.dataYear.push(d);
                    this.dataplace.push(d);
                    this.groupsNames.push(d.gname);
                }
                if(NAT1 && REG2 && (foundplace == this.place || diz[foundplace][0] == this.reg2)){
                    this.dataYear.push(d);
                    this.dataplace.push(d);
                    this.groupsNames.push(d.gname);
                }
                if(NAT1 && CON2 && (foundplace == this.place || diz[foundplace][1] == this.con2)){
                    this.dataYear.push(d);
                    this.dataplace.push(d);
                    this.groupsNames.push(d.gname);
                }
                if(REG1 && NAT2 && (diz[foundplace][0] == this.reg1 || foundplace == this.secondPlace)){
                    this.dataYear.push(d);
                    this.dataplace.push(d);
                    this.groupsNames.push(d.gname);
                }
                if(REG1 && REG2 && (diz[foundplace][0] == this.reg1 || diz[foundplace][0] == this.reg2)){
                    this.dataYear.push(d);
                    this.dataplace.push(d);
                    this.groupsNames.push(d.gname);
                }
                if(REG1 && CON2 && (diz[foundplace][0] == this.reg1 || diz[foundplace][1] == this.con2)){
                    this.dataYear.push(d);
                    this.dataplace.push(d);
                    this.groupsNames.push(d.gname);
                }
                if(CON1 && NAT2 && (diz[foundplace][1] == this.con1 || foundplace == this.secondPlace)){
                    this.dataYear.push(d);
                    this.dataplace.push(d);
                    this.groupsNames.push(d.gname);
                }
                if(CON1 && REG2 && (diz[foundplace][1] == this.con1 || diz[foundplace][0] == this.reg2)){
                    this.dataYear.push(d);
                    this.dataplace.push(d);
                    this.groupsNames.push(d.gname);
                }
                if(CON1 && CON2 && (diz[foundplace][1] == this.con1 || diz[foundplace][1] == this.con2)){
                    this.dataYear.push(d);
                    this.dataplace.push(d);
                    this.groupsNames.push(d.gname);
                }
                
            }
            if (selectedYear == foundYear){
                this.dataMap.push(d);
            }        
        }
    }
    else{
        for (i = 0; i < this.dataOriginal.length; i++) {
            d = this.dataOriginal[i];
            foundYear = d.iyear
            if (selectedYear == foundYear){
                this.dataYear.push(d);
                this.groupsNames.push(d.gname);
            }
            if (selectedYear == foundYear)
                this.dataMap.push(d);
        }
    }
    d3.csv("./Dataset/mrate.csv", function (data) {
        rate={}
        data.forEach(d => {
            rate[d["place"]]= d[selectedYear];
        });
        _obj.mrate = rate;
    })
    d3.csv("./Dataset/pop.csv", function (data) {
        popo=[]
        data.forEach(d => {
            popo[d["place"]]= d[selectedYear];
        });
        _obj.pop = popo;
    })
    this._updateGroupsNames();
    this._updateDataFromYear();
    this.notifyYearChanged();
}

Manager.prototype.triggerPlaceFilterEvent = function (selectedPlace, selectedYear) {
    //if(this.group==undefined){
        var sel1 = document.querySelector("select[name='s1']");
        var sel2 = document.querySelector("select[name='s2']");
        var c1=document.getElementById("continent1");
        var r1=document.getElementById("region1");
        var n1=document.getElementById("nation1");
        var c2=document.getElementById("continent2");
        var r2=document.getElementById("region2");
        var n2=document.getElementById("nation2");
        this.parallelFiltering = false;
        if (this.compareMode == false){
            this.place = selectedPlace;
            this.con1=diz[selectedPlace][1];
            this.reg1=diz[selectedPlace][0];
            n1.innerHTML = this.place;
            r1.innerHTML = diz[this.place][0];
            c1.innerHTML = diz[this.place][1];
            if(sel1.value=="region1"){
                sel1.value = "region1";
            }else if(sel1.value=="continent1"){
                sel1.value = "continent1";
            }else{
                sel1.value = "nation1";
            }
            this.dataContinent =[];
            this.dataplace =[];
            this.dataRegion =[];
            this.dataMap = [];
            this.dataplaceludo =[];
            for (i = 0; i < this.dataOriginal.length; i++) {
                d = this.dataOriginal[i];
                foundplace = d.place;
                foundYear = d.iyear;
                foundRegion = d.region_txt;
                if(this.con1==diz[foundplace][1] && selectedYear == foundYear){
                    this.dataContinent.push(d);
                }
                if(diz[selectedPlace][0]==d.region_txt && selectedYear == foundYear){
                    this.dataRegion.push(d);
                }
                if (selectedPlace == foundplace){
                    this.dataplaceludo.push(d);
                }
                if (selectedPlace == foundplace && selectedYear == foundYear){
                    this.dataplace.push(d);
                }
                else if (selectedYear == foundYear)
                    this.dataMap.push(d);
            }
            svgBar.selectAll("*").remove();
            if(this.group!=undefined){
                gg=true;
            }
            this._updateDataFromPlace();
            this.notifyPlaceChanged();
        }
        else{
            if (this.place == undefined){
                this.place = selectedPlace;
                this.con1=diz[selectedPlace][1];
                this.reg1=diz[selectedPlace][0];
                n1.innerHTML = this.place;
                r1.innerHTML = diz[this.place][0];
                c1.innerHTML = diz[this.place][1];
                if(sel1.value=="region1"){
                    sel1.value = "region1";
                }else if(sel1.value=="continent1"){
                    sel1.value = "continent1";
                }else{
                    sel1.value = "nation1";
                }
                this.dataContinent =[];
                this.dataplace =[];
                this.dataRegion = [];
                this.dataMap = [];
                this.dataplaceludo =[];
                for (i = 0; i < this.dataOriginal.length; i++) {
                    d = this.dataOriginal[i];
                    foundplace = d.place
                    foundYear = d.iyear
                    if(this.con1==diz[foundplace][1] && selectedYear == foundYear){
                        this.dataContinent.push(d);
                    }
                    if(diz[selectedPlace][0]==d.region_txt && selectedYear == foundYear){
                        this.dataRegion.push(d);
                    }
                    if (selectedPlace == foundplace){
                        this.dataplaceludo.push(d);
                    }
                    if (selectedPlace == foundplace && selectedYear == foundYear){
                        this.dataplace.push(d);
                    }
                    else if (selectedYear == foundYear)
                        this.dataMap.push(d);
                }
                svgBar.selectAll("*").remove();
                if(this.group!=undefined){
                    gg=true;
                }
       
                this._updateDataFromPlace();
                this.notifyPlaceChanged();
            }
            else if (this.secondPlace == undefined){
                this.secondPlace = selectedPlace;
                this.con2=diz[selectedPlace][1];
                this.reg2=diz[selectedPlace][0];
                //place2Div.innerHTML = this.secondPlace;
                n2.innerHTML = this.secondPlace;
                r2.innerHTML = diz[this.secondPlace][0];
                c2.innerHTML = diz[this.secondPlace][1];
                if(sel2.value=="region2"){
                    sel2.value = "region2";
                }else if(sel2.value=="continent2"){
                    sel2.value = "continent2";
                }else{
                    sel2.value = "nation2";
                }
                this.dataMap = [];
                for (i = 0; i < this.dataOriginal.length; i++) {
                    d = this.dataOriginal[i];
                    foundplace = d.place
                    foundYear = d.iyear
                    if(this.con2==diz[foundplace][1] && selectedYear == foundYear && this.con1!=this.con2){
                        this.dataContinent.push(d);
                    }
                    if(diz[selectedPlace][0]==d.region_txt && selectedYear == foundYear && this.reg1!=this.reg2){
                        this.dataRegion.push(d);
                    }
                    if (selectedPlace == foundplace){
                        this.dataplaceludo.push(d);
                    }
                    if (selectedPlace == foundplace && selectedYear == foundYear){
                        this.dataplace.push(d);
                    }
                    else if (selectedYear == foundYear && foundplace != this.place)
                        this.dataMap.push(d);
                }
                svgBar.selectAll("*").remove();
                if(this.group!=undefined){
                    gg=true;
                }
                this._updateDataFromPlace();
                this.notifyPlaceChanged();
            }
            else{
                this.dataMap = []
                var c=false;
                var r=false;
                if(diz[selectedPlace][1]!=diz[this.place][1]){
                    c=true;
                }
                if(diz[selectedPlace][0]!=diz[this.place][0]){
                    r=true;
                }
                if(c==true){
                    for (var i = this.dataContinent.length - 1; i >= 0; i-- ){
                        if(diz[this.dataContinent[i].place][1]==diz[selectedPlace][1]){
                            this.dataContinent.splice(i,1);
                        }
                    }
                }
                if(r==true){
                    for (var i = this.dataRegion.length - 1; i >= 0; i-- ){
                        if(diz[this.dataRegion[i].place][0]==diz[selectedPlace][0]){
                            this.dataRegion.splice(i,1);
                        }
                    }
                }
                for (var i = this.dataplace.length - 1; i >= 0; i-- ){
                    if (this.dataplace[i].place == this.secondPlace) {
                        this.dataplace.splice(i,1);
                    }
                }
                for (var i = this.dataplaceludo.length - 1; i >= 0; i-- ){
                    if (this.dataplaceludo[i].place == this.secondPlace) {
                        this.dataplaceludo.splice(i,1);
                    }
                }
                this.secondPlace = selectedPlace;
                n2.innerHTML = this.secondPlace;
                r2.innerHTML = diz[this.secondPlace][0];
                c2.innerHTML = diz[this.secondPlace][1];
                if(sel2.value=="region2"){
                    sel2.value = "region2";
                }else if(sel2.value=="continent2"){
                    sel2.value = "continent2";
                }else{
                    sel2.value = "nation2";
                }
                this.con2=diz[selectedPlace][1];
                this.reg2=diz[selectedPlace][0];
                //place2Div.innerHTML = this.secondPlace;
                for (i = 0; i < this.dataOriginal.length; i++) {
                    d = this.dataOriginal[i];
                    foundplace = d.place
                    foundYear = d.iyear
                    if(c==true){
                        if(diz[this.secondPlace][1]==diz[foundplace][1] && selectedYear == foundYear){
                            this.dataContinent.push(d);
                        }  
                    }
                    if(r==true){
                        if(diz[this.secondPlace][0]==d.region_txt && selectedYear == foundYear){
                            this.dataRegion.push(d);
                        }
                    }       
                    if (selectedPlace == foundplace){
                        this.dataplaceludo.push(d); //compare mode
                    }
                    if (selectedPlace == foundplace && selectedYear == foundYear){
                        this.dataplace.push(d);
                    }
                    else if (selectedYear == foundYear && foundplace != this.place)
                        this.dataMap.push(d);
                }
                (this.dataContinent);
                svgBar.selectAll("*").remove();
                if(this.group!=undefined){
                    gg=true;
                }
                this._updateDataFromPlace();
                this.notifyPlaceChanged();
            }
        }
    /*}else{
        this.parallelFiltering = false;
        this.place = selectedPlace;
        //place1Div.innerHTML = this.place;
        this.dataplace =[];
        this.dataMap = []
        for (i = 0; i < this.dataOriginal.length; i++) {
            d = this.dataOriginal[i];
            foundgroup = d.gname
            foundYear = d.iyear
            foundplace = d.place;
            if (this.group == foundgroup){
                this.dataplaceludo.push(d);
            }
            if (selectedPlace==foundplace){
                this.dataplace.push(d);
            }
            else if (selectedYear == foundYear)
                this.dataMap.push(d);
        }
        this._updateDataFromPlace();
        this.notifyPlaceChanged();
    }*/
}

Manager.prototype._updateDataFromYear = function () {
    this.data = [];
    this.filteredByParallel = [];
    this.dataGroupYear=[];
    //this.dataplace =[]
    for (i = 0; i < this.dataYear.length; i++) {
        if(this.group!=undefined){
            if(this.dataYear[i].gname==this.group){
                this.dataGroupYear.push(this.dataYear[i]);
            }
        }
        else{
            this.dataGroupYear.push(this.dataYear[i]);
        }
        this.data.push(this.dataYear[i]);
        this.dataScattered.push(this.dataYear[i]);
    }
    for (i = 0; i < this.data.length; i++) {
        this.filteredByParallel.push(this.data[i]);
    }
}

Manager.prototype._updateGroupsNames = function () {
    var a=unique(this.groupsNames);
    this.groupNames=a;
    Vue.set(vm, 'reasons', a);
   // Vue.set(vm, 'selectedludo', vm.selectedludo);
    this.notifyGroupsNames();
}


Manager.prototype._updateDataFromPlace = function () {
    this.data = [];
    this.filteredByParallel = [];
    this.groupsNames=["Tutti"];
    var x;
    if(CON1 || CON2){
        x=this.dataContinent;
    }else if(REG1 || REG2){
        x=this.dataRegion;
    }else{
        x=this.dataplace;
    }
    for (i = 0; i < x.length; i++) {
        this.data.push(x[i]);
        this.groupsNames.push(x[i].gname);
        this.dataScattered.push(x[i]);
    }
    for (i = 0; i < this.data.length; i++) {
        this.filteredByParallel.push(this.data[i]);
    }
    this._updateGroupsNames();
}

Manager.prototype._updateDataFromGroupYear = function () {
    if(this.group!="Tutti" && this.group!=null && this.group!=undefined){
        this.data = [];
        this.filteredByParallel = [];
        for (i = 0; i < this.dataGroupYear.length; i++) {
            this.data.push(this.dataGroupYear[i]);
            this.dataScattered.push(this.dataGroupYear[i]);
        }
        for (i = 0; i < this.data.length; i++) {
            this.filteredByParallel.push(this.data[i]);
        }
    }else{
        this.data = [];
        this.filteredByParallel = [];
        for (i = 0; i < this.dataYear.length; i++) {
            this.data.push(this.dataYear[i]);
            this.dataScattered.push(this.dataYear[i]);
        }
        for (i = 0; i < this.data.length; i++) {
            this.filteredByParallel.push(this.data[i]);
        }
    }
    
}

var manager=new Manager();
manager.loadData();

