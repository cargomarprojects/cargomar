import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { PreAlert } from '../models/prealert';
import { PreAlertRepService } from '../services/prealertrep.service';
import { DateComponent } from '../../shared/date/date.component';

@Component({
    selector: 'app-prealertrep',
    templateUrl: './prealertrep.component.html',
    providers: [PreAlertRepService]
})

export class PreAlertRepComponent {
    title = 'PreAlert / PreAdvice'

    @ViewChild('todate') private todate: DateComponent;
    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string;
    modal: any;

    ErrorMessage = "";
    mode = '';
    pkid = '';

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    type_date: string = 'SOB';
    from_date: string = '';
    to_date: string = '';
    branch_name: string;
    branch_code: string;
    shipper_id: string;
    consignee_id: string;
    agent_id: string;
    carrier_id: string;
    carriertype: string;
    pol_id: string;
    pod_id: string;
    porttype: string;

    bExcel = false;
    disableSave = true;
    bCompany = false;
    all: boolean = false;
    bAdmin = false;
    loading = false;
    currentTab = 'LIST';
    searchstring = '';
    showpending: boolean = true;

    SearchData = {
        type: '',
        pkid: '',
        page_count: this.page_count,
        page_current: this.page_current,
        page_rows: this.page_rows,
        page_rowcount: this.page_rowcount,
        report_folder: '',
        company_code: '',
        branch_code: '',
        branch_name: '',
        year_code: '',
        searchstring: '',
        from_date: '',
        to_date: '',
        type_date: '',
        shipper_id: '',
        consignee_id: '',
        agent_id: '',
        carrier_id: '',
        pol_id: '',
        pod_id: '',
        all: false,
        showpending: this.showpending
    };

    sSubject: string = '';
    sMsg: string = '';
    sHtml: string = '';
    AttachList: any[] = [];

    // Array For Displaying List
    RecordList: PreAlert[] = [];
    //  Single Record for add/edit/view details
    Record: PreAlert = new PreAlert;

    BRRECORD: SearchTable = new SearchTable();
    EXPRECORD: SearchTable = new SearchTable();
    IMPRECORD: SearchTable = new SearchTable();
    AGENTRECORD: SearchTable = new SearchTable();
    CARRIERRECORD: SearchTable = new SearchTable();
    POLRECORD: SearchTable = new SearchTable();
    PODRECORD: SearchTable = new SearchTable();

    constructor(
        private modalService: NgbModal,
        private mainService: PreAlertRepService,
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

        this.porttype = "SEA PORT";
        this.carriertype = "SEA CARRIER";

        this.Init();
        this.initLov();
        this.LoadCombo();
    }

    Init() {
        this.type_date = "SOB";
        this.branch_code = this.gs.globalVariables.branch_code;
        this.branch_name = this.gs.globalVariables.branch_name;
        this.from_date = this.gs.defaultValues.lastmonthdate;
        this.to_date = this.gs.defaultValues.today;
        this.shipper_id = '';
        this.consignee_id = '';
        this.agent_id = '';
        this.carrier_id = '';
        this.pol_id = '';
        this.pod_id = '';
    }

    // // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    initLov(caption: string = '') {

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


        this.AGENTRECORD = new SearchTable();
        this.AGENTRECORD.controlname = "AGENT";
        this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
        this.AGENTRECORD.displaycolumn = "NAME";
        this.AGENTRECORD.type = "CUSTOMER";
        this.AGENTRECORD.id = "";
        this.AGENTRECORD.code = "";
        this.AGENTRECORD.name = "";

        this.CARRIERRECORD = new SearchTable();
        this.CARRIERRECORD.controlname = "CARRIER";
        this.CARRIERRECORD.displaycolumn = "NAME";
        this.CARRIERRECORD.type = this.carriertype;
        this.CARRIERRECORD.id = "";
        this.CARRIERRECORD.code = "";
        this.CARRIERRECORD.name = "";

        this.POLRECORD = new SearchTable();
        this.POLRECORD.controlname = "POL";
        this.POLRECORD.displaycolumn = "NAME";
        this.POLRECORD.type = this.porttype;
        this.POLRECORD.id = "";
        this.POLRECORD.code = "";
        this.POLRECORD.name = "";


