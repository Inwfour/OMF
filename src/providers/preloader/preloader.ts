import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class PreloaderProvider {
  private loading : any;
  constructor(public http             : Http,
              public loadingCtrl      : LoadingController
    ) {
    
  }

  displayPreloader()
   {
     if(!this.loading){
     this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`

    }); this.loading.present();
   }
   }

   hidePreloader()
   {
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
  }
   }

   setcontentPreloader(text:any)
   {
    this.loading.setContent(text);
   }

}
