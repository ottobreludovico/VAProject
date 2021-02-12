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
    this.dataGroupYear=[]
    this.place= undefined;
    this.filteredByParallel = undefined;
    this.listenersContainer = new EventTarget();
    this.filteringByScatterplot = undefined;
    this.filteringByParallel = undefined;
    this.secondPlace = undefined;
    this.compareMode = false;
}

Manager.prototype.loadData = function () {
    _obj = this;
    var currYear = 2017;
    var currGroup= "MANO-D";
    d3.csv("./Dataset/pronto.csv", function (data) {
        currData = []
        currDataGroupYear = []
        places = ["---"]
        groups = ["---"]
        data.forEach(d => {
            if (d.iyear == currYear) {
                if(d.gname=currGroup){
                    currDataGroupYear.push(d);
                    groups.push(d.gname);
                }
                currData.push(d);
                places.push(d.place);
            }
        });
        _obj.placesNames = unique(places);
        _obj.groupsNames = unique(groups);
        _obj.data = currData;
        _obj.dataGroupYear = currDataGroupYear;
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
    this.listenersContainer.dispatchEvent(new Event('parallelBrushing'));;
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
    return this.data;
}

Manager.prototype.getDataFilteredByG = function () {
    return this.dataGroupYear;
}

Manager.prototype.getDataByPlace = function () {
    return this.dataplaceludo;
}

Manager.prototype.triggerFilterEvent = function () {
    this._updateDataFromWeek();
    this.notifyUpdatedDataFiltering();
}

Manager.prototype.triggerGroupFilterEvent = function (selectedGroup, selectedYear) {
    this.dataGroupYear = [];
    for (i = 0; i < this.dataOriginal.length; i++) {
        d = this.dataOriginal[i];
        foundGroup = d.gname;
        foundYear = d.iyear;
        if (selectedGroup == foundGroup && selectedYear==foundYear){
            this.dataGroupYear.push(d);
        }
    }
    console.log(this.dataGroupYear)
    this._updateDataFromYear();    
    this.notifyGroupChanged();
    this.notifyYearChanged();
}

Manager.prototype.triggerYearFilterEvent = function (selectedYear) {
    this.dataYear = [];
    this.dataMap = [];
    if (this.place != undefined){
        for (i = 0; i < this.dataOriginal.length; i++) {
            d = this.dataOriginal[i];
            foundYear = d.iyear
            foundplace = d.place    
            if (selectedYear == foundYear && (foundplace == this.place || foundplace == this.secondPlace)){
                this.dataYear.push(d);
            }
            else if (selectedYear == foundYear)
                this.dataMap.push(d);
        }
    }
    else{
        for (i = 0; i < this.dataOriginal.length; i++) {
            d = this.dataOriginal[i];
            foundYear = d.iyear
            if (selectedYear == foundYear){
                this.dataYear.push(d);
            }
            if (selectedYear == foundYear)
                this.dataMap.push(d);
        }
    }
    this._updateDataFromYear();
    this.notifyYearChanged();
}

Manager.prototype.triggerPlaceFilterEvent = function (selectedPlace, selectedYear) {
    this.parallelFiltering = false;
    if (this.compareMode == false){
        this.place = selectedPlace;
        //place1Div.innerHTML = this.place;
        this.dataplace =[];
        this.dataMap = []
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
            this.dataMap = []
            for (i = 0; i < this.dataOriginal.length; i++) {
                d = this.dataOriginal[i];
                foundplace = d.place
                foundYear = d.iyear
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
            this.dataMap = []
            for (i = 0; i < this.dataOriginal.length; i++) {
                d = this.dataOriginal[i];
                foundplace = d.place
                foundYear = d.iyear
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
            this.secondPlace = selectedPlace;
            //place2Div.innerHTML = this.secondPlace;
            for (i = 0; i < this.dataOriginal.length; i++) {
                d = this.dataOriginal[i];
                foundplace = d.place
                foundYear = d.iyear
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
    
}

Manager.prototype._updateDataFromYear = function () {
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

Manager.prototype._updateDataFromPlace = function () {
    this.data = [];
    this.filteredByParallel = [];
    for (i = 0; i < this.dataplace.length; i++) {
        this.data.push(this.dataplace[i]);
        this.dataScattered.push(this.dataplace[i]);
    }
    for (i = 0; i < this.data.length; i++) {
        this.filteredByParallel.push(this.data[i]);
    }
  }

var manager = new Manager();
manager.loadData();
