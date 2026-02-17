import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkMarketingm, MonColumns } from '../models/markmarketingm';
import { MarkReport } from '../models/markmarketingm';
import { MarkMarketingService } from '../services/markmarketing.service';
import { SearchTable } from '../../shared/models/searchtable';
import { get } from 'https';


@Component({
    selector: 'app-visitreport',
    templateUrl: './visitreport.component.html',
    providers: [MarkMarketingService]
})
export class VisitReportComponent {

    // Local Variables 
    title = 'Vist Report';


    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() customer_name: string = '';
    @Input() sman_id: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

    modal: any;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    currentPage = "ROOT";
    invokeByMenu = true;
    selectedRowIndex = 0;
    branch_code: string = '';
    branch_name: string = '';
    sortby: string = 'DEFAULT';
    report_format: string = 'MONTH-WISE';

    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;
    totdays: number = 0;
    week5: number = 0;

    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";
    // hyperlinkStyle = "'hlink'";
    sundayColor: string = "#FF8A8A";
    report_type = 'SALES PERSON';
    search_report_type = 'SALES PERSON';
    mode = '';
    pkid = '';
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
        cust_category: ''
    };
    iYear: number;
    iYearCaption: number;

    iMonth: string = 'ALL';
    search_iMonth: string = 'ALL';
    search_format: string = 'MONTH-WISE';
    // Array For Displaying List
    RecordList: MarkReport[] = [];

    // Single Record for add/edit/view details
    Record: MarkReport = new MarkReport;
    RecordCaption: MarkReport = new MarkReport;
    MonList: any[] = [];
    IsCompany: boolean = false;
    IsAdmin: boolean = false;
    bPrint: boolean = true;

    constructor(
        private modalService: NgbModal,
        private mainService: MarkMarketingService,
        private route: ActivatedRoute,
        public gs: GlobalService

    ) {
        this.page_count = 0;
        this.page_rows = 200;
        this.page_current = 0;
        this.InitLov();
        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                if (this.menuid == "MARKVISITREPORT") {
                    this.type = options.type;
                    this.InitComponent();
                } else {
                    // this.hyperlinkStyle = "hlink3";
                    this.invokeByMenu = false;
                    this.report_type = 'CUSTOMER'; //if calling from contact master detail
                }
            }
        });
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.searchstring = this.customer_name;
        if (!this.InitCompleted) {
            this.InitComponent();
        }
    }

    InitComponent() {
        let d = new Date();
        this.iYear = d.getFullYear();
        this.iYearCaption = this.iYear;
        this.IsAdmin = false;
        this.IsCompany = false;
        this.bPrint = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_admin)
                this.IsAdmin = true;
            if (this.menu_record.rights_company)
                this.IsCompany = true;
            if (this.menu_record.rights_print)
                this.bPrint = true;
        }
        this.LoadCombo();
        this.List('NEW', 'SCREEN');
        this.InitCompleted = true;
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    InitLov() {

    }

    InitCaption() {
        this.RecordCaption = new MarkReport();
        this.RecordCaption.d1_caption = '1';
        this.RecordCaption.d2_caption = '2';
        this.RecordCaption.d3_caption = '3';
        this.RecordCaption.d4_caption = '4';
        this.RecordCaption.d5_caption = '5';
        this.RecordCaption.d6_caption = '6';
        this.RecordCaption.d7_caption = '7';
        this.RecordCaption.d8_caption = '8';
        this.RecordCaption.d9_caption = '9';
        this.RecordCaption.d10_caption = '10';
        this.RecordCaption.d11_caption = '11';
        this.RecordCaption.d12_caption = '12';
        this.RecordCaption.d13_caption = '13';
        this.RecordCaption.d14_caption = '14';
        this.RecordCaption.d15_caption = '15';
        this.RecordCaption.d16_caption = '16';
        this.RecordCaption.d17_caption = '17';
        this.RecordCaption.d18_caption = '18';
        this.RecordCaption.d19_caption = '19';
        this.RecordCaption.d20_caption = '20';
        this.RecordCaption.d21_caption = '21';
        this.RecordCaption.d22_caption = '22';
        this.RecordCaption.d23_caption = '23';
        this.RecordCaption.d24_caption = '24';
        this.RecordCaption.d25_caption = '25';
        this.RecordCaption.d26_caption = '26';
        this.RecordCaption.d27_caption = '27';
        this.RecordCaption.d28_caption = '28';
        this.RecordCaption.d29_caption = '29';
        this.RecordCaption.d30_caption = '30';
        this.RecordCaption.d31_caption = '31';
        this.RecordCaption.w1_caption = 'WEEK-1';
        this.RecordCaption.w2_caption = 'WEEK-2';
        this.RecordCaption.w3_caption = 'WEEK-3';
        this.RecordCaption.w4_caption = 'WEEK-4';
        this.RecordCaption.w5_caption = 'WEEK-5';
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
            this.branch_code = _Record.code;
            this.branch_name = _Record.name;
        }
    }

    // Query List Data
    List(_type: string, _output_type: string = "SCREEN") {

        if (this.report_format == "MONTH-WISE") {
            if (this.iMonth != 'ALL') {
                alert('Please select month as ALL and continue.....');
                return;
            }
        }

        if (this.report_format == "DAY-WISE" || this.report_format == "WEEK-WISE") {
            if (this.iMonth == 'ALL') {
                alert('Please select a month and continue.....');
                return;
            }
        }

        if (_output_type != 'EXCEL') {
            this.search_iMonth = this.iMonth;
            this.search_format = this.report_format;
            this.InitCaption();
        }
        this.iYearCaption = this.iYear;
        this.search_report_type = this.report_type;
        this.loading = true;
        let SearchData = {
            type: _type,
            filter_source: 'REPORT',
            iscompany: this.IsCompany,
            isadmin: this.IsAdmin,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            userid: this.gs.globalVariables.user_pkid,
            usercode: this.gs.globalVariables.user_code,
            companyid: this.gs.globalVariables.comp_code,
            branchid: this.gs.globalVariables.branch_code,
            branchids: this.gs.globalVariables.branch_code,
            iYear: this.iYear.toString(),
            output_type: _output_type,
            ispagewise: this.invokeByMenu == true ? true : false,
            file_name: '',
            report_folder: this.gs.globalVariables.report_folder,
            report_type: this.report_type,
            sman_id: this.gs.isBlank(this.sman_id) ? this.gs.globalVariables.sman_id : this.sman_id,
            searchstring: this.searchstring,
            branch_code: this.branch_code,
            sortby: this.sortby,
            imonth: this.iMonth,
            report_format: this.report_format
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.DashBoard(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.totdays = response.totdays;
                this.week5 = response.week5;
                if (_output_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {

                    this.RecordList = response.list;
                    this.RecordCaption = response.recordcaption;
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
            this.searchstring = this.searchstring.toUpperCase();
        }

    }

    OnChange(field: string) {
        if (field == 'report_format') {
            if (this.report_format == "MONTH-WISE")
                this.iMonth = "ALL";
            else {
                if (this.iMonth == "ALL") {
                    if (this.gs.defaultValues.today.trim() != "") {
                        var tempdt = this.gs.defaultValues.today.split('-');
                        this.iMonth = tempdt[1];
                    }
                }
            }
        }
    }

    ShowReport(_rec: MarkReport, _month: string, _cellValue: number = 1) {

        if (_cellValue <= 0)
            return;

        let user_id: string = '';
        let user_name: string = '';
        let cust_id: string = '';
        let cust_name: string = '';
        let from_date: string = '';
        let to_date: string = '';
        if (this.search_iMonth == "ALL") {
            if (_month == "PREV" || _month == "ALL") {
                from_date = _rec.min_visit_date;
                to_date = this.iYear + "-12-31";
                if (_month == "PREV") {
                    let prevyr = +this.iYear - 1;
                    var temparr = _rec.min_visit_date.split('-');
                    let tempyr: number = +temparr[0];
                    if (tempyr == this.iYear)
                        from_date = '2001-01-01'
                    to_date = prevyr + "-12-31";
                }
            }
        } else {

            if (_month == "ALL") {
                from_date = this.iYear + "-" + this.search_iMonth + "-01";
                to_date = this.iYear + "-" + this.search_iMonth + "-" + this.totdays.toString();
            } else {
                from_date = this.iYear + "-" + this.search_iMonth + "-" + _month;
                to_date = from_date;
            }
        }

        if (this.search_report_type == "SALES PERSON") {
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
            year: this.iYear.toString(),
            month: _month,
            report_type: this.search_report_type,
            cust_id: cust_id,
            cust_name: cust_name,
            from_date: from_date,
            to_date: to_date,
            cust_category: 'ALL'
        };
        this.currentPage = "VISIT-REPORT-CHILD";
    }
    pageChanged(stype: string) {
        this.currentPage = "ROOT";
    }

    Close() {
        this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content);
    }


}
