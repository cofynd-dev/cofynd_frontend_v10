import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkationRoutingModule } from './workation-routing.module';
import { BirComponent } from './bir/bir.component';
import { RishikeshComponent } from './rishikesh/rishikesh.component';
import { UdaipurComponent } from './udaipur/udaipur.component';
import { McloadganjComponent } from './mcloadganj/mcloadganj.component';
import { KochiComponent } from './kochi/kochi.component';
import { ManaliComponent } from './manali/manali.component';
import { JaipurComponent } from './jaipur/jaipur.component';
import { MumbaiComponent } from './mumbai/mumbai.component';
import { VaranasiComponent } from './varanasi/varanasi.component';
import { AmritsarComponent } from './amritsar/amritsar.component';
import { AlleppeyComponent } from './alleppey/alleppey.component';
import { MunnarComponent } from './munnar/munnar.component';
import { SharedModule } from '@app/shared/shared.module';
import { PalampurComponent } from './palampur/palampur.component';
import { DalhousieComponent } from './dalhousie/dalhousie.component';
import { LehComponent } from './leh/leh.component';
import { MussoorieComponent } from './mussoorie/mussoorie.component';
import { NaggarComponent } from './naggar/naggar.component';
import { DelhiComponent } from './delhi/delhi.component';

@NgModule({
  declarations: [
    BirComponent,
    RishikeshComponent,
    UdaipurComponent,
    McloadganjComponent,
    KochiComponent,
    ManaliComponent,
    JaipurComponent,
    MumbaiComponent,
    VaranasiComponent,
    AmritsarComponent,
    AlleppeyComponent,
    MunnarComponent,
    PalampurComponent,
    DalhousieComponent,
    LehComponent,
    MussoorieComponent,
    NaggarComponent,
    DelhiComponent,],
  imports: [
    CommonModule,
    WorkationRoutingModule,
    SharedModule
  ]
})
export class WorkationModule { }
