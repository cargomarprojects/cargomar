import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { LlmDoc } from '../models/llmdoc';
import { LlmDocService } from '../services/llmdoc.services';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-llmdoc',
    templateUrl: './llmdoc.component.html',
    providers: [LlmDocService]
})

export class LlmDocComponent {
    // Local Variables 
    title = 'LLM Documents';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    disableSave = true;
    loading = false;
    bDocs: boolean = false;
    bExcel: boolean = false;
    sub: any;
    urlid: string;
    modal: any;

    // Single Record for add/edit/view details
    Record: LlmDoc = new LlmDoc;

    constructor(
        private modalService: NgbModal,
        public mainService: LlmDocService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.InitLov();

        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                // this.InitCompleted = true;
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.type = options.type;
                // this.InitComponent();
            }
        });
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (!this.InitCompleted) {
            this.InitCompleted = true;
            this.InitComponent();
        }

        this.mainService.init(this.menuid);
        if (this.mainService.state.mode == "ADD")
            this.ActionHandler('ADD', '');
        else if (this.mainService.state.mode == "EDIT")
            this.ActionHandler('EDIT', this.mainService.state.pkid)

    }

    InitComponent() {
        this.bDocs = false;
        this.bExcel = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_docs)
                this.bDocs = true;
            if (this.menu_record.rights_print)
                this.bExcel = true;
        }
        this.LoadCombo();
        // this.List("NEW");
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    LoadCombo() {
    }

    InitLov() {

    }

    LovSelected(_Record: SearchTable) {
        // if (_Record.controlname == "ACCTM") {
        //     this.Record.te_tds_acc_id = _Record.id;
        //     this.Record.te_tds_acc_code = _Record.code;
        //     this.Record.te_tds_acc_name = _Record.name;
        // }
    }


    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.mainService.state.ErrorMessage = '';
        if (action == 'LIST') {
            this.mainService.state.mode = '';
            this.mainService.state.pkid = '';
            this.mainService.state.currentTab = 'LIST';
        }
        else if (action === 'ADD') {
            this.mainService.state.currentTab = 'DETAILS';
            this.mainService.state.mode = 'ADD';
            this.ResetControls();
            this.NewRecord();
        }
        else if (action === 'EDIT') {
            this.mainService.state.currentTab = 'DETAILS';
            this.mainService.state.mode = 'EDIT';
            this.ResetControls();
            this.mainService.state.pkid = id;
            this.GetRecord(id);
        }
    }


    ResetControls() {
        this.disableSave = true;
        if (!this.menu_record)
            return;

        if (this.menu_record.rights_admin)
            this.disableSave = false;
        if (this.mainService.state.mode == "ADD" && this.menu_record.rights_add)
            this.disableSave = false;
        if (this.mainService.state.mode == "EDIT" && this.menu_record.rights_edit)
            this.disableSave = false;
        return this.disableSave;
    }

    // Query List Data
    List(_type: string) {

        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this.mainService.state.searchstring.toUpperCase(),
            page_count: this.mainService.state.page_count,
            page_current: this.mainService.state.page_current,
            page_rows: this.mainService.state.page_rows,
            page_rowcount: this.mainService.state.page_rowcount,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            report_folder: this.gs.globalVariables.report_folder
        };
        this.mainService.state.ErrorMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.reportfile, _type, response.filedisplayname);
                else {
                    this.mainService.state.RecordList = response.list;
                    this.mainService.state.page_count = response.page_count;
                    this.mainService.state.page_current = response.page_current;
                    this.mainService.state.page_rowcount = response.page_rowcount;
                }
            },
                error => {
                    this.loading = false;
                    this.mainService.state.ErrorMessage = this.gs.getError(error);
                    alert(this.mainService.state.ErrorMessage);
                });
    }

    NewRecord() {

        this.mainService.state.pkid = this.gs.getGuid();
        this.Record = new LlmDoc();
        this.Record.ld_pkid = this.mainService.state.pkid;
        this.Record.ld_slno = '';
        this.Record.ld_remarks = '';
        this.Record.rec_mode = this.mainService.state.mode;

        this.InitLov();
    }

    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
        this.loading = true;

        let SearchData = {
            pkid: Id,
        };

        this.mainService.state.ErrorMessage = '';
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.LoadData(response.record);
            },
                error => {
                    this.loading = false;
                    this.mainService.state.ErrorMessage = this.gs.getError(error);
                    alert(this.mainService.state.ErrorMessage);
                });
    }

    LoadData(_Record: LlmDoc) {
        this.Record = _Record;
        this.InitLov();

        // this.Record.rec_mode = this.mode;
        this.Record.rec_mode = this.mainService.state.mode;
    }


    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.mainService.state.ErrorMessage = '';

        this.Record._globalvariables = this.gs.globalVariables;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.mainService.state.ErrorMessage = "Save Complete";
                this.mainService.state.mode = 'EDIT';
                this.Record.rec_mode = this.mainService.state.mode;
                this.RefreshList();
                alert(this.mainService.state.ErrorMessage);
            },
                error => {
                    this.loading = false;
                    this.mainService.state.ErrorMessage = this.gs.getError(error);
                    alert(this.mainService.state.ErrorMessage);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.mainService.state.ErrorMessage = '';
        // if (this.Record.te_tds_acc_id.trim().length <= 0) {
        //     bret = false;
        //     sError = "A/c Code Need To Be Selected";
        // }
        // if (bret === false) {
        //     this.mainService.state.ErrorMessage = sError;
        //     alert(this.mainService.state.ErrorMessage);
        // }
        return bret;
    }

    RefreshList() {

        if (this.mainService.state.RecordList == null)
            return;
        var REC = this.mainService.state.RecordList.find(rec => rec.ld_pkid == this.Record.ld_pkid);
        if (REC == null) {
            this.mainService.state.RecordList.push(this.Record);
        }
        else {
            REC.ld_remarks = this.Record.ld_remarks;
        }
    }

    Close() {
        this.gs.ClosePage('home');
    }


    OnBlur(controlname: string) {

        if (controlname == 'ld_remarks') {
            this.Record.ld_remarks = this.Record.ld_remarks.toUpperCase();
        }
        if (controlname == 'searchstring') {
            this.mainService.state.searchstring = this.mainService.state.searchstring.toUpperCase();
        }
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }


}