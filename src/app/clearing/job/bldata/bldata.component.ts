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
        // this.ActionHandler("ADD", null);
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    InitLov() {

    }

    LovSelected(_Record: SearchTable) {

    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
        else if (action === 'ADD') {
            this.currentTab = 'DETAILS';
            this.mode = 'ADD';
            this.ResetControls();
            this.NewRecord();

        }
        else if (action === 'EDIT') {
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            this.ResetControls();
            this.pkid = id;
            // this.GetRecord(id);
        }
        else if (action === 'REMOVE') {
            this.currentTab = 'DETAILS';
            this.pkid = id;
            this.RemoveRecord(id);
        }
    }

    ResetControls() {

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
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    NewRecord() {

        this.pkid = this.gs.getGuid();
        this.Record = new Bldata();
        this.Record.bd_pkid = this.pkid;
        // this.Record.cntr_no = '';
        // this.Record.cntr_sealno = '';
        // this.Record.cntr_sealdate = '';
        // this.Record.cntr_size = '';
        // this.Record.cntr_type = 'GP';
        // this.Record.cntr_pkts = 0;
        // this.Record.cntr_transporter = '';
        // this.Record.cntr_sealtype = this.gs.defaultValues.sea_jobcntr_sealtype;
        // this.Record.cntr_sealdevice_id = '';
        // this.Record.cntr_movdoc_type = '';
        // this.Record.cntr_movdoc_number = '';

        this.Record.rec_mode = this.mode;
        this.InitLov();

        // this.cntr_no.nativeElement.focus();
    }

    // Load a single Record for VIEW/EDIT


    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        let Rec: SaveBldata = new SaveBldata;
        Rec.BldataList = this.RecordList;
        Rec._globalvariables = this.gs.globalVariables;
        this.mainService.Save(Rec)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = "Save Complete";
                this.mode = 'EDIT';
                // this.Record.rec_mode = this.mode;
                //   this.RefreshList();
                //   this.ActionHandler('ADD', null);
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



    RemoveList(event: any) {
        if (event.selected) {
            this.ActionHandler('REMOVE', event.id)
        }
    }
    RemoveRecord(Id: string) {
        // this.loading = true;
        // let SearchData = {
        //     pkid: Id,
        //     parentid: this.parentid
        // };

        // this.ErrorMessage = '';
        // this.InfoMessage = '';
        // this.mainService.DeleteRecord(SearchData)
        //     .subscribe(response => {
        //         this.loading = false;
        //         this.RecordList.splice(this.RecordList.findIndex(rec => rec.cntr_pkid == this.pkid), 1);
        //         this.ActionHandler('ADD', null);
        //     },
        //     error => {
        //         this.loading = false;
        //         this.ErrorMessage = this.gs.getError(error);
        //     });
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


    }
    RemoveRow() {

    }
}
