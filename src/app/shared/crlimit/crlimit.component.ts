import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-crlimit',
  templateUrl: './crlimit.component.html',
})
export class CrLimitComponent {

  title = 'O/s Details';
  
  @Input() public pkid: string;
  @Input() public type: string = '';
  @Input() RecordList : any ;
    

  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    // URL Query Parameter 
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
  
  }

  InitComponent() {
    
  }

  Close() {
    
  }
    

}

