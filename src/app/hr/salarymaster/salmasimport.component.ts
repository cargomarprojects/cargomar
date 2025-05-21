import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { Salarym, SalMasImport ,SalMasImportDet} from '../models/salarym';
import { SalDet } from '../models/salarym';
import { SalaryMasterService } from '../services/salarymaster.service';

@Component({
    selector: 'App-salmasimport',
    templateUrl: './salmasimport.component.html',
    providers: [SalaryMasterService]
})
export class SalMasImportComponent implements OnInit {

    @Output() CloseClicked = new EventEmitter<{ records: any[], data: string }>()
    @Input() msg: string;
    @Input() type: string;
    ErrorMessage: string = '';
    cbdata: string = '';
    Record: SalMasImport;
    Records: any[];
    jsonString: any;
    currentTab = 'PASTEDATA';
    ExcelFormat: string = '';
    bSave = false;

    constructor(
        private mainService: SalaryMasterService,
        private gs: GlobalService
    ) {
    }

    ngOnInit() {
        this.currentTab = 'PASTEDATA';
        this.ExcelFormat =  "SALARY-MASTER" ;
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
        let tot_cols: number = 27;
        const list = this.gs.CSVToJSON(this.cbdata);

        this.Records = list.reduce((acc: any[], rec: any) => {
            const len = Object.keys(rec).length;
            if (len == tot_cols) {
                const _code = rec["CODE"];
                if (_code != "")
                    acc.push({ ...rec, status: '' });
            }
            return acc;
        }, []);

        this.jsonString = JSON.stringify(this.Records);

        this.Record = new SalMasImport();
        this.Record.records = <SalMasImportDet[]>this.Records;
    }

    save() {
        
        const rec = this.Records.find(f => f.status != "");
        if (rec) {
            alert('Records Already Saved');
            return;
        }
        this.bSave = true;
        this.ErrorMessage = '';
        this.Record.sal_type = this.type;
        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.SaveSalMasImport(this.Record)
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
