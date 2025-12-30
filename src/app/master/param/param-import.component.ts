import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { ParamService } from '../services/param.service';
import { Currency, Currency_vm } from '../models/param';

@Component({
    selector: 'App-param-import',
    templateUrl: './param-import.component.html',
    providers: [ParamService]
})
export class ParamImportComponent implements OnInit {

    @Output() CloseClicked = new EventEmitter<{ records: any[], data: string }>()
    @Input() msg: string;
    @Input() type: string;
    ErrorMessage: string = '';
    cbdata: string = '';
    currentTab = 'PASTEDATA';

    bSave = false;

    // Array For Displaying List
    RecordList: Currency[] = [];
    // Single Record for add/edit/view details
    Record: Currency = new Currency;

    constructor(
        private mainService: ParamService,
        private gs: GlobalService
    ) {
    }

    ngOnInit() {
        this.currentTab = 'PASTEDATA';
    }

    PasteDataClosed(cbdata: string) {
        this.cbdata = cbdata;
        if (this.ConvertData())
            this.currentTab = "LIST";
    }

    cancel() {
        this.cbdata = "";
        this.RecordList = [];
        this.currentTab = "PASTEDATA";
    }

    ConvertData() {
        let bRet = false;
        const CurrArray = this.cbdata.split('\n');
        if (CurrArray[1] == '1') {
            this.RecordList = new Array<Currency>();
            for (let i = 1; i < CurrArray.length; i += 6) {
                try {
                    this.Record = new Currency();
                    this.Record.curr_slno = parseInt(CurrArray[i], 10);
                    this.Record.curr_code = CurrArray[i + 1];
                    this.Record.curr_name = CurrArray[i + 2];
                    this.Record.curr_per_rate = parseFloat(CurrArray[i + 3]);
                    this.Record.curr_imp_rate = parseFloat(CurrArray[i + 4]);
                    this.Record.curr_exp_rate = parseFloat(CurrArray[i + 5]);
                    this.RecordList.push(this.Record);
                } catch (error) {
                    bRet = false;
                    this.ErrorMessage = error.message;
                    alert(this.ErrorMessage);
                    break;
                }
                bRet = true;
            }
        } else {
            bRet = this.rowConvertData();
        }
        return bRet;
    }

    rowConvertData() {
        let bRet = false;
        const CurrArray = this.cbdata.split('\n');
        this.RecordList = new Array<Currency>();
        for (let i = 1; i < CurrArray.length; i++) {
            try {
                const parts = CurrArray[i].split(" ").filter(p => p.trim().length > 0);
                if (parts.length < 6) continue;

                this.Record = new Currency();
                this.Record.curr_slno = parseInt(parts[0], 10);
                this.Record.curr_code = parts[1];
                let currIndex = 2;
                while (currIndex < parts.length && isNaN(Number(parts[currIndex]))) {
                    currIndex++;
                }
                const currencyName = parts.slice(2, currIndex).join(" ");
                this.Record.curr_name = currencyName;
                this.Record.curr_per_rate = Number(parts[currIndex++]);
                this.Record.curr_imp_rate = Number(parts[currIndex++]);
                this.Record.curr_exp_rate = Number(parts[currIndex++]);
                this.RecordList.push(this.Record);

            } catch (error) {
                bRet = false;
                this.ErrorMessage = error.message;
                alert(this.ErrorMessage);
                break;
            }
            bRet = true;
        }
        return bRet;
    }

    save() {
        if (this.type != "CURRENCY") {
            alert('This option can be used only in Currency Master, Invalid Type ' + this.type);
            return;
        }

        this.bSave = true;
        this.ErrorMessage = '';
        let saveRecord: Currency_vm = new Currency_vm;
        saveRecord.param_type = this.type;
        saveRecord.RecordDet = this.RecordList;
        saveRecord._globalvariables = this.gs.globalVariables;
        this.mainService.SaveParamImport(saveRecord)
            .subscribe(response => {
                this.bSave = false;
                alert(response.retmsg);
                if (this.CloseClicked != null)
                    this.CloseClicked.emit();
                //alert("Save Completed");
            }, error => {
                // this.ErrorMessage = this.gs.getError(error);
                this.bSave = false;
                alert(this.gs.getError(error));
            });
    }

}


