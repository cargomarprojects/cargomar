import { GlobalVariables } from '../../core/models/globalvariables';
export class ShipmentStage {
  stage_parent_id: string;
  stage_order: number;
  stage_name: string;
  stage_date_old: string;
  stage_date: string;
  stage_editable: string;
  stage_col_name: string;
}

export class VmShipmentStage {
  pkid: string;
  job_date: string;
  job_type: string;
  job_stage: string;
  job_stage_order: number;
  job_stage_col_name: string;
  ShipmentStageList: ShipmentStage[] = [];
  _globalvariables: GlobalVariables;
}
