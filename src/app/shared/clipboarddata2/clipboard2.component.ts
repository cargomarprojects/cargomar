import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { SearchTable } from '../models/searchtable';
import { GlobalService } from '../../core/services/global.service';



@Component({
  selector: 'App-ClipBoard2',
  templateUrl: './clipboard2.component.html'
})
export class ClipBoard2Component implements OnInit {

  @ViewChild('content') private content: any;

  @Output() CloseClicked = new EventEmitter<string>()

  @Input() msg: string;

  //@Input() visible: boolean = false;

  displayed: boolean = false;

  loading: boolean = false

  modalref: any;

  ErrorMessage: string = '';

  cbdata: string = '';

  RecList: SearchTable[] = [];

  nTotal: string = '';

  json: any;
  jsonString: any;

  constructor(
    private gs: GlobalService,
    private modalService: NgbModal) {
  }


  ngOnInit() {
  }

  open() {
    this.displayed = true;
  }

  close() {
    if (this.displayed) {
      this.displayed = false;
      if (this.CloseClicked != null)
        this.CloseClicked.emit(null);
    }
  }

  clearData() {
    this.cbdata = "";
    this.json = null;
  }

  process() {

    if (this.cbdata == "")
      return;
    if (this.CloseClicked != null) {
      this.CloseClicked.emit(this.cbdata);
    }
  }





}
