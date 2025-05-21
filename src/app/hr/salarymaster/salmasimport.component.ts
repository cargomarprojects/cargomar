import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { Salarym, SalMasImport, SalMasImportDet } from '../models/salarym';
import { SalDet } from '../models/salarym';
import { SalaryMasterService } from '../services/salarymaster.service';
import { forEach } from '@angular/router/src/utils/collection';

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
        this.ExcelFormat = "SALARY-MASTER";
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
        let tot_cols: number = 42;
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
        for (let rec of this.Record.records) {
            this.findTot(rec);
        }
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

    findTot(_rec: SalMasImportDet) {
        let totearn: number = 0;
        let totdedcut: number = 0;

        totearn = +_rec.basic;
        totearn += +_rec.da;
        totearn += +_rec.cca;
        totearn += +_rec.hra;
        totearn += +_rec.ent;
        totearn += +_rec.cnv;
        totearn += +_rec.uniw;
        totearn += +_rec.medi;
        totearn += +_rec.edu;
        totearn += +_rec.pa;
        totearn += +_rec.spla;
        totearn += +_rec.maint;
        totearn += +_rec.osa;
        totearn += +_rec.metro;
        totearn += +_rec.com;
        totearn += +_rec.vma;
        totearn += +_rec.fuel;
        totearn += +_rec.tele;
        totearn += +_rec.otheralw;
        totearn += +_rec.basic2;

        totdedcut = +_rec.pf;
        totdedcut += +_rec.esi;
        totdedcut += +_rec.tds;
        totdedcut += +_rec.lic;
        totdedcut += +_rec.vploan;
        totdedcut += +_rec.loan;
        totdedcut += +_rec.adv;
        totdedcut += +_rec.medclaim;
        totdedcut += +_rec.ptax;
        totdedcut += +_rec.exfuel;
        totdedcut += +_rec.exphone;
        totdedcut += +_rec.fine;
        totdedcut += +_rec.lwf;
        totdedcut += +_rec.vpf;
        totdedcut += +_rec.others;

        _rec.total_earn = totearn;
        _rec.total_deduct = totdedcut;
        _rec.sal_net = totearn - totdedcut;
    }
}
