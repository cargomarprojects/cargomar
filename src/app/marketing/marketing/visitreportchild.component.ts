import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkMarketingm } from '../models/markmarketingm';
import { MarkMarketingService } from '../services/markmarketing.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-visitreportchild',
    templateUrl: './visitreportchild.component.html',
    providers: [MarkMarketingService]
})
export class VisitReportChildComponent {

    // Local Variables 
    title = 'Visit Detail';

    @Input() menuid: string = '';
    @Input() type: string = '';
    closecaption: string = 'Close';
    @Input() parentData: any;
    @Output() PageChanged = new EventEmitter<any>();

    InitCompleted: boolean = false;
    menu_record: any;

    modal: any;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    selectedRowIndex = 0;

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    searchstring = { searchstring: '' };
    searchdata = { searchstring: '' };
    ErrorMessage = "";
    InfoMessage = "";
    userCaption = "Sales Person";
    report_type = "SALES PERSON";
    print_format = "DETAIL";
    mode = '';
    pkid = '';
    myTable = {
        branch_id: '',
        branch_name: '',
        user_id: '',
        user_name: ''
    };

    // Array For Displaying List
    RecordList: MarkMarketingm[] = [];
    // Single Record for add/edit/view details
    Record: MarkMarketingm = new MarkMarketingm;


    BRANCHRECORD: SearchTable = new SearchTable();
    USERRECORD: SearchTable = new SearchTable();
    CUSTRECORD: SearchTable = new SearchTable();

    From_Date: string = "";
    To_Date: string = "";
    sSubject: string = '';
    sMsg: string = '';
    sHtml: string = '';
    sTo_ids: string = '';
    AttachList: any[] = [];

    filename: string = "";
    IsCompany: boolean = false;
    IsAdmin: boolean = false;
    bPrint: boolean = true;
    bEmail: boolean = false;

    constructor(
        private modalService: NgbModal,
        private mainService: MarkMarketingService,
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
        if (this.parentData != null) {
            this.report_type = this.parentData.report_type;
            this.closecaption = "BACK";
            this.USERRECORD.controlname = "USER";
            this.USERRECORD.displaycolumn = "NAME";
            this.USERRECORD.type = "USER";
            this.USERRECORD.id = this.parentData.user_id;
            this.USERRECORD.name = this.parentData.user_name;

            this.CUSTRECORD = new SearchTable();
            this.CUSTRECORD.controlname = "CUSTOMER";
            this.CUSTRECORD.displaycolumn = "NAME";
            this.CUSTRECORD.type = "MARKETING CONTACT";
            this.CUSTRECORD.id = this.parentData.cust_id;
            this.CUSTRECORD.name = this.parentData.cust_name;

            this.AssignDate();
            this.List('NEW');
        }
    }

