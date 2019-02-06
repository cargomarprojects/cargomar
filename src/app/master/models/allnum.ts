
import { GlobalVariables } from '../../core/models/globalvariables';
import { Bookblno } from './bookblno';

export class Allnum {
  table_pkid: string;
  table_name: string;
  table_prefix: string;
  table_year: number;
  table_company_code: string;
  table_branch_code: string;
  table_value: number;
  table_type: string;
  table_group: string;

  rec_mode: string;
  BlList: Bookblno[] = [];

  _globalvariables: GlobalVariables;
}

