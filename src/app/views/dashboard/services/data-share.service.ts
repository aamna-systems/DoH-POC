import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { FilterFormData } from '../models/filter.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataShareService {
  private filterFormValue: FilterFormData;
  public formValueChanged = new BehaviorSubject<FilterFormData>(null);
  // public coordinatesReset = new Subject<void>();

  constructor(private http: HttpClient) {}

  setFilterFormValue(formValue: FilterFormData): void {
    this.filterFormValue = formValue;

    this.formValueChanged.next(this.filterFormValue);
  }

  getCoordinates(emirateName: string): { lat: number; lng: number } {
    if (emirateName) {
      const emirate = emirateName.toLowerCase();
      if (emirate.toLowerCase() === 'abu dhabi') {
        return { lat: 24.466667, lng: 54.366669 };
      } else if (emirate.toLowerCase() === 'dubai') {
        return { lat: 25.2048, lng: 55.2708 };
      } else if (emirate.toLowerCase() === 'sharjah') {
        return { lat: 25.357119, lng: 55.391068 };
      } else if (emirate.toLowerCase() === 'ajman') {
        return { lat: 25.400073, lng: 55.481698 };
      } else if (emirate.toLowerCase() === 'umm al-quwain') {
        return { lat: 25.520482, lng: 55.713391 };
      } else if (emirate.toLowerCase() === 'fujairah') {
        return { lat: 25.11899, lng: 56.34956 };
      } else if (emirate.toLowerCase() === 'ras al khaimah') {
        return { lat: 25.983932, lng: 56.075012 };
      }
    }

    return { lat: 25.2048, lng: 55.2708 };
  }

  /**
   * Generates number of random geolocation points given a center and a radius.
   * @param  {Object} center A JS object with lat and lng attributes.
   * @param  {number} radius Radius in meters.
   * @param {number} count Number of points to generate.
   * @return {array} Array of Objects with lat and lng attributes.
   */
  generateRandomPoints(center, radius, count) {
    var points = [];
    for (var i = 0; i < count; i++) {
      points.push(this.generateRandomPoint(center, radius));
    }
    return points;
  }

  /**
   * Generates number of random geolocation points given a center and a radius.
   * Reference URL: http://goo.gl/KWcPE.
   * @param  {Object} center A JS object with lat and lng attributes.
   * @param  {number} radius Radius in meters.
   * @return {Object} The generated random points as JS object with lat and lng attributes.
   */
  generateRandomPoint(center, radius) {
    var x0 = center.lng;
    var y0 = center.lat;
    // Convert Radius from meters to degrees.
    var rd = radius / 111300;

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    var xp = x / Math.cos(y0);

    // Resulting point.
    return { lat: y + y0, lng: xp + x0 };
  }

  sendPatientData(formValue) {
    return this.http.post('http://localhost:5000/patient/', formValue);
  }
}
