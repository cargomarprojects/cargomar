import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Bl } from '../../models/bl';
import { BlService } from '../../services/bl.service';
import { SearchTable } from '../../../shared/models/searchtable';

import { Bldesc } from '../../models/bdesc';
//EDIT-AJITH-14-09-2021

@Component({
  selector: 'app-airbl',
  templateUrl: './airbl.component.html',
  providers: [BlService]
})
export class AirBlComponent {
  // Local Variables 
  title = 'AWB';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  @Input() invokefrom: string = '';
  @Output() PageChanged = new EventEmitter<any>();

  selectdeselect = false;

  loading = false;
  currentTab = 'LIST';
  ErrorMessage = "";
  InfoMessage = '';


  mode = 'ADD';
  pkid = '';
  folder_id = '';
  backside_print = false;
  user_admin = false;
  // Array For Displaying List
  BLFormatList: any[] = [];
  BLPrintFormatList: any[] = [];
  FooterNotesList: any[] = [];
  ChargesAgent: any[] = [];
  ChargesCarrier: any[] = [];

  FootNotes: string = "";

  // Single Record for add/edit/view details
  Record: Bl = new Bl;

  //AttchRecordList: Bldesc[] = [];
  //AttchRecord: Bldesc = new Bldesc;

  SHPRRECORD: SearchTable = new SearchTable();
  SHPRADDRECORD: SearchTable = new SearchTable();

  CNGERECORD: SearchTable = new SearchTable();
  CNGEADDRECORD: SearchTable = new SearchTable();

