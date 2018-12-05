import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'RxJS/Rx';
import 'rxjs/add/operator/map'

import { SearchTable } from '../models/searchtable';
import { GlobalService } from '../../core/services/global.service';



@Component({
  selector: 'App-PasteData',
  templateUrl: './pastedata.component.html'
})
export class PasteDataComponent implements OnInit {

  @ViewChild('content') private content: any;

  @Output() CloseClicked = new EventEmitter<string>();

  @Input() msg: string;

  @Input() visible: boolean = false;

  displayed: boolean = false;

  loading: boolean = false

  modalref: any;

  ErrorMessage: string = '';

  cbdata: string = '';

  maintype: string = 'ORDER LIST';

 // RecList: SearchTable[] = [];

  nTotal: string = '';
 

  SearchData = {
    //table: '',
    type: '',
    comp_code: '',
    branch_code: '',
    year_code: '',
    cbdata: ''
  };

  constructor(
    private gs: GlobalService,
    private modalService: NgbModal) {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      if (propName == 'visible') {

        if (this.visible) {
          this.cbdata = '';
         // this.RecList = null;
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
      this.CloseClicked.emit(this.cbdata);
  }
  

  //SearchRecord() {

  //  this.loading = true;

   


  // // SearchData.table = 'pastedata';
  //  this.SearchData.type = this.maintype;
  //  this.SearchData.comp_code = this.gs.globalVariables.comp_code;
  //  this.SearchData.branch_code = this.gs.globalVariables.branch_code;
  //  this.SearchData.year_code = this.gs.globalVariables.year_code;
  //  this.SearchData.cbdata = this.cbdata;
    
    
  //  //this.RecList = this.SearchData;

  //  this.ErrorMessage = '';
    
  //}
  


}
