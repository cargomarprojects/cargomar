import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { LedgertRemarks } from '../models/ledgertremarks';
import { LedgerRemarksService } from '../services/ledgerremarks.service';

@Component({
    selector: 'app-osrem2',
    templateUrl: './osrem2.component.html',
    providers: [LedgerRemarksService]
})
export class OsRemarkComponent {

    // Local Variables 
    title = 'Remarks';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';
    @Output() ModifiedRecords = new EventEmitter<any>();

    InitCompleted: boolean = false;
    menu_record: any;
    closecaption: string = 'Close';
    modal: any;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    adminText = "";
    ErrorMessage = "";
    InfoMessage = "";

    mode = 'ADD';
    pkid = '';

    // Array For Displaying List
    RecordList: LedgertRemarks[] = [];
    // Single Record for add/edit/view details
    Record: LedgertRemarks = new LedgertRemarks;

    user_code: string = this.gs.globalVariables.user_code;
    From_Date: string = "";
    To_Date: string = "";

    filename: string = "";
    IsCompany: boolean = false;
    IsAdmin: boolean = false;
    bPrint: boolean = true;
    bDocs: boolean = false;

    constructor(
        private modalService: NgbModal,
        private mainService: LedgerRemarksService,
        private route: ActivatedRoute,
        public gs: GlobalService
    ) {

        this.page_count = 0;
        this.page_rows = 25;
        this.page_current = 0;

        this.InitLov();

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.InitComponent();
        this.newRecord();
        this.List('NEW');

    }

    newRecord() {
        this.mode = 'ADD';
        this.ErrorMessage = '';
        this.pkid = this.gs.getGuid();
        this.Record = new LedgertRemarks();
        this.Record.rem_pkid = this.pkid;
        this.Record.rem_parent_id = this.parentid;
        this.Record.rec_created_date = this.gs.defaultValues.today;
        this.Record.rem_remarks = "";
        this.Record.rem_type = "";
    }

    InitComponent() {
        this.IsAdmin = false;
        this.IsCompany = false;
        this.bPrint = false;
        this.bDocs = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_admin)
                this.IsAdmin = true;
            if (this.menu_record.rights_company)
                this.IsCompany = true;
            if (this.menu_record.rights_print)
                this.bPrint = true;
            if (this.menu_record.rights_docs)
                this.bDocs = true;
            this.adminText = this.menu_record.rights_approval;
        }
        this.LoadCombo();
    }


    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        // this.sub.unsubscribe();
    }


    InitLov() {


    }



    LoadCombo() {

        // this.loading = true;
        // let SearchData = {
        //   type: 'type',
        //   comp_code: this.gs.globalVariables.comp_code,
        //   branch_code: this.gs.globalVariables.branch_code
        // };

        // this.ErrorMessage = '';
        // this.InfoMessage = '';
        // this.mainService.LoadDefault(SearchData)
        //   .subscribe(response => {
        //     this.loading = false;
        //     this.List("NEW");
        //   },
        //     error => {
        //       this.loading = false;
        //       this.ErrorMessage = this.gs.getError(error);
        //     });
    }


    LovSelected(_Record: any) {

    }

    // Query List Data
    List(_type: string) {
        this.loading = true;
        let SearchData = {
            type: _type,
            parent_id: this.parentid,
            output_type: 'SCREEN',
            user_code: this.gs.globalVariables.user_code,
            user_pkid: this.gs.globalVariables.user_pkid,
            company_code: this.gs.globalVariables.user_company_code,
            branch_code: this.gs.globalVariables.branch_code,
            branch_codes: this.gs.globalVariables.branch_code
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
                    alert(this.ErrorMessage);
                });
    }

    // Save Data
    Save() {
        if (!this.allvalid()) {
            alert(this.ErrorMessage);
            return;
        }
        let _type: string = "";
        let _remarks: string = "";
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record._globalvariables = this.gs.globalVariables;
        this.Record.rem_pkid = this.pkid;
        this.Record.rem_parent_id = this.parentid;
        this.Record.rem_remarks = this.Record.rem_remarks.toUpperCase();
        this.Record.rec_created_by = this.gs.globalVariables.user_code;
        this.Record.rec_created_date = this.gs.defaultValues.today;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = "";
                _type = "";
                _remarks = "";
                if (response.mode == "EDIT") {
                    for (let rec of this.RecordList.filter(rec => rec.rem_pkid == this.pkid)) {
                        rec.rem_type = this.gs.isBlank(this.Record.rem_type) ? 'NA' : this.Record.rem_type;
                        rec.rem_remarks = this.Record.rem_remarks;
                        _type = this.Record.rem_type;
                        _remarks = this.Record.rem_remarks;
                    }
                    this.newRecord();
                } else {
                    _type = this.Record.rem_type;
                    _remarks = this.Record.rem_remarks;
                    this.Record.rem_type = this.gs.isBlank(this.Record.rem_type) ? 'NA' : this.Record.rem_type;
                    this.RecordList.push(this.Record);
                    this.newRecord();
                }
                if (this.ModifiedRecords != null)
                    this.ModifiedRecords.emit({ saction: 'SAVE', type: _type, remarks: _remarks });
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

        if (this.adminText != "ADMIN") {
            if (this.Record.rem_type != '') {
                bret = false;
                sError += " | You can select the type as NA only ";
            }
        }

        if (this.gs.isBlank(this.Record.rem_remarks)) {
            bret = false;
            sError += " | Remarks Cannot Be Blank ";
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    OnBlur(field: string) {
        if (field == 'rem_remarks') {
            this.Record.rem_remarks = this.Record.rem_remarks.toUpperCase();
        }
    }

    Close() {
        if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ saction: 'CLOSE', type: this.Record.rem_type, remarks: this.Record.rem_remarks });
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    editRecord(Id: string) {

        this.loading = true;
        let SearchData = {
            pkid: Id,
        };

        this.mode = 'EDIT';
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.LoadData(response.record);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    LoadData(_Record: LedgertRemarks) {
        this.pkid = _Record.rem_pkid;
        this.Record.rem_pkid = this.pkid;
        this.Record.rem_type = _Record.rem_type;
        this.Record.rem_remarks = _Record.rem_remarks;
    }


}
