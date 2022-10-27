import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { MapTwoComponent } from './components/map-two/map-two.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: $localize`Dashboard`,
    },
  },
  // {
  //   path: 'map-two',
  //   component: MapTwoComponent,
  //   data: {
  //     title: $localize`New Map`,
  //   },
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
