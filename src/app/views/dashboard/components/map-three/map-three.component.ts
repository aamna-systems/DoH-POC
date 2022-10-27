import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { Cluster, OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { boundingExtent } from 'ol/extent';
import * as proj from 'ol/proj';
import * as layer from 'ol/layer';
import { FilterFormData } from '../../models/filter.model';
import { DataShareService } from '../../services/data-share.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-three',
  templateUrl: './map-three.component.html',
  styleUrls: ['./map-three.component.scss'],
})
export class MapThreeComponent implements OnInit, OnDestroy {
  formValue: FilterFormData;
  private formValueSub: Subscription;
  // private coordinatesSub: Subscription;
  private emirate;
  private coordinates;

  public map!: Map;
  public newMap!: Map;
  distanceInput;
  minDistanceInput;

  count;
  features;
  e;
  // for (let i = 0; i < count; ++i) {
  //   const coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
  //   features[i] = new Feature(new Point(coordinates));
  // }

  source;

  clusterSource;

  styleCache;
  clusters;

  raster;

  constructor(private dataShareService: DataShareService) {}

  ngOnInit(): void {
    this.formValueSub = this.dataShareService.formValueChanged.subscribe(
      (formValue: FilterFormData) => {
        this.formValue = formValue;
        this.emirate = this?.formValue?.emirate ?? 'dubai';
        this.coordinates = this.dataShareService.getCoordinates(this.emirate);
        this.logEmirateData();
        this.mapConfiguration();
      }
    );

    // this.coordinatesSub = this.dataShareService.coordinatesReset.subscribe(() => this.resetCoordinates());
  }

  mapConfiguration(): void {
    document.getElementById('map-three').innerHTML = '';
    // Usage Example.
    // Generates 100 points that is in a 1km radius from the given lat and lng point.
    var randomGeoPoints = this.generateRandomPoints(
      this.coordinates,
      10000,
      1000
    ); //[lat: 23.4241, lng: 53.8478] - UAE /
    console.log('LANG-LOT ', randomGeoPoints);

    // this.distanceInput = "40"
    // this.minDistanceInput = "20"
    // this.count = 20000;
    // this.features = new Array(this.count);
    this.e = 4500000;
    console.log('GEO POINTS - ', randomGeoPoints.length, randomGeoPoints);
    this.count = randomGeoPoints.length;
    let co = [];
    for (let i = 0; i < this.count; i++) {
      co.push({ lng: randomGeoPoints[i].lng, lat: randomGeoPoints[i].lat });
    }
    console.log('coord - ', co);

    // if(randomGeoPoints.length > 0){
    //   var count = 0;
    //   let co = [];
    // for (let key in mapData) {
    //   count += mapData[key].length;
    //   mapData[key].forEach((item) => {
    //     co.push({ lng: item.lng, lat: item.lat });
    //   });
    // }

    this.features = new Array(this.count);
    for (var i = 0; i < this.count; ++i) {
      var coordinates = [parseFloat(co[i].lng), parseFloat(co[i].lat)];
      this.features[i] = new Feature(
        new Point(proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857'))
      );
    }
    // this.features = new Array(randomGeoPoints.length);
    // for (let i = 0; i < randomGeoPoints.length; i++) {
    //   const coordinates = [
    //     randomGeoPoints[i]['lat'],
    //     randomGeoPoints[i]['lng'],
    //   ];
    //   console.log('coord - ', coordinates);

    //   this.features[i] = new Feature(new Point(coordinates));
    // }
    // console.log('features - ', this.features);

    // for (let i = 0; i < this.count; ++i) {
    //   const coordinates = [
    //     2 * this.e * Math.random() - this.e,
    //     2 * this.e * Math.random() - this.e,
    //   ];
    //   console.log("coord - ", coordinates);

    //   this.features[i] = new Feature(new Point(coordinates));
    // }

    // console.log("clustor -", this.clusterSource);
    console.log('features - ', this.features);

    var source = new VectorSource({
      features: this.features,
    });

    var clusterSource = new Cluster({
      distance: parseInt('60'),
      source: source,
    });

    var styleCache = {};
    var clusters = new layer.Vector({
      source: clusterSource,
      style: function (feature) {
        var size = feature.get('features').length;
        console.log('size - ', size);

        var style = styleCache[size];
        // let color = size >= 100 ? 'green' : 'red';
        // let rad = size >= 100 ? 15 : 10;
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: 15,
              // radius: rad,
              fill: new Fill({
                // color: '#007bff',
                color: 'purple',
                // color: color,
              }),
            }),
            text: new Text({
              text: size.toString(),
              font: 'bold',
              scale: 1.5,
              fill: new Fill({
                color: '#fff',
              }),
            }),
          });
          styleCache[size] = style;
        }
        return style;
      },
    });

    var raster = new TileLayer({
      source: new OSM(),
    });

    var map = new Map({
      layers: [raster, clusters],
      target: 'map-three',
      // interactions: [],
      view: new View({
        // center: proj.fromLonLat([144.847275, 13.566806]),
        center: proj.fromLonLat([this.coordinates.lng, this.coordinates.lat]),
        zoom: 13,
        projection: 'EPSG:3857',
      }),
      // controls: [],
    });
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

  resetCoordinates(): void {
    this.emirate = 'dubai';
    this.coordinates = { lat: 25.2048, lng: 55.2708 };
    console.log('COORDINATES RESET...');
    this.logEmirateData();
  }

  logEmirateData(): void {
    console.log('Component: Map 3');
    console.log('Emirate:', this.emirate);
    console.log('Coordinates:', this.coordinates);
    console.log('----');
  }

  ngOnDestroy(): void {
    if (this.formValueSub) {
      this.formValueSub.unsubscribe();
    }

    // if(this.coordinatesSub) {
    //   this.coordinatesSub.unsubscribe();
    // }
  }
}
