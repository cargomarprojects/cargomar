import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


import { GlobalService } from '../../../core/services/global.service';
import { Joborderm } from '../../models/joborder';
import { JobOrder_VM } from '../../models/joborder';
import { JobOrderService } from '../../services/joborder.service';
import { SearchTable } from '../../../shared/models/searchtable';



@Component({
  selector: 'app-joborder',
  templateUrl: './joborder.component.html',
  providers: [JobOrderService]
})
export class JobOrderComponent {
  // Local Variables 
  title = 'Order List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  selectedRowIndex: number = -1;

  Total_Amount: number = 0;

  modal :  any;

  loading = false;
  currentTab = 'LIST';

  bChanged: boolean;

  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';
  po_nos = '';
  style_nos = '';

  ctr: number;

  bShowPasteData: boolean = false;
  bShowList = false;
  // Array For Displaying List
  OrdColList: any[] = [];
  RecordList: Joborderm[] = [];
  // Single Record for add/edit/view details
  Record: Joborderm = new Joborderm;

  RecordList2: Joborderm[] = [];

  mList: Joborderm[] = [];

  constructor(
    private mainService: JobOrderService,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private modalService: NgbModal,        
  ) {

    this.InitLov();
    this.ActionHandler("ADD", null);
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.po_nos = '';
    this.style_nos = '';
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }
  LoadCombo() {
    this.loading = true;
    let SearchData = {
      type: 'ORDER',
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
        this.OrdColList = response.ordercolumns;
        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });

  }

  InitLov() {

  }

  LovSelected(_Record: SearchTable) {

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
      po_nos: this.po_nos,
      style_nos: this.style_nos
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'UPDATE_LIST')
          this.RecordList2 = response.list;
        else
          this.RecordList = response.list;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  NewRecord() {
    let _OldRecord: Joborderm;
    _OldRecord = this.Record;

    this.bShowList = false;

    this.pkid = this.gs.getGuid();
    this.Record = new Joborderm();
    this.Record.ord_pkid = this.pkid;
    this.Record.ord_exp_id = '';
    this.Record.ord_exp_name = '';
    this.Record.ord_imp_id = '';
    this.Record.ord_imp_name = '';
    this.Record.ord_invno = '';
    this.Record.ord_uneco = '';
    this.Record.ord_po = '';
    this.Record.ord_style = '';
    this.Record.ord_cbm = 0;
    this.Record.ord_pcs = 0;
    this.Record.ord_pkg = 0;
    this.Record.ord_grwt = 0;
    this.Record.ord_ntwt = 0;
    this.Record.ord_hs_code = '';
    this.Record.ord_cargo_status = '';
    this.Record.ord_desc = '';
    this.Record.ord_stylename = '';
    this.Record.ord_color = '';
    this.Record.ord_contractno = '';
    this.Record.ord_source = '';
    this.Record.rec_mode = this.mode;
    this.InitLov();

    if (_OldRecord.ord_pkid != null) {  //setting previous record data for new records
      this.Record.ord_invno = _OldRecord.ord_invno;
      this.Record.ord_uneco = _OldRecord.ord_uneco;
      //this.Record.ord_cbm = _OldRecord.ord_cbm;
      //this.Record.ord_pcs = _OldRecord.ord_pcs;
      //this.Record.ord_pkg = _OldRecord.ord_pkg;
      //this.Record.ord_grwt = _OldRecord.ord_grwt;
      //this.Record.ord_ntwt = _OldRecord.ord_ntwt;
      //this.Record.ord_hs_code = _OldRecord.ord_hs_code;
      this.Record.ord_cargo_status = _OldRecord.ord_cargo_status;
      this.Record.ord_desc = _OldRecord.ord_desc;
    }
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
        });
  }

  LoadData(_Record: Joborderm) {
    this.Record = _Record;
    this.InitLov();
    this.Record.rec_mode = this.mode;
  }

  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;

    this.Record.ord_parent_id = this.parentid;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
        this.ActionHandler('ADD', null);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (this.Record.ord_po.trim().length <= 0) {
      bret = false;
      sError += "\n\r | PO Cannot Be Blank";
    }

    /*
      if (this.Record.ord_desc.trim().length <= 0) {
        bret = false;
        sError += "\n\r | Description Cannot Be Blank";
      }
    */


    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.ord_pkid == this.Record.ord_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.ord_invno = this.Record.ord_invno;
      REC.ord_po = this.Record.ord_po;
      REC.ord_style = this.Record.ord_style;
      REC.ord_cargo_status = this.Record.ord_cargo_status;
      REC.ord_desc = this.Record.ord_desc;
      REC.ord_color = this.Record.ord_color;
      REC.ord_contractno = this.Record.ord_contractno;
    }
  }

  RemoveList(event: any) {
    if (event.selected) {
      this.ActionHandler('REMOVE', event.id)
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
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.ord_pkid == this.pkid), 1);
        this.ActionHandler('ADD', null);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
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

      case 'ord_exp_name':
        {
          this.Record.ord_exp_name = this.Record.ord_exp_name.toUpperCase();
          break;
        }
      case 'ord_imp_nmae':
        {
          this.Record.ord_imp_name = this.Record.ord_imp_name.toUpperCase();
          break;
        }
      case 'ord_invno':
        {
          this.Record.ord_invno = this.Record.ord_invno.toUpperCase();
          break;
        }
      case 'ord_uneco':
        {
          this.Record.ord_uneco = this.Record.ord_uneco.toUpperCase();
          break;
        }
      case 'ord_po':
        {
          this.Record.ord_po = this.Record.ord_po.toUpperCase();
          this.FindContractNo();
          break;
        }
      case 'ord_style':
        {
          this.Record.ord_style = this.Record.ord_style.toUpperCase();
          this.FindContractNo();
          break;
        }
      case 'ord_hs_code':
        {
          this.Record.ord_hs_code = this.Record.ord_hs_code.toUpperCase();
          break;
        }
      case 'ord_cargo_status':
        {
          this.Record.ord_cargo_status = this.Record.ord_cargo_status.toUpperCase();
          break;
        }
      case 'ord_desc':
        {
          this.Record.ord_desc = this.Record.ord_desc.toUpperCase();
          break;
        }

      case 'ord_cbm':
        {
          this.Record.ord_cbm = this.gs.roundWeight(this.Record.ord_cbm, "CBM");
          break;
        }
      case 'ord_pcs':
        {
          this.Record.ord_pcs = this.gs.roundWeight(this.Record.ord_pcs, "PCS");
          break;
        }
      case 'ord_pkg':
        {
          this.Record.ord_pkg = this.gs.roundWeight(this.Record.ord_pkg, "PKG");
          break;
        }
      case 'ord_grwt':
        {
          this.Record.ord_grwt = this.gs.roundWeight(this.Record.ord_grwt, "GRWT");
          break;
        }
      case 'ord_ntwt':
        {
          this.Record.ord_ntwt = this.gs.roundWeight(this.Record.ord_ntwt, "NTWT");
          break;
        }
      case 'ord_color':
        {
          this.Record.ord_color = this.Record.ord_color.toUpperCase();
          this.FindContractNo();
          break;
        }
      case 'ord_stylename':
        {
          this.Record.ord_stylename = this.Record.ord_stylename.toUpperCase();
          break;
        }
      case 'ord_contractno':
        {
          this.Record.ord_contractno = this.Record.ord_contractno.toUpperCase();
          break;
        }
      case 'style_nos':
        {
          this.style_nos = this.style_nos.toUpperCase();
          break;
        }
      case 'po_nos':
        {
          this.po_nos = this.po_nos.toUpperCase();
          break;
        }
    }
  }

  FindContractNo() {
    let sContract: string = "";
    sContract = this.Record.ord_po;
    if (this.Record.ord_style.trim() != "") {
      if (sContract.trim() != "")
        sContract += "/";
      sContract += this.Record.ord_style;
    }
    if (this.Record.ord_color.trim() != "") {
      if (sContract.trim() != "")
        sContract += "-";
      sContract += this.Record.ord_color;
    }
    this.Record.ord_contractno = sContract.trim();
  }

  UpdateJobOrder() {
    this.ErrorMessage = "";
    let OrdPkids: string = "";
    for (let rec of this.RecordList2.filter(rec => rec.ord_selected == true)) {
      if (OrdPkids != "")
        OrdPkids += ",";
      OrdPkids += rec.ord_pkid;
      this.RecordList2.splice(this.RecordList2.findIndex(rec2 => rec2.ord_pkid == rec.ord_pkid), 1);
    }
    if (OrdPkids == "") {
      this.ErrorMessage = "Please select PO and Continue.....";
      return;
    }

    this.SearchRecord("updateorderm", OrdPkids);

  }

  SearchRecord(controlname: string, controlid: string) {
    this.InfoMessage = '';
    if (controlid.trim().length <= 0)
      return;

    this.loading = true;
    let SearchData = {
      pkid: controlid,
      parentid: this.parentid,
      table: 'updateorderm'
    };
    if (controlname == 'updateorderm') {
      SearchData.pkid = controlid;
      SearchData.parentid = this.parentid;
      SearchData.table = 'updateorderm';
    }

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.List('NEW');
      },
        error => {
          this.loading = false;
          this.InfoMessage = this.gs.getError(error);
        });
  }

  PasteData(content : any) {
    this.bShowPasteData = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.modal = this.modalService.open(content);    
  }

  PasteDataClosed(cbdata: string) {

    let col_inv = -1;
    let col_desc = -1;
    let col_uneco = -1;
    let col_po = -1;
    let col_style = -1;
    let col_color = -1;
    let col_pkg = -1;
    let col_pcs = -1;
    let col_ntwt = -1;
    let col_grwt = -1;
    let col_cbm = -1;
    let col_hscode = -1;

    let col_bkd = -1;
    let col_rnd = -1;
    let col_por = -1;
    let col_cr = -1;
    let col_fcr = -1;
    let col_insp = -1;
    let col_stf = -1;
    let col_whd = -1;
    let col_dlv_pol = -1;
    let col_dlv_pod = -1;
    let col_port_pol = -1;
    let col_port_pod = -1;

    if (cbdata != null) {

      let mRec: Joborderm = new Joborderm;
      this.mList = [];
      var ar1 = cbdata.split("\n");
      var ar2;

      if (ar1.length > 0) {
        ar2 = ar1[0].split("\t");
        for (var i = 0; i < ar2.length; i++) {
          if (col_inv < 0)
            col_inv = this.GetColIndex(ar2[i].toUpperCase().trim(), "INVOICE-NO", i)
          if (col_desc < 0)
            col_desc = this.GetColIndex(ar2[i].toUpperCase().trim(), "DESCRIPTION", i)
            if (col_uneco < 0)
            col_uneco = this.GetColIndex(ar2[i].toUpperCase().trim(), "UNECO", i)
          if (col_po < 0)
            col_po = this.GetColIndex(ar2[i].toUpperCase().trim(), "PURCHASE-ORDER", i)
          if (col_style < 0)
            col_style = this.GetColIndex(ar2[i].toUpperCase().trim(), "STYLE-NO", i);
          if (col_color < 0)
            col_color = this.GetColIndex(ar2[i].toUpperCase().trim(), "COLOR", i);
          if (col_pkg < 0)
            col_pkg = this.GetColIndex(ar2[i].toUpperCase().trim(), "CARTONS", i);
          if (col_pcs < 0)
            col_pcs = this.GetColIndex(ar2[i].toUpperCase().trim(), "PCS", i);
          if (col_ntwt < 0)
            col_ntwt = this.GetColIndex(ar2[i].toUpperCase().trim(), "NT-WT", i);
          if (col_grwt < 0)
            col_grwt = this.GetColIndex(ar2[i].toUpperCase().trim(), "GR-WT", i);
          if (col_cbm < 0)
            col_cbm = this.GetColIndex(ar2[i].toUpperCase().trim(), "CBM", i);
          if (col_hscode < 0)
            col_hscode = this.GetColIndex(ar2[i].toUpperCase().trim(), "HS-CODE", i);
          if (col_bkd < 0)
            col_bkd = this.GetColIndex(ar2[i].toUpperCase().trim(), "BOOKING-DATE", i);
          if (col_rnd < 0)
            col_rnd = this.GetColIndex(ar2[i].toUpperCase().trim(), "RANDOM-DATE", i);
          if (col_por < 0)
            col_por = this.GetColIndex(ar2[i].toUpperCase().trim(), "RELEASE-DATE", i);
          if (col_cr < 0)
            col_cr = this.GetColIndex(ar2[i].toUpperCase().trim(), "READY-DATE", i);
          if (col_fcr < 0)
            col_fcr = this.GetColIndex(ar2[i].toUpperCase().trim(), "FCR-DATE", i);
          if (col_insp < 0)
            col_insp = this.GetColIndex(ar2[i].toUpperCase().trim(), "INSPECTION-DATE", i);
          if (col_stf < 0)
            col_stf = this.GetColIndex(ar2[i].toUpperCase().trim(), "STUFFING-DATE", i);
          if (col_whd < 0)
            col_whd = this.GetColIndex(ar2[i].toUpperCase().trim(), "WAREHOUSE-DATE", i);
          if (col_dlv_pol < 0)
            col_dlv_pol = this.GetColIndex(ar2[i].toUpperCase().trim(), "DELIVERY-POL-DATE", i);
          if (col_dlv_pod < 0)
            col_dlv_pod = this.GetColIndex(ar2[i].toUpperCase().trim(), "DELIVERY-POD-DATE", i);
          if (col_port_pol < 0)
            col_port_pol = this.GetColIndex(ar2[i].toUpperCase().trim(), "POL", i);
          if (col_port_pod < 0)
            col_port_pod = this.GetColIndex(ar2[i].toUpperCase().trim(), "POD", i);

          // if (ar2[i].toUpperCase().indexOf("IN") >= 0) {
          //   col_inv = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("DESC") >= 0 || ar2[i].toUpperCase().indexOf("ITEM") >= 0 || ar2[i].toUpperCase().indexOf("NAME") >= 0) {
          //   col_desc = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("PO") >= 0) {
          //   col_po = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("STY") >= 0) {
          //   col_style = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("COL") >= 0) {
          //   col_color = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("CTN") >= 0 || ar2[i].toUpperCase().indexOf("PKG") >= 0 || ar2[i].toUpperCase().indexOf("CAR") >= 0 || ar2[i].toUpperCase().indexOf("PACK") >= 0) {
          //   col_pkg = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("PCS") >= 0) {
          //   col_pcs = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("NT") >= 0 || ar2[i].toUpperCase().indexOf("NET") >= 0) {
          //   col_ntwt = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("GR") >= 0) {
          //   col_grwt = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("CBM") >= 0 || ar2[i].toUpperCase().indexOf("VOL") >= 0) {
          //   col_cbm = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("HS") >= 0) {
          //   col_hscode = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("BOOKING DATE") >= 0) {//BKD
          //   col_bkd = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("RANDOM DATE") >= 0) { //RND
          //   col_rnd = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("RELEASE DATE") >= 0) {//POR
          //   col_por = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("READY DATE") >= 0) { //CR
          //   col_cr = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("FCR DATE") >= 0) {//FCR
          //   col_fcr = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("INSPECTION DATE") >= 0) { //INSP
          //   col_insp = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("STUFFING DATE") >= 0) {
          //   col_stf = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("WARE HOUSE DATE") >= 0) {
          //   col_whd = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("DELIVERY POL DATE") >= 0) {
          //   col_dlv_pol = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("DELIVERY POD DATE") >= 0) {
          //   col_dlv_pod = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("PORT-POL") >= 0) {
          //   col_port_pol = i;
          // }
          // if (ar2[i].toUpperCase().indexOf("PORT-POD") >= 0) {
          //   col_port_pod = i;
          // }
        }

      }

      for (var i = 1; i < ar1.length; i++) {

        if (ar1[i] != '') {
          ar2 = ar1[i].split("\t");
          mRec = new Joborderm;
          mRec.ord_pkid = '';
          mRec.ord_invno = '';
          mRec.ord_desc = '';
          mRec.ord_uneco = '';
          mRec.ord_po = '';
          mRec.ord_style = '';
          mRec.ord_color = '';
          mRec.ord_pkg = 0;
          mRec.ord_pcs = 0;
          mRec.ord_ntwt = 0;
          mRec.ord_grwt = 0;
          mRec.ord_cbm = 0;
          mRec.ord_hs_code = '';
          mRec.ord_exp_id = '';
          mRec.ord_exp_name = '';
          mRec.ord_imp_id = '';
          mRec.ord_imp_name = '';
          mRec.ord_agent_id = '';
          mRec.ord_agent_name = '';
          mRec.rec_category = '';
          mRec.remove = '';
          mRec.ord_source = '';

          mRec.ord_booking_date = '';
          mRec.ord_rnd_insp_date = '';
          mRec.ord_po_rel_date = '';
          mRec.ord_cargo_ready_date = '';
          mRec.ord_fcr_date = '';
          mRec.ord_insp_date = '';
          mRec.ord_stuf_date = '';
          mRec.ord_whd_date = '';
          mRec.ord_delvi_date = '';
          mRec.ord_dlv_pol_date = '';
          mRec.ord_dlv_pod_date = '';
          mRec.ord_pol = '';
          mRec.ord_pod = '';

          mRec.ord_pkid = this.gs.getGuid();
          mRec.rec_category = this.type;

          if (col_inv > -1)
            mRec.ord_invno = ar2[col_inv].toUpperCase();
          if (col_desc > -1)
            mRec.ord_desc = ar2[col_desc].toUpperCase();
            if (col_uneco > -1)
            mRec.ord_uneco = ar2[col_uneco].toUpperCase();
          if (col_po > -1)
            mRec.ord_po = ar2[col_po].toUpperCase();
          if (col_style > -1)
            mRec.ord_style = ar2[col_style].toUpperCase();
          if (col_color > -1)
            mRec.ord_color = ar2[col_color].toUpperCase();
          if (col_pkg > -1) {

            if (ar2[col_pkg] != "") {
              mRec.ord_pkg = parseFloat(ar2[col_pkg]);
            }
            else {
              mRec.ord_pkg = 0;
            }

          }

          if (col_pcs > -1) {

            if (ar2[col_pcs] != "") {
              mRec.ord_pcs = parseFloat(ar2[col_pcs]);
            }
            else {
              mRec.ord_pcs = 0;
            }

          }

          if (col_ntwt > -1) {

            if (ar2[col_ntwt] != "") {
              mRec.ord_ntwt = parseFloat(ar2[col_ntwt]);
            }
            else {
              mRec.ord_ntwt = 0;
            }
          }

          if (col_grwt > -1) {

            if (ar2[col_grwt] != "") {
              mRec.ord_grwt = parseFloat(ar2[col_grwt]);
            }
            else {
              mRec.ord_grwt = 0;
            }
          }

          if (col_cbm > -1) {
            if (ar2[col_cbm] != "") {
              mRec.ord_cbm = parseFloat(ar2[col_cbm]);
            }
            else {
              mRec.ord_cbm = 0;
            }
          }
          if (col_hscode > -1)
            mRec.ord_hs_code = ar2[col_hscode].toUpperCase();

          if (col_bkd > -1)
            mRec.ord_booking_date = ar2[col_bkd].toUpperCase();
          if (col_rnd > -1)
            mRec.ord_rnd_insp_date = ar2[col_rnd].toUpperCase();
          if (col_por > -1)
            mRec.ord_po_rel_date = ar2[col_por].toUpperCase();
          if (col_cr > -1)
            mRec.ord_cargo_ready_date = ar2[col_cr].toUpperCase();
          if (col_fcr > -1)
            mRec.ord_fcr_date = ar2[col_fcr].toUpperCase();
          if (col_insp > -1)
            mRec.ord_insp_date = ar2[col_insp].toUpperCase();
          if (col_stf > -1)
            mRec.ord_stuf_date = ar2[col_stf].toUpperCase();
          if (col_whd > -1)
            mRec.ord_whd_date = ar2[col_whd].toUpperCase();
          if (col_dlv_pol > -1)
            mRec.ord_dlv_pol_date = ar2[col_dlv_pol].toUpperCase();
          if (col_dlv_pod > -1)
            mRec.ord_dlv_pod_date = ar2[col_dlv_pod].toUpperCase();
          if (col_port_pol > -1)
            mRec.ord_pol = ar2[col_port_pol].toUpperCase();
          if (col_port_pod > -1)
            mRec.ord_pod = ar2[col_port_pod].toUpperCase();

          if (mRec.ord_po != '') {
            let sContract: string = "";

            sContract = mRec.ord_po;
            if (mRec.ord_style.trim() != "") {
              if (sContract.trim() != "")
                sContract += "/";
              sContract += mRec.ord_style;
            }
            if (mRec.ord_color.trim() != "") {
              if (sContract.trim() != "")
                sContract += "-";
              sContract += mRec.ord_color;
            }
            mRec.ord_contractno = sContract.trim().toUpperCase();

            mRec.remove = "";

            this.mList.push(mRec);
          }
        }
      }
      if (this.mList.length > 0) {
        this.bShowList = true;
      }

    }
    this.bShowPasteData = false;
    this.closeModal();
  }


  //upload
  Upload() {

    if (this.mList.length <= 0) {
      this.InfoMessage = '';
      this.ErrorMessage = 'Data Cannot Be Blank';
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    let VM = new JobOrder_VM;
    VM.JobOrder = this.mList;
    VM.globalvariables = this.gs.globalVariables;
    VM.ord_parent_id = this.parentid;
    VM.ord_source = "JOB";

    this.mainService.Upload(VM)
      .subscribe(response => {
        this.loading = false;
        if (response.list.length <= 0) {
          this.InfoMessage = "Upload Complete";
        }
        else {
          this.ErrorMessage = "Cannot Insert, All These PO's Already Exist!";
        }

        for (var i = 0; i < this.mList.length; i++) {
          this.mList[i].remove = "Y";
        }

        for (var j = 0; j < response.list.length; j++) {
          for (var i = 0; i < this.mList.length; i++) {
            if (response.list[j].ord_pkid == this.mList[i].ord_pkid) {
              this.mList[i].remove = "N";
            }
          }
        }



        for (var i = this.mList.length - 1; i >= 0; i--) {

          if (this.mList[i].remove == "Y") {
            this.RecordList.push(this.mList[i]);
            this.mList.splice(i);
          }
        }


      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  GetColIndex(SourceCol: string, TargetCol: string, indx: number) {
    let nCol: number = -1;
    for (let rec of this.OrdColList.filter(rec => rec.source_col == SourceCol && rec.target_col == TargetCol)) {
      nCol = indx;
      break;
    }
    return nCol;
  }

  closeModal() {
    this.modal.close();
 
  }

}
