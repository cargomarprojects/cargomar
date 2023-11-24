import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { JobInvoicem } from '../../models/jobinvoice';

import { JobInvoiceService } from '../../services/jobinvoice.service';

import { SearchTable } from '../../../shared/models/searchtable';

@Component({
    selector: 'app-jobinvoice',
    templateUrl: './jobinvoice.component.html',
    providers: [JobInvoiceService]
})
export class JobInvoiceComponent {
    // Local Variables 
    title = 'Invoice List';
    /*
    Ajith 25/06/2019 Show rate and amt in checklist added
    */
    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';
    @Input() jobexporterid: string = '';

    selectedRowIndex: number = -1;

    Total_Amount: number = 0;

    modal: any;

    loading = false;
    currentTab = 'LIST';

    bChanged: boolean;

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';

    ctr: number;


    // Array For Displaying List
    RecordList: JobInvoicem[] = [];
    // Single Record for add/edit/view details
    Record: JobInvoicem = new JobInvoicem;

    PKGUNITRECORD: SearchTable = new SearchTable();
    INVCURRECORD: SearchTable = new SearchTable();
    FCURRECORD: SearchTable = new SearchTable();
    ICURRECORD: SearchTable = new SearchTable();
    PCURRECORD: SearchTable = new SearchTable();
    COMCURRECORD: SearchTable = new SearchTable();
    FOBCURRECORD: SearchTable = new SearchTable();
    OTHERCURRECORD: SearchTable = new SearchTable();
    BUYERRECORD: SearchTable = new SearchTable();
    BUYERADDRRECORD: SearchTable = new SearchTable();
    COUNTRYRECORD: SearchTable = new SearchTable();
    AEOCOUNTRYRECORD: SearchTable = new SearchTable();

