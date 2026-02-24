import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkMarketingm } from '../models/markmarketingm';
import { MarkMarketingService } from '../services/markmarketing.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-visitreportchild2',
    templateUrl: './visitreportchild2.component.html',
    providers: [MarkMarketingService]
})
export class VisitReportChild2Component {

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
    ErrorMessage = "";
    InfoMessage = "";

    mode = '';
    pkid = '';

    from_date: string = "";
    to_date: string = "";
    cust_conv_type: string = "NA";
    report_type: string = "SMAN";
    user_pkid: string = "";
    cust_id: string = "";

    // Array For Displaying List
    RecordList: MarkMarketingm[] = [];
    // Single Record for add/edit/view details
    Record: MarkMarketingm = new MarkMarketingm;

    filename: string = "";
    IsCompany: boolean = false;
    IsAdmin: boolean = false;
    bPrint: boolean = false;
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

    }

    // Init Will be called After executing Constructor
    ngOnInit() {

        this.InitComponent();
        if (this.parentData != null) {
            this.from_date = this.parentData.from_date;
            this.to_date = this.parentData.to_date;
            this.user_pkid = this.parentData.user_id;
            this.cust_id = this.parentData.cust_id;
            this.report_type = this.parentData.report_type;
            this.cust_conv_type = this.parentData.cust_conv_type;
            this.closecaption = "BACK";
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


    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        // this.sub.unsubscribe();
    }


    InitLov() {

    }



    LoadCombo() {


    }


    LovSelected(_Record: any) {


    }


    // Query List Data
    List(_type: string) {

        this.loading = true;
        let SearchData = {
            type: _type,
            report_type: this.parentData.report_type,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            from_date: this.from_date,
            to_date: this.to_date,
            user_pkid: this.parentData.user_id,
            cust_id: this.parentData.cust_id,
            cust_conv_type: this.cust_conv_type
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.LoadCustConvStatus(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
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

    isLeapYear(_year: number): boolean {
        if ((_year % 4 === 0 && _year % 100 !== 0) || (_year % 400 === 0)) {
            return true;
        }
        return false;
    }
}