import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { NewCustReport } from '../models/newcustrpt';
import { NewCustomerService } from '../services/newcustomer.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-newcust',
    templateUrl: './newcust.component.html',
    providers: [NewCustomerService]
})
export class NewCustComponent {

    // Local Variables 
    title = 'New Customer Report';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

    modal: any;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';

    selectedRowIndex = 0;

    Is_NewCustomer = false;
    Is_Nomination = false;
    Is_Clearing = false;
    Is_Forwarding = true;
    Is_Both = true;
    Is_DaysAbove365 = true;

    searchMode = "ALL";
    searchType = "ALL";
    searchstring = '';

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";
    fromdate = "";
    todate = "";
    mode = '';
    pkid = '';

    listHdr_Clearing = false;
    listHdr_Forwarding = true;
    listHdr_Both = true;
    processdate = '';
    // Array For Displaying List
    RecordList: NewCustReport[] = [];
    // Single Record for add/edit/view details
    Record: NewCustReport = new NewCustReport;

    IsCompany: boolean = false;
    IsAdmin: boolean = false;
    bPrint: boolean = true;

    constructor(
        private modalService: NgbModal,
        private mainService: NewCustomerService,
        private route: ActivatedRoute,
        public gs: GlobalService

    ) {
        this.page_count = 0;
        this.page_rows = 20;
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
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    InitLov() {

    }

    LoadCombo() {
        this.loading = true;
        let SearchData = {
            type: 'type',
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.LoadDefault(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.fromdate = response.fromdate;
                this.List('NEW');
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }


    LovSelected(_Record: any) {

    }

    // Query List Data
    List(_type: string) {

        if (_type == 'PROCESS-REPORT') {
            if (this.gs.isBlank(this.fromdate)) {
                alert('From date cannot be blank?');
                return;
            }
            if (!confirm('Process Report start from ' + this.gs.ConvertDate2DisplayFormat(this.fromdate)))
                return;
        }

        if (!this.Is_Clearing && !this.Is_Forwarding && !this.Is_Both) {
            alert('Please select Forwarding/Both and continue......');
            return;
        }


        this.listHdr_Clearing = this.Is_Clearing;
        this.listHdr_Forwarding = this.Is_Forwarding;
        this.listHdr_Both = this.Is_Both;

        this.loading = true;
        let SearchData = {
            type: _type,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            user_id: this.gs.globalVariables.user_pkid,
            user_code: this.gs.globalVariables.user_code,
            iscompany: this.IsCompany,
            isadmin: this.IsAdmin,
            isnewcustomer: this.Is_NewCustomer,
            isnomination: this.Is_Nomination,
            isclearing: this.Is_Clearing,
            isforwarding: this.Is_Forwarding,
            isboth: this.Is_Both,
            isdaysabove365: this.Is_DaysAbove365,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            report_folder: this.gs.globalVariables.report_folder,
            searchmode: this.searchMode,
            searchtype: this.searchType,
            searchstring: this.searchstring,
            fromdate: this.fromdate,
            todate: this.todate
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else if (_type == 'PROCESS-REPORT') {
                    alert('Successfully Processed');
                }
                else {
                    this.RecordList = response.list;
                    this.page_count = response.page_count;
                    this.page_current = response.page_current;
                    this.page_rowcount = response.page_rowcount;
                    this.processdate = response.processdate;
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
        this.RecordList = null;
    }

    Close() {
        this.gs.ClosePage('home');
    }
    open(content: any) {
        this.modal = this.modalService.open(content);
    }

}
