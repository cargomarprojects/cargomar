import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShipmentStage, VmShipmentStage } from '../models/shipment-stage';
import { ShipmentStageService } from '../services/shipment-stage.service';

@Component({
  selector: 'app-shipment-stage',
  templateUrl: './shipment-stage.component.html',
  styleUrls: ['./shipment-stage.component.css']
})
export class ShipmentStageComponent implements OnInit {

  public errorMessage: string = '';
  public tab: string = 'main';

  public _pkid: string = '';
  @Input() set pkid(value: string) {
    this._pkid = value;
  }

  public _type: string = '';
  @Input() set type(value: string) {
    this._type = value;
  }

  public _stage: string = '';
  @Input() set stage(value: string) {
    this._stage = value;
  }


  @Output() callbackevent = new EventEmitter<any>();

  RecordList: ShipmentStage[] = [];

  selectedRowIndex = 0;

  modal: any;
  loading = false;
  constructor(
    private modalService: NgbModal,
    private http2: HttpClient,
    private mainservice: ShipmentStageService,
    private gs: GlobalService) {

  }

  ngOnInit() {
    this.GetList();
  }



  GetList() {

    let SearchData = {
      pkid: '',
      type: ''
    }

    SearchData.pkid = this._pkid;
    SearchData.type = this._type;


    this.mainservice.GetRecord(SearchData).subscribe(response => {
      this.RecordList = response.record.ShipmentStageList;
    }, error => {
      alert(this.gs.getError(error));
    });

  }

  Save() {

    let SearchData: VmShipmentStage = new VmShipmentStage;
    SearchData.pkid = this._pkid;
    SearchData.type = this._type;

    SearchData.ShipmentStageList = this.RecordList;
    SearchData._globalvariables = this.gs.globalVariables;

    this.mainservice.Save(SearchData).subscribe(response => {
      this.RecordList = response.record.ShipmentStageList;
      this.callbackevent.emit({ stage: response.record.stage_name })
      alert("Save Complete");
    }, error => {
      alert(this.gs.getError(error));
    });

  }

  ShowHistory(history: any) {
    this.open(history);
  }

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }


}
