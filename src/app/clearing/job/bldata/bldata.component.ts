import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';

    loading = false;
    currentTab = 'LIST';

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';
    ctr: number;

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
        this.List("NEW");
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    InitLov() {

    }

    LovSelected(_Record: SearchTable) {

    }

    List(_type: string) {
        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
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
        Rec.bd_desc = '';
        Rec.bd_date = '';
        Rec.bd_hscode_id = '';
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
                this.InfoMessage = "Save Complete";
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

        // if (this.Record.cntr_no.trim().length <= 0) {
        //   bret = false;
        //   sError += "\n\r | Container Number Cannot Be Blank";
        // }

        // if (this.Record.cntr_size.trim().length <= 0) {
        //     bret = false;
        //     sError += "\n\r | Container Size Cannot Be Blank";
        // }


        // if (bret === false)
        //     this.ErrorMessage = sError;
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
            // case 'cntr_no':
            //     {
            //   this.Record.cntr_no = this.Record.cntr_no.replace(oldChar, '').toUpperCase();
            //         break;
            //     }
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