    constructor(
        private modalService: NgbModal,
        private mainService: JobInvoiceService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.InitLov();
        this.ActionHandler("ADD", null);
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.List("NEW");
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    InitLov() {

        this.PKGUNITRECORD = new SearchTable();
        this.PKGUNITRECORD.controlname = "PKG-UNIT";
        this.PKGUNITRECORD.displaycolumn = "CODE";
        this.PKGUNITRECORD.type = "UNIT";
        this.PKGUNITRECORD.id = "";
        this.PKGUNITRECORD.code = "";
        this.PKGUNITRECORD.name = "";

        this.INVCURRECORD = new SearchTable();
        this.INVCURRECORD.controlname = "INVCURRENCY";
        this.INVCURRECORD.displaycolumn = "CODE";
        this.INVCURRECORD.type = "CURRENCY";
        this.INVCURRECORD.id = "";
        this.INVCURRECORD.code = "";

        /*
          if (this.gs.globalVariables.branch_code == "TUTSF" ||
            this.gs.globalVariables.branch_code == "CHNSF" ||
            this.gs.globalVariables.branch_code == "CHNAF") {
            this.INVCURRECORD.id = "";
            this.INVCURRECORD.code = "";
          } else {
            this.INVCURRECORD.id = this.gs.defaultValues.param_curr_foreign_id;
            this.INVCURRECORD.code = this.gs.defaultValues.param_curr_foreign_code;
          }
        */

        this.FCURRECORD = new SearchTable();
        this.FCURRECORD.controlname = "FCURRENCY";
        this.FCURRECORD.displaycolumn = "CODE";
        this.FCURRECORD.type = "CURRENCY";
        this.FCURRECORD.id = this.gs.defaultValues.param_curr_foreign_id;
        this.FCURRECORD.code = this.gs.defaultValues.param_curr_foreign_code;

        this.ICURRECORD = new SearchTable();
        this.ICURRECORD.controlname = "ICURRENCY";
        this.ICURRECORD.displaycolumn = "CODE";
        this.ICURRECORD.type = "CURRENCY";
        this.ICURRECORD.id = this.gs.defaultValues.param_curr_foreign_id;
        this.ICURRECORD.code = this.gs.defaultValues.param_curr_foreign_code;

        this.PCURRECORD = new SearchTable();
        this.PCURRECORD.controlname = "PCURRENCY";
        this.PCURRECORD.displaycolumn = "CODE";
        this.PCURRECORD.type = "CURRENCY";
        this.PCURRECORD.id = this.gs.defaultValues.param_curr_foreign_id;
        this.PCURRECORD.code = this.gs.defaultValues.param_curr_foreign_code;

        this.COMCURRECORD = new SearchTable();
        this.COMCURRECORD.controlname = "COMCURRENCY";
        this.COMCURRECORD.displaycolumn = "CODE";
        this.COMCURRECORD.type = "CURRENCY";
        this.COMCURRECORD.id = this.gs.defaultValues.param_curr_foreign_id;
        this.COMCURRECORD.code = this.gs.defaultValues.param_curr_foreign_code;

        this.FOBCURRECORD = new SearchTable();
        this.FOBCURRECORD.controlname = "FOBCURRENCY";
        this.FOBCURRECORD.displaycolumn = "CODE";
        this.FOBCURRECORD.type = "CURRENCY";
        this.FOBCURRECORD.id = this.gs.defaultValues.param_curr_foreign_id;
        this.FOBCURRECORD.code = this.gs.defaultValues.param_curr_foreign_code;

        this.OTHERCURRECORD = new SearchTable();
        this.OTHERCURRECORD.controlname = "OTHERCURRENCY";
        this.OTHERCURRECORD.displaycolumn = "CODE";
        this.OTHERCURRECORD.type = "CURRENCY";
        this.OTHERCURRECORD.id = this.gs.defaultValues.param_curr_foreign_id;
        this.OTHERCURRECORD.code = this.gs.defaultValues.param_curr_foreign_code;

        this.BUYERRECORD = new SearchTable();
        this.BUYERRECORD.controlname = "BUYER";
        this.BUYERRECORD.displaycolumn = "CODE";
        this.BUYERRECORD.type = "CUSTOMER";
        this.BUYERRECORD.id = "";
        this.BUYERRECORD.code = "";
        this.BUYERRECORD.name = "";
        this.BUYERRECORD.parentid = "";

        this.BUYERADDRRECORD = new SearchTable();
        this.BUYERADDRRECORD.controlname = "BUYERADDRESS";
        this.BUYERADDRRECORD.displaycolumn = "CODE";
        this.BUYERADDRRECORD.type = "CUSTOMERADDRESS";
        this.BUYERADDRRECORD.id = "";
        this.BUYERADDRRECORD.code = "";
        this.BUYERADDRRECORD.name = "";
        this.BUYERADDRRECORD.parentid = "";

        this.COUNTRYRECORD = new SearchTable();
        this.COUNTRYRECORD.controlname = "COUNTRY";
        this.COUNTRYRECORD.displaycolumn = "NAME";
        this.COUNTRYRECORD.type = "COUNTRY";
        this.COUNTRYRECORD.id = "";
        this.COUNTRYRECORD.code = "";
        this.COUNTRYRECORD.name = "";

        this.AEOCOUNTRYRECORD = new SearchTable();
        this.AEOCOUNTRYRECORD.controlname = "AEOCOUNTRY";
        this.AEOCOUNTRYRECORD.displaycolumn = "NAME";
        this.AEOCOUNTRYRECORD.type = "COUNTRY";
        this.AEOCOUNTRYRECORD.id = "";
        this.AEOCOUNTRYRECORD.code = "";
        this.AEOCOUNTRYRECORD.name = "";
    }

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "PKG-UNIT") {
            //this.Record.pack_pkg_unit_id = _Record.id;
            //this.Record.pack_pkg_unit_code = _Record.code;
        }

        if (_Record.controlname == "INVCURRENCY") {
            this.Record.jexp_curr_id = _Record.id;
            this.Record.jexp_curr_code = _Record.code;
            if (_Record.col1 != "")
                this.Record.jexp_exrate = +_Record.col1;//clr rate
            else
                this.Record.jexp_exrate = 1;

            this.CurrencyLoad();
        }

