
import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../services/global.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent {
    title = "";
    constructor(
        private router: Router,        
        private http2: HttpClient,
        private gs: GlobalService) {

        if (!this.gs.IsLoginSuccess) {
            
            this.router.navigate(['login'], { replaceUrl: true });
        }
    }
}


