import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { ShipTrackMaster } from '../models/shiptrackmaster';
import { ShipTrackMasterService } from '../services/shiptrackmaster.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-shiptrackmaster',
    templateUrl: './shiptrackmaster.component.html',
    providers: [ShipTrackMasterService]
})
export class ShipTrackMasterComponent {
    // Local Variables
    title = 'Tracking List';

    @Input() menuid: string = '';
    @Input() type: string = "NA";
    InitCompleted: boolean = false;
    menu_record: any;

    is_both: boolean = true;
    modal: any;
    selectedRowIndex = 0;
    bMail: boolean = false;
    bAdmin = false;
    bPrint = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    list_trk_exist: boolean = true;
    search_list_opr_type: string = "SEA EXPORT,AIR EXPORT";
    list_opr_type: string = "SEA EXPORT,AIR EXPORT";

    ord_trkids: string = "";
    ord_trkpos: string = "";
    job_docno: string = "";
    master_no: string = "";
    house_no: string = "";
    ord_po: string = "";
    ord_invoice: string = "";
    from_date: string = '';
    to_date: string = '';
    ord_showpending: boolean = false;
    ord_status: string = "ALL";
    sort_colname: string = "a.rec_created_date desc";

    list_exp_id: string = "";
    list_exp_name: string = "";
    list_exp_code: string = "";
    list_imp_id: string = "";
    list_imp_name: string = "";
    list_imp_code: string = "";
    list_agent_id: string = "";
    list_agent_name: string = "";
    list_agent_code: string = "";
    ftp_agent_name: string = "";
    ftp_agent_code: string = "";

    ErrorMessage = "";
    InfoMessage = "";

    mode = '';
    pkid = '';

    bShowPasteData: boolean = false;
    bDisabledControl: boolean = false;
    selectcheckbox: boolean = false;
    selectcheck: boolean = false;

    LIST_EXPRECORD: SearchTable = new SearchTable();

    sSubject: string = '';
    sMsg: string = '';
    sHtml: string = '';

    OrdColList: any[] = [];
    AttachList: any[] = [];
    SortList: any[] = [];
    FileList: any[] = [];
    // Array For Displaying List
    RecordList: ShipTrackMaster[] = [];
    // Single Record for add/edit/view details
    Record: ShipTrackMaster = new ShipTrackMaster;

    bShowList = false;


