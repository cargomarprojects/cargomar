import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { LovService } from '../services/lov.service';
import { documentm } from '../models/documentm';

@Component({
  selector: 'app-fileedit',
  templateUrl: './fileedit.component.html',
})

export class FileEditComponent {
  // Local Variables 
  title = '';
 
  @Input() record: documentm;
  @Input() DocTypeList:any[] = [];
  @Input() catg_id: string = '';

  pkid: string = '';
  
      
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
 
  sub: any;
  urlid: string;
  
  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  
  SearchData = {
    pkid: '',
    catgid: '',
    filename:''
  }
  
  // Array For Displaying List

  // Single Record for add/edit/view details


  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.pkid = this.record.doc_pkid;
  }

  InitComponent() {
    
  }


  // Save Data
  Save() {
    /*
    if (!this.allvalid())
      return;
    */
    this.ErrorMessage = '';
    if (this.record.doc_file_name == '') {
      this.ErrorMessage = 'File Name Cannot Be Empty';
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
 
    // this.SearchData.pkid = this.pkid;
    // this.SearchData.remarks = this.remarks;

    // this.mainService.UpdateDsrRemarks(this.SearchData)
    //   .subscribe(response => {
    //     this.loading = false;

    //     if (response.status == "OK") {
    //      
    //       this.record.rec_displayed = false;
    //     }

    //   },
    //   error => {
    //     this.loading = false;
    //     this.ErrorMessage = this.gs.getError(error);
        
    //   });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    

    //if (bret === false)
    //  this.ErrorMessage = sError;
    return bret;
  }


  Close() {
    this.record.row_displayed = false;

  }

}
