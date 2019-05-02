import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { SearchTable } from '../models/searchtable';
import { GlobalService } from '../../core/services/global.service';



@Component({
  selector: 'App-ClipBoard',
  templateUrl: './clipboard.component.html'
})
export class ClipBoardComponent implements OnInit {

  @ViewChild('content') private content: any;

  @Output() CloseClicked = new EventEmitter<SearchTable[]>();

  @Input() msg: string;

  @Input() visible: boolean = false;

  displayed: boolean = false;

  loading: boolean = false

  modalref: any;

  ErrorMessage: string = '';

  cbdata: string = '';

  maintype: string = 'JOB SEA EXPORT';
  yearcode: string = '2019';
  
  RecList: SearchTable[] = [];

  nTotal: string = '';

  constructor(
    private gs: GlobalService,
    private modalService: NgbModal) {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      if (propName == 'visible') {

        if (this.visible) {
          this.cbdata = '';
          this.RecList = null;
          this.open();
        }
        if (!this.visible)
          this.close();

      }
    }
  }

  ngOnInit() {
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
        this.CloseClicked.emit(null);
    }
  }

  ok() {
    if (this.CloseClicked != null)
      this.CloseClicked.emit(this.RecList);
  }


  SearchRecord() {

    this.loading = true;

    let SearchData = {
      table: '',
      type: '',
      comp_code: '',
      branch_code: '',
      year_code: '',
      cbdata: '',
      isoldyear: 'N'
    };


    SearchData.table = 'pastedata';
    SearchData.type = this.maintype;
    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    // SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.year_code = this.yearcode;
    SearchData.isoldyear = this.gs.globalVariables.year_code == this.yearcode ? 'N' : 'Y';
    SearchData.cbdata = this.cbdata;


    this.ErrorMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecList = response.pastedata;
        this.nTotal = response.total;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }



}
