import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Bl } from '../../models/bl';
import { BlService } from '../../services/bl.service';
import { SearchTable } from '../../../shared/models/searchtable';

import { Bldesc } from '../../models/bdesc';
import { IfObservable } from 'rxjs/observable/IfObservable';


@Component({
  selector: 'app-seabl',
  templateUrl: './seabl.component.html',
  providers: [BlService]
})
export class BlComponent {
  /*
  Ajith 24/05/2019 paste data implemented for attached sheet
  */
  // Local Variables 
  title = 'BL ';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() invokefrom: string = '';
  @Input() parentid: string = '';
  @Output() PageChanged = new EventEmitter<any>();

  loading = false;
  currentTab = 'LIST';
  ErrorMessage = "";
  InfoMessage = '';
  modal: any;

  attchmode = 'ADD';
  mode = 'ADD';
  pkid = '';
  folder_id = '';
  color_print = true;
  user_admin = false;
  bShowPasteData: boolean = false;
  // Array For Displaying List
  BLFormatList: any[] = [];
  BLPrintFormatList: any[] = [];

  // Single Record for add/edit/view details
  Record: Bl = new Bl;

  AttchRecordList: Bldesc[] = [];
  AttchRecord: Bldesc = new Bldesc;

  SHPRRECORD: SearchTable = new SearchTable();
  SHPRADDRECORD: SearchTable = new SearchTable();

  CNGERECORD: SearchTable = new SearchTable();
  CNGEADDRECORD: SearchTable = new SearchTable();

