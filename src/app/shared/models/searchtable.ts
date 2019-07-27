export class SearchTable {
    controlname: string = '';
    displaycolumn: string = '';
    type: string = '';
    parentid: string = '';
    where: string = '';
    id: string;
    code: string;
    name: string;
    rate: number = 0;
    col1: string;
    col2: string;
    col3: string;
    col4: string;
    col5: string;
    col6: string;
    col7: string;
    constructor(_controlname: string = '',
        _type: string = '',
        _displaycolumn: string = '',
        _id: string ='',
        _parentid: string = '',
        _where: string = '',
        _code: string ='',
        _name: string ='',
        _rate: number = 0,
        _col1: string ='',
        _col2: string='',
        _col3: string = '',
        _col4: string = '',
        _col5: string = '',
        _col6: string = '',
        _col7: string = ''
    ){
        this.controlname = _controlname;
        this.displaycolumn = _displaycolumn;
        this.type = _type;
        this.id = _id;
        this.parentid = _parentid;
        this.where = _where;
        this.code = _code;
        this.name = _name;
        this.rate = _rate;
        this.col1 = _col1;
        this.col2 = _col2;
        this.col3 = _col3;
        this.col4 = _col4;
        this.col5 = _col5;
        this.col6 = _col6;
        this.col7 = _col7;
    }
}


