Manager = function () {
    this.dataLoaded = false;
    this.filteringByYear = true;
    this.parallelFiltering = false;
    this.placesNames = ["---"];
    this.dataOriginal = [];
    this.dataYear = [];
    this.data = [];
    this.dataMap = [];
    this.dataplaceludo=[];
    this.dataScattered = [];
    this.dataplace=[];
    this.dataGroupYear=[];
    this.dataGroup=[];
    this.groupsNames=[];
    this.places=[];
    this.group=undefined;
    this.place= undefined;
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
        _obj.dataOriginal = data;
        _obj.dataYear = currData;
        _obj.dataMap = currData;
        _obj.dataLoaded = true;
        _obj.listenersContainer.dispatchEvent(new Event('dataReady'))
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

Manager.prototype.getDataFilteredByYear = function () {
    return this.dataYear; //CONTROLLARE BENE
}

Manager.prototype.getDataFilteredByG = function () {
    return this.dataGroupYear;
}

Manager.prototype.getDataFilteredByGG = function () {
    return this.dataGroup;
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
    console.log(selectedGroup);
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
    this.groupsNames=["Tutti"];
    if (this.place != undefined){
        for (i = 0; i < this.dataOriginal.length; i++) {
            d = this.dataOriginal[i];
            foundYear = d.iyear
            foundplace = d.place    
            if (selectedYear == foundYear && (foundplace == this.place || foundplace == this.secondPlace)){
                this.dataYear.push(d);
                this.dataplace.push(d);
                this.groupsNames.push(d.gname);
            }
            if (selectedYear == foundYear)
                this.dataMap.push(d);
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
    this._updateGroupsNames();
    this._updateDataFromYear();
    this.notifyYearChanged();
}

Manager.prototype.triggerPlaceFilterEvent = function (selectedPlace, selectedYear) {
    //if(this.group==undefined){
        this.parallelFiltering = false;
        if (this.compareMode == false){
            this.place = selectedPlace;
            //place1Div.innerHTML = this.place;
            this.dataplace =[];
            this.dataMap = [];
            this.dataplaceludo =[];
            for (i = 0; i < this.dataOriginal.length; i++) {
                d = this.dataOriginal[i];
                foundplace = d.place
                foundYear = d.iyear
                if (selectedPlace == foundplace){
                    this.dataplaceludo.push(d);
                }
                if (selectedPlace == foundplace && selectedYear == foundYear){
                    this.dataplace.push(d);
                }
                else if (selectedYear == foundYear)
                    this.dataMap.push(d);
            }
            this._updateDataFromPlace();
            this.notifyPlaceChanged();
        }
        else{
            if (this.place == undefined){
                this.place = selectedPlace;
                //place1Div.innerHTML = this.place;
                this.dataplace =[];
                this.dataMap = [];
                this.dataplaceludo =[];
                for (i = 0; i < this.dataOriginal.length; i++) {
                    d = this.dataOriginal[i];
                    foundplace = d.place
                    foundYear = d.iyear
                    if (selectedPlace == foundplace){
                        this.dataplaceludo.push(d);
                    }
                    if (selectedPlace == foundplace && selectedYear == foundYear){
                        this.dataplace.push(d);
                    }
                    else if (selectedYear == foundYear)
                        this.dataMap.push(d);
                }
                this._updateDataFromPlace();
                this.notifyPlaceChanged();
            }
            else if (this.secondPlace == undefined){
                this.secondPlace = selectedPlace;
                //place2Div.innerHTML = this.secondPlace;
                this.dataMap = [];
                for (i = 0; i < this.dataOriginal.length; i++) {
                    d = this.dataOriginal[i];
                    foundplace = d.place
                    foundYear = d.iyear
                    if (selectedPlace == foundplace){
                        this.dataplaceludo.push(d);
                    }
                    if (selectedPlace == foundplace && selectedYear == foundYear){
                        this.dataplace.push(d);
                    }
                    else if (selectedYear == foundYear && foundplace != this.place)
                        this.dataMap.push(d);
                }
                this._updateDataFromPlace();
                this.notifyPlaceChanged();
            }
            else{
                this.dataMap = []
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
                //place2Div.innerHTML = this.secondPlace;
                for (i = 0; i < this.dataOriginal.length; i++) {
                    d = this.dataOriginal[i];
                    foundplace = d.place
                    foundYear = d.iyear

                    if (selectedPlace == foundplace){
                        this.dataplaceludo.push(d); //compare mode
                    }
                    if (selectedPlace == foundplace && selectedYear == foundYear){
                        this.dataplace.push(d);
                    }
                    else if (selectedYear == foundYear && foundplace != this.place)
                        this.dataMap.push(d);
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
    Vue.set(vm, 'selected', vm.selected);
    this.notifyGroupsNames();
}


Manager.prototype._updateDataFromPlace = function () {
    this.data = [];
    this.filteredByParallel = [];
    this.groupsNames=["Tutti"];
    for (i = 0; i < this.dataplace.length; i++) {
        this.data.push(this.dataplace[i]);
        this.groupsNames.push(this.dataplace[i].gname);
        this.dataScattered.push(this.dataplace[i]);
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
        console.log(this.filteredByParallel);
    }
    
}

var manager=new Manager();
manager.loadData();

