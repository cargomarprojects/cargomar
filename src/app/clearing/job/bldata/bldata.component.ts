import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Bldata, SaveBldata } from '../../models/bldata';
import { BldataService } from '../../services/bldata.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
    selector: 'app-bldata',
    templateUrl: './bldata.component.html',
    providers: [BldataService]
})
export class BlDataComponent {
    // Local Variables 
    title = 'BlData';
    @ViewChildren('_hs_code') hs_code_field: QueryList<ElementRef>;
    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';
    @Input() category: string = '';

    loading = false;
    currentTab = 'LIST';

    Desc_Caption = "INVOICE.NO";
    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';
    ctr: number;

    RITCRECORD: SearchTable = new SearchTable();
    // Array For Displaying List
    RecordList: Bldata[] = [];
    // Single Record for add/edit/view details
    Record: Bldata = new Bldata;

    constructor(
        private mainService: BldataService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.InitLov();
    }

    // Init Will be called After executing Constructor
    ngOnInit() {

        if (this.type == "INVOICE")
            this.Desc_Caption = "INVOICE NO";
        else if (this.type == "SB")
            this.Desc_Caption = "SB NO";
        else if (this.type == "COMMODITY")
            this.Desc_Caption = "COMMODITY";
        else if (this.type == "DESC")
            this.Desc_Caption = "DESCRIPTION";
        this.List();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    InitLov() {

        // this.RITCRECORD = new SearchTable();
        // this.RITCRECORD.controlname = "RITC";
        // this.RITCRECORD.displaycolumn = "CODE";
        // this.RITCRECORD.type = "RITCM";
        // this.RITCRECORD.id = "";
        // this.RITCRECORD.code = "";
        // this.RITCRECORD.name = "";

    }

    LovSelected(_Record: SearchTable, idx: number = 0) {
        if (_Record.controlname == "RITC") {
            this.RecordList.forEach(rec => {
                if (rec.bd_pkid == _Record.uid) {
                    rec.bd_hscode_id = _Record.id;
                    rec.bd_hscode_code = _Record.code;
                    rec.bd_hscode_name = _Record.name;
                    // if (idx < this.cntr_sealno_field.toArray().length)
                    //   this.cntr_sealno_field.toArray()[idx].nativeElement.focus();
                }
            });
        }
    }

    List() {
        this.loading = true;
        let SearchData = {
            type: this.type,
            parentid: this.parentid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
                if (this.gs.isBlank(this.RecordList))
                    this.RecordList = new Array<Bldata>();
                if (this.RecordList.length == 0)
                    this.NewRecord();

            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }


    NewRecord() {

        let Rec: Bldata = new Bldata();
        Rec.bd_pkid = this.gs.getGuid();
        Rec.bd_parent_id = this.parentid;
        Rec.bd_type = this.type;
        Rec.bd_desc = '';
        Rec.bd_date = '';
        Rec.bd_hscode_id = '';
        Rec.bd_hscode_code = '';
        Rec.bd_hscode_name = '';
        Rec.rec_category = this.category;
        this.RecordList.push(Rec);
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        let Rec: SaveBldata = new SaveBldata;
        Rec.BldataList = this.RecordList;
        Rec.type = this.type;
        Rec.parentid = this.parentid;
        Rec._globalvariables = this.gs.globalVariables;
        this.mainService.Save(Rec)
            .subscribe(response => {
                this.loading = false;
                // this.InfoMessage = "Save Complete";
                alert('Save Complete')
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        let iCtr = 0;
        if (this.type == "COMMODITY") {

            for (let rec of this.RecordList) {
                iCtr++;
                if (this.gs.isBlank(rec.bd_hscode_code)) {
                    bret = false;
                    sError += "\n\r | HS Code Cannot Be Blank, Row" + iCtr.toString();
                } else if (rec.bd_hscode_code.trim().length < 8) {
                    bret = false;
                    sError += "\n\r | Invalid HS Code, Row" + iCtr.toString();
                }
                if (this.gs.isBlank(rec.bd_desc)) {
                    bret = false;
                    sError += "\n\r | Commodity Cannot Be Blank, Row" + iCtr.toString();
                }
                if (!bret)
                    break;
            }
        }
        if (this.type == "SB") {

            for (let rec of this.RecordList) {
                iCtr++;

                if (this.gs.isBlank(rec.bd_desc)) {
                    bret = false;
                    sError += "\n\r | SB Number Cannot Be Blank, Row" + iCtr.toString();
                }

                if (this.gs.isBlank(rec.bd_date)) {
                    bret = false;
                    sError += "\n\r | Date Cannot Be Blank, Row" + iCtr.toString();
                }
                if (!bret)
                    break;
            }
        }

        if (this.type == "INVOICE") {

            for (let rec of this.RecordList) {
                iCtr++;
                if (this.gs.isBlank(rec.bd_desc)) {
                    bret = false;
                    sError += "\n\r | Invoice Number Cannot Be Blank, Row" + iCtr.toString();
                }

                if (this.gs.isBlank(rec.bd_date)) {
                    bret = false;
                    sError += "\n\r | Date Cannot Be Blank, Row" + iCtr.toString();
                }
                if (!bret)
                    break;
            }
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    Close() {
        this.gs.ClosePage('home');
    }

    OnFocus(field: string) {

    }

    OnChange(field: string) {


    }

    OnBlur(field: string, rec: Bldata) {
        var oldChar = / /gi;//replace all blank space in a string
        switch (field) {
            case 'bd_desc':
                {
                    rec.bd_desc = rec.bd_desc.toUpperCase();
                    break;
                }
            // case 'cntr_sealno':
            //     {
            //         this.Record.cntr_sealno = this.Record.cntr_sealno.toUpperCase();
            //         break;
            //     }

        }
    }


    AddRow() {
        this.NewRecord();
    }

    RemoveRow(_id: string) {
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.bd_pkid == _id), 1);
        if (this.RecordList.length == 0)
            this.NewRecord();
    }
}
