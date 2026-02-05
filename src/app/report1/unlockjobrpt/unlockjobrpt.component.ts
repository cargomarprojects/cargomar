import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { JobUnlock } from '../../master/models/jobunlock';
import { RepService } from '../services/report.service';

@Component({
    selector: 'app-unlockjobrpt',
    templateUrl: './unlockjobrpt.component.html',
    providers: [RepService]
})
export class UnlockJobrptComponent {
    // Local Variables 
    title = 'Unlock Details';

    @Input() public type: string = '';
    @Input() menuid: string = '';

    menu_record: any;
    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    sub: any;
    urlid: string;
    bExcel = false;
    bCompany = false;
    bAdmin = false;
    bEmail = false;
    bApprove = false;
    bPending: boolean = true;
    bshowDeleted: boolean = false;
    listShowDeleted: boolean = false;

    modal: any;
    selectedRowIndex = 0;
    chkallselected: boolean = false;
    selectdeselect: boolean = false;

    pkid: string;
    searchstring: string = '';
    //searchuser: string = '';
    searchtype: string = 'ALL';
    //searchmodule: string = '';
    //searchbranch: string = '';
    //searchaction: string = '';
    //searchremarks: string = '';
    from_date: string = '';
    to_date: string = '';
    branch_code = '';
    branch_name = '';
    shipper_id = '';
    consignee_id = '';
    shipper_name = '';
    consignee_name = '';
    billto_id = '';
    billto_name = '';

    sSubject: string = '';
    sMsg: string = '';
    sHtml: string = '';
    AttachList: any[] = [];

    page_count: number = 0;
    page_current: number = 0;
    page_rowcount: number = 0;
    page_rows: number = 0;

    ErrorMessage = "";
    InfoMessage = "";
    RecordList: JobUnlock[] = [];

    BRRECORD: SearchTable = new SearchTable();
    EXPRECORD: SearchTable = new SearchTable();
    IMPRECORD: SearchTable = new SearchTable();
    BILLTORECORD: SearchTable = new SearchTable();

