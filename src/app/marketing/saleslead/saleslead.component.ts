import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkSalesleadd, MarkSalesleadm } from '../models/marksaleslead';
import { MarkSalesleadService } from '../services/marksaleslead.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-saleslead',
    templateUrl: './saleslead.component.html',
    providers: [MarkSalesleadService]
})
export class SalesleadComponent {

    // Local Variables 
    title = 'Saleslead';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

    modal: any;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';

    from_date: string;
    to_date: string;
    searchstring = '';
    searchstatus = 'ALL';
    searchconverted = 'ALL';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    ActionsRecord = {
        parent_id: '',
        title: 'ADD/EDIT FOLLOW UP DETAILS',
        mode_title: ' TO FOLLOW UP',
        hide_rem_caption: false,
        hide_plan: false,
        save_everyone: false,
        followupstatus: ''
    };

    ErrorMessage = "";
    InfoMessage = "";
    clientType = "";
    mode = '';
    pkid = '';
    sSubject: string = '';
    sMsg: string = '';
    sHtml: string = '';
    sTo_ids: string = '';
    AttachList: any[] = [];

    showclosebutton: boolean = true;
    AgentList: any[] = [];
    // Array For Displaying List
    RecordList: MarkSalesleadm[] = [];
    // Single Record for add/edit/view details
    Record: MarkSalesleadm = new MarkSalesleadm;

    EXPRECORD: SearchTable = new SearchTable();
    IMPRECORD: SearchTable = new SearchTable();
    POLRECORD: SearchTable = new SearchTable();
    PODRECORD: SearchTable = new SearchTable();
    BUYAGENTRECORD: SearchTable = new SearchTable();
    LOCATIONRECORD: SearchTable = new SearchTable();
    CNTRYRECORD: SearchTable = new SearchTable();
    IsCompany: boolean = false;
    IsAdmin: boolean = false;
    bPrint: boolean = false;
    bEmail: boolean = false;
    bDocs: boolean = false;
    bWithFollowup: boolean = false;
    disableShipperAddr: boolean = true;
    disableConsigneeAddr: boolean = true;

    constructor(
        private modalService: NgbModal,
        private mainService: MarkSalesleadService,
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
        this.List('NEW');
    }

    InitComponent() {
        this.from_date = '';
        this.to_date = '';
        this.IsAdmin = false;
        this.IsCompany = false;
        this.bPrint = false;
        this.bEmail = false;
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
            if (this.menu_record.rights_email)
                this.bEmail = true;
            if (this.menu_record.rights_docs)
                this.bDocs = true;
        }
        this.LoadCombo();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    InitLov() {

        this.LOCATIONRECORD = new SearchTable();
        this.LOCATIONRECORD.controlname = "LOCATION";
        this.LOCATIONRECORD.displaycolumn = "NAME";
        this.LOCATIONRECORD.type = "BRANCH";
        this.LOCATIONRECORD.id = "";
        this.LOCATIONRECORD.name = "";

        this.EXPRECORD = new SearchTable();
        this.EXPRECORD.controlname = "EXPORTER";
        this.EXPRECORD.displaycolumn = "NAME";
        this.EXPRECORD.type = "MARKETING CONTACT";
        this.EXPRECORD.id = "";
        this.EXPRECORD.code = "";
        this.EXPRECORD.name = "";

        this.IMPRECORD = new SearchTable();
        this.IMPRECORD.controlname = "IMPORTER";
        this.IMPRECORD.displaycolumn = "NAME";
        this.IMPRECORD.type = "MARKETING CONTACT";
        this.IMPRECORD.id = "";
        this.IMPRECORD.code = "";
        this.IMPRECORD.name = "";

        this.POLRECORD = new SearchTable();
        this.POLRECORD.controlname = "POL";
        this.POLRECORD.displaycolumn = "CODE";
        this.POLRECORD.type = "PORT";
        this.POLRECORD.id = "";
        this.POLRECORD.code = "";
        this.POLRECORD.name = "";

        this.PODRECORD = new SearchTable();
        this.PODRECORD.controlname = "POD";
        this.PODRECORD.displaycolumn = "CODE";
        this.PODRECORD.type = "PORT";
        this.PODRECORD.id = "";
        this.PODRECORD.code = "";
        this.PODRECORD.name = "";

        this.BUYAGENTRECORD = new SearchTable();
        this.BUYAGENTRECORD.controlname = "BUYING-AGENT";
        this.BUYAGENTRECORD.displaycolumn = "NAME";
        this.BUYAGENTRECORD.type = "MARKETING CONTACT";
        this.BUYAGENTRECORD.id = "";
        this.BUYAGENTRECORD.code = "";
        this.BUYAGENTRECORD.name = "";

        this.CNTRYRECORD = new SearchTable();
        this.CNTRYRECORD.controlname = "COUNTRY";
        this.CNTRYRECORD.displaycolumn = "NAME";
        this.CNTRYRECORD.type = "COUNTRY";
        this.CNTRYRECORD.id = "";
        this.CNTRYRECORD.code = "";
        this.CNTRYRECORD.name = "";
    }



