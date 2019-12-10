import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crlimit',
  templateUrl: './crlimit.component.html',

})
export class CrLimitComponent {

  @ViewChild('content') private content: any;

  title = 'O/s Details';

  @Input() RecordList: any;
  @Input() msg: string;
  @Input() visible: boolean = false;

  @Output() hidealert = new EventEmitter<boolean>();

  displayed: boolean = false;

  modalref: any;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    // URL Query Parameter 

  }

  // Init Will be called After executing Constructor
  ngOnInit() {

  }

/* 
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      if (propName == 'visible') {
        if (this.visible)
          this.open();
        if (!this.visible)
          this.close();

      }
    }
  } */


  InitComponent() {

  }

  open() {
    this.displayed = true;
    this.modalref = this.modalService.open(this.content, { size: "sm", backdrop: 'static', keyboard: false, windowClass: 'modal-custom' });
  }

  close() {

    if (this.displayed) {
      this.displayed = false;
      this.hidealert.emit(false);
      this.modalref.close();
    }
  }

  close1() {
    this.visible =false
    this.hidealert.emit(false);

  }

}

