import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistorychatPage } from './historychat';

@NgModule({
  declarations: [
    HistorychatPage,
  ],
  imports: [
    IonicPageModule.forChild(HistorychatPage),
  ],
})
export class HistorychatPageModule {}
