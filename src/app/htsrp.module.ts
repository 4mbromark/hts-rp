import { HtsRpService } from './htsrp.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { HtsRpComponent } from './htsrp.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HtsRpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    HtsRpService
  ],
  bootstrap: [
    HtsRpComponent
  ]
})
export class HtsRpModule { }
