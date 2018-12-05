
import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../services/global.service';


@Component({
    selector: 'app-home',
    templateUrl : './home.component.html'
})
export class HomeComponent {
    title = "";
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }


}
