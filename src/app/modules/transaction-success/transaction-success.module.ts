import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionSuccessComponent } from './transaction-success.component';
const routes: Routes = [
  {
    path: '',
    component: TransactionSuccessComponent,
  },
];

@NgModule({
  declarations: [TransactionSuccessComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class TransactionSuccessModule {}