    constructor(
        private modalService: NgbModal,
        private mainService: ShipTrackMasterService,
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {
        this.page_count = 0;
        this.page_rows = 30;
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
        // this.from_date = this.gs.getNewdate(60);
        this.from_date = this.gs.globalVariables.year_start_date;
        this.to_date = "";
        this.bMail = false;
        this.bAdmin = false;
        this.bPrint = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_admin)
                this.bAdmin = true;
            if (this.menu_record.rights_print)
                this.bPrint = true;
            if (this.menu_record.rights_email)
                this.bMail = true;
        }
        this.LoadCombo();
        this.initLov();
        // this.List("NEW",'');
    }

    //// Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    initLov(caption: string = '') {

        // this.LIST_EXPRECORD = new SearchTable();
        // this.LIST_EXPRECORD.controlname = "LIST_SHIPPER";
        // this.LIST_EXPRECORD.displaycolumn = "NAME";
        // this.LIST_EXPRECORD.type = "CUSTOMER";
        // this.LIST_EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
        // this.LIST_EXPRECORD.id = "";
        // this.LIST_EXPRECORD.code = "";
        // this.LIST_EXPRECORD.name = "";
        // this.LIST_EXPRECORD.parentid = "";

    }



    LovSelected(_Record: SearchTable) {
        // Company Settings


        if (_Record.controlname == "LIST_SHIPPER") {
            this.list_exp_id = _Record.id;
            this.list_exp_name = _Record.name;
            this.list_exp_code = _Record.code;

        }

    }

    LoadCombo() {

        // this.list_agent_id = "";
        // this.list_exp_id = "";
        // this.list_imp_id = "";
        // this.job_docno = "";
        // this.ord_po = "";
        // this.ord_invoice = "";
        // this.ord_status = "ALL";
        this.sort_colname = "a.rec_created_date desc";
        this.SortList = [
            { "colheadername": "CREATED", "colname": "a.rec_created_date desc" },
            { "colheadername": "AGENT,SHIPPER,PO", "colname": "agent.cust_name,exp.cust_name,ord_po" }
        ];

        // this.loading = true;
        // let SearchData = {
        //   type: 'TPLIST',
        //   comp_code: this.gs.globalVariables.comp_code,
        //   branch_code: this.gs.globalVariables.branch_code,
        //   tp_code: this.gs.globalVariables.tp_code,
        //   tp_name: this.gs.globalVariables.tp_name,
        //   istp: this.gs.globalVariables.istp
        // };

        // SearchData.comp_code = this.gs.globalVariables.comp_code;
        // SearchData.branch_code = this.gs.globalVariables.branch_code;

        // this.ErrorMessage = '';
        // this.InfoMessage = '';
        // this.mainService.LoadDefault(SearchData)
        //   .subscribe(response => {
        //     this.loading = false;
        //     this.TpList = response.tplist;
        //     if (!this.gs.isBlank(this.TpList)) {
        //       if (this.TpList.length > 0)
        //         this.list_tp_code = this.TpList[0].user_tp_code;
        //     }
        //   },
        //     error => {
        //       this.loading = false;
        //       this.ErrorMessage = this.gs.getError(error);
        //       alert(this.ErrorMessage);
        //     });

    }

    ////function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        this.InfoMessage = '';
    }




    //// Query List Data
    List(_type: string, mailsent: any) {

        this.search_list_opr_type = this.list_opr_type;
        this.loading = true;
        this.selectcheck = false;
        this.selectcheckbox = false;
        if (this.search_list_opr_type.includes('EXPORT'))
            this.list_trk_exist = true;
        else
            this.list_trk_exist = false;

        let SearchData = {
            type: _type,
            rowtype: this.search_list_opr_type,
            searchstring: this.searchstring.toUpperCase(),
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            from_date: this.from_date,
            to_date: this.to_date,
            list_exp_id: this.list_exp_id,
            report_folder: this.gs.globalVariables.report_folder,
            file_pkid: this.gs.getGuid(),
            sort_colname: this.sort_colname,
            root_folder: this.gs.defaultValues.root_folder
        };

        if (_type == "MAIL")
            SearchData.type = "EXCEL";
        else
            SearchData.type = _type;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL') {
                    this.FileList = response.filelist;
                    if (this.gs.isBlank(this.FileList)) {
                        if (response.filename)
                            this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                    } else {
                        for (let rec of this.FileList) {
                            this.Downloadfile(rec.filename, rec.filetype, rec.filedisplayname);
                        }
                    }
                }
                else if (_type == 'MAIL') {
                    this.FileList = response.filelist;
                    this.AttachList = new Array<any>();
                    if (this.gs.isBlank(this.FileList)) {
                        this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filesize: response.filesize });
                    } else {
                        for (let rec of this.FileList) {
                            this.AttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filesize: rec.filesize });
                        }
                    }
                    this.sSubject = response.subject;
                    this.sMsg = response.message;
                    this.open(mailsent);
                }
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


    OnBlur(field: string) {
        switch (field) {
            case 'master_no':
                {
                    this.master_no = this.master_no.toUpperCase();
                    break;
                }
            case 'house_no':
                {
                    this.house_no = this.house_no.toUpperCase();
                    break;
                }
        }
    }


    ShowPage(_rec: ShipTrackMaster) {
        _rec.row_displayed = !_rec.row_displayed;
    }



    Close() {
        this.gs.ClosePage('home');
    }

    getSwhere(_type: string) {
        let _retstr = "";

        if (_type == "AGENT")
            _retstr = " CUST_IS_AGENT = 'Y' ";
        else if (_type == "SHIPPER")
            _retstr = " CUST_IS_SHIPPER = 'Y' ";
        else if (_type == "CONSIGNEE")
            _retstr = " CUST_IS_CONSIGNEE = 'Y' ";

        return _retstr;
    }

    ModifiedRecords(params: any) {
        // if (params.type == "MAIL-PO-CHECKLIST") {
        //   this.MailOrders('','MULTIPLE','CHECK-LIST');
        // }
    }

    //   ShowFile(id: string) {
    //     this.gs.DownloadFileDirect(id);
    //   }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }
}
