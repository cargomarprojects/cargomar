import { GlobalVariables } from '../../core/models/globalvariables';

export class CiGeImport {
    jvh_type: string;
    records: CiGeImportDet[];
    rec_created_by: string;
    rec_created_date: string;
    _globalvariables: GlobalVariables;
}

export class CiGeImportDet {
    originalinvoiceno: string;
    originalinvoicedate: string;
    referenceno: string;
    referencedate: string;
    debitcode: string;
    debitamount: string;
    creditcode: string;
    creditamount: string;
    cgstrate: string;
    cgstamount: string;
    sgstrate: string;
    sgstamount: string;
    igstrate: string;
    igstamount: string;
    costcenter: string;
    costcentercode: string;
    branch: string;
    status: string;

}
