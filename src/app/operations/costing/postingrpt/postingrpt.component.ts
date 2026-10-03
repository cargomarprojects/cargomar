import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Posting } from '../../models/posting';
import { PostingService } from '../../services/posting.service';

@Component({
  selector: 'app-postingrpt',
  templateUrl: './postingrpt.component.html',
  providers: [PostingService]
})
export class PostingRptComponent {
   
  title = 'Posting Status';

  @Input() public inv_pkid: string = "";
  @Input() public jvbr_pkid: string = "";
  @Input() public jvho_pkid: string = "";
  @Input() public type: string = '';

  InitCompleted: boolean = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string = "";

  listHtmlHt: string = '400px';
  RecordList: Posting[] = [];
   
  selectedRowIndex = 0;
  searchString: string = "";

  constructor(
    private mainService: PostingService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {
    // URL Query Parameter
  }

   

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.LoadCombo();
    this.List('NEW');
  }

  InitComponent() {
    this.InitLov();
  }

  InitLov() {


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


  List(_type: string) {

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      inv_pkid: this.inv_pkid,
      jvbr_pkid: this.jvbr_pkid,
      jvho_pkid: this.jvho_pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
    };
    this.mainService.postingrpt(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }

}
