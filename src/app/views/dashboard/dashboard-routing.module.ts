import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { MapTwoComponent } from './components/map-two/map-two.component';
import { MapThreeComponent } from './components/map-three/map-three.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: $localize`Data Generator`,
    },
  },
  {
    path: 'map-two',
    component: MapTwoComponent,
    data: {
      title: $localize`International Outbreak`,
    },
  },
  {
    path: 'map-three',
    component: MapThreeComponent,
    data: {
      title: $localize`Epidemic Visualization`,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
