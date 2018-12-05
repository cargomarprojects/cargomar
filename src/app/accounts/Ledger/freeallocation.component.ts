
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { pendinglist   } from '../models/pendinglist';

import { FreeAllocationService } from '../services/freeallocationservice';

import { SearchTable } from '../../shared/models/searchtable';

import { XList } from '../models/ledgerxref';

import { LedgerXref } from '../models/ledgerxref';


@Component({
  selector: 'app-freeallocation',
  templateUrl: './freeallocation.component.html',
  providers: [FreeAllocationService]
})

export class FreeAllocationComponent {
  // Local Variables 
  title = 'Allocation';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;


  selectdeselect = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;

  jv_total: number = 0;
  Total_Diff: number = 0;
  Total_Amount: number = 0;

  search_id: string;

  shipper_id: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';

  SearchData = {
    type: '',
    accid: '',
    company_code: '',
    branch_code: '',
    year_code: '',
  };

  EXPRECORD: any;
  EXPREC: any = { id: '', code: '', name: '' };
  // Array For Displaying List
  SourceList: pendinglist[] = [];
  // Single Record for add/edit/view details
  PendingList: pendinglist[] = [];

  Record: XList = new XList;

  xRefList: LedgerXref[] = [];

  xRefRec: LedgerXref = new LedgerXref;
  
  constructor(
    private mainService: FreeAllocationService,
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
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.initLov();
    this.InitDefault();
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  initLov(caption: string = '') {
    if (caption == '' || caption == 'SHIPPER') {
      this.EXPRECORD = {
        controlname: 'SHIPPER',
        type: 'ACCTM',
        where: " acc_against_invoice = 'D' ",
        displaycolumn: 'NAME',
        parentid: '',
        id: this.EXPREC.id,
        code: this.EXPREC.code,
        name: this.EXPREC.name
      };
    }
  }

  LovSelected(_Record: SearchTable) {

    // Company Settings
    if (_Record.controlname == 'SHIPPER') {
      this.search_id = _Record.id;
    }
  }
  LoadCombo() {
  }
  InitDefault() {
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

  // Find Source List
  FindPendingList() {
    // For Debtors use 'CR'  as TYPE

    this.shipper_id = this.search_id;
    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.accid = this.shipper_id;
    this.SearchData.type = 'CR';
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;

    this.ErrorMessage = '';
    this.mainService.GetPendingList(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        this.SourceList = response.sourcelist;
        this.PendingList = response.pendinglist;
        
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }


  OnChangeSourceList(field: string, _rec: pendinglist) {
    if (field == 'jv_selected') {
      if (_rec.jv_selected)
        this.jv_total = _rec.jv_balance;
      else
        this.jv_total = 0;
      this.findtotal();  
    }

  }


  OnChangePendingList(field: string, _rec: pendinglist) {
    if (field == 'jv_selected') {
      if (_rec.jv_selected) {
        if (this.Total_Diff < _rec.jv_balance) {
          _rec.jv_allocation = this.Total_Diff;
        }
        else {
          _rec.jv_allocation = _rec.jv_balance;
        }
      }
      else {
        _rec.jv_allocation = 0;
      }
      this.findtotal();
    }
  }

  OnBlur(field: string, _rec: pendinglist) {
    if (field == 'jv_allocation') {

      if (_rec.jv_allocation > 0) {
        _rec.jv_selected = true;
      }
      if (_rec.jv_allocation > _rec.jv_balance) {
        alert('Cannot Allocate More than balance ')
      }


      this.findtotal();
      return;
    }
  }



  findtotal() {
    this.Total_Amount = 0;
    this.PendingList.forEach(rec => {
      this.Total_Amount += rec.jv_allocation;
    });
    this.Total_Amount = this.gs.roundNumber(this.Total_Amount, 2);
    this.Total_Diff = this.jv_total - this.Total_Amount;
    this.Total_Diff = this.gs.roundNumber(this.Total_Diff, 2);
  }
  

  Close() {
    this.gs.ClosePage('home');
  }


  allvalid() {
    let bret: boolean = true;
    let sError: string = "";
    let iCount = 0;

    if (this.search_id != this.shipper_id) {
      bret = false;
      sError += " | Mismatch in List";
    }

    this.SourceList.forEach(rec => {
      if (rec.jv_selected)
        iCount++;
    });

    if (iCount != 1) {
      bret = false;
      sError += " | Allocation not selected in First List";
    }

    if (iCount > 1) {
      this.SourceList.forEach(rec => {
        rec.jv_selected = false;
      });
    }

    this.PendingList.forEach(rec => {
      if (rec.jv_allocation > rec.jv_balance) {
        bret = false;
        sError += " | Allocation Above Balance";
      }
    });


    if (this.Total_Amount <=0 ) {
      bret = false;
      sError += " | Allocation Not Entered  in Second List";
    }

    if (this.Total_Diff < 0) {
      bret = false;
      sError += " | Invalid Allocation";
    }

    if (!bret) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;

  }


  Save() {

    let bOk: Boolean = false;
    let mRec : pendinglist;

    this.findtotal();
    if (!this.allvalid())
      return;

    this.SourceList.forEach(_Rec => {
      if (_Rec.jv_selected) {
        bOk = true;
        mRec = _Rec;
      }
    });

    if (!bOk) {
      this.ErrorMessage = 'Allocation Not Selected in First List ';
      alert(this.ErrorMessage);
      return;
    }

    this.loading = true;

    this.xRefList = Array<LedgerXref>();

    this.PendingList.forEach(Rec => {
      if (Rec.jv_selected && Rec.jv_allocation > 0) {

        this.xRefRec = new LedgerXref;
        this.xRefRec.xref_pkid = this.gs.getGuid();
        this.xRefRec.xref_jvh_id = mRec.jv_parent_id;
        this.xRefRec.xref_jv_id = mRec.jv_pkid;
        this.xRefRec.xref_year = mRec.jv_year;
        this.xRefRec.xref_acc_id = this.shipper_id;

        this.xRefRec.xref_dr_jvh_id = Rec.jv_parent_id;
        this.xRefRec.xref_dr_jv_id = Rec.jv_pkid;
        this.xRefRec.xref_dr_jv_year = Rec.jv_year;
        this.xRefRec.xref_dr_jv_date = Rec.jv_date;

        this.xRefRec.xref_cr_jvh_id = mRec.jv_parent_id;
        this.xRefRec.xref_cr_jv_id = mRec.jv_pkid;
        this.xRefRec.xref_cr_jv_year = mRec.jv_year;
        this.xRefRec.xref_cr_jv_date = mRec.jv_date;

        this.xRefRec.xref_amt = Rec.jv_allocation;

        this.xRefRec.xref_adv_amt = 0;

        this.xRefRec.xref_drcr = 'DR';


        this.xRefList.push(this.xRefRec);
      }
    });


    this.Record = new XList;
    this.Record.jvh_id = '';
    this.Record._globalvariables = this.gs.globalVariables;
    this.Record.XrefList = this.xRefList;

    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        alert("Save Complete")
        this.FindPendingList();
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });


  }




}
