
import { GlobalVariables } from '../../core/models/globalvariables';

export class Egm {

  cntr_no: string;
  job_docno: string;
  pol_code: string;
  egno: string;
  egdate: string; 
  opr_sbill_no: string;
  opr_sbill_date: string;


  job_cargo_nature: string;
  pol: string;
  pkg_unit: string;
  pofd_code: string;
  commodity: string;
  exporter: string;
  exp_add1: string;
  exp_add2: string;
  exp_add3: string;
  importer: string;
  imp_add1: string;
  imp_add2: string;
  imp_add3: string;

  job_qty: number;
  job_grwt: number;
  job_pkg: number;
  shut_out_qty: number; 
  

  _globalvariables: GlobalVariables;
}
