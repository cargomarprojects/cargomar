import { Component, OnDestroy , OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { GlobalService } from './core/services/global.service';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
    title = 'Application Root Page';
    loading = false;

    sub : any;

    constructor(
        public gs: GlobalService,
        private route : ActivatedRoute,
        private router: Router) {

        this.gs.InitdefaultValues();
        this.gs.RemoveLocalStorage();

        this.sub =  this.router.events.subscribe((event: Event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.loading = true;
                    break;
                }
                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.loading = false;
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }

    async ngOnInit() {

        const appid = this.gs.getURLParam('appid');
        this.gs.appid = appid;
        if (this.gs.isBlank(appid)) {
            this.router.navigate(['login'], { replaceUrl: true }); 
            return;
        }

        if (!this.gs.isAppidExtistsInLocalStorage()) 
            return ;
        this.gs.ReadLocalStorage();
        this.gs.reload_url =  window.location.pathname + window.location.search;
        this.router.navigate(['/reload']);
        
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }

}
