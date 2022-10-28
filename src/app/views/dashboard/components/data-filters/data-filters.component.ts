import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataShareService } from '../../services/data-share.service';
@Component({
  selector: 'app-data-filters',
  templateUrl: './data-filters.component.html',
  styleUrls: ['./data-filters.component.scss'],
})
export class DataFiltersComponent implements OnInit {
  filterDataForm: FormGroup;

  constructor(
    private toastr: ToastrService,
    private dataShareService: DataShareService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.filterDataForm = new FormGroup({
      noOfCases: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
      patientDemographics: new FormGroup({
        fullname: new FormControl(null),
        gender: new FormControl(null),
        ageGroup: new FormControl(null),
        dob: new FormControl(null),
        nationality: new FormControl(null),
        residencyStatus: new FormControl(null),
      }),
      patientAddress: new FormGroup({
        emirate: new FormControl(null),
        region: new FormControl(null),
        zone: new FormControl(null),
        typeOfResidence: new FormControl(null),
        buildingName: new FormControl(null),
        flatNumber: new FormControl(null),
        area: new FormControl(null),
        streetNumber: new FormControl(null),
      }),
      school: new FormGroup({
        instituteType: new FormControl(null),
        schoolName: new FormControl(null),
        classNumber: new FormControl(null),
        classSection: new FormControl(null),
        // Institute Address
        emirate: new FormControl(null),
        region: new FormControl(null),
        zone: new FormControl(null),
        typeOfResidence: new FormControl(null),
        buildingName: new FormControl(null),
        flatNumber: new FormControl(null),
        area: new FormControl(null),
        streetNumber: new FormControl(null),
      }),
      occuapation: new FormGroup({
        occupationName: new FormControl(null),
        employerName: new FormControl(null),
        placeOfWork: new FormControl(null),
        // Employer Address
        emirate: new FormControl(null),
        region: new FormControl(null),
        zone: new FormControl(null),
        typeOfResidence: new FormControl(null),
        buildingName: new FormControl(null),
        flatNumber: new FormControl(null),
        area: new FormControl(null),
        streetNumber: new FormControl(null),
      }),
      vaccination: new FormGroup({
        covidVaccineStatus: new FormControl(null),
      }),
      labTests: new FormGroup({
        testDate: new FormControl(null),
        sampleDate: new FormControl(null),
        performingFacility: new FormControl(null),
        referringFacility: new FormControl(null),
      }),
    });
  }

  onApplyFilters(): void {
    const formValue = this.filterDataForm.value;

    this.dataShareService.sendPatientData(formValue).subscribe(
      (res: any) => {
        console.log(res);
        this.showSuccess(res?.message);
      },
      (error: any) => {
        console.log(error);
        this.showError(error?.message);
      }
    );

    console.log(formValue);
    this.filterDataForm.reset();
  }

  showSuccess(success = 'Data successfully generated') {
    this.toastr.success(success, 'Success!', {
      timeOut: 5000,
      closeButton: true,
    });
  }

  showError(error = 'Data could not be generated') {
    this.toastr.error(error, 'Error!', {
      timeOut: 5000,
      closeButton: true,
    });
  }
}
