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
    /// currentTab = 'LIST';

    /// selectedRowIndex = 0;

    Is_NewCustomer = false;
    /// Is_Nomination = false;
    Is_Clearing = false;
    Is_Forwarding = true;
    Is_Both = true;
    Is_DaysAbove365 = true;

    searchMode = "ALL";
    /// searchType = "ALL";
    /// searchstring = '';

    /// page_count = 0;
    /// page_current = 0;
    /// page_rows = 0;
    /// page_rowcount = 0;

    sub: any;
    urlid: string;

    /// ErrorMessage = "";
    /// InfoMessage = "";
    /// fromdate = "";
    todate = "";
    /// mode = '';
    /// pkid = '';

    listHdr_Clearing = false;
    listHdr_Forwarding = true;
    listHdr_Both = true;
    processdate = '';
    // Array For Displaying List
    /// RecordList: NewCustReport[] = [];
    // Single Record for add/edit/view details
    Record: NewCustReport = new NewCustReport;

    IsCompany: boolean = false;
    IsAdmin: boolean = false;
    bPrint: boolean = true;

    constructor(
        private modalService: NgbModal,
        public ms: NewCustomerService,
        private route: ActivatedRoute,
        public gs: GlobalService

    ) {
        /// this.page_count = 0;
        /// this.page_rows = 20;
        /// this.page_current = 0;
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
        this.ms.init(this.menuid, this.type);
        if(!this.ms.state.Initialized){
            this.LoadCombo(); // to load from date once only
            this.List('NEW');
            this.ms.state.Initialized = true;
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
        /// this.LoadCombo();
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

    LoadCombo() {
        this.loading = true;
        let SearchData = {
            type: 'type',
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code
        };

        this.ms.state.ErrorMessage = '';
        this.ms.state.InfoMessage = '';
        this.ms.LoadDefault(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ms.state.fromdate = response.fromdate;
                /// this.List('NEW');
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                    alert(this.ms.state.ErrorMessage);
                });
    }


    LovSelected(_Record: any) {

    }

    // Query List Data
    List(_type: string) {

        if (_type == 'PROCESS-REPORT') {
            if (this.gs.isBlank(this.ms.state.fromdate)) {
                alert('From date cannot be blank?');
                return;
            }
            if (!confirm('Process Report start from ' + this.gs.ConvertDate2DisplayFormat(this.ms.state.fromdate)))
                return;
        }

        // if (!this.Is_Clearing && !this.Is_Forwarding && !this.Is_Both) {
        //     alert('Please select Forwarding/Both and continue......');
        //     return;
        // }


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
            isnomination: this.ms.state.Is_Nomination,
            isclearing: this.Is_Clearing,
            isforwarding: this.Is_Forwarding,
            isboth: this.Is_Both,
            isdaysabove365: this.Is_DaysAbove365,
            page_count: this.ms.state.page_count,
            page_current: this.ms.state.page_current,
            page_rows: this.ms.state.page_rows,
            page_rowcount: this.ms.state.page_rowcount,
            report_folder: this.gs.globalVariables.report_folder,
            searchmode: this.searchMode,
            searchtype: this.ms.state.searchType,
            searchstring: this.ms.state.searchstring,
            fromdate: this.ms.state.fromdate,
            todate: this.todate
        };

        this.ms.state.selectedRowIndex = 0;
        this.restoreRowPosition();
        this.ms.state.ErrorMessage = '';
        this.ms.state.InfoMessage = '';
        this.ms.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else if (_type == 'PROCESS-REPORT') {
                    alert('Successfully Processed');
                }
                else {
                    this.ms.state.RecordList = response.list;
                    this.ms.state.page_count = response.page_count;
                    this.ms.state.page_current = response.page_current;
                    this.ms.state.page_rowcount = response.page_rowcount;
                    this.processdate = response.processdate;
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
        this.ms.state.RecordList = [];
    }

    Close() {
        this.gs.ClosePage('home');
    }
    open(content: any) {
        this.modal = this.modalService.open(content);
    }

}
