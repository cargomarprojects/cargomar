import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Rebate } from '../models/rebate';
import { Rebatem } from '../models/rebate';
import { RepService } from '../services/report.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'App-PostRebate',
  templateUrl: './postrebate.component.html',
  providers: [RepService]
})
export class PostRebateComponent {
  // Local Variables 
  title = 'Post Rebate';

  @ViewChild('content') private content: any;

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() partyid: string = '';

  @Input() jvid: string = '';
  @Input() jvno: string = '';

  @Input() jvid_ho: string = '';
  @Input() jvno_ho: string = '';


  @Input() jvdate: string = '';

  @Input() hblid: string = '';
  @Input() visible: boolean = false;
  @Input() RecordList: Rebate[] = [];
  @Output() CloseClicked = new EventEmitter<any>();

  selectedRowIndex: number = -1;
  bChanged: boolean;
  total_amt: number = 0;
  isRebateok: boolean = false;

  loading = false;
  currentTab = 'LIST';
  search_inv_pkid: string = '';

  category: string = '';
  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';



  status: string = '';
  
  Record: Rebatem = new Rebatem;


  qtnid = "";
  ctr: number;
  displayed: boolean = false;
  modalref: any;


  //Cost Center List 
  // Array For Displaying List
  // Single Record for add/edit/view details

  constructor(
    private mainService: RepService,
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

  Init() {

    if (this.jvdate == '')
      this.Record.jvh_date = this.gs.defaultValues.today;
    else
      this.Record.jvh_date = this.jvdate;

    this.status = 'NEW JV';
    if (this.jvid != '') {
      this.status = 'EDIT JV = ' + this.jvno;
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      if (propName == 'visible') {
        if (this.visible) {

          this.Init();

          this.FindListTotal();
          this.open();
        }
        if (!this.visible)
          this.close();
      }
    }
  }

  open() {
    this.displayed = true;
  //  this.modalref = this.modalService.open(this.content, { size: "lg", backdrop: 'static', keyboard: false });
  }

  close() {
    if (this.displayed) {
      this.displayed = false;
   //   this.modalref.close();
      if (this.CloseClicked != null)
        this.CloseClicked.emit({ status: 'CANCEL', jvid: '', jvno: '', jvid_ho: '', jvno_ho : ''});
    }
  }


  // Save Rebate
  ok() {

    let jvid: string = '';
    let jvno: string = '';
    let jvid_ho: string = '';
    let jvno_ho: string = '';

    if (!this.isRebateok) {
      alert('One or more selected row is invalid');
      return;
    }

    if (this.Record.jvh_date == '') {
      alert('Jv Date Cannot Be Blank');
      return;
    }


    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.Record.rebate_type = this.type;
    
    this.Record.rec_mode = "ADD";
    this.Record.jvhid = '';

    if (this.jvid != '') {
      this.Record.rec_mode = "EDIT";

      this.Record.jvhid = this.jvid;
      this.Record.jvh_vrno = this.jvno;

      this.Record.jvhid_ho = this.jvid_ho;

    }

    this.Record.jvh_amount = this.total_amt;

    this.Record.RebateList = this.RecordList;

    this.Record._globalvariables = this.gs.globalVariables;

    this.mainService.SaveRebate(this.Record)
      .subscribe(response => {
        this.loading = false;
        jvid = response.jvid;
        jvno = response.jvno;

        jvid_ho = response.jvid_ho;
        jvno_ho = response.jvno_ho;

        this.InfoMessage = "Save Complete";
        if (this.CloseClicked != null)
          this.CloseClicked.emit({status :'OK', jvid: jvid, jvno: jvno, jvid_ho: jvid_ho,jvno_ho: jvno_ho });
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        

        alert(this.ErrorMessage);
      });
  }




  /*
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
        this.ErrorMessage = JSON.parse(error._body).Message;
      });
  }

  */

  FindListTotal() {
    this.isRebateok = true;
    this.total_amt = 0;
    this.RecordList.forEach(rec => {
      this.total_amt += rec.inv_rebate_amt_inr;
      if (rec.hbl_pkid.length <= 0)
        this.isRebateok = false;
      if (rec.inv_rebate_amt_inr <= 0)
        this.isRebateok = false;

    });
    this.total_amt = this.gs.roundNumber(this.total_amt, 2);

  }


}
