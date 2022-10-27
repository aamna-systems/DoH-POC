import { Component, OnInit } from '@angular/core';
import { FilterFormData } from './models/filter.model';
import { DataShareService } from './services/data-share.service';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isFilterOpen: boolean = false;
  showMapType: string = 'mapOne';
  formValue: FilterFormData;

  constructor(private dataShareService: DataShareService) {}

  ngOnInit(): void {}

  onToggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  onToggleViewClustorMap(mapType: string): void {
    this.showMapType = mapType;
  }

  // onResetCoordinates(): void {
  //   this.dataShareService.coordinatesReset.next();
  // }
}
