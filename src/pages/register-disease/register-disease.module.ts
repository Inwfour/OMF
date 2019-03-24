import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterDiseasePage } from './register-disease';

@NgModule({
  declarations: [
    RegisterDiseasePage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterDiseasePage),
  ],
})
export class RegisterDiseasePageModule {}
