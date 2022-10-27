import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataShareService } from '../../services/data-share.service';

@Component({
  selector: 'app-data-filters',
  templateUrl: './data-filters.component.html',
  styleUrls: ['./data-filters.component.scss'],
})
export class DataFiltersComponent implements OnInit {
  filterDataForm: FormGroup;

  constructor(private dataShareService: DataShareService) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.filterDataForm = new FormGroup({
      emirate: new FormControl(null),
      gender: new FormControl(null),
      area: new FormControl(null),
      performingFacility: new FormControl(null),
      referringFacility: new FormControl(null),
      testDate: new FormControl(null),
      occupation: new FormControl(null),
      sponsorName: new FormControl(null),
    });
  }

  onApplyFilters(): void {
    const formValue = this.filterDataForm.value;
    this.dataShareService.setFilterFormValue(formValue);
    this.filterDataForm.reset();
  }
}
