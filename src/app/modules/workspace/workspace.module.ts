import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { WorkspacePlanComponent } from './workspace-plan/workspace-plan.component';
import { WorkSpaceRoutingModule } from './workspace-routing.module';
import { WorkSpaceComponent } from './workspace.component';
import { WorkspaceTimingComponent } from './workspace-timing/workspace-timing.component';

import { MicroLocationPipe, WorkspaceSimilarComponent } from './workspace-similar/workspace-similar.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    WorkSpaceComponent,
    WorkspacePlanComponent,
    WorkspaceTimingComponent,
    WorkspaceSimilarComponent,
    MicroLocationPipe,
  ],
  imports: [CommonModule, SharedModule, WorkSpaceRoutingModule, LeafletModule],
})
export class WorkSpaceModule {}
