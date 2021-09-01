import { Component } from '@angular/core';
import { environment } from '../environments/environment';

import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';

import { LoadingScreenService } from './core/services/loadingscreen.service';
import { GlobalService } from './core/services/global.service';


import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-reload',
  templateUrl: './reload.component.html'
})
export class ReloadComponent {

  loading = false;
  constructor(
    public gs: GlobalService,
    public loadingservice: LoadingScreenService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {


  }

  async ngOnInit() {
  
    this.gs.ReadLocalStorage();

    let url = this.gs.reload_url;
    this.gs.reload_url = '';
    if (url == '') {
      this.router.navigate(['home'], { replaceUrl: true });
    }
    
    var iRet = await this.gs.Login(this.gs.globalVariables.user_code, this.gs.globalVariables.user_pwd, this.gs.globalVariables.user_company_code);
        
    if (iRet != 0) {
      this.router.navigate(['login'], { replaceUrl: true });
      return;
    }
    if (this.gs.baseLocalServerUrl != "") {
      iRet = await this.gs.checkLocalServer();
      if (iRet != 0)
        this.router.navigate(['login'], { replaceUrl: true });
      return;
    }

    const bRet = await this.gs.LoadMenu(this.gs.globalVariables.branch_pkid, this.gs.globalVariables.year_pkid);
    if (iRet != 0) {
      this.router.navigate(['login'], { replaceUrl: true });
      return;
    }

    var _old_appid = 'appid='+this.gs.appid;
    this.gs.CreateAppId();
    var _new_appid = 'appid='+this.gs.appid;
    url = url.replace(_old_appid, _new_appid );

    const Record  = this.gs.getAppDetailsRecord();
    const iRet1 =  await this.gs.saveAppDetails(Record);

    this.router.navigateByUrl(url, { replaceUrl: true });

  }


  ngOnDestroy() {

  }


}
