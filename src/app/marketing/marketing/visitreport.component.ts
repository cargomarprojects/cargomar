import { Component, Input, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkReport } from '../models/markvisitreport';
import { MarkReportService } from '../services/markvisitreport.service';


@Component({
    selector: 'app-visitreport',
    templateUrl: './visitreport.component.html',
    providers: [MarkReportService]
})
export class VisitReportComponent {

    // Local Variables 
    title = 'Vist Report';


    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() customer_name: string = '';
    @Input() sman_id: string = '';

    @ViewChild('scrollContainerMonth') scrollContainerMonth: ElementRef;
    @ViewChildren('tableRowMonth') tableRowsMonth: QueryList<ElementRef>;

    @ViewChild('scrollContainerDay') scrollContainerDay: ElementRef;
    @ViewChildren('tableRowDay') tableRowsDay: QueryList<ElementRef>;

    @ViewChild('scrollContainerWeek') scrollContainerWeek: ElementRef;
    @ViewChildren('tableRowWeek') tableRowsWeek: QueryList<ElementRef>;


    InitCompleted: boolean = false;
    menu_record: any;

    modal: any;
    disableSave = true;
    loading = false;
    /// currentTab = 'LIST';
    currentPage = "ROOT";
    invokeByMenu = true;
    /// selectedRowIndex = 0;
    /// branch_code: string = '';
    /// branch_name: string = '';
    /// sortby: string = 'DEFAULT';
    /// report_format: string = 'WEEK-WISE';

    /// searchstring = '';
    /// page_count = 0;
    /// page_current = 0;
    /// page_rows = 0;
    /// page_rowcount = 0;
    // totdays: number = 0;
    // ms.state.week5: number = 0;

    sub: any;
    urlid: string;

    selectedRowMonth: string = "";
    selectedRowDay: string = "";
    selectedRowWeek: string = "";

    /// included: string = "NA";

    sSubject: string = '';
    sMsg: string = '';
    sHtml: string = '';
    sTo_ids: string = '';
    AttachList: any[] = [];
    /// ErrorMessage = "";
    /// InfoMessage = "";
    // hyperlinkStyle = "'hlink'";
    sundayColor: string = "#FF8A8A";
    /// report_type = 'SALES PERSON';
    /// search_report_type = 'SALES PERSON';
    /// mode = '';
    /// pkid = '';
    ChildRecord = {
        type: '',
        user_id: '',
        user_name: '',
        year: '',
        month: '',
        report_type: 'SALES PERSON',
        cust_id: '',
        cust_name: '',
        from_date: '',
        to_date: '',
        cust_category: '',
        cust_conv_type: '',
        login_user_code: ''
    };
    /// iYear: number;
    /// iYearCaption: number;

    // iMonth: string = 'ALL';
    // search_iMonth: string = 'ALL';
    // search_format: string = 'MONTH-WISE';
    // Array For Displaying List
    /// RecordList: MarkReport[] = [];

