import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  GridModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { HttpClientModule } from '@angular/common/http';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { WidgetsModule } from '../widgets/widgets.module';
import { MapComponent } from './components/map/map.component';
import { DataFiltersComponent } from './components/data-filters/data-filters.component';
import { MapTwoComponent } from './components/map-two/map-two.component';
import { MapThreeComponent } from './components/map-three/map-three.component';

import { DataShareService } from './services/data-share.service';

@NgModule({
  imports: [
    DashboardRoutingModule,
    CardModule,
    NavModule,
    IconModule,
    TabsModule,
    CommonModule,
    GridModule,
    ProgressModule,
    ReactiveFormsModule,
    ButtonModule,
    // FormModule,
    HttpClientModule,
    FormsModule,
    ButtonModule,
    ButtonGroupModule,
    ChartjsModule,
    AvatarModule,
    TableModule,
    WidgetsModule,
  ],
  declarations: [
    DashboardComponent,
    MapComponent,
    DataFiltersComponent,
    MapTwoComponent,
    MapThreeComponent,
  ],
  providers: [DataShareService],
})
export class DashboardModule {}