    LoadCombo() {

        this.loading = true;
        let SearchData = {
            type: 'type',
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code
        };

        SearchData.comp_code = this.gs.globalVariables.comp_code;
        SearchData.branch_code = this.gs.globalVariables.branch_code;

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.LoadDefault(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.AgentList = response.agentlist;

            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }


    LovSelected(_Record: any) {

        if (_Record.controlname == "LOCATION") {
            this.Record.msl_location_id = _Record.id;
            this.Record.msl_location_name = _Record.name;
        }

        if (_Record.controlname == "EXPORTER") {
            this.Record.msl_shipper_id = _Record.id;
            this.Record.msl_shipper_code = _Record.code;
            this.Record.msl_shipper_name = _Record.name;
            this.Record.msl_shipper_add1 = _Record.col1;
            this.Record.msl_shipper_add2 = _Record.col2;
            this.Record.msl_shipper_add3 = _Record.col3;
            this.Record.msl_city = _Record.col4;
            this.Record.msl_pic = _Record.col5;
            this.Record.msl_shipper_tel = _Record.col6;
            this.Record.msl_shipper_email = _Record.col7;
        }
        if (_Record.controlname == "IMPORTER") {
            this.Record.msl_consignee_id = _Record.id;
            this.Record.msl_consignee_code = _Record.code;
            this.Record.msl_consignee = _Record.name;
            this.Record.msl_consignee_add1 = _Record.col1;
            this.Record.msl_consignee_add2 = _Record.col2;
            this.Record.msl_consignee_add3 = _Record.col3;
            this.Record.msl_consignee_pic = _Record.col5;
            this.Record.msl_consignee_tel = _Record.col6;
            this.Record.msl_consignee_email = _Record.col7;
            this.Record.msl_country = '';
            var temparry = _Record.col8.split(',');
            if (temparry.length >= 2) {
                this.Record.msl_country_id = temparry[0].toString();
                this.Record.msl_country = temparry[1].toString();
                this.Record.msl_country_code = '';
                this.CNTRYRECORD = new SearchTable();
                this.CNTRYRECORD.controlname = "COUNTRY";
                this.CNTRYRECORD.displaycolumn = "NAME";
                this.CNTRYRECORD.type = "COUNTRY";
                this.CNTRYRECORD.id = this.Record.msl_country_id;
                this.CNTRYRECORD.code = this.Record.msl_country_code;
                this.CNTRYRECORD.name = this.Record.msl_country;
            }
        }
        if (_Record.controlname == "POL") {
            this.Record.msl_pol_id = _Record.id;
            this.Record.msl_pol_code = _Record.code;
            this.Record.msl_pol = _Record.name;
        }
        if (_Record.controlname == "POD") {
            this.Record.msl_pod_id = _Record.id;
            this.Record.msl_pod_code = _Record.code;
            this.Record.msl_pod = _Record.name;
        }
        if (_Record.controlname == "BUYING-AGENT") {
            this.Record.msl_buyagent_id = _Record.id;
            this.Record.msl_buyagent_code = _Record.code;
            this.Record.msl_buyagent_name = _Record.name;
        }
        if (_Record.controlname == "COUNTRY") {
            this.Record.msl_country_id = _Record.id;
            this.Record.msl_country_code = _Record.code;
            this.Record.msl_country = _Record.name;
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

        this.loading = true;

        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this.searchstring.toUpperCase(),
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            user_id: this.gs.globalVariables.user_pkid,
            user_code: this.gs.globalVariables.user_code,
            iscompany: this.IsCompany,
            isadmin: this.IsAdmin,
            searchstatus: this.searchstatus,
            report_folder: this.gs.globalVariables.report_folder,
            bwithfollowup: this.bWithFollowup,
            from_date: this.from_date,
            to_date: this.to_date,
            searchconverted: this.searchconverted
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
        this.Record = new MarkSalesleadm();
        this.Record.msl_pkid = this.pkid;
        this.Record.msl_slno = 0;
        this.Record.msl_location_id = "";
        this.Record.msl_location_name = this.gs.globalVariables.branch_name;
        this.Record.msl_date = this.gs.defaultValues.today;
        this.Record.msl_shipper_id = "";
        this.Record.msl_shipper_code = "";
        this.Record.msl_shipper_name = "";
        this.Record.msl_shipper_add1 = "";
        this.Record.msl_shipper_add2 = "";
        this.Record.msl_shipper_add3 = "";
        this.Record.msl_city = "";
        this.Record.msl_pic = "";
        this.Record.msl_consignee_id = "";
        this.Record.msl_consignee_code = "";
        this.Record.msl_consignee = "";
        this.Record.msl_destination = "";
        this.Record.msl_remarks = "";
        this.Record.msl_shipper_tel = "";
        this.Record.msl_shipper_email = "";
        this.Record.msl_consignee_add1 = "";
        this.Record.msl_consignee_add2 = "";
        this.Record.msl_consignee_add3 = "";
        this.Record.msl_consignee_pic = "";
        this.Record.msl_consignee_tel = "";
        this.Record.msl_consignee_email = "";
        this.Record.msl_agent_id = "";
        this.Record.msl_agent_name = "";
        this.Record.msl_terms = "";
        this.Record.msl_commodity = "";
        this.Record.msl_volume = "";
        this.Record.msl_pol_id = "";
        this.Record.msl_pol_code = "";
        this.Record.msl_pol = "";
        this.Record.msl_pod_id = "";
        this.Record.msl_pod_code = "";
        this.Record.msl_pod = "";
        this.Record.msl_recommendation = "";
        this.Record.msl_competition = "";
        this.Record.msl_type = "SEA";
        this.Record.msl_converted = "IN-PROGRESS";
        this.Record.msl_country_id = "";
        this.Record.msl_country_code = "";
        this.Record.msl_country = "";
        this.Record.msl_status = "ACTIVE";
        this.Record.msl_buyagent_id = "";
        this.Record.msl_buyagent_code = "";
        this.Record.msl_buyagent_name = "";

        this.Record.rec_mode = this.mode;
        this.Record.rec_user_id = this.gs.globalVariables.user_pkid;
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

    LoadData(_Record: MarkSalesleadm) {
        this.Record = _Record;
        this.Record.rec_mode = "EDIT";

        this.InitLov();

        this.EXPRECORD.id = this.Record.msl_shipper_id;
        this.EXPRECORD.code = this.Record.msl_shipper_code;
        this.EXPRECORD.name = this.Record.msl_shipper_name;

        this.IMPRECORD.id = this.Record.msl_consignee_id;
        this.IMPRECORD.code = this.Record.msl_consignee_code;
        this.IMPRECORD.name = this.Record.msl_consignee;

        this.POLRECORD.id = this.Record.msl_pol_id;
        this.POLRECORD.code = this.Record.msl_pol_code;
        this.POLRECORD.name = this.Record.msl_pol;

        this.PODRECORD.id = this.Record.msl_pod_id;
        this.PODRECORD.code = this.Record.msl_pod_code;
        this.PODRECORD.name = this.Record.msl_pod

        this.BUYAGENTRECORD.id = this.Record.msl_buyagent_id;
        this.BUYAGENTRECORD.code = this.Record.msl_buyagent_code;
        this.BUYAGENTRECORD.name = this.Record.msl_buyagent_name;

        this.CNTRYRECORD.id = this.Record.msl_country_id;
        this.CNTRYRECORD.code = this.Record.msl_country_code;
        this.CNTRYRECORD.name = this.Record.msl_country;
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
                if (this.mode == "ADD")
                    this.Record.msl_slno = response.slno;
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

        // if (this.gs.isBlank(this.Record.msl_shipper_name)) {
        //     bret = false;
        //     sError = " | Shipper Name Cannot be Blank";
        // }

        if (bret) {
            this.Record.msl_action = "ACTION";
        }

        // if (bret === false)
        //     this.ErrorMessage = sError;
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
        var REC = this.RecordList.find(rec => rec.msl_pkid == this.Record.msl_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.msl_date = this.Record.msl_date;
            //REC.msl_location_name = this.Record.msl_location_name;
            REC.msl_shipper_name = this.Record.msl_shipper_name;
            REC.msl_shipper_add1 = this.Record.msl_shipper_add1;
            REC.msl_shipper_add2 = this.Record.msl_shipper_add2;
            REC.msl_shipper_add3 = this.Record.msl_shipper_add3;
            REC.msl_city = this.Record.msl_city;
            REC.msl_pic = this.Record.msl_pic;
            REC.msl_consignee = this.Record.msl_consignee;
            REC.msl_agent_name = this.Record.msl_agent_name;
            REC.msl_type = this.Record.msl_type;
            REC.msl_terms = this.Record.msl_terms;
            REC.msl_commodity = this.Record.msl_commodity;
            REC.msl_pol = this.Record.msl_pol;
            REC.msl_pod = this.Record.msl_pod;
            REC.msl_country = this.Record.msl_country;
            REC.msl_remarks = this.Record.msl_remarks;
            REC.msl_status = this.Record.msl_status;
        }
    }


    OnBlur(field: string) {

        if (field == 'msl_location_name') {
            this.Record.msl_location_name = this.Record.msl_location_name.toUpperCase();
        }
        if (field == 'msl_shipper_name') {
            this.Record.msl_shipper_name = this.Record.msl_shipper_name.toUpperCase();
        }
        if (field == 'msl_shipper_add1') {
            this.Record.msl_shipper_add1 = this.Record.msl_shipper_add1.toUpperCase();
        }
        if (field == 'msl_shipper_add2') {
            this.Record.msl_shipper_add2 = this.Record.msl_shipper_add2.toUpperCase();
        }
        if (field == 'msl_shipper_add3') {
            this.Record.msl_shipper_add3 = this.Record.msl_shipper_add3.toUpperCase();
        }
        if (field == 'msl_city') {
            this.Record.msl_city = this.Record.msl_city.toUpperCase();
        }
        if (field == 'msl_pic') {
            this.Record.msl_pic = this.Record.msl_pic.toUpperCase();
        }
        if (field == 'msl_consignee') {
            this.Record.msl_consignee = this.Record.msl_consignee.toUpperCase();
        }
        if (field == 'msl_destination') {
            this.Record.msl_destination = this.Record.msl_destination.toUpperCase();
        }
        if (field == 'msl_remarks') {
            this.Record.msl_remarks = this.Record.msl_remarks.toUpperCase();
        }
        if (field == 'msl_shipper_tel') {
            this.Record.msl_shipper_tel = this.Record.msl_shipper_tel.toUpperCase();
        }
        if (field == 'msl_shipper_email') {
            this.Record.msl_shipper_email = this.Record.msl_shipper_email.toLowerCase();
        }

        if (field == 'msl_consignee_add1') {
            this.Record.msl_consignee_add1 = this.Record.msl_consignee_add1.toUpperCase();
        }

        if (field == 'msl_consignee_add2') {
            this.Record.msl_consignee_add2 = this.Record.msl_consignee_add2.toUpperCase();
        }

        if (field == 'msl_consignee_add3') {
            this.Record.msl_consignee_add3 = this.Record.msl_consignee_add3.toUpperCase();
        }

        if (field == 'msl_consignee_pic') {
            this.Record.msl_consignee_pic = this.Record.msl_consignee_pic.toUpperCase();
        }

        if (field == 'msl_consignee_tel') {
            this.Record.msl_consignee_tel = this.Record.msl_consignee_tel.toUpperCase();
        }

        if (field == 'msl_consignee_email') {
            this.Record.msl_consignee_email = this.Record.msl_consignee_email.toLowerCase();
        }

        if (field == 'msl_commodity') {
            this.Record.msl_commodity = this.Record.msl_commodity.toUpperCase();
        }

        if (field == 'msl_volume') {
            this.Record.msl_volume = this.Record.msl_volume.toUpperCase();
        }
        if (field == 'msl_pol') {
            this.Record.msl_pol = this.Record.msl_pol.toUpperCase();
        }
        if (field == 'msl_pod') {
            this.Record.msl_pod = this.Record.msl_pod.toUpperCase();
        }
        if (field == 'msl_country') {
            this.Record.msl_country = this.Record.msl_country.toUpperCase();
        }
        if (field == 'msl_competition') {
            this.Record.msl_competition = this.Record.msl_competition.toUpperCase();
        }
        if (field == 'msl_recommendation') {
            this.Record.msl_recommendation = this.Record.msl_recommendation.toUpperCase();
        }
        if (field == 'searchstring') {
            this.searchstring = this.searchstring.trim().toUpperCase();
        }


    }

    Close() {
        this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    showhiderow(rec: MarkSalesleadm) {
        this.ActionsRecord.parent_id = rec.msl_pkid.toString()
        rec.rowdisplayed = !rec.rowdisplayed;
    }


    actionsChanged(comments: any, _rec: MarkSalesleadm) {
        if (comments.saction == "CLOSE")
            _rec.rowdisplayed = false;
        if (comments.saction == "SAVE") {
            for (let rec of this.RecordList.filter(rec => rec.msl_pkid == _rec.msl_pkid)) {
                rec.msl_followupcount = comments.sfollowupcount;
            }
        }
    }

    PrintSaleslead(_id: string, _type: string, mailsent: any) {

        this.loading = true;
        let SearchData = {
            type: _type,
            pkid: _id,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            report_folder: this.gs.globalVariables.report_folder,
            bwithfollowup: this.bWithFollowup
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.PrintSaleslead(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL') {
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                }
                else if (_type == 'MAIL') {
                    this.AttachList = new Array<any>();
                    this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filesize: response.filesize });
                    this.sSubject = response.subject;
                    this.sMsg = response.message;
                    this.sTo_ids = response.toids;
                    this.open(mailsent);
                }

            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });

    }

    ShowDocuments(doc: any) {
        this.ErrorMessage = '';
        this.open(doc);
    }

    ShowClientModal(content: any, _clientType: string) {
        this.ErrorMessage = '';
        this.clientType = _clientType;
        this.open(content);
    }
}
