import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShipmentStage, VmShipmentStage } from '../models/shipment-stage';
import { ShipmentStageService } from '../services/shipment-stage.service';

@Component({
  selector: 'app-shipment-stage',
  templateUrl: './shipment-stage.component.html'
})
export class ShipmentStageComponent implements OnInit {

  public errorMessage: string = '';
  public tab: string = 'main';

  private _parentid: string = '';
  @Input() set parentid(value: string) {
    this._parentid = value;
  }

  private _type: string = '';
  @Input() set type(value: string) {
    this._type = value;
  }

  @Output() callbackevent = new EventEmitter<any>();
  RecordList: ShipmentStage[] = [];

  modal: any;
  loading = false;
  constructor(
    private modalService: NgbModal,
    private http2: HttpClient,
    private mainservice: ShipmentStageService,
    private gs: GlobalService) {

  }

  ngOnInit() {

  }

  CloseModal(_type: string) {
    if (_type == "OK") {
      this.SaveRecord();
    } else
      this.modal.close();
  }


  GetList(memmodal: any = null) {

    let SearchData = {
      parentid: '',
      type: ''
    }

    SearchData.parentid = this._parentid;
    SearchData.type = this._type;

    this.mainservice.List(SearchData).subscribe(response => {
      this.RecordList = response.list;
      this.open(memmodal);

    }, error => {
      alert(this.gs.getError(error));
    });

  }

  SaveRecord() {

    if (this.gs.isBlank(this._parentid)) {
      alert('Invalid ID');
      return;
    }

    let SearchData: VmShipmentStage = new VmShipmentStage;
    SearchData.List = this.RecordList;
    SearchData._globalvariables = this.gs.globalVariables;

    this.mainservice.Save(SearchData).subscribe(response => {
      //this.modal.close();

    }, error => {
      alert(this.gs.getError(error));
    });

  }

  open(content: any) {
    this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: true, windowClass: 'modal-custom' });
  }

}
