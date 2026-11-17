import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { CartingOrderm } from '../../models/cartingorderm';
import { CartingOrderService } from '../../services/cartingorder.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { DateComponent } from '../../../shared/date/date.component';

@Component({
    selector: 'app-cartingorder',
    templateUrl: './cartingorder.component.html',
    providers: [CartingOrderService]
})
export class CartingOrderComponent {
    // Local Variables 
    title = 'CARTING ORDER';

    @ViewChild('co_date') private ctrl_co_date: DateComponent;

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;

    menu_record: any;
    modal: any;

    ord_selected = false;
    chkselected = false;
    disableSave = true;
    loading = false;

    ord_po = "";
    ord_trkids = "";
    ord_trkpos = "";

    sub: any;
    urlid: string;

    // Single Record for add/edit/view details
    Record: CartingOrderm = new CartingOrderm;

    constructor(
        private modalService: NgbModal,
        public ms: CartingOrderService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
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

        this.ms.init(this.menuid);
        if (this.ms.state.mode == "ADD")
            this.ActionHandler('ADD', '');
        else if (this.ms.state.mode == "EDIT")
            this.ActionHandler('EDIT', this.ms.state.pkid)
    }

    InitComponent() {
        this.ord_po = "";
        this.ord_trkids = "";
        this.ord_trkpos = "";
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record)
            this.title = this.menu_record.menu_name;

