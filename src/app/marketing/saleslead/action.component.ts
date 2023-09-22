import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkSalesleadd } from '../models/marksaleslead';
import { MarkSalesleadService } from '../services/marksaleslead.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-action',
    templateUrl: './action.component.html',
    providers: [MarkSalesleadService]
})
export class ActionComponent {

    // Local Variables 
    title = 'Visit Detail';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() rec_user_id: string = '';
    @Input() parentData: any;
    @Output() actionsChanged = new EventEmitter<any>();

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

    ErrorMessage = "";
    InfoMessage = "";

    mode = 'ADD';
    pkid = '';
    uploadpkid = '';
    followupcount: string = '';
    category: string = "";
    // Array For Displaying List
    RecordList: MarkSalesleadd[] = [];
    // Single Record for add/edit/view details
    Record: MarkSalesleadd = new MarkSalesleadd;

    From_Date: string = "";
    To_Date: string = "";

    filename: string = "";
    IsCompany: boolean = false;
    IsAdmin: boolean = false;
    bPrint: boolean = true;
    bDocs: boolean = false;

    constructor(
        private modalService: NgbModal,
        private mainService: MarkSalesleadService,
        private route: ActivatedRoute,
        public gs: GlobalService
    ) {

        this.page_count = 0;
        this.page_rows = 25;
        this.page_current = 0;

        this.InitLov();

        // URL Query Parameter 
        // this.sub = this.route.queryParams.subscribe(params => {
        //     if (params["parameter"] != "") {
        //         this.InitCompleted = true;
        //         var options = JSON.parse(params["parameter"]);
        //         this.menuid = options.menuid;
        //         this.type = options.type;
        //         this.InitComponent();
        //     }
        // });

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.InitComponent();
        this.newRecord();
        this.List('ACTIONS');

    }

    newRecord() {
        this.mode = 'ADD';
        this.ErrorMessage = '';
        this.pkid = this.gs.getGuid();
        this.Record = new MarkSalesleadd();
        this.Record.msld_pkid = this.pkid;
        this.Record.msld_date = this.gs.defaultValues.today;
        this.Record.msld_remarks = "";
        this.Record.msld_action_plan = "";
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
        }
        this.category = 'SALESLEAD';
        if (this.menuid == 'MARKCONTACTS')
            this.category = 'CONTACTS';
        else if (this.menuid == 'MARKMARKETING')
            this.category = 'VISITDETAILS';
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
            parent_id: this.parentData.parent_id,
            output_type: 'SCREEN',
            user_pkid: this.gs.globalVariables.user_pkid,
            company_code: this.gs.globalVariables.user_company_code,
            branch_code: this.gs.globalVariables.branch_code,
            branch_codes: this.gs.globalVariables.branch_code
        };
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.getSalesleadActions(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.RecordList = response.list;
                    this.followupcount = this.RecordList.length.toString();
                    // this.page_count = response.page_count;
                    // this.page_current = response.page_current;
                    // this.page_rowcount = response.page_rowcount;
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }


    // Save Data
    Save() {
        if (!this.allvalid()) {
            alert(this.ErrorMessage);
            return;
        }
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record._globalvariables = this.gs.globalVariables;
        this.Record.msld_pkid = this.pkid;
        this.Record.msld_parent_id = this.parentData.parent_id;
        this.Record.msld_remarks = this.Record.msld_remarks.toUpperCase();
        this.Record.msld_action_plan = this.Record.msld_action_plan.toUpperCase();
        this.Record.msld_user_id = this.gs.globalVariables.user_pkid;
        this.Record.msld_user_name = this.gs.globalVariables.user_name;
        this.Record.msld_category = this.category;
        this.Record.msld_status = this.parentData.followupstatus;

        this.mainService.SaveSalesleadActions(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = "";
                if (response.mode == "EDIT") {
                    for (let rec of this.RecordList.filter(rec => rec.msld_pkid == this.pkid)) {
                        rec.msld_date = this.Record.msld_date;
                        rec.msld_remarks = this.Record.msld_remarks;
                        rec.msld_action_plan = this.Record.msld_action_plan;
                    }
                    this.newRecord();
                } else {
                    this.RecordList.push(this.Record);
                    this.newRecord();
                    this.followupcount = this.RecordList.length.toString();
                    if (this.actionsChanged != null)
                        this.actionsChanged.emit({ saction: 'SAVE', sfollowupcount: this.followupcount, sfollowupstatus: this.parentData.followupstatus });
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

        if (this.gs.isBlank(this.Record.msld_date)) {
            bret = false;
            sError = " | Date Cannot Be Blank ";
        }

        let str: string = "";
        if (!this.gs.isBlank(this.Record.msld_remarks))
            str += this.Record.msld_remarks.trim();
        if (!this.gs.isBlank(this.Record.msld_action_plan))
            str += this.Record.msld_action_plan.trim();

        if (str.trim().length <= 0) {
            bret = false;
            if (this.parentData != null) {
                if (this.parentData.hide_plan)
                    sError += "| Remarks Cannot Be Blank ";
                else
                    sError += "| Remarks or Plan Cannot Be Blank ";
            } else
                sError += "| Remarks or Plan Cannot Be Blank ";
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    OnBlur(field: string) {

        if (field == 'msld_remarks') {
            this.Record.msld_remarks = this.Record.msld_remarks.toUpperCase();
        }
        if (field == 'msld_action_plan') {
            this.Record.msld_action_plan = this.Record.msld_action_plan.toUpperCase();
        }
    }

    Close() {
        if (this.actionsChanged != null)
            this.actionsChanged.emit({ saction: 'CLOSE', sfollowupcount: this.followupcount });
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
        this.mainService.GetRecordSalesleadActions(SearchData)
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

    LoadData(_Record: MarkSalesleadd) {
        this.pkid = _Record.msld_pkid;
        this.Record.msld_pkid = this.pkid;
        this.Record.msld_remarks = _Record.msld_remarks;
        this.Record.msld_action_plan = _Record.msld_action_plan;
    }

    ShowDocuments(doc: any, _rec: MarkSalesleadd = null) {
        this.ErrorMessage = '';
        this.uploadpkid = _rec.msld_pkid;
        this.open(doc);
    }
}
