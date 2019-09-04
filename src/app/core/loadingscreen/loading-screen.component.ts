
import { Component, OnInit } from '@angular/core';
import { LoadingScreenService } from '../services/loadingscreen.service';

import { Subscription } from "rxjs";
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html'
  
})
export class LoadingScreenComponent implements OnInit {

  loading: boolean = false;
  loadingSubscription: Subscription;

  constructor(
    private loadingScreenService: LoadingScreenService
    ) {}

  ngOnInit() {

    this.loadingSubscription = this.loadingScreenService.loadingStatus.subscribe((value) => {
      
      this.loading = value;

    });

  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