        this.LoadCombo();
    }

    // Destroy Will be called when this component is closed
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

    LoadCombo() {

    }


    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "SHIPPER") {
            this.Record.co_exp_id = _Record.id;
            this.Record.co_exp_code = _Record.code;
            this.Record.co_exp_name = _Record.name;
        }
        else if (_Record.controlname == "AGENT") {
            this.Record.co_agent_id = _Record.id;
            this.Record.co_agent_code = _Record.code;
            this.Record.co_agent_name = _Record.name;
        }
        else if (_Record.controlname == "CONSIGNEE") {
            this.Record.co_imp_id = _Record.id;
            this.Record.co_imp_code = _Record.code;
            this.Record.co_imp_name = _Record.name;
        }
        else if (_Record.controlname == "VESSEL") {
            this.Record.co_vessel_id = _Record.id;
            this.Record.co_vessel_code = _Record.code;
            this.Record.co_vessel_name = _Record.name;
        }
    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ms.state.ErrorMessage = '';
        this.ms.state.InfoMessage = '';
        if (action == 'LIST') {
            this.ms.state.mode = '';
            this.ms.state.pkid = '';
            this.ms.state.currentTab = 'LIST';
            this.restoreRowPosition();
        }
        else if (action === 'ADD') {
            this.ms.state.currentTab = 'DETAILS';
            this.ms.state.mode = 'ADD';
            this.ResetControls();
            this.NewRecord();
        }
        else if (action === 'EDIT') {
            this.ms.state.currentTab = 'DETAILS';
            this.ms.state.pkid = id;
            this.ms.state.mode = 'EDIT';
            this.ResetControls();
            this.GetRecord(id, '');
        }
    }

    ResetControls() {
        this.disableSave = true;
        if (!this.menu_record)
            return;

        if (this.menu_record.rights_admin)
            this.disableSave = false;
        if (this.ms.state.mode == "ADD" && this.menu_record.rights_add)
            this.disableSave = false;
        if (this.ms.state.mode == "EDIT" && this.menu_record.rights_edit)
            this.disableSave = false;

        return this.disableSave;
    }

    // Query List Data
    List(_type: string) {
        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this.ms.state.searchstring.toUpperCase(),
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            page_count: this.ms.state.page_count,
            page_current: this.ms.state.page_current,
            page_rows: this.ms.state.page_rows,
            page_rowcount: this.ms.state.page_rowcount
        };

        this.ms.state.selectedRowIndex = 0;
        this.restoreRowPosition();
        this.ms.state.ErrorMessage = '';
        this.ms.state.InfoMessage = '';
        this.ms.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ms.state.RecordList = response.list;
                this.ms.state.page_count = response.page_count;
                this.ms.state.page_current = response.page_current;
                this.ms.state.page_rowcount = response.page_rowcount;
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                });
    }

    NewRecord() {
        this.ord_po = "";
        this.chkselected = false;
        this.ord_selected = false;
        this.ms.state.pkid = this.gs.getGuid();
        this.Record = new CartingOrderm();
        this.Record.co_pkid = this.ms.state.pkid;
        this.Record.co_sl_no = null;
        this.Record.co_date = this.gs.defaultValues.today;
        this.Record.co_agent_id = '';
        this.Record.co_agent_code = '';
        this.Record.co_agent_name = '';
        this.Record.co_exp_id = '';
        this.Record.co_exp_code = '';
        this.Record.co_exp_name = '';
        this.Record.co_imp_id = '';
        this.Record.co_imp_code = '';
        this.Record.co_imp_name = '';
        this.Record.co_remarks = '';
        this.Record.co_vessel_id = '';
        this.Record.co_vessel_code = '';
        this.Record.co_vessel_name = '';
        this.Record.co_vessel_no = '';
        this.Record.rec_mode = this.ms.state.mode;
    }

    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string, _type: string) {
        this.loading = true;
        let SearchData = {
            pkid: Id,
            report_folder: this.gs.globalVariables.report_folder,
            file_pkid: this.gs.getGuid(),
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            type: _type,
        };

        this.ms.state.ErrorMessage = '';
        this.ms.state.InfoMessage = '';
        this.ms.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.LoadData(response.record);
                }
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                });
    }

    LoadData(_Record: CartingOrderm) {
        this.ord_po = "";
        this.Record = _Record;
        this.Record.rec_mode = this.ms.state.mode;
        this.Record.OrderList = _Record.OrderList;
        this.ord_selected = false;
        if (this.Record.OrderList.length > 0)
            this.ord_selected = true;
        this.chkselected = this.ord_selected;
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ms.state.ErrorMessage = '';
        this.ms.state.InfoMessage = '';
        this.Record._globalvariables = this.gs.globalVariables;
        this.ms.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                if (this.ms.state.mode == 'ADD') {
                    this.Record.co_sl_no = response.slno;
                    this.ms.state.InfoMessage = "New Record " + this.Record.co_sl_no + " Generated Successfully";
                } else
                    this.ms.state.InfoMessage = "Save Complete";

                this.ms.state.mode = 'EDIT';
                this.Record.rec_mode = this.ms.state.mode;
                this.RefreshList();
                alert(this.ms.state.InfoMessage);
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                    alert(this.ms.state.ErrorMessage);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ms.state.ErrorMessage = '';
        this.ms.state.InfoMessage = '';

        if (this.Record.co_date.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Date Cannot Be Blank";
        }
        if (this.Record.co_agent_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Agent Cannot Be Blank";
        }
        if (this.Record.co_exp_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Exporter Cannot Be Blank";
        }

        if (bret === false) {
            this.ms.state.ErrorMessage = sError;
            alert(this.ms.state.ErrorMessage);
        }
        return bret;
    }

    RefreshList() {
        if (this.ms.state.RecordList == null)
            return;
        var REC = this.ms.state.RecordList.find(rec => rec.co_pkid == this.Record.co_pkid);
        if (REC == null) {
            this.ms.state.RecordList.push(this.Record);
            this.ms.state.selectedRowIndex = this.ms.state.RecordList.length - 1;
            REC = this.ms.state.RecordList.find(rec => rec.co_pkid == this.Record.co_pkid);
            if (!this.gs.isBlank(this.ctrl_co_date))
                REC.co_date = this.ctrl_co_date.GetDisplayDate();
        }
        else {
            REC.co_agent_name = this.Record.co_agent_name;
            REC.co_exp_name = this.Record.co_exp_name;
            REC.co_imp_name = this.Record.co_imp_name;
            REC.co_vessel_name = this.Record.co_vessel_name;
            REC.co_vessel_no = this.Record.co_vessel_no;
            REC.co_date = this.ctrl_co_date.GetDisplayDate();
            REC.co_remarks = this.Record.co_remarks;
        }
    }


    OnBlur(field: string) {
        switch (field) {

            case 'ord_po':
                {
                    this.ord_po = this.ord_po.toUpperCase();
                    break;
                }
            case 'co_vessel_no':
                {
                    this.Record.co_vessel_no = this.Record.co_vessel_no.toUpperCase();
                    break;
                }
            case 'co_remarks':
                {
                    this.Record.co_remarks = this.Record.co_remarks.toUpperCase();
                    break;
                }
        }
    }
    OnBlurTableCell(field: string, fieldid: string) {
        var REC = this.Record.OrderList.find(rec => rec.ord_pkid == fieldid);
        if (REC != null) {
            if (field == "ord_carting_no")
                REC.ord_carting_no = REC.ord_carting_no.toUpperCase();
        }
    }
    Close() {
        this.gs.ClosePage('home');
    }

    OrderList(_Record: CartingOrderm) {

        this.ms.state.ErrorMessage = '';
        this.ms.state.InfoMessage = '';

        this.loading = true;
        let SearchData = {
            rowtype: this.type,
            ordpo: this.ord_po,
            cartingid: _Record.co_pkid,
            agentid: _Record.co_agent_id,
            expid: _Record.co_exp_id,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code
        };

        this.ms.OrderList(SearchData)
            .subscribe(response => {
                this.loading = false;
                var REC = null;

                for (let Rec of response.list) {
                    REC = this.Record.OrderList.find(a => a.ord_pkid == Rec.ord_pkid);
                    if (REC == null) {
                        this.Record.OrderList.push(Rec);
                    }
                }
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    SelectDeselect() {
        this.chkselected = !this.chkselected;
        for (let rec of this.Record.OrderList) {
            rec.ord_selected = this.chkselected;
        }
    }

    open(content: any) {
        this.modal = this.modalService.open(content);
    }

    TrackOrders(trkorder: any) {
        this.ms.state.ErrorMessage = "";
        this.ord_trkids = "";
        this.ord_trkpos = "";
        for (let rec of this.Record.OrderList) {

            if (rec.ord_selected) {

                if (this.ord_trkids != "")
                    this.ord_trkids += ",";
                this.ord_trkids += rec.ord_pkid;

                if (this.ord_trkpos != "")
                    this.ord_trkpos += ", ";
                this.ord_trkpos += rec.ord_po;

            }
        }
        if (this.ord_trkids == "") {
            this.ms.state.ErrorMessage = " Please select PO and continue.....";
            alert(this.ms.state.ErrorMessage);
            return;
        }
        this.open(trkorder);
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
}