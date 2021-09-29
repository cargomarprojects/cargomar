import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { GenRemarks } from '../models/genremarks';
import { GenRemarksService } from '../services/genremarks.service';
//CREATE-AJITH-29-09-2021

@Component({
    selector: 'app-genremarks2',
    templateUrl: './genremarks2.component.html',
    providers: [GenRemarksService]
})

export class GenRemarks2Component {
    // Local Variables 
    title = '';

    @ViewChild('_txtremark') private txtremark_ctrl: ElementRef;
    private _pkid: string;
    @Input() set pkid(value: string) {
        this._pkid = value;
    }

    private _grtype: string = '';
    @Input() set type(value: string) {
        this._grtype = value;
    }

    private _subtype: string;
    @Input() set subtype(value: string) {
        this._subtype = value;
    }

    @Output() ModifiedRecords = new EventEmitter<any>();

    remarks: string = '';

    InitCompleted: boolean = false;

    loading = false;
    currentTab = 'LIST';


    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";

    mode = '';

    // Array For Displaying List
    RecordList: GenRemarks[] = [];
    // Single Record for add/edit/view details
    Record: GenRemarks = new GenRemarks;

    constructor(
        private mainService: GenRemarksService,
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.InitLov();
        this.List("NEW");
    }

    InitComponent() {

    }

    InitLov() {

    }
    LovSelected(_Record: SearchTable) {
    }

    List(_type: string) {

        this.loading = true;
        let SearchData = {
            type: _type,
            grpkid: this._pkid,
            grtype: this._grtype,
            grsubtype: this._subtype
        };
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
                if (this.txtremark_ctrl != null && this.txtremark_ctrl != undefined)
                    this.txtremark_ctrl.nativeElement.focus();
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    // Save Data
    Save() {

        if (!this.allvalid())
            return;

        this.Record = new GenRemarks();
        this.Record.gr_pkid = this._pkid;
        this.Record.gr_uid = this.gs.getGuid();
        this.Record.gr_type = this._grtype;
        this.Record.gr_subtype = this._subtype;
        this.Record.gr_remarks = this.remarks;
        this.Record._globalvariables = this.gs.globalVariables;

        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                if (response.retvalue) {

                    if (this.RecordList == null || this.RecordList == undefined)
                        this.RecordList = new Array<GenRemarks>();
                    this.Record.rec_created_by = this.gs.globalVariables.user_code;
                    this.Record.rec_created_date = response.sdate;
                    this.RecordList.push(this.Record);

                    this.remarks = '';
                    if (this.txtremark_ctrl != null && this.txtremark_ctrl != undefined)
                        this.txtremark_ctrl.nativeElement.focus();

                    // if (this.ModifiedRecords != null)
                    //     this.ModifiedRecords.emit({ saction: "SAVE", pkid: this._pkid, remarks: this.remarks });
                }

            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);

                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        if (this.remarks.toString().length <= 0) {
            bret = false;
            sError = " | Remarks Cannot Be Blank";
        }

        if (bret === false) {
            this.ErrorMessage = sError;
            alert(this.ErrorMessage);
        }
        return bret;
    }


    Close() {
        if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ saction: "CLOSE", pkid: this.pkid });
    }

    OnBlur(field: string) {
        switch (field) {
            case 'remarks':
                {
                    // this.remarks = this.remarks.toUpperCase();
                    // break;
                }
        }
    }



    RemoveRemarks(Id: string) {

        if (!confirm("Delete Remarks")) {
            return;
        }

        this.loading = true;
        let SearchData = {
            pkid: Id,
            parentid: this._pkid,
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code,
        };

        this.ErrorMessage = '';
        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = "Deleted Successfully";
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.gr_uid == Id), 1);
                alert(this.ErrorMessage);
                // if (this.ModifiedRecords != null)
                //     this.ModifiedRecords.emit({ saction: "DELETE", pkid: this._pkid, remarks: this.remarks });
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }
}