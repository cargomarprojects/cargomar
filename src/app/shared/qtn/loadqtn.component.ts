import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, OnChanges, SimpleChange, ViewChild } from '@angular/core';


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { qtnm, SaveQtnData } from '../models/qtn';

import { qtnd } from '../models/qtn';


import { QtnService } from '../services/qtn.services';

import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'App-LoadQtn',
  templateUrl: './loadqtn.component.html',
  providers: [QtnService]
})
export class LoadQtnComponent {
  // Local Variables 
  title = 'Quotation';

  @ViewChild('content') private content: any;

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() partyid: string = '';

  @Input() hblid: string = '';

  @Input() visible: boolean = false;

  @Input() qtntype: string = '';
  @Input() qtnsource: string = '';
  @Input() qtnno: string = '';
  @Input() qtnaccswhere: string = '';
  @Input() inv_category: string = '';


  @Output() CloseClicked = new EventEmitter<string>();


  selectedRowIndex: number = -1;


  bChanged: boolean;

  total_amt: number = 0;

  loading = false;
  currentTab = 'LIST';

  search_inv_pkid: string = '';

  category: string = '';

  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';


  qtnid = "";

  ctr: number;

  displayed: boolean = false;

  modalref: any;


  //Cost Center List 

  // Array For Displaying List
  RecordList: qtnd[] = [];
  // Single Record for add/edit/view details
  Record: qtnm = new qtnm;
  Recorddet: qtnd = new qtnd;

  constructor(
    private mainService: QtnService,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private modalService: NgbModal
  ) {
  }

  // Init Will be called After executing Constructor
  ngOnInit() {

    this.InitLov();
    this.category = '';
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  InitLov() {
  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      if (propName == 'visible') {

        if (this.visible) {
          //this.RecList = null;

          this.List('NEW');

          this.open();
        }
        if (!this.visible)
          this.close();

      }
    }
  }


  open() {
    this.displayed = true;
    this.modalref = this.modalService.open(this.content, { size: "lg", backdrop: 'static', keyboard: false });
  }

  close() {
    if (this.displayed) {
      this.displayed = false;
      this.modalref.close();
      if (this.CloseClicked != null)
        this.CloseClicked.emit('');
    }
  }

  ok() {
    if (this.CloseClicked != null)
      this.CloseClicked.emit(this.qtnid);
  }

  List(_type: string) {
    this.loading = true;

    if (this.type == '') {
      alert('Type Not Selected');
      return;
    }



    let SearchData = {
      type: _type,
      subtype: this.type,
      partyid: this.partyid,
      hblid: this.hblid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      qtnsource: this.qtnsource,
      qtntype: this.qtntype,
      qtnno: this.qtnno
    };



    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.qtnid = '';

    this.mainService.GetQtnList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record = response.row;
        this.RecordList = response.list;
        this.pkid = this.Record.qtn_pkid;
        this.category = response.category;
        this.qtnid = response.qtnid;
        this.FindListTotal();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  FindListTotal() {
    this.total_amt = 0;
    this.RecordList.forEach(rec => {
      this.total_amt += rec.qtnd_total;
    });
  }

  LovSelected(_Record: any, _rec: qtnd) {

    if (_Record.controlname == "ACCTM") {
      _rec.qtnd_acc_id = _Record.id;
      _rec.qtnd_acc_code = _Record.code;
      _rec.qtnd_acc_name = _Record.name;
    }

  }

  SaveQtn() {
    if (!this.allvalid())
      return;
    if (!confirm('SAVE ' + this.category)) {
      return;
    }
    let _saveData: SaveQtnData = new SaveQtnData;
    _saveData.qtnm_detList = this.RecordList;
    _saveData.rowtype = this.qtntype;
    _saveData.parentid = this.hblid;
    _saveData.inv_source = this.type;
    _saveData.inv_category = this.inv_category;
    _saveData._globalvariables = this.gs.globalVariables;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.ImpoprtQtn(_saveData)
      .subscribe(response => {
        this.loading = false;
        // this.InfoMessage = "Save Complete";
        // alert(this.InfoMessage);

        if (this.CloseClicked != null)
          this.CloseClicked.emit('SAVE-LIST');
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

    if (this.qtntype.length <= 0) {
      bret = false;
      sError += "| Invalid Type";
    }
    if (this.hblid.length <= 0) {
      bret = false;
      sError += "| Invalid ID";
    }

    if (this.type.length <= 0) {
      bret = false;
      sError += "| Invalid Source";
    }

    if (this.inv_category.length <= 0) {
      bret = false;
      sError += "| Invalid Category";
    }

    // if (this.type == "SEA EXPORT" || this.type == "SEA IMPORT") {
    //   if (this.Record.inv_source == "FREIGHT MEMO" || this.Record.inv_source == "LOCAL CHARGES") {
    //     if (this.Record.inv_cntr_type_id == "") {
    //       bret = false;
    //       sError += "| Container Type Cannot Be Blank";
    //     }
    //   }
    // }

    for (let rec of this.RecordList) {

      if (rec.qtnd_acc_code.length <= 0) {
        bret = false;
        sError += "| A/c Code Cannot Be Blank";
      }
      if (rec.qtnd_acc_name.length <= 0) {
        bret = false;
        sError += "| A/c Name Cannot Be Blank";
      }
      if (rec.qtnd_curr_code.length <= 0) {
        bret = false;
        sError += "| Currency Cannot Be Blank";
      }
      if (rec.qtnd_qty <= 0) {
        bret = false;
        sError += "| Qty Cannot Be Blank";
      }
      if (rec.qtnd_qty <= 0) {
        bret = false;
        sError += "| Qty Cannot Be Blank";
      }
      if (rec.qtnd_rate <= 0) {
        bret = false;
        sError += "| Rate Cannot Be Blank";
      }
      if (rec.qtnd_total <= 0) {
        bret = false;
        sError += "| Total Cannot Be Blank";
      }
      if (sError != '')
        break;
    }

    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }

}
