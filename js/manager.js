Manager = function () {
    this.dataLoaded = false;
    this.dataOriginal = [];
    this.data = []
    this.listenersContainer = new EventTarget();
    this.filteredByParallel = undefined;
    this.filteringByParallel = undefined;
}

Manager.prototype.loadData = function () {
    _obj = this;
    var currYear = 2017;
    d3.csv("./Dataset/globalterrorismdb.csv", function (data) {
        _obj.dataLoaded = true;
        _obj.listenersContainer.dispatchEvent(new Event('dataReady'))
    })
}

Manager.prototype.addListener = function (nameEvent, functionz) {
    if (this.dataLoaded && nameEvent == 'dataReady') functionz();
    else this.listenersContainer.addEventListener(nameEvent, functionz);
}

Manager.prototype.notifyParallelBrushing = function () {
    this.filteredByParallel = [];
    this.parallelFiltering = true;
    for (i = 0; i < this.data.length; i++) {
        if (this.filteringByParallel != undefined && this.filteringByParallel(this.data[i])) this.filteredByParallel.push(this.data[i]);
    }
    this.listenersContainer.dispatchEvent(new Event('parallelBrushing'));;
}

Manager.prototype.getDataFilteredByParallel = function () {
    if (this.filteredByParallel == undefined) return this.data;
    else return this.filteredByParallel;
}


var manager = new Manager();
manager.loadData();