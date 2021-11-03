import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkMarketingm } from '../models/markmarketingm';
import { MarkReport } from '../models/markmarketingm';
import { MarkMarketingService } from '../services/markmarketing.service';
import { SearchTable } from '../../shared/models/searchtable';


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
    InitCompleted: boolean = false;
    menu_record: any;
    
    modal: any;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    currentPage = "ROOT";

    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";

    mode = '';
    pkid = '';
    ChildRecord = {
        type: '',
        user_id: '',
        user_name: '',
        year : '',
        month: ''
    };
    iYear: number ;

    // Array For Displaying List
    RecordList: MarkReport[] = [];
    // Single Record for add/edit/view details
    Record: MarkReport = new MarkReport;
     
    IsCompany: boolean = false;
    IsAdmin: boolean = false;

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
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                this.InitCompleted = true;
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.type = options.type;
                this.InitComponent();
            }
        });
        this.List('LIST', 'SCREEN');
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (!this.InitCompleted) {
            this.InitComponent();
        }
    }

    InitComponent() {
        this.IsAdmin = false;
        this.IsCompany = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_admin)
                this.IsAdmin = true;
            if (this.menu_record.rights_company)
                this.IsCompany = true;
        }
        this.LoadCombo();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
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
    List(_type: string, _output_type : string) {
        let d = new Date();
        this.iYear = d.getFullYear();

        this.loading = true;

        let SearchData = {
            type: _type,
            filter_source : 'REPORT',
            iscompany: this.IsCompany,
            isadmin: this.IsAdmin,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            userid: this.gs.globalVariables.user_pkid,
            companyid: this.gs.globalVariables.comp_code,
            branchid: this.gs.globalVariables.branch_code,
            branchids: this.gs.globalVariables.branch_code,
            iYear: this.iYear.toString(),
            output_type: _output_type,
            file_name:'',
            report_folder:this.gs.globalVariables.report_folder
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.DashBoard(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_output_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.RecordList = response.list;
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
 

    Isnumeric(i: any) {

        if (i >= 0 && i <= 9) {
            return true;
        }
        else {
            return false;
        }

    }

    

    OnBlur(field: string) {

        // if (field == 'mark_time_visit') {
        //     this.Record.mark_time_visit = this.Record.mark_time_visit.toUpperCase();
        // }
       
    }

    ShowReport(_rec: MarkReport, _month: string) {
        this.ChildRecord = {
            type: 'Report',
            user_id: _rec.user_id,
            user_name: _rec.user_name,
            year: this.iYear.toString(),
            month: _month
        };
        this.currentPage = "VISIT-REPORT-CHILD";
    }
    pageChanged(stype: string)
    {
        this.currentPage = "ROOT";
    }

    Close() {
        this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content);
    }

}
