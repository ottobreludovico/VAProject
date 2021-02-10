Manager = function () {
    this.dataLoaded = false;
    this.filteringByYear = true;
    this.parallelFiltering = false;
    this.placesNames = ["---"];
    this.dataOriginal = [];
    this.dataYear = [];
    this.data = [];
    this.dataMap = [];
    this.dataScattered = [];
    this.dataplace=[];
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
    d3.csv("./dataset/globalterrorismdb.csv", function (data) {
        currData = [];
        places = ["---"];
        data.forEach(d => {
            if (d.iyear == currYear){
                currData.push(d);
            }
            places.push(d.place);
        });
        _obj.placesNames = unique(places);
        _obj.data = currData;
        _obj.dataOriginal = data;
        _obj.dataYear = currData;
        _obj.dataMap = currData;
        _obj.dataLoaded = true;
        _obj.listenersContainer.dispatchEvent(new Event('dataReady'))
    });
    
}

Manager.prototype.addListener = function (nameEvent, functionz) {
    console.log("chiamata al manager");
    if (this.dataLoaded && nameEvent == 'dataReady') functionz();
    else this.listenersContainer.addEventListener(nameEvent, functionz);
}

Manager.prototype.notifyYearChanged = function () {
    this.listenersContainer.dispatchEvent(new Event('yearChanged'));
}

Manager.prototype.notifyParallelBrushing = function () {
    this.filteredByParallel = [];
    this.parallelFiltering = true;
    for (i = 0; i < this.data.length; i++) {
        if (this.filteringByParallel != undefined && this.filteringByParallel(this.data[i])) this.filteredByParallel.push(this.data[i]);
    }
    this.listenersContainer.dispatchEvent(new Event('parallelBrushing'));;
}

Manager.prototype.getDataFilteredByMap = function () {
    if (this.dataMap == undefined) return this.data;
    else return this.dataMap;
}

Manager.prototype.getDataOriginal = function () {
    return this.dataOriginal;
}

Manager.prototype.getDataFilteredByYear = function () {
    return this.dataYear;
}

Manager.prototype.triggerYearFilterEvent = function (selectedYear) {
    this.dataYear = [];
    this.dataMap = [];
    this.dataOriginal.forEach(d => {
                if (d.iyear == selectedYear){
                    this.dataYear.push(d);
                }
            });
    this._updateDataFromYear();
    this.notifyYearChanged();
}

Manager.prototype.getDataFilteredByParallel = function () {
    if (this.filteredByParallel == undefined) return this.data;
    else return this.filteredByParallel;
}

Manager.prototype._updateDataFromYear = function () {
    this.data = [];
    for (i = 0; i < this.dataYear.length; i++) {
        this.data.push(this.dataYear[i]);
    }
}

var manager = new Manager();
manager.loadData();
