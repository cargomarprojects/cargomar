import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, OnChanges, SimpleChange, ViewChild } from '@angular/core';


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { qtnm } from '../models/qtn';

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
      hblid : this.hblid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
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
        this.qtnid   = response.qtnid;
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
  
  
}
