
import { GlobalVariables } from '../../core/models/globalvariables';

export class OsRep {

  row_type: string;
  row_colour: string;

  caption: string;

  branch: string;
  branch_code: string;

  smanid: string;
  sman: string;
  party: string;
  invno: string;
  invdate: string;


  jv_od_type: string;
  jv_od_remarks: string;

  age1: number;
  age2: number;
  age3: number;
  age4: number;
  age5: number;
  age6: number;

  overdue: number; 
  balance: number;
  advance: number;
  legal: number;
  oneyear: number;
  _globalvariables: GlobalVariables;
}
