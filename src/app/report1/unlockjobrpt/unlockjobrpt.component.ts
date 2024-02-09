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

    modal: any;
    selectedRowIndex = 0;

    pkid: string;
    searchstring: string = '';
    //searchuser: string = '';
    searchtype: string = 'JOB SEA EXPORT';
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
        this.page_rows = 50;
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
        }
        this.InitLov();
    }

    InitLov() {
        this.BRRECORD = new SearchTable();
        this.BRRECORD.controlname = "BRANCH";
        this.BRRECORD.displaycolumn = "CODE";
        this.BRRECORD.type = "BRANCH";
        this.BRRECORD.id = "";
        this.BRRECORD.code = this.gs.globalVariables.branch_code;


        this.EXPRECORD = new SearchTable();
        this.EXPRECORD.controlname = "SHIPPER";
        this.EXPRECORD.displaycolumn = "NAME";
        this.EXPRECORD.type = "CUSTOMER";
        this.EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
        this.EXPRECORD.id = "";
        this.EXPRECORD.code = "";
        this.EXPRECORD.name = "";
        this.EXPRECORD.parentid = "";


        this.IMPRECORD = new SearchTable();
        this.IMPRECORD.controlname = "CONSIGNEE";
        this.IMPRECORD.displaycolumn = "NAME";
        this.IMPRECORD.type = "CUSTOMER";
        this.IMPRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
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
            this.shipper_id = ''; this.shipper_name = '';
            this.consignee_id = ''; this.consignee_name = '';
            this.billto_id = ''; this.billto_name = '';
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

    List(_type: string, mailsent: any) {
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
            billto_name: this.billto_name
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
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else if (_type == 'MAIL') {
                    this.AttachList = new Array<any>();
                    this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname });
                    this.sSubject = response.subject;
                    this.sMsg = response.message;
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

}
