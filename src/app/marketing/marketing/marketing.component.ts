import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkMarketingm } from '../models/markmarketingm';
import { MarkMarketingService } from '../services/markmarketing.service';
import { SearchTable } from '../../shared/models/searchtable';
import { DateComponent } from '../../shared/date/date.component';

@Component({
    selector: 'app-marketing',
    templateUrl: './marketing.component.html',
    // providers: [MarkMarketingService]
})
export class MarketingComponent {

    // Local Variables 

    title = 'Visit Detail';

    @ViewChild('_mark_visit_date') private mark_visit_date_ctrl: DateComponent;
    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    menu_contact_record: any;

    modal: any;
    disableSave = true;
    loading = false;
    bDocs: boolean = false;
    bDocsUpload: boolean = false;

    currentTab = 'LIST';

    searchby = "";
    searchstring = '';
    search_datetype = 'VISIT-DATE';
    search_branch_code = '';
    search_cust_name = '';
    search_cust_id = '';
    search_user_name = '';
    search_user_id = '';
    search_salesman_name = '';
    search_salesman_id = '';
    search_leadsource = 'ALL';
    search_convrtstatus = 'ALL';
    search_commodity = '';

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    selectedRowIndex = 0;

    ErrorMessage = "";
    InfoMessage = "";

    ActionsRecord = {
        parent_id: '',
        title: 'FOLLOW UP DETAILS',
        hide_rem_caption:true,
        hide_plan: true,
        save_everyone: true
    };
    mode = '';
    pkid = '';
    clientid = '';

    // Array For Displaying List
    RecordList: MarkMarketingm[] = [];
    // Single Record for add/edit/view details
    Record: MarkMarketingm = new MarkMarketingm;
    print_format = "DETAIL";

    CUSTRECORD: SearchTable = new SearchTable();
    SALESMANRECORD: SearchTable = new SearchTable();
    IsCompany: boolean = false;
    IsAdmin: boolean = false;
    CanAddContacts: boolean = false;
    bPrint: boolean = false;
    IsHeader: boolean = true;

    constructor(
        private modalService: NgbModal,
        public mainService: MarkMarketingService,
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

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (!this.InitCompleted) {
            this.InitComponent();
        }
    }