    InitComponent() {
        this.IsAdmin = false;
        this.IsCompany = false;
        this.bPrint = false;
        this.bEmail = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_admin)
                this.IsAdmin = true;
            if (this.menu_record.rights_company)
                this.IsCompany = true;
            if (this.menu_record.rights_print)
                this.bPrint = true;
            if (this.menu_record.rights_email)
                this.bEmail = true;
        }
        this.LoadCombo();
    }

    AssignDate() {
        if (this.parentData.month == "ALL") {
            this.From_Date = this.parentData.year + "-01-01";
            this.To_Date = this.parentData.year + "-12-31";
        }
        else if (this.parentData.month == "JAN") {
            this.From_Date = this.parentData.year + "-01-01";
            this.To_Date = this.parentData.year + "-01-31";
        }
        else if (this.parentData.month == "FEB") {
            this.From_Date = this.parentData.year + "-02-01";
            this.To_Date = this.parentData.year + "-02-28";
        }
        else if (this.parentData.month == "MAR") {
            this.From_Date = this.parentData.year + "-03-01";
            this.To_Date = this.parentData.year + "-03-31";
        }
        else if (this.parentData.month == "APR") {
            this.From_Date = this.parentData.year + "-04-01";
            this.To_Date = this.parentData.year + "-04-30";
        }
        else if (this.parentData.month == "MAY") {
            this.From_Date = this.parentData.year + "-05-01";
            this.To_Date = this.parentData.year + "-05-31";
        }
        else if (this.parentData.month == "JUN") {
            this.From_Date = this.parentData.year + "-06-01";
            this.To_Date = this.parentData.year + "-06-30";
        }
        else if (this.parentData.month == "JUL") {
            this.From_Date = this.parentData.year + "-07-01";
            this.To_Date = this.parentData.year + "-07-31";
        }
        else if (this.parentData.month == "AUG") {
            this.From_Date = this.parentData.year + "-08-01";
            this.To_Date = this.parentData.year + "-08-31";
        }
        else if (this.parentData.month == "SEP") {
            this.From_Date = this.parentData.year + "-09-01";
            this.To_Date = this.parentData.year + "-09-30";
        }
        else if (this.parentData.month == "OCT") {
            this.From_Date = this.parentData.year + "-10-01";
            this.To_Date = this.parentData.year + "-10-31";
        }
        else if (this.parentData.month == "NOV") {
            this.From_Date = this.parentData.year + "-11-01";
            this.To_Date = this.parentData.year + "-11-30";
        }
        else if (this.parentData.month == "DEC") {
            this.From_Date = this.parentData.year + "-12-01";
            this.To_Date = this.parentData.year + "-12-31";
        }

    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        // this.sub.unsubscribe();
    }


    InitLov() {

        this.BRANCHRECORD.controlname = "BRANCH";
        this.BRANCHRECORD.displaycolumn = "NAME";
        this.BRANCHRECORD.type = "BRANCH";
        this.BRANCHRECORD.id = "";
        this.BRANCHRECORD.name = "";

        this.USERRECORD.controlname = "USER";
        this.USERRECORD.displaycolumn = "NAME";
        this.USERRECORD.type = "USER";
        this.USERRECORD.id = "";
        this.USERRECORD.name = "";

        this.CUSTRECORD.controlname = "CUSTOMER";
        this.CUSTRECORD.displaycolumn = "NAME";
        this.CUSTRECORD.type = "MARKETING CONTACT";
        this.CUSTRECORD.id = "";
        this.CUSTRECORD.name = "";
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

        if (_Record.controlname == "BRANCH") {
            this.myTable.branch_id = _Record.id;
            this.myTable.branch_name = _Record.name;
        }
        if (_Record.controlname == "USER") {
            this.myTable.user_id = _Record.id;
            this.myTable.user_name = _Record.name;
        }
    }


    // Query List Data
    List(_type: string) {

        if (_type == "NEW") {
            this.searchdata.searchstring = this.searchstring.searchstring;
        }

        this.loading = true;

        let SearchData = {
            type: _type,
            filter_source: 'REPORT',
            rowtype: this.type,
            searchstring: this.searchdata.searchstring,
            iscompany: this.IsCompany,
            isadmin: this.IsAdmin,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            user_pkid: this.gs.globalVariables.user_pkid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            branchids: this.gs.globalVariables.branch_code,
            filter_from_date: this.From_Date,
            filter_to_date: this.To_Date,
            filter_branch_id: this.BRANCHRECORD.code,
            filter_user_id: this.USERRECORD.id,
            filter_cust_id: this.CUSTRECORD.id,
            report_type: this.parentData.report_type,
            sman_id: this.gs.globalVariables.sman_id,
            print_format:this.print_format
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.RecordList = response.list;
                    this.page_count = response.page_count;
                    this.page_current = response.page_current;
                    this.page_rowcount = response.page_rowcount;
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

    ShowHideRecord(_rec: MarkMarketingm) {
        if (!_rec.row_displayed) {
            this.GetRecord(_rec.mark_pkid);
        }
        _rec.row_displayed = !_rec.row_displayed;
    }


    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {

        this.loading = true;
        let SearchData = {
            pkid: Id,
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.Record = response.record;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    DownloadList(_type: string, mailsent: any) {

        this.searchdata.searchstring = this.searchstring.searchstring;

        this.loading = true;

        let SearchData = {
            type: _type,
            filter_source: 'REPORT',
            rowtype: this.type,
            searchstring: this.searchdata.searchstring,
            iscompany: this.IsCompany,
            isadmin: this.IsAdmin,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            user_pkid: this.gs.globalVariables.user_pkid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            branchids: this.gs.globalVariables.branch_code,
            filter_from_date: this.From_Date,
            filter_to_date: this.To_Date,
            filter_branch_id: this.BRANCHRECORD.code,
            filter_branch_name: this.BRANCHRECORD.name,
            filter_user_id: this.USERRECORD.id,
            filter_user_name: this.USERRECORD.name,
            filter_cust_id: this.CUSTRECORD.id,
            filter_cust_name: this.CUSTRECORD.name,
            report_folder: this.gs.globalVariables.report_folder,
            report_type: this.parentData.report_type,
            print_format:this.print_format
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.ProcessDownloadList(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL') {
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                } else if (_type == 'MAIL') {
                    this.AttachList = new Array<any>();
                    this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filesize: response.filesize });
                    this.sSubject = response.subject;
                    this.sMsg = response.message;
                    this.sTo_ids = response.toids;
                    this.open(mailsent);
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    OnBlur(field: string) {
        // if (field == 'mark_time_visit') {
        //     this.Record.mark_time_visit = this.Record.mark_time_visit.toUpperCase();
        // }
    }

    Close() {
        if (this.PageChanged != null)
            this.PageChanged.emit('ROOT');
        else
            this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

}
