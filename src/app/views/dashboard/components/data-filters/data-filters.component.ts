import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DataShareService } from '../../services/data-share.service';
@Component({
  selector: 'app-data-filters',
  templateUrl: './data-filters.component.html',
  styleUrls: ['./data-filters.component.scss'],
})
export class DataFiltersComponent implements OnInit, OnDestroy {
  filterDataForm: FormGroup;
  private patientRegionSub: Subscription;
  private schoolRegionSub: Subscription;
  private occupationRegionSub: Subscription;

  /* DROPDOWN */
  dropdownSettings;
  emirateList: string[];
  selectedEmirateList: string[];
  genderList: string[];
  ageGroupList: string[];
  nationalityList: string[];
  residencyStatusList: string[];
  regionList: string[];
  zoneList: string[];
  patientZoneList: string[];
  schoolZoneList: string[];
  occupationZoneList: string[];
  residenceTypeList: string[];
  patientBuildingNameList: string[];
  patientAreaList: string[];
  // schoolAreaList: string[];
  instituteTypeList: string[];
  schoolNameList: string[];
  classSectionList: string[];
  classNumberList: string[];
  occupationNameList: string[];
  employerNameList: string[];
  placeofWorkList: string[];
  occupationAreaList: string[];
  covidVaccineStatusList: string[];
  performingFacilityList: string[];
  referringFacilityList: string[];

  constructor(
    private toastr: ToastrService,
    private dataShareService: DataShareService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.configureDropdowns();
    this.updateZoneBasedOnRegion();
  }

  configureDropdowns(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.emirateList = [
      // 'Abu Dhabi',
      'Dubai',
      // 'Sharjah',
      // 'Ajman',
      // 'Umm Al-Quwain',
      // 'Fujairah',
      // 'Ras Al Khaimah',
    ];

    this.selectedEmirateList = ['Dubai'];

    this.genderList = ['Female', 'Male'];

    this.ageGroupList = ['0-14', '15-19', '20-24', '25-29'];

    this.nationalityList = ['UAE', 'India', 'Pakistan', 'Egypt'];

    this.residencyStatusList = [
      'UAE Citizen',
      'Resident Expatriate',
      'Tourist',
    ];

    // this.regionList = ['ABU DHABI', 'AL AIN', 'AL DHAFRA'];
    this.regionList = ['Bur Dubai', 'Deira', 'Jumeirah'];

    this.zoneList = [
      'Zone 1',
      'Zone 2',
      'Zone 3',
      'Zone 4',
      'Zone 5',
      'Zone 6',
      'Zone 7',
    ];

    this.patientZoneList =
      this.schoolZoneList =
      this.occupationZoneList =
        this.zoneList;

    this.residenceTypeList = ['Villa', 'Apartment', 'Hotel'];

    this.patientBuildingNameList = [
      'Hotel Tulip',
      'Al Khoory Hotel Apartments',
      'Saffron Hotel',
      'Garden Homes Frond O',
    ];

    this.patientAreaList = ['Bur Dubai', 'Deira', 'Palm Jumeirah'];

    // this.schoolAreaList = ['Al Qusais', 'Al Warqa', 'Al Barsha South', 'DAMAC Hills'];

    this.instituteTypeList = ['School', 'College', 'University'];

    this.schoolNameList = [
      'The Westminster School',
      'International Academic School',
      'Nord Anglia International School',
      'Gems Metropole School',
    ];

    this.classSectionList = ['A', 'B', 'C', 'D'];
    this.classNumberList = ['1', '2', '3', '4'];

    this.occupationNameList = [
      'Procurement Officer',
      'IT Manager',
      'HR Manager',
      'Doctor',
    ];

    this.employerNameList = [
      'Dubai Health Authority',
      'Microsoft',
      'TechVista Systems',
    ];

    this.placeofWorkList = [
      'Al Kifaf building',
      'Microsoft Dubai office Building',
      'The Exchange Tower Building',
      'Latifa Tower Building',
    ];

    // this.occupationAreaList = [ 'Zabeel', 'Dubai Knowledge Park', 'Business Bay', 'World Trade Centre', ];
    this.occupationAreaList = this.patientAreaList;

    this.covidVaccineStatusList = ['Yes', 'No'];

    this.performingFacilityList = [
      'AH Yahar Health Center',
      'AH HMSAA Center',
      'Lanzhou Institute of Biological Products Co. LTD, China',
      "AH Mushrif Children's Speciality Center",
    ];

    this.referringFacilityList = [
      'AH Yahar Health Center',
      'AH HMSAA Center',
      'Lanzhou Institute of Biological Products Co. LTD, China',
      "AH Mushrif Children's Speciality Center",
    ];
  }

  createForm(): void {
    this.filterDataForm = new FormGroup({
      noOfCases: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
      patientDemographics: new FormGroup({
        // fullname: new FormControl(null),
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
        // typeOfResidence: new FormControl(null),
        // buildingName: new FormControl(null),
        // apartmentNumber: new FormControl(null),
        // area: new FormControl(null),
        // streetNumber: new FormControl(null),
      }),
      occuapation: new FormGroup({
        occupationName: new FormControl(null),
        employerName: new FormControl(null),
        placeOfWork: new FormControl(null),
        // Employer Address
        emirate: new FormControl(null),
        region: new FormControl(null),
        zone: new FormControl(null),
        // typeOfResidence: new FormControl(null),
        // buildingName: new FormControl(null),
        // apartmentNumber: new FormControl(null),
        area: new FormControl(null),
        // streetNumber: new FormControl(null),
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

  updateZoneBasedOnRegion(): void {
    const patientRegion = this.filterDataForm.get('patientAddress.region');
    const schoolRegion = this.filterDataForm.get('school.region');
    const occupationRegion = this.filterDataForm.get('occuapation.region');

    const patientZone = this.filterDataForm.get('patientAddress.zone');
    const schoolZone = this.filterDataForm.get('school.zone');
    const occupationZone = this.filterDataForm.get('occuapation.zone');

    this.patientRegionSub = patientRegion.valueChanges.subscribe(() => {
      this.patientZoneList = this.checkRegionSetZone(
        patientRegion,
        patientZone
      );
    });

    this.schoolRegionSub = schoolRegion.valueChanges.subscribe(() => {
      this.schoolZoneList = this.checkRegionSetZone(schoolRegion, schoolZone);
    });

    this.occupationRegionSub = occupationRegion.valueChanges.subscribe(() => {
      this.occupationZoneList = this.checkRegionSetZone(
        occupationRegion,
        occupationZone
      );
    });
  }

  checkRegionSetZone(regionFormControl, zoneFormControl): string[] {
    const selectedRegionsArray: string[] = regionFormControl.value;
    let sectionZoneList: string[] = [];

    zoneFormControl.setValue(null);

    selectedRegionsArray.forEach((region) => {
      if (region === 'Bur Dubai') {
        sectionZoneList.push('Zone 5');
      } else if (region === 'Deira') {
        sectionZoneList.push('Zone 6');
      } else if (region === 'Jumeirah') {
        sectionZoneList.push('Zone 2');
      }
    });

    if (!sectionZoneList.length) {
      sectionZoneList = this.zoneList;
    }

    return sectionZoneList;
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
    // this.filterDataForm.reset();
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

  ngOnDestroy(): void {
    if (this.patientRegionSub) {
      this.patientRegionSub.unsubscribe();
    }

    if (this.schoolRegionSub) {
      this.schoolRegionSub.unsubscribe();
    }

    if (this.occupationRegionSub) {
      this.occupationRegionSub.unsubscribe();
    }
  }
}