    InitComponent() {
        this.searchby = "NA";
        this.CanAddContacts = false;
        this.IsAdmin = false;
        this.IsCompany = false;
        this.bPrint = false;
        this.bDocs = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_admin)
                this.IsAdmin = true;
            if (this.menu_record.rights_company)
                this.IsCompany = true;
            if (this.menu_record.rights_print)
                this.bPrint = true;
            if (this.menu_record.rights_docs)
                this.bDocs = true;
        }
        this.menu_contact_record = this.gs.getMenu("MARKCONTACTS");
        if (this.menu_contact_record) {
            if (this.menu_contact_record.rights_add)
                this.CanAddContacts = true;
        }

        this.LoadCombo();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    InitLov() {

        this.CUSTRECORD = new SearchTable();
        this.CUSTRECORD.controlname = "CUSTOMER";
        this.CUSTRECORD.displaycolumn = "NAME";
        this.CUSTRECORD.type = "MARKETING CONTACT";
        this.CUSTRECORD.id = "";
        this.CUSTRECORD.code = "";
        this.CUSTRECORD.name = "";

        this.SALESMANRECORD = new SearchTable();
        this.SALESMANRECORD.controlname = "SALESMAN";
        this.SALESMANRECORD.displaycolumn = "NAME";
        this.SALESMANRECORD.type = "SALESMAN";
        this.SALESMANRECORD.id = "";
        this.SALESMANRECORD.code = "";
        this.SALESMANRECORD.name = "";

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

        if (_Record.controlname == "SALESMAN") {
            this.Record.mark_jointsalesman_id = _Record.id;
            this.Record.mark_jointsalesman_name = _Record.name;
        }

        if (_Record.controlname == "CUSTOMER") {
            if (this.Record.mark_customer_id != _Record.id)
                this.Record.rec_category = "";
            this.Record.mark_customer_id = _Record.id;
            this.Record.mark_customer_name = _Record.name;
            this.Record.mark_contact_person = _Record.col5;
        }

        if (_Record.controlname == "BR") {
            this.search_branch_code = _Record.code;
        }
        if (_Record.controlname == "CONTACT") {
            this.search_cust_id = _Record.id;
            this.search_cust_name = _Record.name;
        }
        if (_Record.controlname == "USER") {
            this.search_user_id = _Record.id;
            this.search_user_name = _Record.name;
        }
        if (_Record.controlname == "SMAN") {
            this.search_salesman_id = _Record.id;
            this.search_salesman_name = _Record.name;
        }

    }



    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
        else if (action === 'ADD') {
            this.currentTab = 'DETAILS';
            this.mode = 'ADD';
            this.ResetControls();
            this.NewRecord();
            this.ActionsRecord.parent_id = this.pkid;
        }
        else if (action === 'EDIT') {
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            this.ResetControls();
            this.pkid = id;
            this.GetRecord(id);
            this.ActionsRecord.parent_id = id;
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

    // Query List Data
    List(_type: string) {

        if (this.searchby == "NA")
            this.searchstring = "";
        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            filter_source: 'LIST',
            searchby: this.searchby,
            searchstring: this.searchstring.toUpperCase(),
            iscompany: this.IsCompany,
            isadmin: this.IsAdmin,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            filter_from_date: '',
            filter_to_date: '',
            filter_branch_id: '',
            filter_user_id: '',
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            user_code: this.gs.globalVariables.user_code,
            user_pkid: this.gs.globalVariables.user_pkid,
            from_date: this.gs.globalData.mark_fromdate,
            to_date: this.gs.globalData.mark_todate,
            report_folder: this.gs.globalVariables.report_folder,
            isheader: this.IsHeader,
            print_format: this.print_format,
            search_datetype: this.search_datetype,
            search_branch_code: this.search_branch_code,
            search_cust_id: this.search_cust_id,
            search_cust_name: this.search_cust_name,
            search_user_id: this.search_user_id,
            search_user_name: this.search_user_name,
            search_salesman_id: this.search_salesman_id,
            search_salesman_name: this.search_salesman_name,
            search_commodity: this.search_commodity,
            search_leadsource: this.search_leadsource,
            search_convrtstatus: this.search_convrtstatus
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

    NewRecord() {

        this.pkid = this.gs.getGuid();
        this.Record = new MarkMarketingm();
        this.Record.mark_pkid = this.pkid;
        this.Record.mark_mode = "PERSONAL VISIT";
        this.Record.rec_category = "";
        this.Record.mark_visit_date = "";
        this.Record.mark_result = "";
        this.Record.mark_next_action = "";
        this.Record.mark_next_visit_date = "";
        this.Record.mark_contact_person = "";
        this.Record.mark_oldcustomer_id = "";
        this.Record.mark_customer_id = "";
        this.Record.mark_customer_name = "";
        this.Record.mark_user_id = this.gs.globalVariables.user_pkid;
        this.Record.mark_user_name = "";
        this.Record.branch_name = "";
        this.Record.mobile = "";
        this.Record.email = "";
        this.Record.target = "";
        this.Record.mark_competition = "";
        this.Record.mark_nomination = "";
        this.Record.mark_last_shipment = "";
        this.Record.mark_agent_name = "";
        this.Record.mark_commodity = "";
        this.Record.mark_next_visit_status = "FOLLOW UP REQUIRED";
        this.Record.rec_mode = this.mode;
        this.Record.rec_created_date = '';
        this.Record.rec_created_by = '';
        this.InitLov();
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
                this.LoadData(response.record);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    LoadData(_Record: MarkMarketingm) {
        this.Record = _Record;
        this.Record.rec_mode = "EDIT";

        this.InitLov();

        this.SALESMANRECORD.id = this.Record.mark_jointsalesman_id.toString();
        this.SALESMANRECORD.name = this.Record.mark_jointsalesman_name;

        this.CUSTRECORD.id = this.Record.mark_customer_id.toString();
        this.CUSTRECORD.name = this.Record.mark_customer_name;
    }

    loadVisit() {
        this.loading = true;
        let SearchData = {
            user_pkid: this.gs.globalVariables.user_pkid,
            branch_code: this.gs.globalVariables.branch_code,
            customer_id: this.Record.mark_customer_id,
            mark_pkid: this.Record.mark_pkid
        };

        this.mainService.LoadVisit(SearchData)
            .subscribe(response => {
                this.loading = false;
                let mRow = response.record;
                if (mRow != null) {
                    if (!this.gs.isBlank(mRow.mark_agent_name))
                        this.Record.mark_agent_name = mRow.mark_agent_name;
                    if (!this.gs.isBlank(mRow.mark_competition))
                        this.Record.mark_competition = mRow.mark_competition;
                    if (!this.gs.isBlank(mRow.mark_deciding_person))
                        this.Record.mark_deciding_person = mRow.mark_deciding_person;
                    if (!this.gs.isBlank(mRow.mark_last_shipment))
                        this.Record.mark_last_shipment = mRow.mark_last_shipment;
                    if (!this.gs.isBlank(mRow.mark_nomination))
                        this.Record.mark_nomination = mRow.mark_nomination;
                    if (!this.gs.isBlank(mRow.mark_commodity))
                        this.Record.mark_commodity = mRow.mark_commodity;
                    if (!this.gs.isBlank(mRow.mark_contact_person))
                        this.Record.mark_contact_person = mRow.mark_contact_person;
                    if (!this.gs.isBlank(mRow.rec_category))
                        this.Record.rec_category = mRow.rec_category;
                }
                // this.ErrorMessage = this.title;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                }
            );
    }


    // Save Data
    Save() {
        if (!this.allvalid()) {
            alert(this.ErrorMessage);
            return;
        }

        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                if (this.mode == "ADD") {
                    this.Record.mark_id = response.mark_id;
                    this.Record.branch_name = this.gs.globalVariables.branch_name;
                    this.Record.mark_user_name = this.gs.globalVariables.user_code;
                    this.Record.mark_oldcustomer_id = this.Record.mark_customer_id;
                }
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                this.InfoMessage = "Save Complete";
                this.RefreshList();
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        if (this.Record.rec_mode == "EDIT" && this.Record.mark_user_id != this.gs.globalVariables.user_pkid) {
            bret = false;
            sError = " | Cannot Edit Other User Visit Info";
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    Isnumeric(i: any) {

        if (i >= 0 && i <= 9) {
            return true;
        }
        else {
            return false;
        }

    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.mark_pkid == this.Record.mark_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
            REC = this.RecordList.find(rec => rec.mark_pkid == this.Record.mark_pkid);
            REC.mark_visit_date = this.mark_visit_date_ctrl.GetDisplayDate();
        }
        else {
            // REC.branch_name = this.Record.branch_name;
            REC.mark_user_name = this.Record.mark_user_name;
            REC.mark_visit_date = this.mark_visit_date_ctrl.GetDisplayDate();
            REC.mark_customer_name = this.Record.mark_customer_name;
            REC.mark_contact_person = this.Record.mark_contact_person;

            REC.mark_mode = this.Record.mark_mode;
            REC.mark_customer_name = this.Record.mark_customer_name;
            REC.mark_cont_remarks = this.Record.mark_cont_remarks;
            REC.mark_lead_source = this.Record.mark_lead_source;
            REC.mark_cont_converted = this.Record.mark_cont_converted;
            REC.mark_commodity = this.Record.mark_commodity;
            REC.mark_next_action = this.Record.mark_next_action;
        }
    }


    OnBlur(field: string) {

        if (field == 'mark_time_visit') {
            this.Record.mark_time_visit = this.Record.mark_time_visit.toUpperCase();
        }
        if (field == 'mark_contact_person') {
            this.Record.mark_contact_person = this.Record.mark_contact_person.toUpperCase();
        }
        if (field == 'mark_deciding_person') {
            this.Record.mark_deciding_person = this.Record.mark_deciding_person.toUpperCase();
        }
        if (field == 'mark_agent_name') {
            this.Record.mark_agent_name = this.Record.mark_agent_name.toUpperCase();
        }
        if (field == 'mark_commodity') {
            this.Record.mark_commodity = this.Record.mark_commodity.toUpperCase();
        }
        if (field == 'mark_competition') {
            this.Record.mark_competition = this.Record.mark_competition.toUpperCase();
        }
        if (field == 'mark_nomination') {
            this.Record.mark_nomination = this.Record.mark_nomination.toUpperCase();
        }
        if (field == 'mark_last_shipment') {
            this.Record.mark_last_shipment = this.Record.mark_last_shipment.toUpperCase();
        }
        if (field == 'mark_result') {
            this.Record.mark_result = this.Record.mark_result.toUpperCase();
        }
        if (field == 'mark_next_action') {
            this.Record.mark_next_action = this.Record.mark_next_action.toUpperCase();
        }
        if (field == 'searchstring') {
            this.searchstring = this.searchstring.toUpperCase();
        }
        if (field == 'search_commodity') {
            this.search_commodity = this.search_commodity.toUpperCase();
        }
    }

    Close() {
        this.gs.ClosePage('home');
    }

    AddClient(content: any) {
        this.clientid = '';
        this.open(content);
    }

    EditClient(content: any) {
        this.clientid = this.Record.mark_customer_id;
        this.open(content);
    }


    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    ShowDocuments(doc: any, _rec: MarkMarketingm = null) {
        this.ErrorMessage = '';
        this.bDocsUpload = true;
        if (_rec != null) {
            this.pkid = _rec.mark_pkid;
            this.bDocsUpload = false;
        }
        this.open(doc);
    }

    actionsChanged(comments: any, _rec: MarkMarketingm) {
        // if (comments.saction == "CLOSE")
        //     _rec.rowdisplayed = false;
        // if (comments.saction == "SAVE") {
        //     for (let rec of this.RecordList.filter(rec => rec.msl_pkid == _rec.msl_pkid)) {
        //         rec.msl_followupcount = comments.sfollowupcount;
        //     }
        // }
    }

}