    // Single Record for add/edit/view details
    Record: MarkReport = new MarkReport;
    // RecordCaption: MarkReport = new MarkReport;
    MonList: any[] = [];
    IsCompany: boolean = false;
    IsAdmin: boolean = false;
    bPrint: boolean = true;
    bEmail: boolean = false;
    constructor(
        private modalService: NgbModal,
        public ms: MarkReportService,
        private route: ActivatedRoute,
        public gs: GlobalService

    ) {
        /// this.page_count = 0;
        /// this.page_rows = 200;
        /// this.page_current = 0;
        this.InitLov();
        /// this.OnChange('report_format');
        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                if (this.menuid == "MARKVISITREPORT") {
                    this.type = options.type;
                    if (!this.gs.isBlank(options.format) && !this.gs.isBlank(options.month)) {
                        this.ms.state.report_format = options.format;
                        this.ms.state.iMonth = options.month;
                        this.OnChange('report_format');
                    }
                    this.InitComponent();
                } else {
                    // this.hyperlinkStyle = "hlink3";
                    this.invokeByMenu = false;
                    this.ms.state.report_type = 'CUSTOMER'; //if calling from contact master detail
                    this.ms.state.report_format = 'MONTH-WISE';
                    this.ms.state.searchstring = this.customer_name;
                    this.ms.state.Initialized = false;
                    this.OnChange('report_format');
                }
            }
        });
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (!this.InitCompleted) {
            this.InitComponent();
        }
        this.ms.init(this.menuid, this.type);

        if (this.type == "INVOKE-FRM-CONTACT") {
            this.ms.state.report_type = 'CUSTOMER';
            this.ms.state.report_format = 'MONTH-WISE';
            this.ms.state.searchstring = this.customer_name;
            this.ms.state.Initialized = false;
        }

        this.OnChange('report_format');

        if(!this.ms.state.Initialized){
            this.List('NEW', 'SCREEN');
            this.ms.state.Initialized = true;
        }
    }

    InitComponent() {
        // let d = new Date();
        // this.ms.state.iYear = d.getFullYear();
        // this.iYearCaption = this.ms.state.iYear;
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
        // this.List('NEW', 'SCREEN');
        this.InitCompleted = true;
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    /// for restore selected row in list
    ngAfterViewInit() {
        this.restoreRowPosition();
    }

    restoreRowPosition(){
        setTimeout(() => {
            this.scrollToRowPosition();
        }, 100);
    }

    scrollToRowPosition() {
        const row = document.getElementById('row-' + this.ms.state.selectedRowIndex);
        if (row) {
            row.scrollIntoView({
            behavior: 'auto',
            block: 'center'
            });
        }
    }


    InitLov() {

    }

    InitCaption() {
        // this.ms.state.RecordCaption = new MarkReport();
        this.ms.state.RecordCaption.d1_caption = '1';
        this.ms.state.RecordCaption.d2_caption = '2';
        this.ms.state.RecordCaption.d3_caption = '3';
        this.ms.state.RecordCaption.d4_caption = '4';
        this.ms.state.RecordCaption.d5_caption = '5';
        this.ms.state.RecordCaption.d6_caption = '6';
        this.ms.state.RecordCaption.d7_caption = '7';
        this.ms.state.RecordCaption.d8_caption = '8';
        this.ms.state.RecordCaption.d9_caption = '9';
        this.ms.state.RecordCaption.d10_caption = '10';
        this.ms.state.RecordCaption.d11_caption = '11';
        this.ms.state.RecordCaption.d12_caption = '12';
        this.ms.state.RecordCaption.d13_caption = '13';
        this.ms.state.RecordCaption.d14_caption = '14';
        this.ms.state.RecordCaption.d15_caption = '15';
        this.ms.state.RecordCaption.d16_caption = '16';
        this.ms.state.RecordCaption.d17_caption = '17';
        this.ms.state.RecordCaption.d18_caption = '18';
        this.ms.state.RecordCaption.d19_caption = '19';
        this.ms.state.RecordCaption.d20_caption = '20';
        this.ms.state.RecordCaption.d21_caption = '21';
        this.ms.state.RecordCaption.d22_caption = '22';
        this.ms.state.RecordCaption.d23_caption = '23';
        this.ms.state.RecordCaption.d24_caption = '24';
        this.ms.state.RecordCaption.d25_caption = '25';
        this.ms.state.RecordCaption.d26_caption = '26';
        this.ms.state.RecordCaption.d27_caption = '27';
        this.ms.state.RecordCaption.d28_caption = '28';
        this.ms.state.RecordCaption.d29_caption = '29';
        this.ms.state.RecordCaption.d30_caption = '30';
        this.ms.state.RecordCaption.d31_caption = '31';
        this.ms.state.RecordCaption.w1_caption = 'WEEK-1';
        this.ms.state.RecordCaption.w2_caption = 'WEEK-2';
        this.ms.state.RecordCaption.w3_caption = 'WEEK-3';
        this.ms.state.RecordCaption.w4_caption = 'WEEK-4';
        this.ms.state.RecordCaption.w5_caption = 'WEEK-5';
    }



    LoadCombo() {

        // this.MonList = [{ "id": "ALL", "name": "ALL" }, { "id": "01", "name": "JANUARY" }, { "id": "02", "name": "FEBRUARY" }, { "id": "03", "name": "MARCH" }
        //     , { "id": "04", "name": "APRIL" }, { "id": "05", "name": "MAY" }, { "id": "06", "name": "JUNE" }
        //     , { "id": "07", "name": "JULY" }, { "id": "08", "name": "AUGUST" }, { "id": "09", "name": "SEPTEMBER" }
        //     , { "id": "10", "name": "OCTOBER" }, { "id": "11", "name": "NOVEMBER" }, { "id": "12", "name": "DECEMBER" }];

        this.MonList = [{ "id": "ALL", "name": "ALL" }, { "id": "01", "name": "JAN" }, { "id": "02", "name": "FEB" }, { "id": "03", "name": "MAR" }
            , { "id": "04", "name": "APR" }, { "id": "05", "name": "MAY" }, { "id": "06", "name": "JUN" }
            , { "id": "07", "name": "JUL" }, { "id": "08", "name": "AUG" }, { "id": "09", "name": "SEP" }
            , { "id": "10", "name": "OCT" }, { "id": "11", "name": "NOV" }, { "id": "12", "name": "DEC" }];

        // this.loading = true;
        // let SearchData = {
        //   type: 'type',
        //   comp_code: this.gs.globalVariables.comp_code,
        //   branch_code: this.gs.globalVariables.branch_code
        // };

        // this.ms.state.ErrorMessage = '';
        // this.ms.state.InfoMessage = '';
        // this.ms.LoadDefault(SearchData)
        //   .subscribe(response => {
        //     this.loading = false;
        //     this.List("NEW");
        //   },
        //     error => {
        //       this.loading = false;
        //       this.ms.state.ErrorMessage = this.gs.getError(error);
        //     });
    }


    LovSelected(_Record: any) {
        if (_Record.controlname == "BRANCH") {
            this.ms.state.branch_code = _Record.code;
            this.ms.state.branch_name = _Record.name;
        }
    }

    // Query List Data
    List(_type: string, _output_type: string = "SCREEN", mailsent: any = null) {

        if (this.ms.state.report_format == "MONTH-WISE") {
            if (this.ms.state.iMonth != 'ALL') {
                alert('Please select month as ALL and continue.....');
                return;
            }
        }

        if (this.ms.state.report_format == "DAY-WISE" || this.ms.state.report_format == "WEEK-WISE") {
            if (this.ms.state.iMonth == 'ALL') {
                alert('Please select a month and continue.....');
                return;
            }
        }

        if (_output_type != 'EXCEL') {
            this.ms.state.search_iMonth = this.ms.state.iMonth;
            this.ms.state.search_format = this.ms.state.report_format;
            this.InitCaption();
        }
        this.ms.state.iYearCaption = this.ms.state.iYear;
        this.ms.state.search_report_type = this.ms.state.report_type;
        this.loading = true;
        let SearchData = {
            type: _type,
            filter_source: 'REPORT',
            iscompany: this.IsCompany,
            isadmin: this.IsAdmin,
            page_count: this.ms.state.page_count,
            page_current: this.ms.state.page_current,
            page_rows: this.ms.state.page_rows,
            page_rowcount: this.ms.state.page_rowcount,
            userid: this.gs.globalVariables.user_pkid,
            usercode: this.gs.globalVariables.user_code,
            companyid: this.gs.globalVariables.comp_code,
            branchid: this.gs.globalVariables.branch_code,
            branchids: this.gs.globalVariables.branch_code,
            iYear: this.ms.state.iYear.toString(),
            output_type: _output_type,
            ispagewise: this.invokeByMenu == true ? true : false,
            file_name: '',
            report_folder: this.gs.globalVariables.report_folder,
            report_type: this.ms.state.report_type,
            sman_id: this.gs.isBlank(this.sman_id) ? this.gs.globalVariables.sman_id : this.sman_id,
            searchstring: this.ms.state.searchstring,
            branch_code: this.ms.state.branch_code,
            sortby: this.ms.state.sortby,
            imonth: this.ms.state.iMonth,
            report_format: this.ms.state.report_format,
            included: this.ms.state.included,
            hostname: window.location.protocol + "//" + window.location.host
        };

        this.ms.state.selectedRowIndex = 0;
        this.restoreRowPosition();
        this.ms.state.ErrorMessage = '';
        this.ms.state.InfoMessage = '';
        this.ms.DashBoard(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ms.state.totdays = response.totdays;
                this.ms.state.week5 = response.week5;
                if (_type == 'PRINT')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else if (_type == 'MAIL') {
                    this.AttachList = new Array<any>();
                    this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filesize: response.filesize });
                    this.sSubject = response.subject;
                    this.sMsg = response.message;
                    this.sTo_ids = response.toids;
                    this.open(mailsent);
                }
                else {

                    this.ms.state.RecordList = response.list;
                    this.ms.state.RecordCaption = response.recordcaption;
                    this.ms.state.page_count = response.page_count;
                    this.ms.state.page_current = response.page_current;
                    this.ms.state.page_rowcount = response.page_rowcount;
                }
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                    alert(this.ms.state.ErrorMessage);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }


    Isnumeric(i: any) {

        if (i >= 0 && i <= 9) {
            return true;
        }
        else {
            return false;
        }

    }

    OnBlur(field: string) {

        if (field == 'searchstring') {
            this.ms.state.searchstring = this.ms.state.searchstring.toUpperCase();
        }

    }

    OnChange(field: string) {
        if (field == 'report_format') {
            if (this.ms.state.report_format == "MONTH-WISE")
                this.ms.state.iMonth = "ALL";
            else {
                if (this.ms.state.iMonth == "ALL") {
                    if (this.gs.defaultValues.today.trim() != "") {
                        var tempdt = this.gs.defaultValues.today.split('-');
                        this.ms.state.iMonth = tempdt[1];
                    }
                }
            }
        }
    }

    ShowReport(_rec: MarkReport, _month: string, _cellValue: number = 1) {
        if (_rec.user_name == "TOTAL")
            return;
        if (_cellValue <= 0)
            return;

        let user_id: string = '';
        let user_name: string = '';
        let cust_id: string = '';
        let cust_name: string = '';
        let from_date: string = '';
        let to_date: string = '';
        if (this.ms.state.search_iMonth == "ALL") {
            if (_month == "PREV" || _month == "ALL") {
                from_date = _rec.min_visit_date;
                to_date = this.ms.state.iYear + "-12-31";
                if (_month == "PREV") {
                    let prevyr = +this.ms.state.iYear - 1;
                    var temparr = _rec.min_visit_date.split('-');
                    let tempyr: number = +temparr[0];
                    if (tempyr == this.ms.state.iYear)
                        from_date = '2001-01-01'
                    to_date = prevyr + "-12-31";
                }
            }
        } else {

            if (_month == "ALL") {
                from_date = this.ms.state.iYear + "-" + this.ms.state.search_iMonth + "-01";
                to_date = this.ms.state.iYear + "-" + this.ms.state.search_iMonth + "-" + this.ms.state.totdays.toString();
            } else {
                from_date = this.ms.state.iYear + "-" + this.ms.state.search_iMonth + "-" + _month;
                to_date = from_date;
            }
        }

        if (this.ms.state.search_report_type == "SALES PERSON") {
            user_id = _rec.user_id;
            user_name = _rec.user_name;
            cust_id = "";
            cust_name = "";
        } else { //Customer
            user_id = "";
            user_name = "";
            cust_id = _rec.user_id;
            cust_name = _rec.user_name;
        }

        this.ChildRecord = {
            type: 'Report',
            user_id: user_id,
            user_name: user_name,
            year: this.ms.state.iYear.toString(),
            month: _month,
            report_type: this.ms.state.search_report_type,
            cust_id: cust_id,
            cust_name: cust_name,
            from_date: from_date,
            to_date: to_date,
            cust_category: 'ALL',
            cust_conv_type: '',
            login_user_code: this.gs.globalVariables.user_code
        };

        // this is for scrollview
        if (this.ms.state.search_format == "MONTH-WISE")
            this.selectedRowMonth = _rec.user_name;
        else if (this.ms.state.search_format == "DAY-WISE")
            this.selectedRowDay = _rec.user_name;
        if (this.ms.state.search_format == "WEEK-WISE")
            this.selectedRowWeek = _rec.user_name;

        this.currentPage = "VISIT-REPORT-CHILD";
    }
    ShowReport2(_rec: MarkReport, _month: string, _conv_type: string, _cellValue: number) {

        if (_rec.user_name == 'TOTAL' && (_conv_type == 'ALL' || _conv_type.includes('WEEK')))
            return;

        if (_cellValue <= 0)
            return;

        let user_id: string = '';
        let user_name: string = '';
        let cust_id: string = '';
        let cust_name: string = '';
        let from_date: string = '';
        let to_date: string = '';
        if (this.ms.state.search_iMonth == "ALL") {
            if (_month == "ALL") {
                from_date = _rec.min_visit_date;
                to_date = this.ms.state.iYear + "-12-31";
            }
        } else {
            from_date = this.ms.state.iYear + "-" + this.ms.state.search_iMonth + "-01";
            to_date = this.ms.state.iYear + "-" + this.ms.state.search_iMonth + "-" + this.ms.state.totdays.toString();
        }

        if (this.ms.state.search_report_type == "SALES PERSON") {
            user_id = _rec.user_id;
            user_name = _rec.user_name;
            cust_id = "";
            cust_name = "";
        } else { //Customer
            user_id = "";
            user_name = "";
            cust_id = _rec.user_id;
            cust_name = _rec.user_name;
        }

        this.ChildRecord = {
            type: 'Report',
            user_id: user_id,
            user_name: user_name,
            year: this.ms.state.iYear.toString(),
            month: _month,
            report_type: this.ms.state.search_report_type,
            cust_id: cust_id,
            cust_name: cust_name,
            from_date: from_date,
            to_date: to_date,
            cust_category: 'ALL',
            cust_conv_type: _conv_type,
            login_user_code: this.gs.globalVariables.user_code
        };

        // this is for scrollview
        if (this.ms.state.search_format == "MONTH-WISE")
            this.selectedRowMonth = _rec.user_name;
        else if (this.ms.state.search_format == "DAY-WISE")
            this.selectedRowDay = _rec.user_name;
        else if (this.ms.state.search_format == "WEEK-WISE")
            this.selectedRowWeek = _rec.user_name;

        this.currentPage = "VISIT-REPORT-CHILD2";
    }
    pageChanged(stype: string) {
        this.currentPage = "ROOT";

        if (this.ms.state.search_format == "MONTH-WISE")
            this.setScrollMonth();
        else if (this.ms.state.search_format == "DAY-WISE")
            this.setScrollDay();
        else if (this.ms.state.search_format == "WEEK-WISE")
            this.setScrollWeek();
    }

    Close() {
        this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }


    setScrollMonth() {
        setTimeout(() => {
            if (this.selectedRowMonth) {
                const rowArray = this.tableRowsMonth.toArray();
                let rowEl = null;
                for (let r of rowArray) {
                    if (r.nativeElement.getAttribute('data-id') === this.selectedRowMonth) {
                        rowEl = r; break;
                    }
                }
                if (rowEl) rowEl.nativeElement.scrollIntoView({ block: 'center' });
            }
        }, 50);
    }

    setScrollDay() {
        setTimeout(() => {
            if (this.selectedRowDay) {
                const rowArray = this.tableRowsDay.toArray();
                let rowEl = null;
                for (let r of rowArray) {
                    if (r.nativeElement.getAttribute('data-id') === this.selectedRowDay) {
                        rowEl = r; break;
                    }
                }
                if (rowEl) rowEl.nativeElement.scrollIntoView({ block: 'center' });
            }
        }, 50);
    }

    setScrollWeek() {
        setTimeout(() => {
            if (this.selectedRowWeek) {
                const rowArray = this.tableRowsWeek.toArray();
                let rowEl = null;
                for (let r of rowArray) {
                    if (r.nativeElement.getAttribute('data-id') === this.selectedRowWeek) {
                        rowEl = r; break;
                    }
                }
                if (rowEl) rowEl.nativeElement.scrollIntoView({ block: 'center' });
            }
        }, 50);
    }

}