        if (_Record.controlname == "FCURRENCY") {
            this.Record.jexp_freight_curr_id = _Record.id;
            this.Record.jexp_freight_curr_code = _Record.code;
        }
        if (_Record.controlname == "ICURRENCY") {
            this.Record.jexp_insurance_curr_id = _Record.id;
            this.Record.jexp_insurance_curr_code = _Record.code;
        }
        if (_Record.controlname == "PCURRENCY") {
            this.Record.jexp_packing_curr_id = _Record.id;
            this.Record.jexp_packing_curr_code = _Record.code;
        }
        if (_Record.controlname == "COMCURRENCY") {
            this.Record.jexp_commission_curr_id = _Record.id;
            this.Record.jexp_commission_curr_code = _Record.code;
        }
        if (_Record.controlname == "FOBCURRENCY") {
            this.Record.jexp_fobdiscount_curr_id = _Record.id;
            this.Record.jexp_fobdiscount_curr_code = _Record.code;
        }
        if (_Record.controlname == "OTHERCURRENCY") {
            this.Record.jexp_otherded_curr_id = _Record.id;
            this.Record.jexp_otherded_curr_code = _Record.code;
        }

        if (_Record.controlname == "COUNTRY") {
            this.Record.jexp_tp_country_id = _Record.id;
            //this.Record.jexp_tp_country_code = _Record.code;
            this.Record.jexp_tp_country_name = _Record.name;
        }
        if (_Record.controlname == "AEOCOUNTRY") {
            this.Record.jexp_aeo_operator_country_id = _Record.id;
            //this.Record.jexp_aeo_operator_country_code = _Record.code;
            this.Record.jexp_aeo_operator_country_name = _Record.name;
        }

        let bchange: boolean = false;
        if (_Record.controlname == 'BUYER') {
            bchange = false;
            if (this.Record.jexp_buyer_id != _Record.id)
                bchange = true;
            this.Record.jexp_buyer_id = _Record.id;
            this.Record.jexp_buyer_name = _Record.name;

            if (bchange) {
                this.BUYERADDRRECORD = new SearchTable();
                this.BUYERADDRRECORD.controlname = "BUYERADDRESS";
                this.BUYERADDRRECORD.type = "CUSTOMERADDRESS";
                this.BUYERADDRRECORD.id = "";
                this.BUYERADDRRECORD.code = "";
                this.BUYERADDRRECORD.name = "";
                this.BUYERADDRRECORD.parentid = this.Record.jexp_buyer_id;
                this.Record.jexp_buyer_address = "";
            }

        }