        this.PODRECORD = new SearchTable();
        this.PODRECORD.controlname = "POD";
        this.PODRECORD.displaycolumn = "NAME";
        this.PODRECORD.type = this.porttype;
        this.PODRECORD.id = "";
        this.PODRECORD.code = "";
        this.PODRECORD.name = "";


    }

    LovSelected(_Record: SearchTable) {
        // Company Settings
        if (_Record.controlname == "BRANCH") {
            this.branch_code = _Record.code;
            this.branch_name = _Record.name;
        }
        if (_Record.controlname == "SHIPPER") {
            this.shipper_id = _Record.id;
            // this.shipper_name = _Record.name;
        }
        if (_Record.controlname == "CONSIGNEE") {
            this.consignee_id = _Record.id;
            //  this.consignee_name = _Record.name;
        }
        if (_Record.controlname == "AGENT") {
            this.agent_id = _Record.id;
            // this.agent_code = _Record.code;
            // this.agent_name = _Record.name;
        }
        if (_Record.controlname == "CARRIER") {
            this.carrier_id = _Record.id;
            // this.carrier_code = _Record.code;
            // this.carrier_name = _Record.name;
        }
        if (_Record.controlname == "POL") {
            this.pol_id = _Record.id;
            // this.pol_code = _Record.code;
            //  this.pol_name = _Record.name;
        }
        if (_Record.controlname == "POD") {
            this.pod_id = _Record.id;
            // this.pod_code = _Record.code;
            // this.pod_name = _Record.name;
        }

    }
    LoadCombo() {
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
        this.disableSave = true;
        if (!this.menu_record)
            return;

        if (this.menu_record.rights_admin)
            this.disableSave = false;
        if (this.mode == "ADD" && this.menu_record.rights_add)
            this.disableSave = false;
        if (this.mode == "EDIT" && this.menu_record.rights_edit)
            this.disableSave = false;

        return this.disableSave;
    }

    // // Query List Data
    List(_type: string, mailsent: any) {

        this.ErrorMessage = '';
        //if (this.from_date.trim().length <= 0) {
        //  this.ErrorMessage = "From Date Cannot Be Blank";
        //  return;
        //}
        //if (this.to_date.trim().length <= 0) {
        //  this.ErrorMessage = "To Date Cannot Be Blank";
        //  return;
        //}

        this.loading = true;
        this.pkid = this.gs.getGuid();
        this.SearchData.pkid = this.pkid;
        this.SearchData.report_folder = this.gs.globalVariables.report_folder;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;

        if (this.bCompany) {
            this.SearchData.branch_code = this.branch_code;
            this.SearchData.branch_name = this.branch_name;
        }
        else {
            this.SearchData.branch_code = this.gs.globalVariables.branch_code;
            this.SearchData.branch_name = this.gs.globalVariables.branch_name;

        }
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.SearchData.searchstring = this.searchstring.toUpperCase();
        if (_type == "MAIL")
            this.SearchData.type = "EXCEL";
        else
            this.SearchData.type = _type;
        this.SearchData.type_date = this.type_date;
        this.SearchData.from_date = this.from_date;
        this.SearchData.to_date = this.to_date;
        this.SearchData.shipper_id = this.shipper_id;
        this.SearchData.consignee_id = this.consignee_id;
        this.SearchData.agent_id = this.agent_id;
        this.SearchData.carrier_id = this.carrier_id;
        this.SearchData.pol_id = this.pol_id;
        this.SearchData.pod_id = this.pod_id;
        this.SearchData.all = this.all;
        this.SearchData.showpending = this.showpending;

        this.SearchData.page_count = this.page_count;
        this.SearchData.page_current = this.page_current;
        this.SearchData.page_rows = this.page_rows;
        this.SearchData.page_rowcount = this.page_rowcount;

        this.ErrorMessage = '';
        this.mainService.List(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                // if (_type == 'EXCEL')
                //     this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                // else if (_type == 'MAIL') {
                //     this.AttachList = new Array<any>();
                //     this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname });
                //     this.setMailBody(response.totteu, response.totteuday, response.tomonth);

                //     this.open(mailsent);
                // }
                // else {
                //     this.RecordList = response.list;
                // }
                this.RecordList = response.list;
                this.page_count = response.page_count;
                this.page_current = response.page_current;
                this.page_rowcount = response.page_rowcount;
            },
                error => {
                    this.loading = false;
                    this.RecordList = null;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }
    
    setMailBody(totteu: number, totteuday: number, tomonth: string) {

        // this.sSubject = "LINER BOOKING REPORT";

        // this.sMsg = "Dear All,";
        // this.sMsg += " \n\n";
        // this.sMsg += "  Please find the attached Daily Booking Report as on date;";
        // this.sMsg += " \n\n";
        // this.sMsg += "  Bookings as on " + this.todate.GetDisplayDate() + "  : " + totteuday.toString() + " Teus";
        // this.sMsg += " \n\n";
        // this.sMsg += "  Bookings in the month of " + tomonth + " as on " + this.todate.GetDisplayDate();
        // this.sMsg += "  : " + totteu.toString() + " Teus ( Confirmed bookings )";
        // this.sMsg += " \n\n";
    }
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    OnChange(field: string) {
        // this.RecordList = null;

    }

    Close() {
        this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content);
    }

}
