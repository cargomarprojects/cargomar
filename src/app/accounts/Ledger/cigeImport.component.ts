import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { LedgerService } from '../services/ledger.service';
import { CiGeImport, CiGeImportDet } from '../models/cigeimport';

@Component({
    selector: 'App-cigeimport',
    templateUrl: './cigeimport.component.html',
    providers: [LedgerService]
})
export class CiGeImportComponent implements OnInit {

    @Output() CloseClicked = new EventEmitter<{ records: any[], data: string }>()
    @Input() msg: string;
    @Input() type: string;
    ErrorMessage: string = '';
    cbdata: string = '';
    Record: CiGeImport;
    Records: any[];
    jsonString: any;
    currentTab = 'PASTEDATA';
    ExcelFormat: string = '';
    bSave = false;

    constructor(
        private mainService: LedgerService,
        private gs: GlobalService
    ) {
    }

    ngOnInit() {
        this.currentTab = 'PASTEDATA';
        this.ExcelFormat = this.type == "PN-CI" ? "PN-CI-GE2" : this.type;
    }

    PasteDataClosed(cbdata: string) {
        this.cbdata = cbdata;
        this.ConvertData();
        this.currentTab = "LIST";
    }

    cancel() {
        this.cbdata = "";
        this.jsonString = "";
        this.Records = [];
        this.currentTab = "PASTEDATA";
    }

    ConvertData() {
        let tot_cols: number = 12;
        if (this.type == "PN-JV")
            tot_cols = 17;
        const list = this.gs.CSVToJSON(this.cbdata);

        this.Records = list.reduce((acc: any[], rec: any) => {
            const len = Object.keys(rec).length;
            if (len == tot_cols) {
                const amt = rec["amt"];
                if (amt != "")
                    acc.push({ ...rec, status: '' });
            }
            return acc;
        }, []);

        this.jsonString = JSON.stringify(this.Records);

        this.Record = new CiGeImport();
        this.Record.records = <CiGeImportDet[]>this.Records;
    }

    save() {
        let _bOk: boolean = false;
        if (this.type == "PN-CI" || this.type == "PN-JV")
            _bOk = true;

        if (!_bOk) {
            alert('This option can be used only in Inward Credit Note(GE)/General Expense, Invalid Type ' + this.type);
            return;
        }

        const rec = this.Records.find(f => f.status != "");
        if (rec) {
            alert('Records Already Saved');
            return;
        }

        if (this.type == "PN-CI")
            this.saveCiGe();
        if (this.type == "PN-JV")
            this.saveGe();
    }

    saveCiGe() {

        this.bSave = true;
        this.ErrorMessage = '';
        this.Record.jvh_type = this.type;
        this.Record.jvh_subtype = "AR";
        this.Record.jvh_headerdrcr = "DR";
        this.Record.branch_gstin_state_code = this.gs.defaultValues.gstin_state_code;
        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.SaveCiGeImport(this.Record)
            .subscribe(response => {
                this.Records = response.record;
                this.bSave = false;
                if (this.CloseClicked != null)
                    this.CloseClicked.emit({ records: this.Records, data: '' });
                //alert("Save Completed");
            }, error => {
                // this.ErrorMessage = this.gs.getError(error);
                this.bSave = false;
                alert(this.gs.getError(error));
            });
    }

    saveGe() {

        this.bSave = true;
        this.ErrorMessage = '';
        this.Record.jvh_type = this.type;
        this.Record.jvh_subtype = "AP";
        this.Record.jvh_headerdrcr = "CR";
        this.Record.branch_gstin_state_code = this.gs.defaultValues.gstin_state_code;
        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.SaveGeImport(this.Record)
            .subscribe(response => {
                this.Records = response.record;
                this.bSave = false;
                if (this.CloseClicked != null)
                    this.CloseClicked.emit({ records: this.Records, data: '' });
                //alert("Save Completed");
            }, error => {
                // this.ErrorMessage = this.gs.getError(error);
                this.bSave = false;
                alert(this.gs.getError(error));
            });
    }
}