        else if (_Record.controlname == "BUYERADDRESS") {

            this.Record.jexp_buyer_br_id = _Record.id;
            this.Record.jexp_buyer_br_no = _Record.code;
            this.Record.jexp_buyer_address = this.GetBrAddress(_Record.name).address;

        }

    }


    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
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

        }
        else if (action === 'EDIT') {
            this.selectedRowIndex = _selectedRowIndex;
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            this.ResetControls();
            this.pkid = id;
            this.GetRecord(id);
        }
        else if (action === 'REMOVE') {
            this.currentTab = 'DETAILS';
            this.pkid = id;
            this.RemoveRecord(id);
        }
    }

    RemoveList(event: any) {
        if (event.selected) {
            this.ActionHandler('REMOVE', event.id)
        }
    }



    ResetControls() {

    }

    List(_type: string) {



        this.loading = true;



        let SearchData = {
            type: _type,
            rowtype: this.type,
            parentid: this.parentid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    NewRecord() {

        this.pkid = this.gs.getGuid();
        this.Record = new JobInvoicem();
        this.Record.jexp_pkid = this.pkid;
        this.Record.jexp_invoice_no = '';
        this.Record.jexp_invoice_date = '';
        this.Record.jexp_curr_id = "";
        this.Record.jexp_curr_code = "";
        this.Record.jexp_exrate = 0;

        /*
          if (this.gs.globalVariables.branch_code == "TUTSF" ||
             this.gs.globalVariables.branch_code == "CHNSF"  ||
             this.gs.globalVariables.branch_code == "CHNAF") {
             this.Record.jexp_curr_id = "";
             this.Record.jexp_curr_code = "";
             this.Record.jexp_exrate = 0;
          } else {
            this.Record.jexp_curr_id = this.gs.defaultValues.param_curr_foreign_id;
            this.Record.jexp_curr_code = this.gs.defaultValues.param_curr_foreign_code;
            this.Record.jexp_exrate = this.gs.defaultValues.param_curr_foreign_clrrate;
          }
        */

        this.Record.jexp_lcno = '';
        this.Record.jexp_payment_type = "DP";
        this.Record.jexp_valid_period = 60;
        this.Record.jexp_contract_no = '';
        this.Record.jexp_comm_invoice_no = '';
        this.Record.jexp_contract_nature = "FOB";
        this.Record.jexp_freight_amount = 0.00;

        this.Record.jexp_freight_curr_id = this.gs.defaultValues.param_curr_foreign_id;
        this.Record.jexp_freight_curr_code = this.gs.defaultValues.param_curr_foreign_code;

        this.Record.jexp_insurance_rate = 0.00;
        this.Record.jexp_insurance_amount = 0.00;

        this.Record.jexp_insurance_curr_id = this.gs.defaultValues.param_curr_foreign_id;
        this.Record.jexp_insurance_curr_code = this.gs.defaultValues.param_curr_foreign_code;

        this.Record.jexp_packing_amount = 0.00;

        this.Record.jexp_packing_curr_id = this.gs.defaultValues.param_curr_foreign_id;
        this.Record.jexp_packing_curr_code = this.gs.defaultValues.param_curr_foreign_code;

        this.Record.jexp_commission_rate = 0.00;
        this.Record.jexp_commission_amount = 0.00;

        this.Record.jexp_commission_curr_id = this.gs.defaultValues.param_curr_foreign_id;
        this.Record.jexp_commission_curr_code = this.gs.defaultValues.param_curr_foreign_code;

        this.Record.jexp_fobdiscount_rate = 0.00;
        this.Record.jexp_fobdiscount_amount = 0.00;

        this.Record.jexp_fobdiscount_curr_id = this.gs.defaultValues.param_curr_foreign_id;
        this.Record.jexp_fobdiscount_curr_code = this.gs.defaultValues.param_curr_foreign_code;

        this.Record.jexp_otherded_rate = 0.00;
        this.Record.jexp_otherded_amount = 0.00;
        this.Record.jexp_otherded_curr_id = this.gs.defaultValues.param_curr_foreign_id;
        this.Record.jexp_otherded_curr_code = this.gs.defaultValues.param_curr_foreign_code;
        this.Record.jexp_add = "NO";
        this.Record.jexp_inv_amt = 0.00;

        this.Record.jexp_isconsbuyersame = true;
        this.Record.jexp_buyer_id = '';
        this.Record.jexp_buyer_code = '';
        this.Record.jexp_buyer_name = '';
        this.Record.jexp_buyer_address = '';
        this.Record.jexp_buyer_br_id = '';
        this.Record.jexp_buyer_br_no = '';

        this.Record.jexp_tp_code = '';
        this.Record.jexp_tp_name = '';
        this.Record.jexp_tp_addr1 = '';
        this.Record.jexp_tp_addr2 = '';
        this.Record.jexp_tp_city = '';
        this.Record.jexp_tp_country_subdiv = '';
        this.Record.jexp_tp_country_id = '';
        //this.Record.jexp_tp_country_code = '';
        this.Record.jexp_tp_country_name = '';
        this.Record.jexp_tp_pin = '';

        this.Record.jexp_aeo_operator_code = '';
        this.Record.jexp_aeo_operator_country_id = '';
        //this.Record.jexp_aeo_operator_country_code = '';
        this.Record.jexp_aeo_operator_country_name = '';
        this.Record.jexp_aeo_operator_role = '';
        this.Record.jexp_aeo_term_place = '';
        this.Record.jexp_show_amount = false;

        this.Record.rec_mode = this.mode;

        this.InitLov();

        //this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;
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

    LoadData(_Record: JobInvoicem) {
        this.Record = _Record;
        this.InitLov();

        //this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;

        this.INVCURRECORD.id = this.Record.jexp_curr_id;
        this.INVCURRECORD.code = this.Record.jexp_curr_code;

        this.FCURRECORD.id = this.Record.jexp_freight_curr_id;
        this.FCURRECORD.code = this.Record.jexp_freight_curr_code;

        this.ICURRECORD.id = this.Record.jexp_insurance_curr_id;
        this.ICURRECORD.code = this.Record.jexp_insurance_curr_code;

        this.PCURRECORD.id = this.Record.jexp_packing_curr_id;
        this.PCURRECORD.code = this.Record.jexp_packing_curr_code;

        this.COMCURRECORD.id = this.Record.jexp_commission_curr_id;
        this.COMCURRECORD.code = this.Record.jexp_commission_curr_code;

        this.FOBCURRECORD.id = this.Record.jexp_fobdiscount_curr_id;
        this.FOBCURRECORD.code = this.Record.jexp_fobdiscount_curr_code;

        this.OTHERCURRECORD.id = this.Record.jexp_otherded_curr_id;
        this.OTHERCURRECORD.code = this.Record.jexp_otherded_curr_code;

        this.BUYERRECORD.id = this.Record.jexp_buyer_id;
        this.BUYERRECORD.code = this.Record.jexp_buyer_code;
        this.BUYERRECORD.name = this.Record.jexp_buyer_name;

        this.BUYERADDRRECORD.id = this.Record.jexp_buyer_br_id;
        this.BUYERADDRRECORD.code = this.Record.jexp_buyer_br_no;
        this.BUYERADDRRECORD.parentid = this.Record.jexp_buyer_id;

        this.COUNTRYRECORD.id = this.Record.jexp_tp_country_id;
        //this.COUNTRYRECORD.code = this.Record.jexp_tp_country_code;
        this.COUNTRYRECORD.name = this.Record.jexp_tp_country_name;

        this.AEOCOUNTRYRECORD.id = this.Record.jexp_aeo_operator_country_id;
        //this.AEOCOUNTRYRECORD.code = this.Record.jexp_aeo_operator_country_code;
        this.AEOCOUNTRYRECORD.name = this.Record.jexp_aeo_operator_country_name;

        this.Record.rec_mode = this.mode;
    }
    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record.jexp_job_id = this.parentid;
        this.Record._globalvariables = this.gs.globalVariables;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                if (response.STATUS == "SPECIAL CHARACTER") {
                    alert("Specical Character Found Buyer Address, Pls Re-Check Data");
                }
                this.RefreshList();
                this.ActionHandler('ADD', null);
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

        if (this.Record.jexp_invoice_no.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Invoice# Cannot Be Blank";
        }
        if (this.Record.jexp_invoice_date.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Invoice Date Cannot Be Blank";
        }
        if (this.Record.jexp_inv_amt <= 0) {
            bret = false;
            sError += "\n\r | Invalid Invoice Amount";
        }
        if (this.Record.jexp_curr_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Currency Cannot Be Blank";
        }
        if (this.Record.jexp_exrate <= 0) {
            bret = false;
            sError += "\n\r | Invalid Exchange Rate";
        }
        if (this.Record.jexp_freight_amount > 0 && this.Record.jexp_freight_curr_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Freight Currency Cannot Be Blank";
        }
        if (this.Record.jexp_insurance_amount > 0 && this.Record.jexp_insurance_curr_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Insurance Currency Cannot Be Blank";
        }
        if (this.Record.jexp_packing_amount > 0 && this.Record.jexp_packing_curr_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Packing Currency Cannot Be Blank";
        }
        if (this.Record.jexp_commission_amount > 0 && this.Record.jexp_commission_curr_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Commission Currency Cannot Be Blank";
        }
        if (this.Record.jexp_otherded_amount > 0 && this.Record.jexp_otherded_curr_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Otherdeduction Currency Cannot Be Blank";
        }
        if (this.Record.jexp_add.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Rate Includes Cannot Be Blank";
        }
        if (bret === false)
        {
            this.ErrorMessage = sError;
            alert(this.ErrorMessage);
        }
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.jexp_pkid == this.Record.jexp_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.jexp_invoice_no = this.Record.jexp_invoice_no;
            REC.jexp_invoice_date = this.Record.jexp_invoice_date;
            REC.jexp_curr_code = this.Record.jexp_curr_code;
            REC.jexp_exrate = this.Record.jexp_exrate;
            REC.jexp_inv_amt = this.Record.jexp_inv_amt;
        }
    }

    RemoveRecord(Id: string) {
        this.loading = true;
        let SearchData = {
            pkid: Id,
            parentid: this.parentid
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.jexp_pkid == this.pkid), 1);
                this.ActionHandler('ADD', null);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }


    Close() {
        this.gs.ClosePage('home');
    }

    OnFocus(field: string) {
        this.bChanged = false;
    }

    OnChange(field: string) {
        this.bChanged = true;

    }

    OnBlur(field: string) {
        switch (field) {
            case 'jexp_invoice_no':
                {
                    this.Record.jexp_invoice_no = this.Record.jexp_invoice_no.toUpperCase();
                    this.SearchRecord('jexp_invoice_no');
                    break;
                }
            case 'jexp_lcno':
                {
                    this.Record.jexp_lcno = this.Record.jexp_lcno.toUpperCase();
                    break;
                }
            case 'jexp_exrate': {
                this.Record.jexp_exrate = this.gs.roundNumber(this.Record.jexp_exrate, 3);
            }
            case 'jexp_contract_no':
                {
                    this.Record.jexp_contract_no = this.Record.jexp_contract_no.toUpperCase();
                    break;
                }
            case 'jexp_comm_invoice_no':
                {
                    this.Record.jexp_comm_invoice_no = this.Record.jexp_comm_invoice_no.toUpperCase();
                    break;
                }
            case 'jexp_freight_amount': {
                this.Record.jexp_freight_amount = this.gs.roundNumber(this.Record.jexp_freight_amount, 2);
                break;
            }
            case 'jexp_insurance_rate': {
                if (!this.bChanged)
                    return;
                if (this.Record.jexp_insurance_amount > 0) {
                    this.Record.jexp_insurance_amount = 0;
                }
                this.Record.jexp_insurance_rate = this.gs.roundNumber(this.Record.jexp_insurance_rate, 2);
                break;
            }
            case 'jexp_insurance_amount': {
                if (!this.bChanged)
                    return;
                if (this.Record.jexp_insurance_rate > 0) {
                    this.Record.jexp_insurance_rate = 0;
                }
                this.Record.jexp_insurance_amount = this.gs.roundNumber(this.Record.jexp_insurance_amount, 2);
                break;
            }
            case 'jexp_packing_amount': {
                this.Record.jexp_packing_amount = this.gs.roundNumber(this.Record.jexp_packing_amount, 2);
                break;
            }
            case 'jexp_commission_rate': {
                if (!this.bChanged)
                    return;
                if (this.Record.jexp_commission_amount > 0) {
                    this.Record.jexp_commission_amount = 0;
                }
                this.Record.jexp_commission_rate = this.gs.roundNumber(this.Record.jexp_commission_rate, 2);
                break;
            }
            case 'jexp_commission_amount': {
                if (!this.bChanged)
                    return;
                if (this.Record.jexp_commission_rate > 0) {
                    this.Record.jexp_commission_rate = 0;
                }
                this.Record.jexp_commission_amount = this.gs.roundNumber(this.Record.jexp_commission_amount, 2);
                break;
            }
            case 'jexp_fobdiscount_rate': {
                if (!this.bChanged)
                    return;
                if (this.Record.jexp_fobdiscount_amount > 0) {
                    this.Record.jexp_fobdiscount_amount = 0;
                }
                this.Record.jexp_fobdiscount_rate = this.gs.roundNumber(this.Record.jexp_fobdiscount_rate, 2);
                break;
            }
            case 'jexp_fobdiscount_amount': {
                if (!this.bChanged)
                    return;
                if (this.Record.jexp_fobdiscount_rate > 0) {
                    this.Record.jexp_fobdiscount_rate = 0;
                }
                this.Record.jexp_fobdiscount_amount = this.gs.roundNumber(this.Record.jexp_fobdiscount_amount, 2);
                break;
            }
            case 'jexp_otherded_rate': {
                if (!this.bChanged)
                    return;
                if (this.Record.jexp_otherded_amount > 0) {
                    this.Record.jexp_otherded_amount = 0;
                }
                this.Record.jexp_otherded_rate = this.gs.roundNumber(this.Record.jexp_otherded_rate, 2);
                break;
            }
            case 'jexp_otherded_amount': {
                if (!this.bChanged)
                    return;
                if (this.Record.jexp_otherded_rate > 0) {
                    this.Record.jexp_otherded_rate = 0;
                }
                this.Record.jexp_otherded_amount = this.gs.roundNumber(this.Record.jexp_otherded_amount, 2);
                break;
            }
            case 'jexp_inv_amt': {
                this.Record.jexp_inv_amt = this.gs.roundNumber(this.Record.jexp_inv_amt, 3);
                break;
            }
            case 'jexp_tp_code': {
                this.Record.jexp_tp_code = this.Record.jexp_tp_code.toUpperCase();
                break;
            }
            case 'jexp_buyer_name': {
                this.Record.jexp_buyer_name = this.Record.jexp_buyer_name.toUpperCase();
                break;
            }
            case 'jexp_buyer_address': {
                this.Record.jexp_buyer_address = this.Record.jexp_buyer_address.toUpperCase();
                break;
            }
            case 'jexp_tp_name': {
                this.Record.jexp_tp_name = this.Record.jexp_tp_name.toUpperCase();
                break;
            }
            case 'jexp_tp_addr1': {
                this.Record.jexp_tp_addr1 = this.Record.jexp_tp_addr1.toUpperCase();
                break;
            }
            case 'jexp_tp_addr2': {
                this.Record.jexp_tp_addr2 = this.Record.jexp_tp_addr2.toUpperCase();
                break;
            }
            case 'jexp_tp_city': {
                this.Record.jexp_tp_city = this.Record.jexp_tp_city.toUpperCase();
                break;
            }
            case 'jexp_tp_country_subdiv': {
                this.Record.jexp_tp_country_subdiv = this.Record.jexp_tp_country_subdiv.toUpperCase();
                break;
            }
            case 'jexp_aeo_operator_code': {
                this.Record.jexp_aeo_operator_code = this.Record.jexp_aeo_operator_code.toUpperCase();
                break;
            }
            case 'jexp_aeo_operator_role': {
                this.Record.jexp_aeo_operator_role = this.Record.jexp_aeo_operator_role.toUpperCase();
                break;
            }
            case 'jexp_aeo_term_place': {
                this.Record.jexp_aeo_term_place = this.Record.jexp_aeo_term_place.toUpperCase();
                break;
            }
        }
    }

    SearchRecord(controlname: string) {
        this.ErrorMessage = '';
        if (this.Record.jexp_invoice_no.trim().length <= 0)
            return;

        if (this.parentid.trim().length <= 0 || this.jobexporterid.trim().length <= 0) {
            this.ErrorMessage = "Invalid ID";
            alert(this.ErrorMessage);
            return;
        }
        this.loading = true;
        let SearchData = {
            rowtype: this.type,
            table: 'dupjobinvno',
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            job_exp_id: '',
            invoice_no: '',
            job_pkid: ''
        };
        if (controlname == 'jexp_invoice_no') {
            SearchData.rowtype = this.type;
            SearchData.table = 'dupjobinvno';
            SearchData.company_code = this.gs.globalVariables.comp_code;
            SearchData.branch_code = this.gs.globalVariables.branch_code;
            SearchData.year_code = this.gs.globalVariables.year_code;
            SearchData.job_exp_id = this.jobexporterid;
            SearchData.invoice_no = this.Record.jexp_invoice_no;
            SearchData.job_pkid = this.parentid;
        }
        this.ErrorMessage = '';
        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = '';
                if (response.dupjobinvno.length > 0) {

                    this.ErrorMessage = "Invoice no Duplication, JOB NO " + response.dupjobinvno;
                    alert(this.ErrorMessage);
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }


    CurrencyLoad() {
        this.Record.jexp_freight_curr_id = this.Record.jexp_curr_id;
        this.Record.jexp_freight_curr_code = this.Record.jexp_curr_code;
        this.Record.jexp_insurance_curr_id = this.Record.jexp_curr_id;
        this.Record.jexp_insurance_curr_code = this.Record.jexp_curr_code;
        this.Record.jexp_packing_curr_id = this.Record.jexp_curr_id;
        this.Record.jexp_packing_curr_code = this.Record.jexp_curr_code;
        this.Record.jexp_commission_curr_id = this.Record.jexp_curr_id;
        this.Record.jexp_commission_curr_code = this.Record.jexp_curr_code;
        this.Record.jexp_fobdiscount_curr_id = this.Record.jexp_curr_id;
        this.Record.jexp_fobdiscount_curr_code = this.Record.jexp_curr_code;
        this.Record.jexp_otherded_curr_id = this.Record.jexp_curr_id;
        this.Record.jexp_otherded_curr_code = this.Record.jexp_curr_code;

        //this.FCURRECORD.id = this.Record.jexp_freight_curr_id;
        //this.FCURRECORD.code = this.Record.jexp_freight_curr_code;

        this.FCURRECORD = new SearchTable();
        this.FCURRECORD.controlname = "FCURRENCY";
        this.FCURRECORD.displaycolumn = "CODE";
        this.FCURRECORD.type = "CURRENCY";
        this.FCURRECORD.id = this.Record.jexp_freight_curr_id;
        this.FCURRECORD.code = this.Record.jexp_freight_curr_code;

        this.ICURRECORD = new SearchTable();
        this.ICURRECORD.controlname = "ICURRENCY";
        this.ICURRECORD.displaycolumn = "CODE";
        this.ICURRECORD.type = "CURRENCY";
        this.ICURRECORD.id = this.Record.jexp_insurance_curr_id;
        this.ICURRECORD.code = this.Record.jexp_insurance_curr_code;

        this.PCURRECORD = new SearchTable();
        this.PCURRECORD.controlname = "PCURRENCY";
        this.PCURRECORD.displaycolumn = "CODE";
        this.PCURRECORD.type = "CURRENCY";
        this.PCURRECORD.id = this.Record.jexp_packing_curr_id;
        this.PCURRECORD.code = this.Record.jexp_packing_curr_code;

        this.COMCURRECORD = new SearchTable();
        this.COMCURRECORD.controlname = "COMCURRENCY";
        this.COMCURRECORD.displaycolumn = "CODE";
        this.COMCURRECORD.type = "CURRENCY";
        this.COMCURRECORD.id = this.Record.jexp_commission_curr_id;
        this.COMCURRECORD.code = this.Record.jexp_commission_curr_code;

        this.FOBCURRECORD = new SearchTable();
        this.FOBCURRECORD.controlname = "FOBCURRENCY";
        this.FOBCURRECORD.displaycolumn = "CODE";
        this.FOBCURRECORD.type = "CURRENCY";
        this.FOBCURRECORD.id = this.Record.jexp_fobdiscount_curr_id;
        this.FOBCURRECORD.code = this.Record.jexp_fobdiscount_curr_code;

        this.OTHERCURRECORD = new SearchTable();
        this.OTHERCURRECORD.controlname = "OTHERCURRENCY";
        this.OTHERCURRECORD.displaycolumn = "CODE";
        this.OTHERCURRECORD.type = "CURRENCY";
        this.OTHERCURRECORD.id = this.Record.jexp_otherded_curr_id;
        this.OTHERCURRECORD.code = this.Record.jexp_otherded_curr_code;

    }

    GetBrAddress(straddress: string) {
        let AddressSplit = {
            addressbrno: '',
            address: ''
        };
        if (straddress.trim() != "") {
            var temparr = straddress.split(' ');
            AddressSplit.addressbrno = temparr[0];
            AddressSplit.address = straddress.substr(AddressSplit.addressbrno.length).trim();
        }
        return AddressSplit;
    }

    OnChange2(field: string) {

        if (field == "CF") {
            this.Record.jexp_add = "FREIGHT";
        }
        if (field == "CI") {
            this.Record.jexp_add = "INSURANCE";
        }
        if (field == "CIF") {
            this.Record.jexp_add = "BOTH";
        }
        if (field == "FOB") {
            this.Record.jexp_add = "NO";
        }
    }

    open(content: any) {
        this.modal = this.modalService.open(content,{ backdrop: 'static', keyboard: true});
    }

    LinkDocs(esanchitlink: any) {
        this.open(esanchitlink);
    }
}