  NFYRECORD: SearchTable = new SearchTable();
  NFYADDRECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
    private mainService: BlService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.NewRecord();
    this.LoadCombo();
    this.user_admin = false;
    if (this.gs.globalVariables.user_code == "ADMIN")
      this.user_admin = true;
    this.title = this.invokefrom;
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  InitLov() {

    this.SHPRRECORD = new SearchTable();
    this.SHPRRECORD.controlname = "SHIPPER";
    this.SHPRRECORD.displaycolumn = "CODE";
    this.SHPRRECORD.type = "CUSTOMER";
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
        this.SHPRADDRECORD.displaycolumn = "CODE";
        this.SHPRADDRECORD.type = "CUSTOMERADDRESS";
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

    this.loading = true;
    let SearchData = {
      type: 'SEABL',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      blf_type: "HBL"
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
    if (_type == 'PDF' && _formattype == 'BLANKBL') {
      if (this.BLPrintFormatList == null)
        return;
      var REC = this.BLPrintFormatList.find(rec => rec.blf_pkid == this.Record.bl_print_format_id)
      if (REC != null) {
        if (REC.blf_name == "NA") {
          this.ErrorMessage = "\n\r | Please select  print format and continue....";
        }
      }
    }
    if (this.ErrorMessage.length > 0)
      return;

    this.loading = true;
    this.folder_id = this.gs.getGuid();
    let _colorprint: string = "N";
    if (this.color_print)
      _colorprint = "Y";

    let SearchData = {
      type: _type,
      formattype: _formattype,
      pkid: this.parentid,
      rowtype: 'SEA EXPORT',
      report_folder: this.gs.globalVariables.report_folder,
      folderid: this.folder_id,
      colorprint: _colorprint,
      issuedplace: this.gs.defaultValues.bl_issued_place,
      branch_code: this.gs.globalVariables.branch_code,
      invokefrm: this.invokefrom
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
    this.AttchRecordList = new Array<Bldesc>();
    this.AttchRecord = new Bldesc();
    this.AttchRecord.bl_pkid = this.gs.getGuid();
    this.Initdefault('');
    this.InitLov();
  }
  Initdefault(fldtype: string) {

    if (fldtype == '' || fldtype == 'SEQ')
      if (this.BLFormatList != null) {
        var REC = this.BLFormatList.find(rec => rec.table_name == 'NA');
        if (REC != null) {
          this.Record.hbl_seq_format_id = REC.table_pkid;
        }
      }

    if (fldtype == '' || fldtype == 'PRINT')
      if (this.BLPrintFormatList != null) {
        var REC = this.BLPrintFormatList.find(rec => rec.blf_name == 'NA');
        if (REC != null) {
          this.Record.bl_print_format_id = REC.blf_pkid;
        }
      }

  }
  LoadData(_Record: Bl) {
    this.Record = _Record;
    if (this.Record.hbl_seq_format_id.length <= 0)
      this.Initdefault('SEQ');
    this.AttchRecordList = _Record.AttachList;
    this.NewAttchRecord();

    if (this.mode == "ADD") {
      this.Initdefault('');
      this.Record.bl_reg_no = this.gs.defaultValues.bl_reg_no;
      this.Record.bl_issued_by1 = this.gs.defaultValues.bl_issued_by1;
      this.Record.bl_issued_by2 = this.gs.defaultValues.bl_issued_by2;
      this.Record.bl_issued_by3 = this.gs.defaultValues.bl_issued_by3;
      this.Record.bl_issued_by4 = this.gs.defaultValues.bl_issued_by4;
      this.Record.bl_issued_by5 = this.gs.defaultValues.bl_issued_by5;
      if (this.invokefrom == 'HBL')
        this.Record.bl_issued_place = this.gs.defaultValues.bl_issued_place;
    }
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
    this.Record._globalvariables = this.gs.globalVariables;
    this.Record.AttachList = this.AttchRecordList;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;

        //if (this.Record.hbl_date.toString().trim().length > 0)
        //  this.Record.bl_issued_date = this.Record.hbl_date;

        this.InfoMessage = "Save Complete";
        this.mode = "EDIT";
        this.Record.rec_mode = this.mode;
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
      case 'bl_place_receipt':
        {
          this.Record.bl_place_receipt = this.Record.bl_place_receipt.toUpperCase();
          break;
        }

      case 'bl_date_receipt':
        {
          this.Record.bl_date_receipt = this.Record.bl_date_receipt.toUpperCase();
          break;
        }


      case 'bl_pol':
        {
          this.Record.bl_pol = this.Record.bl_pol.toUpperCase();
          break;
        }

      case 'bl_pod':
        {
          this.Record.bl_pod = this.Record.bl_pod.toUpperCase();
          break;
        }

      case 'bl_place_delivery':
        {
          this.Record.bl_place_delivery = this.Record.bl_place_delivery.toUpperCase();
          break;
        }

      case 'bl_delivery_contact1':
        {
          this.Record.bl_delivery_contact1 = this.Record.bl_delivery_contact1.toUpperCase();
          break;
        }

      case 'bl_delivery_contact2':
        {
          this.Record.bl_delivery_contact2 = this.Record.bl_delivery_contact2.toUpperCase();
          break;
        }

      case 'bl_delivery_contact3':
        {
          this.Record.bl_delivery_contact3 = this.Record.bl_delivery_contact3.toUpperCase();
          break;
        }

      case 'bl_delivery_contact4':
        {
          this.Record.bl_delivery_contact4 = this.Record.bl_delivery_contact4.toUpperCase();
          break;
        }

      case 'bl_delivery_contact5':
        {
          this.Record.bl_delivery_contact5 = this.Record.bl_delivery_contact5.toUpperCase();
          break;
        }

      case 'bl_delivery_contact6':
        {
          this.Record.bl_delivery_contact6 = this.Record.bl_delivery_contact6.toUpperCase();
          break;
        }

      case 'bl_reg_no':
        {
          this.Record.bl_reg_no = this.Record.bl_reg_no.toUpperCase();
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

      case 'bl_vsl_name':
        {
          this.Record.bl_vsl_name = this.Record.bl_vsl_name.toUpperCase();
          break;
        }

      case 'bl_vsl_voy_no':
        {
          this.Record.bl_vsl_voy_no = this.Record.bl_vsl_voy_no.toUpperCase();
          break;
        }

      case 'bl_period_delivery':
        {
          this.Record.bl_period_delivery = this.Record.bl_period_delivery.toUpperCase();
          break;
        }

      case 'bl_move_type':
        {
          this.Record.bl_move_type = this.Record.bl_move_type.toUpperCase();
          break;
        }

      case 'bl_bl_place_transhipment':
        {
          this.Record.bl_place_transhipment = this.Record.bl_place_transhipment.toUpperCase();
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
      case 'bl_mark16':
        {
          this.Record.bl_mark16 = this.Record.bl_mark16.toUpperCase();
          break;
        }
      case 'bl_mark17':
        {
          this.Record.bl_mark17 = this.Record.bl_mark17.toUpperCase();
          break;
        }
      case 'bl_mark18':
        {
          this.Record.bl_mark18 = this.Record.bl_mark18.toUpperCase();
          break;
        }
      case 'bl_mark19':
        {
          this.Record.bl_mark19 = this.Record.bl_mark19.toUpperCase();
          break;
        }
      case 'bl_mark20':
        {
          this.Record.bl_mark20 = this.Record.bl_mark20.toUpperCase();
          break;
        }
      case 'bl_mark21':
        {
          this.Record.bl_mark21 = this.Record.bl_mark21.toUpperCase();
          break;
        }
      case 'bl_mark22':
        {
          this.Record.bl_mark22 = this.Record.bl_mark22.toUpperCase();
          break;
        }
      case 'bl_mark23':
        {
          this.Record.bl_mark23 = this.Record.bl_mark23.toUpperCase();
          break;
        }
      case 'bl_mark24':
        {
          this.Record.bl_mark24 = this.Record.bl_mark24.toUpperCase();
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
      case 'bl_desc16':
        {
          this.Record.bl_desc16 = this.Record.bl_desc16.toUpperCase();
          break;
        }
      case 'bl_desc17':
        {
          this.Record.bl_desc17 = this.Record.bl_desc17.toUpperCase();
          break;
        }
      case 'bl_desc18':
        {
          this.Record.bl_desc18 = this.Record.bl_desc18.toUpperCase();
          break;
        }

      case 'bl_2desc7':
        {
          this.Record.bl_2desc7 = this.Record.bl_2desc7.toUpperCase();
          break;
        }
      case 'bl_2desc8':
        {
          this.Record.bl_2desc8 = this.Record.bl_2desc8.toUpperCase();
          break;
        }
      case 'bl_2desc9':
        {
          this.Record.bl_2desc9 = this.Record.bl_2desc9.toUpperCase();
          break;
        }
      case 'bl_2desc10':
        {
          this.Record.bl_2desc10 = this.Record.bl_2desc10.toUpperCase();
          break;
        }
      case 'bl_2desc11':
        {
          this.Record.bl_2desc11 = this.Record.bl_2desc11.toUpperCase();
          break;
        }
      case 'bl_2desc12':
        {
          this.Record.bl_2desc12 = this.Record.bl_2desc12.toUpperCase();
          break;
        }
      case 'bl_2desc13':
        {
          this.Record.bl_2desc13 = this.Record.bl_2desc13.toUpperCase();
          break;
        }
      case 'bl_2desc14':
        {
          this.Record.bl_2desc14 = this.Record.bl_2desc14.toUpperCase();
          break;
        }
      case 'bl_grwt':
        {
          this.Record.bl_grwt = this.gs.roundWeight(this.Record.bl_grwt, "GRWT");
          break;
        }
      case 'bl_ntwt':
        {
          this.Record.bl_ntwt = this.gs.roundWeight(this.Record.bl_ntwt, "NTWT");
          break;
        }
      case 'bl_cbm':
        {
          this.Record.bl_cbm = this.gs.roundWeight(this.Record.bl_cbm, "CBM");
          break;
        }
      case 'bl_pcs':
        {
          this.Record.bl_pcs = this.gs.roundWeight(this.Record.bl_pcs, "PCS");
          break;
        }
      case 'bl_pcs_unit':
        {
          this.Record.bl_pcs_unit = this.Record.bl_pcs_unit.toUpperCase();
          break;
        }

      case 'bl_frt_amount':
        {
          this.Record.bl_frt_amount = this.gs.roundNumber(this.Record.bl_frt_amount, 2);
          break;
        }
      case 'bl_frt_pay_at':
        {
          this.Record.bl_frt_pay_at = this.Record.bl_frt_pay_at.toUpperCase();
          break;
        }
      case 'bl_issued_place':
        {
          this.Record.bl_issued_place = this.Record.bl_issued_place.toUpperCase();
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
      case 'bl_remarks1':
        {
          this.Record.bl_remarks1 = this.Record.bl_remarks1.toUpperCase();
          break;
        }
      case 'bl_remarks2':
        {
          this.Record.bl_remarks2 = this.Record.bl_remarks2.toUpperCase();
          break;
        }
      case 'bl_remarks3':
        {
          this.Record.bl_remarks3 = this.Record.bl_remarks3.toUpperCase();
          break;
        }
      case 'bl_remarks4':
        {
          this.Record.bl_remarks4 = this.Record.bl_remarks4.toUpperCase();
          break;
        }
      case 'bl_iata_carrier':
        {
          this.Record.bl_iata_carrier = this.Record.bl_iata_carrier.toUpperCase();
          break;
        }


      case 'bl_grwt_caption':
        {
          this.Record.bl_grwt_caption = this.Record.bl_grwt_caption.toUpperCase();
          break;
        }
      case 'bl_ntwt_caption':
        {
          this.Record.bl_ntwt_caption = this.Record.bl_ntwt_caption.toUpperCase();
          break;
        }
      case 'bl_cbm_caption':
        {
          this.Record.bl_cbm_caption = this.Record.bl_cbm_caption.toUpperCase();
          break;
        }
      case 'bl_pcs_caption':
        {
          this.Record.bl_pcs_caption = this.Record.bl_pcs_caption.toUpperCase();
          break;
        }
      case 'bl_pcs_unit_caption':
        {
          this.Record.bl_pcs_unit_caption = this.Record.bl_pcs_unit_caption.toUpperCase();
          break;
        }
      case 'bl_itm_po':
        {
          this.Record.bl_itm_po = this.Record.bl_itm_po.toUpperCase();
          break;
        }
      case 'bl_itm_desc':
        {
          this.Record.bl_itm_desc = this.Record.bl_itm_desc.toUpperCase();
          break;
        }
    }
  }

  OnBlurTableCell(field: string, fieldid: string) {
    var REC = this.AttchRecordList.find(rec => rec.bl_pkid == fieldid);
    if (REC != null) {
      if (field == "bl_marks")
        REC.bl_marks = REC.bl_marks.toUpperCase();
      if (field == "bl_desc")
        REC.bl_desc = REC.bl_desc.toUpperCase();
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
            this.Record.bl_consignee_state = response.customeraddress[0].add_state_name;
            this.Record.bl_consignee_country = response.customeraddress[0].add_country_name;
          } else if (controlname == 'NOTIFYADDRESS') {
            this.Record.bl_notify_add1 = response.customeraddress[0].add_line1;
            this.Record.bl_notify_add2 = response.customeraddress[0].add_line2;
            this.Record.bl_notify_add3 = response.customeraddress[0].add_line3;
            this.Record.bl_notify_add4 = response.customeraddress[0].add_line4;
            this.Record.bl_notify_state = response.customeraddress[0].add_state_name;
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
      this.attchmode = "ADD";
      this.AddtoList();
    }
    //else if (action === 'EDIT') {
    //  this.attchmode = "EDIT";
    //  this.UpdateAttchList(id);
    //}
    else if (action === 'REMOVE') {
      this.RemoveFromList(id);
    }
  }

  AddtoList() {
    this.NewAttchRecord();
    this.AttchRecordList.push(this.AttchRecord);
  }

  NewAttchRecord() {
    this.attchmode = "ADD";
    this.AttchRecord = new Bldesc();
    this.AttchRecord.bl_parent_id = this.parentid;
    this.AttchRecord.bl_pkid = this.gs.getGuid();
    this.AttchRecord.bl_marks = '';
    this.AttchRecord.bl_desc = '';
  }

  RemoveList(event: any) {
    if (event.selected) {
      this.ActionHandler('REMOVE', event.id)
    }
  }
  RemoveFromList(id: string) {
    this.AttchRecordList.splice(this.AttchRecordList.findIndex(rec => rec.bl_pkid == id), 1);
  }

  GenerateBLNo(_type: string, _formatid: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (_type == "SEABL" && this.Record.hbl_date.trim().length <= 0) {
      this.ErrorMessage = "\n\r | BL Date Cannot Be Blank";
    }

    if (_type == 'SEABL') {
      if (this.BLFormatList != null) {
        var REC = this.BLFormatList.find(rec => rec.table_pkid == this.Record.hbl_seq_format_id)
        if (REC != null) {
          if (REC.table_name == "NA") {
            this.ErrorMessage += "\n\r | Please select BL Sequence format and continue....";
          }
        }
      }
    }
    if (this.ErrorMessage.length > 0) {
      alert(this.ErrorMessage);
      return;
    }

    this.loading = true;
    let SearchData = {
      type: _type,
      pkid: this.parentid,
      formatid: _formatid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      bldate: this.Record.hbl_date,
      category: "SEA EXPORT"
    };

    this.mainService.GenerateBLNumber(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == "SEABL") {
          this.Record.hbl_bl_no = response.newno;
          if (this.Record.hbl_bl_no.trim().length > 0) {
            this.Record.hbl_blno_generated = "G";
            this.Record.bl_issued_date = this.Record.hbl_date;
          }
        }
        else if (_type == "FCR")
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

  Updatedata(_type: string, spo: string, sdesc: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.loading = true;
    let SearchData = {
      pkid: this.parentid,
      type: _type,
      itm_po: spo,
      itm_desc: sdesc,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    }

    SearchData.pkid = this.parentid;
    SearchData.type = _type;
    SearchData.itm_po = spo;
    SearchData.itm_desc = sdesc;

    this.mainService.UpdateBL(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == "LOAD") {
          this.Record.bl_itm_po = response.itmpo;
          this.Record.bl_itm_desc = response.itmdesc;
        } else
          this.InfoMessage = "Successfully Updated";
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });

  }
  LoadDescription(_type: string) {

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.loading = true;
    let SearchData = {
      pkid: this.parentid,
      format: '',
      issuedplace: this.gs.defaultValues.bl_issued_place,
      company_name: this.gs.globalVariables.comp_name,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      invokefrm: ''
    }

    SearchData.pkid = this.parentid;
    SearchData.format = _type;
    SearchData.issuedplace = this.gs.defaultValues.bl_issued_place;
    SearchData.company_name = this.gs.globalVariables.comp_name;
    SearchData.invokefrm = this.invokefrom;

    this.mainService.LoadDescription(SearchData)
      .subscribe(response => {
        this.loading = false;
        let _NewRecord: Bl;
        _NewRecord = response.record;
        this.Record.bl_desc1 = _NewRecord.bl_desc1;
        this.Record.bl_desc2 = _NewRecord.bl_desc2;
        this.Record.bl_2desc7 = _NewRecord.bl_2desc7;
        this.Record.bl_2desc8 = _NewRecord.bl_2desc8;
        this.Record.bl_2desc9 = _NewRecord.bl_2desc9;
        this.Record.bl_grwt = _NewRecord.bl_grwt;
        this.Record.bl_ntwt = _NewRecord.bl_ntwt;
        this.Record.bl_cbm = _NewRecord.bl_cbm;
        this.Record.bl_pcs = _NewRecord.bl_pcs;
        this.Record.bl_pcs_unit = _NewRecord.bl_pcs_unit;
        this.Record.bl_mark7 = _NewRecord.bl_mark7;
        this.Record.bl_mark8 = _NewRecord.bl_mark8;
        this.Record.bl_mark9 = _NewRecord.bl_mark9;
        this.Record.bl_mark10 = _NewRecord.bl_mark10;
        this.Record.bl_mark11 = _NewRecord.bl_mark11;
        this.Record.bl_mark12 = _NewRecord.bl_mark12;
        this.Record.bl_mark13 = _NewRecord.bl_mark13;
        this.Record.bl_mark14 = _NewRecord.bl_mark14;
        this.Record.bl_mark15 = _NewRecord.bl_mark15;
        this.Record.bl_mark16 = _NewRecord.bl_mark16;
        this.Record.bl_mark17 = _NewRecord.bl_mark17;
        this.Record.bl_mark18 = _NewRecord.bl_mark18;
        this.Record.bl_desc3 = _NewRecord.bl_desc3;
        this.Record.bl_desc4 = _NewRecord.bl_desc4;
        this.Record.bl_desc5 = _NewRecord.bl_desc5;
        this.Record.bl_desc6 = _NewRecord.bl_desc6;
        this.Record.bl_desc7 = _NewRecord.bl_desc7;
        this.Record.bl_desc8 = _NewRecord.bl_desc8;
        this.Record.bl_desc9 = _NewRecord.bl_desc9;
        this.Record.bl_desc10 = _NewRecord.bl_desc10;
        this.Record.bl_desc11 = _NewRecord.bl_desc11;
        this.Record.bl_desc12 = _NewRecord.bl_desc12;
        this.Record.bl_desc13 = _NewRecord.bl_desc13;
        this.Record.bl_desc14 = _NewRecord.bl_desc14;
        this.Record.bl_desc15 = _NewRecord.bl_desc15;
        this.Record.bl_desc16 = _NewRecord.bl_desc16;
        this.Record.bl_desc17 = _NewRecord.bl_desc17;
        this.Record.bl_desc18 = _NewRecord.bl_desc18;
        //this.Record.bl_itm_po = _NewRecord.bl_itm_po;
        //this.Record.bl_itm_desc = _NewRecord.bl_itm_desc;
        this.AttchRecordList = _NewRecord.AttachList;

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  PasteData(content: any) {
    this.bShowPasteData = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.modal = this.modalService.open(content);
  }

  PasteDataClosed(cbdata: string) {

    let col_desc = -1;
    let col_mark = -1;

    if (cbdata != null) {
      if (this.AttchRecordList == null)
        this.AttchRecordList = new Array<Bldesc>();

      var ar1 = cbdata.split("\n");
      var ar2;

      if (ar1.length > 0) {
        ar2 = ar1[0].split("\t");
        for (var i = 0; i < ar2.length; i++) {
          if (ar2[i].toUpperCase().indexOf("DESCRIPTION") >= 0 || ar2[i].toUpperCase().indexOf("DESC") >= 0) {
            col_desc = i;
          }
          if (ar2[i].toUpperCase().indexOf("MARKS") >= 0) {
            col_mark = i;
          }
        }
      }

      for (var i = 0; i < ar1.length; i++) {
        if (ar1[i] != '') {
          ar2 = ar1[i].split("\t");

          if (col_mark == -1) {
            if (ar2.length > 0)
              if (ar2[0].length > 125) {
                this.ErrorMessage = "Marks and Number, One or more line exceed the Character length. (max allow 125 Characters)";
                alert(this.ErrorMessage);
                break;
              }
          } else {
            if (col_mark > -1 && ar2.length > col_mark)
              if (ar2[col_mark].length > 125) {
                this.ErrorMessage = "Marks and Number, One or more line exceed the Character length. (max allow 125 Characters)";
                alert(this.ErrorMessage);
                break;
              }
          }

          if (col_desc == -1) {
            if (ar2.length > 1)
              if (ar2[1].length > 125) {
                this.ErrorMessage = "Description, One or more line exceed the Character length. (max allow 125 Characters)";
                alert(this.ErrorMessage);
                break;
              }
          } else {
            if (col_desc > -1 && ar2.length > col_desc)
              if (ar2[col_desc].length > 125) {
                this.ErrorMessage = "Description, One or more line exceed the Character length. (max allow 125 Characters)";
                alert(this.ErrorMessage);
                break;
              }
          }
        }
      }
      for (var i = 0; i < ar1.length; i++) {
        if (i == 0) {
          if (col_desc > 0 || col_mark > 0)
            continue;
          else {
            col_mark = 0;
            col_desc = 1;
          }
        }

        if (ar1[i] != '') {
          ar2 = ar1[i].split("\t");
          this.AttchRecord = new Bldesc();
          this.AttchRecord.bl_pkid = this.gs.getGuid();
          this.AttchRecord.bl_desc = '';
          this.AttchRecord.bl_marks = '';
          if (col_desc > -1 && ar2.length > col_desc)
            this.AttchRecord.bl_desc = ar2[col_desc].toUpperCase();
          if (col_mark > -1 && ar2.length > col_mark)
            this.AttchRecord.bl_marks = ar2[col_mark].toUpperCase();
          this.AttchRecordList.push(this.AttchRecord);
        }
      }
    }
    this.bShowPasteData = false;
    this.closeModal();
  }

  closeModal() {
    this.modal.close();

  }

}