  NFYRECORD: SearchTable = new SearchTable();
  NFYADDRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: BlService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.InitLov();
    this.LoadCombo();
    this.title = this.invokefrom;
    this.user_admin = false;
    if (this.gs.globalVariables.user_code == "ADMIN")
      this.user_admin = true;
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }

  InitLov() {
    this.SHPRRECORD = new SearchTable();
    this.SHPRRECORD.controlname = "SHIPPER";
    this.SHPRRECORD.displaycolumn = "CODE";
    this.SHPRRECORD.type = "CUSTOMER";
    if (this.invokefrom == "HAWB")
      this.SHPRRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.SHPRRECORD.id = "";
    this.SHPRRECORD.code = "";
    this.SHPRRECORD.name = "";

    this.SHPRADDRECORD = new SearchTable();
    this.SHPRADDRECORD.controlname = "SHIPPERADDRESS";
    this.SHPRADDRECORD.displaycolumn = "CODE";
    this.SHPRADDRECORD.type = "CUSTOMERADDRESS";
    this.SHPRADDRECORD.id = "";
    this.SHPRADDRECORD.code = "";
    this.SHPRADDRECORD.name = "";
    this.SHPRADDRECORD.parentid = "";

    this.CNGERECORD = new SearchTable();
    this.CNGERECORD.controlname = "CONSIGNEE";
    this.CNGERECORD.displaycolumn = "CODE";
    this.CNGERECORD.type = "CUSTOMER";
    if (this.invokefrom == "HAWB")
      this.CNGERECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    this.CNGERECORD.id = "";
    this.CNGERECORD.code = "";
    this.CNGERECORD.name = "";

    this.CNGEADDRECORD = new SearchTable();
    this.CNGEADDRECORD.controlname = "CONSIGNEEADDRESS";
    this.CNGEADDRECORD.displaycolumn = "CODE";
    this.CNGEADDRECORD.type = "CUSTOMERADDRESS";
    this.CNGEADDRECORD.id = "";
    this.CNGEADDRECORD.code = "";
    this.CNGEADDRECORD.name = "";
    this.CNGEADDRECORD.parentid = "";

    this.NFYRECORD = new SearchTable();
    this.NFYRECORD.controlname = "NOTIFY";
    this.NFYRECORD.displaycolumn = "CODE";
    this.NFYRECORD.type = "CUSTOMER";
    this.NFYRECORD.id = "";
    this.NFYRECORD.code = "";
    this.NFYRECORD.name = "";

    this.NFYADDRECORD = new SearchTable();
    this.NFYADDRECORD.controlname = "NOTIFYADDRESS";
    this.NFYADDRECORD.displaycolumn = "CODE";
    this.NFYADDRECORD.type = "CUSTOMERADDRESS";
    this.NFYADDRECORD.id = "";
    this.NFYADDRECORD.code = "";
    this.NFYADDRECORD.name = "";
    this.NFYADDRECORD.parentid = "";
  }

  LovSelected(_Record: SearchTable) {
    let bchange: boolean = false;
    if (_Record.controlname == "SHIPPER") {
      if (this.Record.bl_shipper_id != _Record.id) {
        this.Record.bl_shipper_id = _Record.id;
        this.Record.bl_shipper_code = _Record.code;
        this.Record.bl_shipper_name = _Record.name;
        this.Record.bl_shipper_add1 = '';
        this.Record.bl_shipper_add2 = '';
        this.Record.bl_shipper_add3 = '';
        this.Record.bl_shipper_add4 = '';

        this.SHPRADDRECORD = new SearchTable();
        this.SHPRADDRECORD.controlname = "SHIPPERADDRESS";
        this.SHPRADDRECORD.type = "CUSTOMERADDRESS";
        this.SHPRADDRECORD.displaycolumn = "CODE";
        this.SHPRADDRECORD.id = "";
        this.SHPRADDRECORD.code = "";
        this.SHPRADDRECORD.name = "";
        this.SHPRADDRECORD.parentid = this.Record.bl_shipper_id;
      }
    }
    else if (_Record.controlname == "SHIPPERADDRESS") {
      this.Record.bl_shipper_br_id = _Record.id;
      this.SearchRecord("SHIPPERADDRESS", this.Record.bl_shipper_br_id, this.Record.bl_shipper_id);
    } else if (_Record.controlname == "CONSIGNEE") {
      if (this.Record.bl_consignee_id != _Record.id) {
        this.Record.bl_consignee_id = _Record.id;
        this.Record.bl_consignee_code = _Record.code;
        this.Record.bl_consignee_name = _Record.name;
        this.Record.bl_consignee_add1 = '';
        this.Record.bl_consignee_add2 = '';
        this.Record.bl_consignee_add3 = '';
        this.Record.bl_consignee_add4 = '';

        this.CNGEADDRECORD = new SearchTable();
        this.CNGEADDRECORD.controlname = "CONSIGNEEADDRESS";
        this.CNGEADDRECORD.displaycolumn = "CODE";
        this.CNGEADDRECORD.type = "CUSTOMERADDRESS";
        this.CNGEADDRECORD.id = "";
        this.CNGEADDRECORD.code = "";
        this.CNGEADDRECORD.name = "";
        this.CNGEADDRECORD.parentid = this.Record.bl_consignee_id;
      }
    }
    else if (_Record.controlname == "CONSIGNEEADDRESS") {

      this.Record.bl_consignee_br_id = _Record.id;
      this.SearchRecord("CONSIGNEEADDRESS", this.Record.bl_consignee_br_id, this.Record.bl_consignee_id);
    }
    else if (_Record.controlname == "NOTIFY") {

      if (this.Record.bl_notify_id != _Record.id) {
        this.Record.bl_notify_id = _Record.id;
        this.Record.bl_notify_code = _Record.code;
        this.Record.bl_notify_name = _Record.name;
        this.Record.bl_notify_add1 = '';
        this.Record.bl_notify_add2 = '';
        this.Record.bl_notify_add3 = '';
        this.Record.bl_notify_add4 = '';

        this.NFYADDRECORD = new SearchTable();
        this.NFYADDRECORD.controlname = "NOTIFYADDRESS";
        this.NFYADDRECORD.displaycolumn = "CODE";
        this.NFYADDRECORD.type = "CUSTOMERADDRESS";
        this.NFYADDRECORD.id = "";
        this.NFYADDRECORD.code = "";
        this.NFYADDRECORD.name = "";
        this.NFYADDRECORD.parentid = this.Record.bl_notify_id;
      }
    }
    else if (_Record.controlname == "NOTIFYADDRESS") {
      this.Record.bl_notify_br_id = _Record.id;
      this.SearchRecord("NOTIFYADDRESS", this.Record.bl_notify_br_id, this.Record.bl_notify_id);
    }
  }

  LoadCombo() {

    this.FooterNotesList = [
      { "name": "Original 1 - (For Issuing Carrier)", "chk": false, "printorder": 5 },
      { "name": "Original 2 - (For Consignee)", "chk": false, "printorder": 2 },
      { "name": "Original 3 - (For Shipper)", "chk": false, "printorder": 1 },
      { "name": "Copy 4 - (Delivery Receipt)", "chk": false, "printorder": 4 },
      { "name": "Copy 5 - (Airport of Destination)", "chk": false, "printorder": 6 },
      { "name": "Copy 6 - (Third Carrier)", "chk": false, "printorder": 8 },
      { "name": "Copy 7 - (For Second Carrier)", "chk": false, "printorder": 10 },
      { "name": "Copy 8 - (First Carrier)", "chk": false, "printorder": 12 },
      { "name": "Copy 9 - (For Sales Agent)", "chk": false, "printorder": 3 },
      { "name": "Copy 10 - (Extra Copy for Carrier)", "chk": false, "printorder": 7 },
      { "name": "Copy 11 - (Extra Copy for Carrier)", "chk": false, "printorder": 9 },
      { "name": "Copy 12 - (Extra Copy for Carrier)", "chk": false, "printorder": 11 }];

    this.ChargesAgent = [
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" },
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" },
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" },
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" },
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" }];

    this.ChargesCarrier = [
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" },
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" },
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" },
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" },
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" },
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" },
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" },
      { "charges": "", "weight": "", "rate": "", "total": "", "prints": "NA", "printc": "NA" }];

    this.loading = true;
    let SearchData = {
      type: 'AIRBL',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      blf_type: "HAWB"
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.BLFormatList = response.blformatlist;
        this.BLPrintFormatList = response.blprintformatlist;
        this.GetRecord("LIST", "");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  GetRecord(_type: string, _formattype: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (_type == 'PDF' && _formattype == 'AIRBL' && this.invokefrom == "HAWB" && this.user_admin == false) {
      if (this.BLPrintFormatList == null)
        return;
      var REC = this.BLPrintFormatList.find(rec => rec.blf_pkid == this.Record.bl_print_format_id)
      if (REC != null) {
        if (REC.blf_name == "NA") {
          this.ErrorMessage = "\n\r | Please save print format and continue....";
        }
      }
    }
    if (this.ErrorMessage.length > 0)
      return;

    this.folder_id = this.gs.getGuid();
    let _bSideprint: string = "N";
    if (this.backside_print)
      _bSideprint = "Y";

    if (_type == 'PDF')
      this.GetSelectedFootNotes();

    this.loading = true;

    let SearchData = {
      type: _type,
      formattype: _formattype,
      pkid: this.parentid,
      rowtype: this.type,
      report_folder: this.gs.globalVariables.report_folder,
      folderid: this.folder_id,
      footerlist: this.FootNotes,
      bSideprint: _bSideprint,
      invokefrm: this.invokefrom,
      user_code:this.gs.globalVariables.user_code
    };

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.mode = response.recmode;

        if (_type == 'PDF') {
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
          var Rec = response.record;
          this.Record.bl_original_print = Rec.bl_original_print;
          this.Record.bl_print = Rec.bl_print;
        }
        else {
          this.LoadData(response.record);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  NewRecord() {

    // this.Initdefault();
  }
  Initdefault() {
    if (this.BLFormatList != null) {
      var REC = this.BLFormatList.find(rec => rec.table_name == 'NA');
      if (REC != null) {
        this.Record.hbl_seq_format_id = REC.table_pkid;
      }
    }

    if (this.BLPrintFormatList != null) {
      var REC = this.BLPrintFormatList.find(rec => rec.blf_name == 'NA');
      if (REC != null) {
        this.Record.bl_print_format_id = REC.blf_pkid;
      }
    }
  }
  LoadData(_Record: Bl) {
    this.Record = _Record;
    if (this.mode == "EDIT" && this.Record.hbl_seq_format_id.toString().trim() == "") {
      if (this.BLFormatList != null) {
        var REC = this.BLFormatList.find(rec => rec.table_name == 'NA');
        if (REC != null) {
          this.Record.hbl_seq_format_id = REC.table_pkid;
        }
      }
    }
    if (this.mode == "ADD") {
      this.Initdefault();

      this.Record.bl_wt_unit = "K";
      this.Record.bl_issu_agnt_name = this.gs.Company_Name;
      this.Record.bl_issu_agnt_city = this.gs.defaultValues.bl_issued_place;
      this.Record.bl_currency = "INR";
      this.Record.bl_by1_agent = this.gs.Company_Name;
      this.Record.bl_by2_agent = this.gs.defaultValues.bl_issued_place;
      this.Record.bl_ex_works = '';
    }
    this.FillAgentCharges(0, _Record.bl_charges1_agent);
    this.FillAgentCharges(1, _Record.bl_charges2_agent);
    this.FillAgentCharges(2, _Record.bl_charges3_agent);
    this.FillAgentCharges(3, _Record.bl_charges4_agent);
    this.FillAgentCharges(4, _Record.bl_charges5_agent);

    this.FillCarrierCharges(0, _Record.bl_charges1_carrier);
    this.FillCarrierCharges(1, _Record.bl_charges2_carrier);
    this.FillCarrierCharges(2, _Record.bl_charges3_carrier);
    this.FillCarrierCharges(3, _Record.bl_charges4_carrier);
    this.FillCarrierCharges(4, _Record.bl_charges5_carrier);
    this.FillCarrierCharges(5, _Record.bl_charges6_carrier);
    this.FillCarrierCharges(6, _Record.bl_charges7_carrier);
    this.FillCarrierCharges(7, _Record.bl_charges8_carrier);
    //this.NewAttchRecord();

    this.InitLov();
    this.SHPRRECORD.id = this.Record.bl_shipper_id;
    this.SHPRRECORD.code = this.Record.bl_shipper_code;

    this.SHPRADDRECORD.id = this.Record.bl_shipper_br_id;
    this.SHPRADDRECORD.code = this.Record.bl_shipper_br_no;
    this.SHPRADDRECORD.parentid = this.Record.bl_shipper_id;

    this.CNGERECORD.id = this.Record.bl_consignee_id;
    this.CNGERECORD.code = this.Record.bl_consignee_code;

    this.CNGEADDRECORD.id = this.Record.bl_consignee_br_id;
    this.CNGEADDRECORD.code = this.Record.bl_consignee_br_no;
    this.CNGEADDRECORD.parentid = this.Record.bl_consignee_id;

    this.NFYRECORD.id = this.Record.bl_notify_id;
    this.NFYRECORD.code = this.Record.bl_notify_code;

    this.NFYADDRECORD.id = this.Record.bl_notify_br_id;
    this.NFYADDRECORD.code = this.Record.bl_notify_br_no;
    this.NFYADDRECORD.parentid = this.Record.bl_notify_id;

  }

  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;
    this.Record.bl_pkid = this.parentid;
    this.Record.bl_invoke_frm = this.invokefrom;
    this.Record._globalvariables = this.gs.globalVariables;
    this.Record.bl_charges1_agent = this.GetAgentCharges(0);
    this.Record.bl_charges2_agent = this.GetAgentCharges(1);
    this.Record.bl_charges3_agent = this.GetAgentCharges(2);
    this.Record.bl_charges4_agent = this.GetAgentCharges(3);
    this.Record.bl_charges5_agent = this.GetAgentCharges(4);
    this.Record.bl_charges1_carrier = this.GetCarrierCharges(0);
    this.Record.bl_charges2_carrier = this.GetCarrierCharges(1);
    this.Record.bl_charges3_carrier = this.GetCarrierCharges(2);
    this.Record.bl_charges4_carrier = this.GetCarrierCharges(3);
    this.Record.bl_charges5_carrier = this.GetCarrierCharges(4);
    this.Record.bl_charges6_carrier = this.GetCarrierCharges(5);
    this.Record.bl_charges7_carrier = this.GetCarrierCharges(6);
    this.Record.bl_charges8_carrier = this.GetCarrierCharges(7);

    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;

        this.InfoMessage = "Save Complete";
        this.mode = "EDIT";
        this.Record.rec_mode = this.mode;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  GetAgentCharges(_num: number) {
    let str: string;
    str = "";
    str = str.concat(this.ChargesAgent[_num].charges, ",", this.ChargesAgent[_num].weight, ",", this.ChargesAgent[_num].rate, ",", this.ChargesAgent[_num].total, ",", this.ChargesAgent[_num].prints, ",", this.ChargesAgent[_num].printc)
    return str;
  }
  FillAgentCharges(_num: number, _str: string) {
    var temparr = _str.split(',');
    this.ChargesAgent[_num].charges = temparr[0];
    this.ChargesAgent[_num].weight = temparr[1];
    this.ChargesAgent[_num].rate = temparr[2];
    this.ChargesAgent[_num].total = temparr[3];
    this.ChargesAgent[_num].prints = temparr[4];
    this.ChargesAgent[_num].printc = temparr[5];
  }
  GetCarrierCharges(_num: number) {
    let str: string;
    str = "";
    str = str.concat(this.ChargesCarrier[_num].charges, ",", this.ChargesCarrier[_num].weight, ",", this.ChargesCarrier[_num].rate, ",", this.ChargesCarrier[_num].total, ",", this.ChargesCarrier[_num].prints, ",", this.ChargesCarrier[_num].printc)
    return str;
  }
  FillCarrierCharges(_num: number, _str: string) {
    var temparr = _str.split(',');
    this.ChargesCarrier[_num].charges = temparr[0];
    this.ChargesCarrier[_num].weight = temparr[1];
    this.ChargesCarrier[_num].rate = temparr[2];
    this.ChargesCarrier[_num].total = temparr[3];
    this.ChargesCarrier[_num].prints = temparr[4];
    this.ChargesCarrier[_num].printc = temparr[5];
  }
  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';

    if (this.Record.hbl_bl_no.trim().length > 0) {
      if (this.Record.hbl_date.trim().length <= 0) {
        bret = false;
        sError += "\n\r | BL Date Cannot be blank.";
      }
    }
    //if (this.Record.ct_amount <= 0 ) {
    //    bret = false;
    //    sError += "\n\rAmount Cannot Be Blank";
    //}
    if (bret == false)
      this.ErrorMessage = sError;

    return bret;
  }

  OnBlur(field: string) {

    var oldChar = /,/gi;//replace all commas in a string
    var oldChar2 = / /gi;//replace all blank space in a string

    switch (field) {
      case 'bl_shipper_name':
        {
          this.Record.bl_shipper_name = this.Record.bl_shipper_name.toUpperCase();
          break;
        }
      case 'bl_shipper_add1':
        {
          this.Record.bl_shipper_add1 = this.Record.bl_shipper_add1.toUpperCase();
          break;
        }
      case 'bl_shipper_add2':
        {
          this.Record.bl_shipper_add2 = this.Record.bl_shipper_add2.toUpperCase();
          break;
        }
      case 'bl_shipper_add3':
        {
          this.Record.bl_shipper_add3 = this.Record.bl_shipper_add3.toUpperCase();
          break;
        }
      case 'bl_shipper_add4':
        {
          this.Record.bl_shipper_add4 = this.Record.bl_shipper_add4.toUpperCase();
          break;
        }
      case 'bl_shipper_state':
        {
          this.Record.bl_shipper_state = this.Record.bl_shipper_state.toUpperCase();
          break;
        }
      case 'bl_shipper_country':
        {
          this.Record.bl_shipper_country = this.Record.bl_shipper_country.toUpperCase();
          break;
        }
      case 'bl_consignee_name':
        {
          this.Record.bl_consignee_name = this.Record.bl_consignee_name.toUpperCase();
          break;
        }
      case 'bl_consignee_add1':
        {
          this.Record.bl_consignee_add1 = this.Record.bl_consignee_add1.toUpperCase();
          break;
        }
      case 'bl_consignee_add2':
        {
          this.Record.bl_consignee_add2 = this.Record.bl_consignee_add2.toUpperCase();
          break;
        }
      case 'bl_consignee_add3':
        {
          this.Record.bl_consignee_add3 = this.Record.bl_consignee_add3.toUpperCase();
          break;
        }
      case 'bl_consignee_add4':
        {
          this.Record.bl_consignee_add4 = this.Record.bl_consignee_add4.toUpperCase();
          break;
        }
      case 'bl_consignee_state':
        {
          this.Record.bl_consignee_state = this.Record.bl_consignee_state.toUpperCase();
          break;
        }
      case 'bl_consignee_country':
        {
          this.Record.bl_consignee_country = this.Record.bl_consignee_country.toUpperCase();
          break;
        }
      case 'bl_notify_name':
        {
          this.Record.bl_notify_name = this.Record.bl_notify_name.toUpperCase();
          break;
        }
      case 'bl_notify_add1':
        {
          this.Record.bl_notify_add1 = this.Record.bl_notify_add1.toUpperCase();
          break;
        }
      case 'bl_notify_add2':
        {
          this.Record.bl_notify_add2 = this.Record.bl_notify_add2.toUpperCase();
          break;
        }
      case 'bl_notify_add3':
        {
          this.Record.bl_notify_add3 = this.Record.bl_notify_add3.toUpperCase();
          break;
        }
      case 'bl_notify_add4':
        {
          this.Record.bl_notify_add4 = this.Record.bl_notify_add4.toUpperCase();
          break;
        }
      case 'bl_notify_state':
        {
          this.Record.bl_notify_state = this.Record.bl_notify_state.toUpperCase();
          break;
        }
      case 'bl_notify_country':
        {
          this.Record.bl_notify_country = this.Record.bl_notify_country.toUpperCase();
          break;
        }

      case 'bl_issu_agnt_name':
        {
          this.Record.bl_issu_agnt_name = this.Record.bl_issu_agnt_name.toUpperCase();
          break;
        }
      case 'bl_issu_agnt_city':
        {
          this.Record.bl_issu_agnt_city = this.Record.bl_issu_agnt_city.toUpperCase();
          break;
        }
      case 'bl_iata_code':
        {
          this.Record.bl_iata_code = this.Record.bl_iata_code.toUpperCase();
          break;
        }
      case 'bl_acc_no':
        {
          this.Record.bl_acc_no = this.Record.bl_acc_no.toUpperCase();
          break;
        }
      case 'bl_pol':
        {
          this.Record.bl_pol = this.Record.bl_pol.toUpperCase();
          break;
        }
      case 'bl_to1':
        {
          this.Record.bl_to1 = this.Record.bl_to1.toUpperCase();
          break;
        }
      case 'bl_by1':
        {
          this.Record.bl_by1 = this.Record.bl_by1.toUpperCase();
          break;
        }
      case 'bl_to2':
        {
          this.Record.bl_to2 = this.Record.bl_to2.toUpperCase();
          break;
        }
      case 'bl_by2':
        {
          this.Record.bl_by2 = this.Record.bl_by2.toUpperCase();
          break;
        }
      case 'bl_to3':
        {
          this.Record.bl_to3 = this.Record.bl_to3.toUpperCase();
          break;
        }
      case 'bl_by3':
        {
          this.Record.bl_by3 = this.Record.bl_by3.toUpperCase();
          break;
        }
      case 'bl_pod':
        {
          this.Record.bl_pod = this.Record.bl_pod.toUpperCase();
          break;
        }
      case 'bl_flight1':
        {
          this.Record.bl_flight1 = this.Record.bl_flight1.toUpperCase();
          break;
        }
      case 'bl_flight2':
        {
          this.Record.bl_flight2 = this.Record.bl_flight2.toUpperCase();
          break;
        }

      case 'bl_issued_by1':
        {
          this.Record.bl_issued_by1 = this.Record.bl_issued_by1.toUpperCase();
          break;
        }
      case 'bl_issued_by2':
        {
          this.Record.bl_issued_by2 = this.Record.bl_issued_by2.toUpperCase();
          break;
        }
      case 'bl_issued_by3':
        {
          this.Record.bl_issued_by3 = this.Record.bl_issued_by3.toUpperCase();
          break;
        }
      case 'bl_issued_by4':
        {
          this.Record.bl_issued_by4 = this.Record.bl_issued_by4.toUpperCase();
          break;
        }
      case 'bl_issued_by5':
        {
          // this.Record.bl_issued_by5 = this.Record.bl_issued_by5.toUpperCase();
          break;
        }

      case 'bl_account_info1':
        {
          this.Record.bl_account_info1 = this.Record.bl_account_info1.toUpperCase();
          break;
        }
      case 'bl_account_info2':
        {
          this.Record.bl_account_info2 = this.Record.bl_account_info2.toUpperCase();
          break;
        }
      case 'bl_account_info3':
        {
          this.Record.bl_account_info3 = this.Record.bl_account_info3.toUpperCase();
          break;
        }
      case 'bl_account_info4':
        {
          this.Record.bl_account_info4 = this.Record.bl_account_info4.toUpperCase();
          break;
        }
      case 'bl_currency':
        {
          this.Record.bl_currency = this.Record.bl_currency.toUpperCase();
          break;
        }
      case 'bl_carriage_value':
        {
          this.Record.bl_carriage_value = this.Record.bl_carriage_value.toUpperCase();
          break;
        }
      case 'bl_frt_status':
        {
          this.Record.bl_frt_status = this.Record.bl_frt_status.toUpperCase();
          break;
        }
      case 'bl_customs_value':
        {
          this.Record.bl_customs_value = this.Record.bl_customs_value.toUpperCase();
          break;
        }
      case 'bl_oc_status':
        {
          this.Record.bl_oc_status = this.Record.bl_oc_status.toUpperCase();
          break;
        }

      case 'bl_ins_amt':
        {
          this.Record.bl_ins_amt = this.Record.bl_ins_amt.toUpperCase();
          break;
        }
      case 'bl_commodity':
        {
          this.Record.bl_commodity = this.Record.bl_commodity.toUpperCase();
          break;
        }
      case 'bl_hand_info1':
        {
          this.Record.bl_hand_info1 = this.Record.bl_hand_info1.toUpperCase();
          break;
        }
      case 'bl_hand_info2':
        {
          this.Record.bl_hand_info2 = this.Record.bl_hand_info2.toUpperCase();
          break;
        }
      case 'bl_hand_info3':
        {
          this.Record.bl_hand_info3 = this.Record.bl_hand_info3.toUpperCase();
          break;
        }

      case 'bl_mark1':
        {
          this.Record.bl_mark1 = this.Record.bl_mark1.toUpperCase();
          break;
        }
      case 'bl_mark2':
        {
          this.Record.bl_mark2 = this.Record.bl_mark2.toUpperCase();
          break;
        }
      case 'bl_mark3':
        {
          this.Record.bl_mark3 = this.Record.bl_mark3.toUpperCase();
          break;
        }
      case 'bl_mark4':
        {
          this.Record.bl_mark4 = this.Record.bl_mark4.toUpperCase();
          break;
        }
      case 'bl_mark5':
        {
          this.Record.bl_mark5 = this.Record.bl_mark5.toUpperCase();
          break;
        }
      case 'bl_mark6':
        {
          this.Record.bl_mark6 = this.Record.bl_mark6.toUpperCase();
          break;
        }
      case 'bl_mark7':
        {
          this.Record.bl_mark7 = this.Record.bl_mark7.toUpperCase();
          break;
        }
      case 'bl_mark8':
        {
          this.Record.bl_mark8 = this.Record.bl_mark8.toUpperCase();
          break;
        }
      case 'bl_mark9':
        {
          this.Record.bl_mark9 = this.Record.bl_mark9.toUpperCase();
          break;
        }
      case 'bl_mark10':
        {
          this.Record.bl_mark10 = this.Record.bl_mark10.toUpperCase();
          break;
        }
      case 'bl_mark11':
        {
          this.Record.bl_mark11 = this.Record.bl_mark11.toUpperCase();
          break;
        }
      case 'bl_mark12':
        {
          this.Record.bl_mark12 = this.Record.bl_mark12.toUpperCase();
          break;
        }
      case 'bl_mark13':
        {
          this.Record.bl_mark13 = this.Record.bl_mark13.toUpperCase();
          break;
        }
      case 'bl_mark14':
        {
          this.Record.bl_mark14 = this.Record.bl_mark14.toUpperCase();
          break;
        }
      case 'bl_mark15':
        {
          this.Record.bl_mark15 = this.Record.bl_mark15.toUpperCase();
          break;
        }

      case 'bl_desc1':
        {
          this.Record.bl_desc1 = this.Record.bl_desc1.toUpperCase();
          break;
        }
      case 'bl_desc2':
        {
          this.Record.bl_desc2 = this.Record.bl_desc2.toUpperCase();
          break;
        }
      case 'bl_desc3':
        {
          this.Record.bl_desc3 = this.Record.bl_desc3.toUpperCase();
          break;
        }
      case 'bl_desc4':
        {
          this.Record.bl_desc4 = this.Record.bl_desc4.toUpperCase();
          break;
        }
      case 'bl_desc5':
        {
          this.Record.bl_desc5 = this.Record.bl_desc5.toUpperCase();
          break;
        }
      case 'bl_desc6':
        {
          this.Record.bl_desc6 = this.Record.bl_desc6.toUpperCase();
          break;
        }
      case 'bl_desc7':
        {
          this.Record.bl_desc7 = this.Record.bl_desc7.toUpperCase();
          break;
        }
      case 'bl_desc8':
        {
          this.Record.bl_desc8 = this.Record.bl_desc8.toUpperCase();
          break;
        }
      case 'bl_desc9':
        {
          this.Record.bl_desc9 = this.Record.bl_desc9.toUpperCase();
          break;
        }
      case 'bl_desc10':
        {
          this.Record.bl_desc10 = this.Record.bl_desc10.toUpperCase();
          break;
        }
      case 'bl_desc11':
        {
          this.Record.bl_desc11 = this.Record.bl_desc11.toUpperCase();
          break;
        }
      case 'bl_desc12':
        {
          this.Record.bl_desc12 = this.Record.bl_desc12.toUpperCase();
          break;
        }
      case 'bl_desc13':
        {
          this.Record.bl_desc13 = this.Record.bl_desc13.toUpperCase();
          break;
        }
      case 'bl_desc14':
        {
          this.Record.bl_desc14 = this.Record.bl_desc14.toUpperCase();
          break;
        }
      case 'bl_desc15':
        {
          this.Record.bl_desc15 = this.Record.bl_desc15.toUpperCase();
          break;
        }
      case 'bl_grwt':
        {
          this.Record.bl_grwt = this.gs.roundWeight(this.Record.bl_grwt, "GRWT");
          break;
        }
      case 'bl_pcs':
        {
          this.Record.bl_pcs = this.gs.roundWeight(this.Record.bl_pcs, "PCS");
          break;
        }
      case 'bl_wt_unit':
        {
          this.Record.bl_wt_unit = this.Record.bl_wt_unit.toUpperCase();
          break;
        }
      case 'bl_class':
        {
          this.Record.bl_class = this.Record.bl_class.toUpperCase();
          break;
        }
      case 'bl_comm':
        {
          this.Record.bl_comm = this.Record.bl_comm.toUpperCase();
          break;
        }
      case 'bl_chwt':
        {
          this.Record.bl_chwt = this.gs.roundWeight(this.Record.bl_chwt, "CHWT");
          this.Record.bl_total = this.Record.bl_chwt * this.Record.bl_rate;
          this.Record.bl_total = this.gs.roundWeight(this.Record.bl_total, "AMT");
          break;
        }

      case 'bl_rate':
        {
          this.Record.bl_rate = this.gs.roundWeight(this.Record.bl_rate, "RATE");
          this.Record.bl_total = this.Record.bl_chwt * this.Record.bl_rate;
          this.Record.bl_total = this.gs.roundWeight(this.Record.bl_total, "AMT");
          break;
        }
      case 'bl_total':
        {
          this.Record.bl_total = this.gs.roundWeight(this.Record.bl_total, "AMT");
          break;
        }


      case 'bl_by1_agent':
        {
          this.Record.bl_by1_agent = this.Record.bl_by1_agent.toUpperCase();
          break;
        }
      case 'bl_by2_agent':
        {
          this.Record.bl_by2_agent = this.Record.bl_by2_agent.toUpperCase();
          break;
        }
      case 'bl_by1_carrier':
        {
          this.Record.bl_by1_carrier = this.Record.bl_by1_carrier.toUpperCase();
          break;
        }
      case 'bl_by2_carrier':
        {
          this.Record.bl_by2_carrier = this.Record.bl_by2_carrier.toUpperCase();
          break;
        }
      case 'bl_issued_place':
        {
          this.Record.bl_issued_place = this.Record.bl_issued_place.toUpperCase();
          break;
        }
      case 'bl_issued_by':
        {
          this.Record.bl_issued_by = this.Record.bl_issued_by.toUpperCase();
          break;
        }
      case 'bl_issued_date':
        {
          this.Record.bl_issued_date = this.Record.bl_issued_date.toUpperCase();
          break;
        }
      case 'bl_no_copies':
        {
          this.Record.bl_no_copies = this.gs.roundNumber(this.Record.bl_no_copies, 0);
          break;
        }
      case 'charges0':
        {
          this.ChargesAgent[0].charges = this.ChargesAgent[0].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'weight0':
        {
          this.ChargesAgent[0].weight = this.ChargesAgent[0].weight.replace(oldChar, '').toUpperCase();
          this.ChargesAgent[0].total = this.FindOthTot(this.ChargesAgent[0].weight, this.ChargesAgent[0].rate);
          break;
        }
      case 'rate0':
        {
          this.ChargesAgent[0].rate = this.ChargesAgent[0].rate.replace(oldChar, '').toUpperCase();
          this.ChargesAgent[0].total = this.FindOthTot(this.ChargesAgent[0].weight, this.ChargesAgent[0].rate);
          break;
        }
      case 'total0':
        {
          this.ChargesAgent[0].total = this.ChargesAgent[0].total.replace(oldChar, '').toUpperCase();
          break;
        }

      case 'charges1':
        {
          this.ChargesAgent[1].charges = this.ChargesAgent[1].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'weight1':
        {
          this.ChargesAgent[1].weight = this.ChargesAgent[1].weight.replace(oldChar, '').toUpperCase();
          this.ChargesAgent[1].total = this.FindOthTot(this.ChargesAgent[1].weight, this.ChargesAgent[1].rate);
          break;
        }
      case 'rate1':
        {
          this.ChargesAgent[1].rate = this.ChargesAgent[1].rate.replace(oldChar, '').toUpperCase();
          this.ChargesAgent[1].total = this.FindOthTot(this.ChargesAgent[1].weight, this.ChargesAgent[1].rate);
          break;
        }
      case 'total1':
        {
          this.ChargesAgent[1].total = this.ChargesAgent[1].total.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'charges2':
        {
          this.ChargesAgent[2].charges = this.ChargesAgent[2].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'weight2':
        {
          this.ChargesAgent[2].weight = this.ChargesAgent[2].weight.replace(oldChar, '').toUpperCase();
          this.ChargesAgent[2].total = this.FindOthTot(this.ChargesAgent[2].weight, this.ChargesAgent[2].rate);
          break;
        }
      case 'rate2':
        {
          this.ChargesAgent[2].rate = this.ChargesAgent[2].rate.replace(oldChar, '').toUpperCase();
          this.ChargesAgent[2].total = this.FindOthTot(this.ChargesAgent[2].weight, this.ChargesAgent[2].rate);
          break;
        }
      case 'total2':
        {
          this.ChargesAgent[2].total = this.ChargesAgent[2].total.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'charges3':
        {
          this.ChargesAgent[3].charges = this.ChargesAgent[3].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'weight3':
        {
          this.ChargesAgent[3].weight = this.ChargesAgent[3].weight.replace(oldChar, '').toUpperCase();
          this.ChargesAgent[3].total = this.FindOthTot(this.ChargesAgent[3].weight, this.ChargesAgent[3].rate);
          break;
        }
      case 'rate3':
        {
          this.ChargesAgent[3].rate = this.ChargesAgent[3].rate.replace(oldChar, '').toUpperCase();
          this.ChargesAgent[3].total = this.FindOthTot(this.ChargesAgent[3].weight, this.ChargesAgent[3].rate);
          break;
        }
      case 'total3':
        {
          this.ChargesAgent[3].total = this.ChargesAgent[3].total.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'charges4':
        {
          this.ChargesAgent[4].charges = this.ChargesAgent[4].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'weight4':
        {
          this.ChargesAgent[4].weight = this.ChargesAgent[4].weight.replace(oldChar, '').toUpperCase();
          this.ChargesAgent[4].total = this.FindOthTot(this.ChargesAgent[4].weight, this.ChargesAgent[4].rate);
          break;
        }
      case 'rate4':
        {
          this.ChargesAgent[4].rate = this.ChargesAgent[4].rate.replace(oldChar, '').toUpperCase();
          this.ChargesAgent[4].total = this.FindOthTot(this.ChargesAgent[4].weight, this.ChargesAgent[4].rate);
          break;
        }
      case 'total4':
        {
          this.ChargesAgent[4].total = this.ChargesAgent[4].total.replace(oldChar, '').toUpperCase();
          break;
        }

      case 'Ccharges0':
        {
          this.ChargesCarrier[0].charges = this.ChargesCarrier[0].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Cweight0':
        {
          this.ChargesCarrier[0].weight = this.ChargesCarrier[0].weight.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[0].total = this.FindOthTot(this.ChargesCarrier[0].weight, this.ChargesCarrier[0].rate);
          break;
        }
      case 'Crate0':
        {
          this.ChargesCarrier[0].rate = this.ChargesCarrier[0].rate.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[0].total = this.FindOthTot(this.ChargesCarrier[0].weight, this.ChargesCarrier[0].rate);
          break;
        }
      case 'Ctotal0':
        {
          this.ChargesCarrier[0].total = this.ChargesCarrier[0].total.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Ccharges1':
        {
          this.ChargesCarrier[1].charges = this.ChargesCarrier[1].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Cweight1':
        {
          this.ChargesCarrier[1].weight = this.ChargesCarrier[1].weight.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[1].total = this.FindOthTot(this.ChargesCarrier[1].weight, this.ChargesCarrier[1].rate);
          break;
        }
      case 'Crate1':
        {
          this.ChargesCarrier[1].rate = this.ChargesCarrier[1].rate.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[1].total = this.FindOthTot(this.ChargesCarrier[1].weight, this.ChargesCarrier[1].rate);
          break;
        }
      case 'Ctotal1':
        {
          this.ChargesCarrier[1].total = this.ChargesCarrier[1].total.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Ccharges2':
        {
          this.ChargesCarrier[2].charges = this.ChargesCarrier[2].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Cweight2':
        {
          this.ChargesCarrier[2].weight = this.ChargesCarrier[2].weight.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[2].total = this.FindOthTot(this.ChargesCarrier[2].weight, this.ChargesCarrier[2].rate);
          break;
        }
      case 'Crate2':
        {
          this.ChargesCarrier[2].rate = this.ChargesCarrier[2].rate.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[2].total = this.FindOthTot(this.ChargesCarrier[2].weight, this.ChargesCarrier[2].rate);
          break;
        }
      case 'Ctotal2':
        {
          this.ChargesCarrier[2].total = this.ChargesCarrier[2].total.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Ccharges3':
        {
          this.ChargesCarrier[3].charges = this.ChargesCarrier[3].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Cweight3':
        {
          this.ChargesCarrier[3].weight = this.ChargesCarrier[3].weight.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[3].total = this.FindOthTot(this.ChargesCarrier[3].weight, this.ChargesCarrier[3].rate);
          break;
        }
      case 'Crate3':
        {
          this.ChargesCarrier[3].rate = this.ChargesCarrier[3].rate.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[3].total = this.FindOthTot(this.ChargesCarrier[3].weight, this.ChargesCarrier[3].rate);
          break;
        }
      case 'total3':
        {
          this.ChargesCarrier[3].total = this.ChargesCarrier[3].total.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Ccharges4':
        {
          this.ChargesCarrier[4].charges = this.ChargesCarrier[4].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Cweight4':
        {
          this.ChargesCarrier[4].weight = this.ChargesCarrier[4].weight.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[4].total = this.FindOthTot(this.ChargesCarrier[4].weight, this.ChargesCarrier[4].rate);
          break;
        }
      case 'Crate4':
        {
          this.ChargesCarrier[4].rate = this.ChargesCarrier[4].rate.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[4].total = this.FindOthTot(this.ChargesCarrier[4].weight, this.ChargesCarrier[4].rate);
          break;
        }
      case 'Ctotal4':
        {
          this.ChargesCarrier[4].total = this.ChargesCarrier[4].total.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Ccharges5':
        {
          this.ChargesCarrier[5].charges = this.ChargesCarrier[5].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Cweight5':
        {
          this.ChargesCarrier[5].weight = this.ChargesCarrier[5].weight.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[5].total = this.FindOthTot(this.ChargesCarrier[5].weight, this.ChargesCarrier[5].rate);
          break;
        }
      case 'Crate5':
        {
          this.ChargesCarrier[5].rate = this.ChargesCarrier[5].rate.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[5].total = this.FindOthTot(this.ChargesCarrier[5].weight, this.ChargesCarrier[5].rate);
          break;
        }
      case 'Ctotal5':
        {
          this.ChargesCarrier[5].total = this.ChargesCarrier[5].total.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Ccharges6':
        {
          this.ChargesCarrier[6].charges = this.ChargesCarrier[6].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Cweight6':
        {
          this.ChargesCarrier[6].weight = this.ChargesCarrier[6].weight.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[6].total = this.FindOthTot(this.ChargesCarrier[6].weight, this.ChargesCarrier[6].rate);
          break;
        }
      case 'Crate6':
        {
          this.ChargesCarrier[6].rate = this.ChargesCarrier[6].rate.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[6].total = this.FindOthTot(this.ChargesCarrier[6].weight, this.ChargesCarrier[6].rate);
          break;
        }
      case 'Ctotal6':
        {
          this.ChargesCarrier[6].total = this.ChargesCarrier[6].total.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Ccharges7':
        {
          this.ChargesCarrier[7].charges = this.ChargesCarrier[7].charges.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'Cweight7':
        {
          this.ChargesCarrier[7].weight = this.ChargesCarrier[7].weight.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[7].total = this.FindOthTot(this.ChargesCarrier[7].weight, this.ChargesCarrier[7].rate);
          break;
        }
      case 'Crate7':
        {
          this.ChargesCarrier[7].rate = this.ChargesCarrier[7].rate.replace(oldChar, '').toUpperCase();
          this.ChargesCarrier[7].total = this.FindOthTot(this.ChargesCarrier[7].weight, this.ChargesCarrier[7].rate);
          break;
        }
      case 'Ctotal7':
        {
          this.ChargesCarrier[7].total = this.ChargesCarrier[7].total.replace(oldChar, '').toUpperCase();
          break;
        }
      case 'bl_iata_carrier':
        {
          this.Record.bl_iata_carrier = this.Record.bl_iata_carrier.toUpperCase();
          break;
        }
      case 'hbl_bl_no':
        {
          this.Record.hbl_bl_no = this.Record.hbl_bl_no.replace(oldChar2, '').toUpperCase();
          break;
        }
      case 'hbl_fcr_no':
        {
          this.Record.hbl_fcr_no = this.Record.hbl_fcr_no.toUpperCase();
          break;
        }

      case 'bl_fcr_doc1':
        {
          this.Record.bl_fcr_doc1 = this.Record.bl_fcr_doc1.toUpperCase();
          break;
        }

      case 'bl_fcr_doc2':
        {
          this.Record.bl_fcr_doc2 = this.Record.bl_fcr_doc2.toUpperCase();
          break;
        }

      case 'bl_fcr_doc3':
        {
          this.Record.bl_fcr_doc3 = this.Record.bl_fcr_doc3.toUpperCase();
          break;
        }
      case 'bl_place_delivery':
        {
          this.Record.bl_place_delivery = this.Record.bl_place_delivery.toUpperCase();
          break;
        }
    }
  }
  OnChange(field: string) {
    switch (field) {
      case 'bl_print_format_id':
        {
          if (this.BLPrintFormatList != null && this.invokefrom == "HAWB") {
            var REC = this.BLPrintFormatList.find(rec => rec.blf_pkid == this.Record.bl_print_format_id);
            if (REC != null) {
              this.Record.bl_print_format_name = REC.blf_name;
              this.Record.bl_issued_by1 = REC.blf_issued_name;
              this.Record.bl_issued_by2 = REC.blf_issued_add1;
              this.Record.bl_issued_by3 = REC.blf_issued_add2;
              this.Record.bl_issued_by4 = REC.blf_issued_add3;
              this.Record.bl_issued_by5 = REC.blf_issued_add4;
            }
          }
          break;
        }
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  HideBlPage() {
    if (this.PageChanged != null)
      this.PageChanged.emit();
  }

  SearchRecord(controlname: string, controlid: string, controlparentid: string) {
    if (controlid.trim().length <= 0)
      return;

    this.loading = true;
    let SearchData = {
      table: 'customeraddress',
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      add_pkid: '',
      add_parent_id: ''
    };

    SearchData.table = 'customeraddress';
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.add_pkid = controlid;
    SearchData.add_parent_id = controlparentid;


    this.ErrorMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = '';

        if (controlname == 'SHIPPERADDRESS') {
          this.Record.bl_shipper_add1 = '';
          this.Record.bl_shipper_add2 = '';
          this.Record.bl_shipper_add3 = '';
          this.Record.bl_shipper_add4 = '';
          this.Record.bl_shipper_state = '';
          this.Record.bl_shipper_country = '';
        } else if (controlname == 'CONSIGNEEADDRESS') {
          this.Record.bl_consignee_add1 = '';
          this.Record.bl_consignee_add2 = '';
          this.Record.bl_consignee_add3 = '';
          this.Record.bl_consignee_add4 = '';
          this.Record.bl_consignee_state = '';
          this.Record.bl_consignee_country = '';
        } else if (controlname == 'NOTIFYADDRESS') {
          this.Record.bl_notify_add1 = '';
          this.Record.bl_notify_add2 = '';
          this.Record.bl_notify_add3 = '';
          this.Record.bl_notify_add4 = '';
          this.Record.bl_notify_state = '';
          this.Record.bl_notify_country = '';
        }

        if (response.customeraddress.length > 0) {

          if (controlname == 'SHIPPERADDRESS') {
            this.Record.bl_shipper_add1 = response.customeraddress[0].add_line1;
            this.Record.bl_shipper_add2 = response.customeraddress[0].add_line2;
            this.Record.bl_shipper_add3 = response.customeraddress[0].add_line3;
            this.Record.bl_shipper_add4 = response.customeraddress[0].add_line4;
            this.Record.bl_shipper_state = response.customeraddress[0].add_state_name;
            this.Record.bl_shipper_country = response.customeraddress[0].add_country_name;
          } else if (controlname == 'CONSIGNEEADDRESS') {
            this.Record.bl_consignee_add1 = response.customeraddress[0].add_line1;
            this.Record.bl_consignee_add2 = response.customeraddress[0].add_line2;
            this.Record.bl_consignee_add3 = response.customeraddress[0].add_line3;
            this.Record.bl_consignee_add4 = response.customeraddress[0].add_line4;
            this.Record.bl_consignee_state = response.customeraddress[0].add_fstate_name;
            this.Record.bl_consignee_country = response.customeraddress[0].add_country_name;
          } else if (controlname == 'NOTIFYADDRESS') {
            this.Record.bl_notify_add1 = response.customeraddress[0].add_line1;
            this.Record.bl_notify_add2 = response.customeraddress[0].add_line2;
            this.Record.bl_notify_add3 = response.customeraddress[0].add_line3;
            this.Record.bl_notify_add4 = response.customeraddress[0].add_line4;
            this.Record.bl_notify_state = response.customeraddress[0].add_fstate_name;
            this.Record.bl_notify_country = response.customeraddress[0].add_country_name;
          }

        }
        else {
          this.ErrorMessage = 'Invalid Address';
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (action === 'ADD') {
      this.AddtoList();
    }
    else if (action === 'EDIT') {
      this.UpdateAttchList(id);
    }
    else if (action === 'REMOVE') {
      this.RemoveFromList(id);
    }
  }

  AddtoList() {
    this.NewAttchRecord();
  }

  NewAttchRecord() {

  }
  LoadAttchList(id: string) {

  }
  UpdateAttchList(id: string) {

  }
  RemoveFromList(id: string) {

  }


  SelectFootNotes() {
    this.selectdeselect = !this.selectdeselect;
    for (let rec of this.FooterNotesList) {
      rec.chk = this.selectdeselect;
    }
  }

  GetSelectedFootNotes() {
    this.FootNotes = "";
    for (let rec of this.FooterNotesList) {
      if (rec.chk) {
        if (this.FootNotes.trim() != "")
          this.FootNotes = this.FootNotes.concat(",");
        this.FootNotes = this.FootNotes.concat(rec.name, "~", rec.printorder);
      }
    }
  }


  GenerateBLNo(_type: string, _formatid: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (_type == "AIRBL" && this.Record.hbl_date.trim().length <= 0) {
      this.ErrorMessage = "\n\r | AWB Date Cannot Be Blank";
      alert(this.ErrorMessage);
    }

    if (_type == 'AIRBL') {
      if (this.BLFormatList != null) {
        var REC = this.BLFormatList.find(rec => rec.table_pkid == this.Record.hbl_seq_format_id)
        if (REC != null) {
          if (REC.table_name == "NA") {
            this.ErrorMessage += "\n\r | Please select AWB Sequence format and continue....";
            alert(this.ErrorMessage);
          }
        }
      }
    }
    if (this.ErrorMessage.length > 0)
      return;

    this.loading = true;
    let SearchData = {
      type: _type,
      pkid: this.parentid,
      formatid: _formatid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      bldate: this.Record.hbl_date,
      category: "AIR EXPORT"
    };

    this.mainService.GenerateBLNumber(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == "AIRBL") {
          this.Record.hbl_bl_no = response.newno;
          if (this.Record.hbl_bl_no.trim().length > 0)
            this.Record.hbl_blno_generated = "G";
        } else if (_type == "FCR")
          this.Record.hbl_fcr_no = response.newno;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  UnlockBLNo(_type: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.gs.globalVariables.user_code != "ADMIN")
      return;

    this.loading = true;
    let SearchData = {
      pkid: this.parentid,
      type: _type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };

    SearchData.pkid = this.parentid;
    SearchData.type = _type;

    this.mainService.UnlockOriginalBL(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Successfully Unlocked";
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });

  }

  FindOthTot(oth_rate: string, oth_wt: string) {
    let nAmt: number = 0;
    nAmt = +oth_rate * +oth_wt;
    return this.gs.roundNumber(nAmt, 2);
  }

  //FindTotal(oth_rate: string, oth_wt: string) {
  //  let nAmt: number = 0;
  //  nAmt = +oth_rate * +oth_wt;
  //  return this.gs.roundNumber(nAmt, 2);
  //}

  UpdateDeliveryDet() {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.loading = true;
    let SearchData = {
      pkid: this.parentid,
      type: 'UPDATE-DELIVERY',
      itm_po: '',
      itm_desc: '',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      deliv_place:'',
      deliv_date:'',
      deliv_date_confirm:false,
      user_code:this.gs.globalVariables.user_code,
      blno:this.Record.hbl_bl_no
    }

    SearchData.pkid = this.parentid;
    SearchData.type = 'UPDATE-DELIVERY';
    SearchData.itm_po = '';
    SearchData.itm_desc = '';
    SearchData.deliv_place = this.Record.bl_place_delivery;
    SearchData.deliv_date = this.Record.hbl_deliv_date;
    SearchData.deliv_date_confirm = this.Record.hbl_deliv_date_confirm;

    this.mainService.UpdateBL(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Successfully Updated";
        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });

  }

  GetBlDraft() {
   
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.loading = true;
    this.folder_id = this.gs.getGuid();

    let SearchData = {
      type: '',
      pkid: this.parentid,
      rowtype: 'AIR EXPORT',
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      invokefrm: this.invokefrom
    };

    this.mainService.GetBlDraftReport(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });

  }
}
