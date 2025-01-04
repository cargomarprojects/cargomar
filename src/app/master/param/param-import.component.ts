import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { ParamService } from '../services/param.service';
import { Currency } from '../models/param';

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
        return bRet;
    }

    save() {
        // if (this.type != "PN-CI") {
        //     alert('This option can be used only in Inward Credit Note(GE), Invalid Type ' + this.type);
        //     return;
        // }

        // const rec = this.Records.find(f => f.status != "");
        // if (rec) {
        //     alert('Records Already Saved');
        //     return;
        // }


        // this.bSave = true;

        // this.ErrorMessage = '';

        // this.Record.jvh_type = this.type;
        // this.Record.jvh_subtype = "AR";
        // this.Record.jvh_headerdrcr = "DR";
        // this.Record.branch_gstin_state_code = this.gs.defaultValues.gstin_state_code;
        // this.Record._globalvariables = this.gs.globalVariables;

        // this.mainService.SaveCiGeImport(this.Record)
        //     .subscribe(response => {
        //         this.Records = response.record;
        //         this.bSave = false;
        //         if (this.CloseClicked != null)
        //             this.CloseClicked.emit({ records: this.Records, data: '' });
        //         //alert("Save Completed");
        //     }, error => {
        //         // this.ErrorMessage = this.gs.getError(error);
        //         this.bSave = false;
        //         alert(this.gs.getError(error));
        //     });
    }

}


