import { GlobalVariables } from '../../core/models/globalvariables';

export class BankStmt {
  jvh_type: string;
  records: BankStmtDet[];
  rec_created_by: string;
  rec_created_date: string;
  _globalvariables: GlobalVariables;
}

export class BankStmtDet {
  date: string;
  valuedate: string;
  chqno: string;
  narration: string;
  cod: string;
  debit: string;
  credit: string;
  balance: string;
  branch: string;
  bank: string;

  acc_id: string;
  acc_code: string;
  acc_name: string;

  bank_id: string;
  bank_code: string;
  bank_name: string;

  status: string;
}
