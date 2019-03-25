import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPhotoPage } from './register-photo';

@NgModule({
  declarations: [
    RegisterPhotoPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterPhotoPage),
  ],
})
export class RegisterPhotoPageModule {}
