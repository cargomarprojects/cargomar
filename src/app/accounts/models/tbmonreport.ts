
import { GlobalVariables } from '../../core/models/globalvariables';

export class TBMonReport {
    rowtype: string;
    rowcolor: string;
    acgrp_order: number;
    main_group: string;
    sub_group: string;
    acc_code: string;
    acc_name: string;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
    jan: number;
    feb: number;
    mar: number;
    tot_dr: number;
    tot_cr: number;

    rec_mode: string;
    _globalvariables: GlobalVariables;
}
