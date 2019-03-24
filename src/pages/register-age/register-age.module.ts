import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterAgePage } from './register-age';

@NgModule({
  declarations: [
    RegisterAgePage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterAgePage),
  ],
})
export class RegisterAgePageModule {}
