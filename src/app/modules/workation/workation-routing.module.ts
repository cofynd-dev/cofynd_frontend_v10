import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlleppeyComponent } from './alleppey/alleppey.component';
import { AmritsarComponent } from './amritsar/amritsar.component';
import { BirComponent } from './bir/bir.component';
import { DalhousieComponent } from './dalhousie/dalhousie.component';
import { DelhiComponent } from './delhi/delhi.component';
import { JaipurComponent } from './jaipur/jaipur.component';
import { KochiComponent } from './kochi/kochi.component';
import { LehComponent } from './leh/leh.component';
import { ManaliComponent } from './manali/manali.component';
import { McloadganjComponent } from './mcloadganj/mcloadganj.component';
import { MumbaiComponent } from './mumbai/mumbai.component';
import { MunnarComponent } from './munnar/munnar.component';
import { MussoorieComponent } from './mussoorie/mussoorie.component';
import { NaggarComponent } from './naggar/naggar.component';
import { PalampurComponent } from './palampur/palampur.component';
import { RishikeshComponent } from './rishikesh/rishikesh.component';
import { UdaipurComponent } from './udaipur/udaipur.component';
import { VaranasiComponent } from './varanasi/varanasi.component';
// import { WorkationComponent } from './workation.component';


const routes: Routes = [
  {
    path: 'gostops-bir',
    component: BirComponent,
  },
  {
    path: 'gostops-rishikesh',
    component: RishikeshComponent
  },
  {
    path: 'gostops-udaipur',
    component: UdaipurComponent
  },
  {
    path: 'gostops-mcleodganj',
    component: McloadganjComponent
  },
  {
    path: 'gostops-kochi',
    component: KochiComponent
  },
  {
    path: "gostops-manali",
    component: ManaliComponent
  },
  {
    path: "gostops-jaipur",
    component: JaipurComponent
  },
  {
    path: "gostops-mumbai",
    component: MumbaiComponent
  },
  {
    path: "gostops-varanasi",
    component: VaranasiComponent
  },
  {
    path: "gostops-amritsar",
    component: AmritsarComponent
  },
  {
    path: "gostops-alleppey",
    component: AlleppeyComponent
  },
  {
    path: "gostops-munnar",
    component: MunnarComponent
  },
  {
    path: "gostops-palampur",
    component: PalampurComponent
  },
  {
    path: "gostops-dalhousie",
    component: DalhousieComponent
  },
  {
    path: "gostops-leh",
    component: LehComponent
  },
  {
    path: "gostops-mussoorie",
    component: MussoorieComponent
  },
  {
    path: "gostops-naggar",
    component: NaggarComponent
  },
  {
    path: "gostops-delhi",
    component: DelhiComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkationRoutingModule { }
