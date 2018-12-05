import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'App-Dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent implements OnInit {

  @Input() id: any;
  @Output() result: EventEmitter<{}> = new EventEmitter<{}>();

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() { }
  
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      if (propName == 'visible') {

      }
    }
  }
  
  open(content : any) {
    this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false, windowClass :'modal-custom' }).result.then((result) => {
      if (result == 'Y') {
        this.id.selected = true;
        this.result.emit(this.id);
      }
      else {
        this.id.selected = false;
        this.result.emit(this.id);
      }
    }, (reason) => {
      {
        this.id.selected = false;
        this.result.emit(this.id);
      }
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



}
