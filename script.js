function Stopwatch(counterTarget, tableTarget) {
    this.counterTarget = counterTarget;
    this.tableTarget = tableTarget;
    this.stopwatchStartValue;
    this.stopwatchCounterRef;
    this.stopwatchCounterRefPaused = false;
    this.stopwatchCounterRefOutOfTime = false;
    this.start = function(startValue) {
        this.stopwatchStartValue = parseInt(startValue);

        if (isNaN(this.stopwatchStartValue)) {
            this.counterTarget.innerHTML = 'Podaj liczbę';
            return;
        }
        else if (startValue <= 0) {
            this.counterTarget.innerHTML = 'Podaj liczbę większą od 0';
            return;
        }

        this.stop();

        this.stopwatchCounterRefOutOfTime = false;
        this.stopwatchStartValue = parseInt(startValue);
        this.counterTarget.innerHTML = this.stopwatchStartValue;

        if (this.stopwatchCounterRef || this.stopwatchStartValue <= 0) {
            this.stop();
            return;
        }

        this.startTimer();
    }
    this.startTimer = function () {
        var self = this;
        this.stopwatchCounterRef = setInterval(function() {
            if (self.stopwatchStartValue <= 0) {
                this.stop();
                self.counterTarget.innerHTML = 'Czas minął';
                self.stopwatchCounterRefOutOfTime = true;
                return;
            }
            self.counterTarget.innerHTML = --self.stopwatchStartValue;
        }, 1000);
    }
    this.stop = function() {
        clearInterval(this.stopwatchCounterRef);
        this.stopwatchCounterRef = undefined;
    }
    this.pause = function() {
        if (this.stopwatchCounterRefOutOfTime) {
            return;
        }
        if (this.stopwatchCounterRef && !this.stopwatchCounterRefPaused) {
            clearInterval(this.stopwatchCounterRef);
            this.counterTarget.innerHTML += ' (pauza)';
            this.stopwatchCounterRefPaused = true;
            return;
        }
        else if (this.stopwatchCounterRef && this.stopwatchCounterRefPaused) {
            return;
        }
        else {
            this.counterTarget.innerHTML = 'Nie rozpoczęto odliczania';
        }
    }
    this.continue = function() {
        if (this.stopwatchCounterRefOutOfTime) {
            return;
        }
        if (this.stopwatchCounterRef && this.stopwatchCounterRefPaused) {
            this.startTimer();
            this.stopwatchCounterRefPaused = false;
            return;
        }
        else if (this.stopwatchCounterRef && !this.stopwatchCounterRefPaused) {
            this.counterTarget.innerHTML = 'Odliczanie nadal w toku';
        }
        else {
            this.counterTarget.innerHTML = 'Nie rozpoczęto odliczania';
        }
    }
    this.clear = function() {
        this.stop();
        this.counterTarget.innerHTML = '';
        //clear table
        while (this.tableTarget.childElementCount > 1) {
            this.tableTarget.removeChild(this.tableTarget.lastChild);
        }
    }
    this.save = function() {
        if (this.stopwatchCounterRef && !this.stopwatchCounterRefOutOfTime) {
            const newRecord = document.createElement("tr");
            const newTd1 = document.createElement("td");
            const newTd2 = document.createElement("td");
            const newTd3 = document.createElement("td");

            const newText1 = document.createTextNode(this.tableTarget.childElementCount);
            const newText2 = document.createTextNode(this.stopwatchStartValue);
            const newBtn = document.createElement("button");
            const newBtnText = document.createTextNode("Usuń");
            newBtn.appendChild(newBtnText);

            //newBtn remove line behaviour
            var self = this;
            newBtn.addEventListener("click", function() {
                this.parentNode.parentNode.remove();
                //reorder tr elements (lp.)
                var i = 1;
                const trArrayChildren = self.tableTarget.getElementsByTagName("tr");
                for (var n=2; n<trArrayChildren.length; n++) {
                    trArrayChildren[n].childNodes[0].innerHTML = i;
                    i++;
                }
            })
            //END newBtn remove line behaviour

            newTd1.appendChild(newText1);
            newTd2.appendChild(newText2);
            newTd3.appendChild(newBtn);

            newRecord.appendChild(newTd1);
            newRecord.appendChild(newTd2);
            newRecord.appendChild(newTd3);

            this.tableTarget.appendChild(newRecord);
        }
        else {
            this.counterTarget.innerHTML = 'Zapisywanie niedostępne';
        }
    }
}

window.onload = function() {
    var stopwatchStartBtn = document.getElementById("btn-stopwatch-start");
    var stopwatchEndBtn = document.getElementById("btn-stopwatch-end");
    var stopwatchPauseBtn = document.getElementById("btn-stopwatch-pause");
    var stopwatchContinueBtn = document.getElementById("btn-stopwatch-continue");
    var stopwatchClearBtn = document.getElementById("btn-stopwatch-clear");
    var stopwatchSaveBtn = document.getElementById("btn-stopwatch-save");
    var stopwatchTable = document.getElementById("stopwatch-table");
    var counter = document.getElementById("counter");

    var stopwatch1 = new Stopwatch(counter, stopwatchTable);

    stopwatchStartBtn.onclick = function() {
        var stopwatchInput = document.getElementById("stopwatch-input-value");
        var startVal = stopwatchInput.value;
        stopwatch1.start(startVal);
    }

    stopwatchEndBtn.onclick = function() {
        stopwatch1.stop();
        counter.innerHTML = 'Zakończono';
    }
    stopwatchPauseBtn.onclick = function() {
        stopwatch1.pause();
    }
    stopwatchContinueBtn.onclick = function() {
        stopwatch1.continue();
    }
    stopwatchClearBtn.onclick = function() {
        stopwatch1.clear();
    }
    stopwatchSaveBtn.onclick = function() {
        stopwatch1.save();
    }
}

