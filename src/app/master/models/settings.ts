
import { GlobalVariables } from '../../core/models/globalvariables';

export class Settings {
  parentid: string;
  tablename: string;
  caption: string;
  id: string;
  code: string;
  name: string;
  tabletype: string;
  
}

export class Settings_VM {
  RecordDet: Settings[] = [];
  _globalvariables: GlobalVariables;
}

export class Lockingm {
  lock_pkid: string;
  lock_year: number;
  lock_ar: string;
  lock_ap: string;
  lock_drn: string;
  lock_crn: string;
  lock_dri: string;
  lock_cri: string;
  lock_cr: string;
  lock_cp: string;
  lock_br: string;
  lock_bp: string;
  lock_jv: string;
  lock_cjv: string;

  _globalvariables: GlobalVariables;
}

