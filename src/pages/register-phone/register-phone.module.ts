import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPhonePage } from './register-phone';

@NgModule({
  declarations: [
    RegisterPhonePage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterPhonePage),
  ],
})
export class RegisterPhonePageModule {}
