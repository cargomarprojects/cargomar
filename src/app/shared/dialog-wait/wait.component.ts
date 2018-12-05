import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'App-Wait',
  templateUrl: './wait.component.html'
})
export class WaitComponent implements OnInit {

  @ViewChild('content') private content : any;

  @Input() msg: string;

  @Input() visible: boolean = false;

  displayed: boolean = false;

  modalref: any;

  constructor(private modalService: NgbModal) {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      if (propName == 'visible') {

        if (this.visible)
          this.open();
        if (!this.visible)
          this.close();

      }
    }
  }
  
  ngOnInit() {
  }

  open() {
    this.displayed = true;
    this.modalref = this.modalService.open(this.content, { size: "sm", backdrop: 'static', keyboard: false, windowClass: 'modal-custom' });
  }

  close() {
    if (this.displayed) {
      this.displayed = false;
      this.modalref.close();
    }
  }

}
