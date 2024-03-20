import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { GstReport } from '../models/gstreport';
import { Companym } from '../../core/models/company';
import { Gstr2bDownload } from '../models/gstr2bdownload';
import { RepService } from '../services/report.service';


@Component({
    selector: 'app-gstdet',
    templateUrl: './gstdet.component.html',
  })
  export class GstDetComponent {
     
    // Local Variables 
    title = 'GSTR2B Details';
    
    @Input() public menuid: string;
    @Input() public type: string = '';
    @Input() public RecordList: Gstr2bDownload[] = [];

    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    sub: any;
    urlid: string;
    
    ErrorMessage = "";
    InfoMessage = "";
    
    constructor(
      private route: ActivatedRoute,
      private gs: GlobalService
    ) {
      // URL Query Parameter 
    }
  
    // Init Will be called After executing Constructor
    ngOnInit() {
      this.LoadCombo();
    }
  
    InitComponent() {
      this.InitLov();
    }
  
    InitLov() {
  
     
    }
    LovSelected(_Record: SearchTable) {
     
    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
     // this.sub.unsubscribe();
    }
  
    LoadCombo() {
     
     
    }
    
    // Save Data
    OnBlur(field: string) {
  
    }
    Close() {
      
    }

  }
  