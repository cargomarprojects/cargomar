import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { EdiJob } from '../../models/edijob';
import { EdijobService } from '../../services/edijob.service';
import { DateComponent } from '../../../shared/date/date.component';
// import { Linkm2 } from '../../../master/models/linkm2';
 
@Component({
    selector: 'app-edijob',
    templateUrl: './edijob.component.html',
    providers: [EdijobService]
})

export class EdijobComponent {
    title = 'Edi Jobs'

    @ViewChild('_tabset') tabsetCtrl: any;
    @ViewChild('todate') private todate: DateComponent;
    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string;

    modal: any;

    selectedRowIndex = 0;
    InfoMessage = "";
    ErrorMessage = "";
    mode = '';
    pkid = '';

    chkallselected: boolean = false;
    selectdeselect: boolean = false;
    bExcel = false;
    bCompany = false;
    bAdmin = false;
    loading = false;
    currentTab = 'LIST';
    searchstring = '';

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sSubject: string = '';
    sMsg: string = '';
    sHtml: string = '';

    AttachList: any[] = [];
    FileList: any[] = [];
    // Array For Displaying List
    RecordList: EdiJob[] = [];
    //  Single Record for add/edit/view details
    Record: EdiJob = new EdiJob;
    // RecordList2: Linkm2[] = [];

    constructor(
        private modalService: NgbModal,
        private mainService: EdijobService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 15;
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
        if (!this.InitCompleted) {
            this.InitComponent();
        }
    }

    InitComponent() {
        this.bExcel = false;
        this.bCompany = false;
        this.bAdmin = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_company)
                this.bCompany = true;
            if (this.menu_record.rights_admin)
                this.bAdmin = true;
            if (this.menu_record.rights_print)
                this.bExcel = true;
        }
        this.Init();
        this.initLov();
        this.LoadCombo();
    }

    Init() {

    }

    // // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    initLov(caption: string = '') {




    }

    LovSelected(_Record: SearchTable) {


    }
    LoadCombo() {
        this.List('NEW');
    }


    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
    }

    ResetControls() {

    }

    // // Query List Data
    List(_type: string) {

        this.ErrorMessage = '';
        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this.searchstring.toUpperCase(),
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            user_code: this.gs.globalVariables.user_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            report_folder: this.gs.globalVariables.report_folder
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.chkallselected = false;
                this.selectdeselect = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.RecordList = response.list;
                    this.page_count = response.page_count;
                    this.page_current = response.page_current;
                    this.page_rowcount = response.page_rowcount;
                }
            }, error => {
                this.loading = false;
                this.ErrorMessage = this.gs.getError(error);
                alert(this.ErrorMessage);
            });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    OnChange(field: string) {
        this.RecordList = null;

    }

    Close() {
        this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    SelectDeselect() {
        this.selectdeselect = !this.selectdeselect;
        for (let rec of this.RecordList) {
            rec.job_selected = this.selectdeselect;
        }
    }

    FindMissingData() {

        let sPkids: string = "";
        for (let rec of this.RecordList.filter(rec => rec.job_selected == true)) {
            if (sPkids != "")
                sPkids += ",";
            sPkids += rec.pkid;
        }

        // if (sPkids == "") {
        //     this.ErrorMessage = "Please Select and Continue.....";
        //     alert(this.ErrorMessage);
        //     return;
        // }

        this.loading = true;
        let eSearchData = {
            pkid: sPkids,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code
        };

        this.ErrorMessage = '';
        this.mainService.FindMissingData(eSearchData)
            .subscribe(response => {
                this.loading = false;
                // this.RecordList2 = response.list;
                //   if (!this.gs.isBlank(this.tabsetCtrl))
                //     this.tabsetCtrl.select('tab2');
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }


    ImportData() {
        this.loading = true;
        let eSearchData = {
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            user_code: this.gs.globalVariables.user_code,
            report_folder: this.gs.globalVariables.report_folder
        };

        this.ErrorMessage = '';
        this.mainService.ImportData(eSearchData)
            .subscribe(response => {
                this.loading = false;

                // alert('Download Complete');
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }



    ValidateData()
    {

    }

    TransferData() {

        let sPkids: string = "";
        for (let rec of this.RecordList.filter(rec => rec.job_selected == true)) {
            if (sPkids != "")
                sPkids += ",";
            sPkids += rec.pkid;
        }

        // if (sPkids == "") {
        //     this.ErrorMessage = "Please Select and Continue.....";
        //     alert(this.ErrorMessage);
        //     return;
        // }

        this.loading = true;
        let eSearchData = {
            pkid: sPkids,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code
        };

        this.ErrorMessage = '';
        this.mainService.TransferData(eSearchData)
            .subscribe(response => {
                this.loading = false;
                // this.RecordList2 = response.list;
                //   if (!this.gs.isBlank(this.tabsetCtrl))
                //     this.tabsetCtrl.select('tab2');
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    /* 
    AutoEmail()
    {
          this.loading = true; //MIS report
        let eSearchData = {
            user_pkid: "C2AD01C8-0585-403D-83D7-4C2E8854EE5C",
            user_code: "ADMIN",
            company_code: this.gs.globalVariables.comp_code,
            type: 'MAIL',
            report_folder: this.gs.globalVariables.report_folder,
            auto_mail: "Y",
            from_date: "2022-11-28",
            to_date: "2022-12-04"
          };

        this.ErrorMessage = '';
        this.mainService.SalesReport(eSearchData)
            .subscribe(response => {
                this.loading = false;

                if(response.retvalue)
                alert('Sent')
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }
    AutoEmail1()
    {
        this.loading = true; //Volume report
        let eSearchData = {
            user_pkid: "C2AD01C8-0585-403D-83D7-4C2E8854EE5C",
            user_code: "ADMIN",
            company_code: this.gs.globalVariables.comp_code,
            type: 'MAIL',
            report_folder: this.gs.globalVariables.report_folder,
            auto_mail: "Y",
            to_date: "2022-11-28"
          };

        this.ErrorMessage = '';
        this.mainService.List(eSearchData)
            .subscribe(response => {
                this.loading = false;

                if(response.retvalue)
                alert('Sent')
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }
     */
}
