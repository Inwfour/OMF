import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsCameraPage } from './tabs-camera';

@NgModule({
  declarations: [
    TabsCameraPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsCameraPage),
  ],
})
export class TabsCameraPageModule {}
