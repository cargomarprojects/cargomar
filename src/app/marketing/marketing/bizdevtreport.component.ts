import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkMarketingm } from '../models/markmarketingm';
import { BizdevelopReport } from '../models/markmarketingm';
import { MarkMarketingService } from '../services/markmarketing.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-bizdevtreport',
    templateUrl: './bizdevtreport.component.html',
    providers: [MarkMarketingService]
})
export class BizDevtReportComponent {

    // Local Variables 
    title = 'Business Development Report';


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

    from_date: string;
    to_date: string;
    searchDateType: string = 'MONTHLY';
    selectDateType: string = 'NEXT';

    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";
    // hyperlinkStyle = "'hlink'";

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

    // Array For Displaying List
    RecordList: BizdevelopReport[] = [];
    // Single Record for add/edit/view details
    Record: BizdevelopReport = new BizdevelopReport;

    IsCompany: boolean = false;
    IsAdmin: boolean = false;
    bPrint: boolean = true;
    bCoreTeam: boolean = false;

    constructor(
        private modalService: NgbModal,
        private mainService: MarkMarketingService,
        private route: ActivatedRoute,
        public gs: GlobalService

    ) {
        this.page_count = 0;
        this.page_rows = 100;
        this.page_current = 0;
        this.InitLov();
        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                if (this.menuid == "BIZDEVTREPORT") {
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
        this.from_date = this.gs.defaultValues.monthbegindate;
        this.to_date = this.gs.defaultValues.today;
        this.IsAdmin = false;
        this.IsCompany = false;
        this.bCoreTeam = false;
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
        this.FindDefaultDate();
        this.LoadCombo();
        this.List('NEW', 'SCREEN');
        this.InitCompleted = true;
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    FindDefaultDate() {
        this.from_date = this.gs.defaultValues.monthbegindate;
        this.to_date = this.gs.defaultValues.today;
        var today = new Date();

        if (this.searchDateType == "MONTHLY") {
            let daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            today.setDate(daysInMonth);
            this.to_date = today.toISOString().slice(0, 10);
        }

        if (this.searchDateType == "WEEKLY") {
            let dayOfWk: number = 0;
            dayOfWk = today.getDay();
            var wkday = today.getDate() - today.getDay() + 1;
            var wkStart = new Date(today.setDate(wkday));
            var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));

            if (dayOfWk == 0) {
                //if Sunday will show previous week
                wkStart = new Date(new Date(wkStart).setDate(wkStart.getDate() - 7));
                wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
            }
            this.from_date = wkStart.toISOString().slice(0, 10);
            this.to_date = wkEnd.toISOString().slice(0, 10);
        }

    }

    FindPrevDate() {
        if (this.gs.isBlank(this.from_date))
            return;
            var d1 = this.from_date.split('-');
        if (this.searchDateType == "MONTHLY") {
            var datef = new Date(parseInt(d1[0]), parseInt(d1[1]) - 1, parseInt(d1[2]));
            datef.setDate(0);
            datef.setDate(1);
            this.from_date = datef.getFullYear().toString() + "-" + (datef.getMonth() + 1).toString() + "-" + datef.getDate().toString();
            var datet = new Date(parseInt(d1[0]), parseInt(d1[1]) - 1, parseInt(d1[2]));
            datet.setDate(0);
            this.to_date = datet.getFullYear().toString() + "-" + (datet.getMonth() + 1).toString() + "-" + datet.getDate().toString();
        }
        if (this.searchDateType == "WEEKLY") {
            var datef = new Date(parseInt(d1[0]), parseInt(d1[1]) - 1, parseInt(d1[2]));
            datef.setDate(datef.getDate() - 7);
            var wkday = datef.getDate() - datef.getDay() + (datef.getDay() === 0 ? -6 : 1);
            datef.setDate(wkday);
            this.from_date = datef.getFullYear().toString() + "-" + (datef.getMonth() + 1).toString() + "-" + datef.getDate().toString();
            var wkEnd = new Date(new Date(datef).setDate(datef.getDate() + 6));
            this.to_date = wkEnd.getFullYear().toString() + "-" + (wkEnd.getMonth() + 1).toString() + "-" + wkEnd.getDate().toString();
        }

        // if (this.searchDateType == "WEEKLY") {
        //     let dayOfWk: number = 0;
        //     dayOfWk = today.getDay();
        //     var wkday = today.getDate() - today.getDay() + 1;
        //     var wkStart = new Date(today.setDate(wkday));
        //     var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));

        //     if (dayOfWk == 0) {
        //         //if Sunday will show previous week
        //         wkStart = new Date(new Date(wkStart).setDate(wkStart.getDate() - 7));
        //         wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
        //     }
        //     this.from_date = wkStart.toISOString().slice(0, 10);
        //     this.to_date = wkEnd.toISOString().slice(0, 10);
        // }

    }
    FindNextDate() {
        if (this.gs.isBlank(this.from_date))
            return;
            var d1 = this.from_date.split('-');
        if (this.searchDateType == "MONTHLY") {
            var datef = new Date(parseInt(d1[0]), parseInt(d1[1]) - 1, parseInt(d1[2]));
            datef.setMonth(datef.getMonth()+1); 
            datef.setDate(1);
            this.from_date = datef.getFullYear().toString() + "-" + (datef.getMonth() + 1).toString() + "-" + datef.getDate().toString();

            let daysInMonth = new Date(datef.getFullYear(), datef.getMonth() + 1, 0).getDate();
            datef.setDate(daysInMonth);
            this.to_date = datef.getFullYear().toString() + "-" + (datef.getMonth() + 1).toString() + "-" + datef.getDate().toString();
        }
        if (this.searchDateType == "WEEKLY") {
            var datef = new Date(parseInt(d1[0]), parseInt(d1[1]) - 1, parseInt(d1[2]));
            datef.setDate(datef.getDate() + 7);
            var wkday = datef.getDate() - datef.getDay() + (datef.getDay() === 0 ? -6 : 1);
            datef.setDate(wkday);
            this.from_date = datef.getFullYear().toString() + "-" + (datef.getMonth() + 1).toString() + "-" + datef.getDate().toString();
            var wkEnd = new Date(new Date(datef).setDate(datef.getDate() + 6));
            this.to_date = wkEnd.getFullYear().toString() + "-" + (wkEnd.getMonth() + 1).toString() + "-" + wkEnd.getDate().toString();
        }

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
    List(_type: string, _output_type: string = "SCREEN") {
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
            file_name: '',
            report_folder: this.gs.globalVariables.report_folder,
            report_type: this.report_type,
            sman_id: this.gs.isBlank(this.sman_id) ? this.gs.globalVariables.sman_id : this.sman_id,
            from_date: this.from_date,
            to_date: this.to_date,
            searchstring: this.searchstring,
            iscoreteam: this.bCoreTeam
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.BizDevelopmentReport(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_output_type == 'EXCEL')
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

        if (field == 'searchDateType') {
            this.FindDefaultDate();
        }

    }



    ShowReport(_rec: BizdevelopReport, _cont_type: string) {

        let user_id: string = '';
        let user_name: string = '';
        let cust_id: string = '';
        let cust_name: string = '';
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
            month: 'BIZDEVELOPMTRPT',
            report_type: this.search_report_type,
            cust_id: cust_id,
            cust_name: cust_name,
            from_date: this.from_date,
            to_date: this.to_date,
            cust_category: _cont_type
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