    constructor(
        private modalService: NgbModal,
        private mainService: RepService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 20;
        this.page_current = 0;
        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                this.InitCompleted = true;
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.type = options.type;
                this.InitComponent();
            }
        });
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.LoadCombo();
    }

    InitComponent() {
        this.to_date = this.gs.defaultValues.today;
        this.from_date = this.gs.defaultValues.today;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_company)
                this.bCompany = true;
            if (this.menu_record.rights_admin)
                this.bAdmin = true;
            if (this.menu_record.rights_print)
                this.bExcel = true;
            if (this.menu_record.rights_email)
                this.bEmail = true;
            if (this.menu_record.rights_approval.length > 0) {
                if (this.menu_record.rights_approval.toString().indexOf('{APPROVE}') >= 0 || this.gs.globalVariables.user_code == "ADMIN")
                    this.bApprove = true;
            }
        }
        this.InitLov();
    }

    InitLov() {
        this.BRRECORD = new SearchTable();
        this.BRRECORD.controlname = "BRANCH";
        this.BRRECORD.displaycolumn = "CODE";
        this.BRRECORD.type = "BRANCH";
        this.BRRECORD.id = "";
        if (this.bCompany)
            this.BRRECORD.code = "";
        else
            this.BRRECORD.code = this.gs.globalVariables.branch_code;


        this.EXPRECORD = new SearchTable();
        this.EXPRECORD.controlname = "SHIPPER";
        this.EXPRECORD.displaycolumn = "NAME";
        this.EXPRECORD.type = "CUSTOMER";
        this.EXPRECORD.where = "";
        this.EXPRECORD.id = "";
        this.EXPRECORD.code = "";
        this.EXPRECORD.name = "";
        this.EXPRECORD.parentid = "";


        this.IMPRECORD = new SearchTable();
        this.IMPRECORD.controlname = "CONSIGNEE";
        this.IMPRECORD.displaycolumn = "NAME";
        this.IMPRECORD.type = "CUSTOMER";
        this.IMPRECORD.where = "";
        this.IMPRECORD.id = "";
        this.IMPRECORD.code = "";
        this.IMPRECORD.name = "";
        this.IMPRECORD.parentid = "";

        this.BILLTORECORD = new SearchTable();
        this.BILLTORECORD.controlname = "BILLTO";
        this.BILLTORECORD.displaycolumn = "NAME";
        this.BILLTORECORD.type = "CUSTOMER";
        this.BILLTORECORD.where = " CUST_IS_SHIPPER = 'Y' ";
        this.BILLTORECORD.id = "";
        this.BILLTORECORD.code = "";
        this.BILLTORECORD.name = "";
        this.BILLTORECORD.parentid = "";
    }
    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "BRANCH") {
            this.branch_code = _Record.code;
            this.branch_name = _Record.name;
        }
        if (_Record.controlname == "SHIPPER") {
            this.shipper_id = _Record.id;
            this.shipper_name = _Record.name;
        }
        if (_Record.controlname == "CONSIGNEE") {
            this.consignee_id = _Record.id;
            this.consignee_name = _Record.name;
        }
        if (_Record.controlname == "BILLTO") {
            this.billto_id = _Record.id;
            this.billto_name = _Record.name;
        }

    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    LoadCombo() {
    }

    chkReset(_rec: JobUnlock) {
        _rec.ul_selected = !_rec.ul_selected;
    }
    OnChange(field: string) {

    }
    // Save Data
    OnBlur(field: string) {
        // if (field == 'searchuser') {
        //     this.searchuser = this.searchuser.toUpperCase();
        // }
        // if (field == 'searchtype') {
        //     this.searchtype = this.searchtype.toUpperCase();
        // }

    }
    Close() {
        this.gs.ClosePage('home');
    }

    // AutoMail(_type: string) {
    //     this.InfoMessage = "";
    //     this.ErrorMessage = '';
    //     this.pkid = this.gs.getGuid();
    //     this.loading = true;
    //     let SearchData = {
    //         type: _type,
    //         report_folder: this.gs.globalVariables.report_folder,
    //         comp_code: this.gs.globalVariables.comp_code,
    //         from_date: this.from_date,
    //         to_date: this.to_date,
    //         auto_mail: "Y"
    //     };

    //     this.ErrorMessage = '';
    //     this.mainService.UnlockJobReport(SearchData)
    //         .subscribe(response => {
    //             this.loading = false;
    //             
    //         },
    //             error => {
    //                 this.loading = false;
    //                 this.RecordList = null;
    //                 this.ErrorMessage = this.gs.getError(error);
    //             });
    // }

    List(_type: string, mailsent: any) {

        if (_type == 'MAIL') {
            if (!confirm("Do you want to Sent Requested/Approved List")) {
                return;
            }
        }
        this.listShowDeleted = this.bshowDeleted;
        this.InfoMessage = "";
        this.ErrorMessage = '';
        this.pkid = this.gs.getGuid();
        this.loading = true;
        let SearchData = {
            pkid: this.pkid,
            type: _type,
            rowtype: this.type,
            report_folder: this.gs.globalVariables.report_folder,
            searchstring: this.searchstring.toUpperCase(),
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            branch_name: this.gs.globalVariables.branch_name,
            user_pkid: this.gs.globalVariables.user_pkid,
            year_code: this.gs.globalVariables.year_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            from_date: this.from_date,
            to_date: this.to_date,
            searchtype: this.searchtype,
            shipper_id: this.shipper_id,
            shipper_name: this.shipper_name,
            consignee_id: this.consignee_id,
            consignee_name: this.consignee_name,
            billto_id: this.billto_id,
            billto_name: this.billto_name,
            bpending: this.bPending,
            bshowDeleted: this.bshowDeleted,
            auto_mail: "N"
        };

        if (this.bCompany) {
            SearchData.branch_code = this.branch_code;
            SearchData.branch_name = this.branch_name;
        }
        else {
            SearchData.branch_code = this.gs.globalVariables.branch_code;
            SearchData.branch_name = this.gs.globalVariables.branch_name;
        }

        this.ErrorMessage = '';
        this.mainService.UnlockJobReport(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.chkallselected = false;
                this.selectdeselect = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else if (_type == 'MAIL') {
                    this.AttachList = new Array<any>();
                    this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname });
                    this.sSubject = response.subject;
                    this.sMsg = '';
                    this.sHtml = response.message;
                    this.open(mailsent);
                }
                else {
                    this.RecordList = response.list;
                    this.page_count = response.page_count;
                    this.page_current = response.page_current;
                    this.page_rowcount = response.page_rowcount;
                }
            },
                error => {
                    this.loading = false;
                    this.RecordList = null;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    SelectDeselect() {
        this.selectdeselect = !this.selectdeselect;
        for (let rec of this.RecordList) {
            rec.ul_selected = this.selectdeselect;
        }
    }

    ApproveCrLimitRequest() {

        let sPkids: string = "";
        for (let rec of this.RecordList.filter(rec => rec.ul_selected == true)) {
            if (sPkids != "")
                sPkids += ",";
            sPkids += rec.ul_pkid;
        }

        if (sPkids == "") {
            this.ErrorMessage = "No records selected";
            alert(this.ErrorMessage);
            return;
        }

        if (!confirm("Approve Credit Limit Request")) {
            return;
        }

        this.loading = true;
        let SearchData = {
            pkid: sPkids,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            branch_name: this.gs.globalVariables.branch_name,
            year_code: this.gs.globalVariables.year_code,
            user_code: this.gs.globalVariables.user_code,
            user_name: this.gs.globalVariables.user_name,
            user_short_name: this.gs.globalVariables.user_short_name,
            user_pkid: this.gs.globalVariables.user_pkid,
            report_folder: this.gs.globalVariables.report_folder,
            root_folder: this.gs.defaultValues.root_folder,
            sub_folder: this.gs.defaultValues.sub_folder
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.ApproveCrLimitRequest(SearchData)
            .subscribe(response => {
                this.loading = false;
                for (let rec of this.RecordList.filter(rec => rec.ul_selected == true)) {
                    rec.ul_locked = 'N';
                }
                this.InfoMessage = response.error;
                alert(this.InfoMessage);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }
}
