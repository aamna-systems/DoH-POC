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
import { DataShareService } from '../../services/data-share.service';
import { FilterFormData } from '../../models/filter.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
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
  source;
  clusterSource;
  styleCache;
  clusters;
  raster;
  center: any;
  constructor(private dataShareService: DataShareService) {}

  ngOnInit(): void {
    // this.distanceInput = "40"
    // this.minDistanceInput = "20"

    this.formValueSub = this.dataShareService.formValueChanged.subscribe(
      (formValue: FilterFormData) => {
        this.formValue = formValue;
        this.emirate = this?.formValue?.emirate ?? 'dubai';
        this.coordinates = this.dataShareService.getCoordinates(this.emirate);
        this.logEmirateData();
        this.mapConfiguration();
      }
    );
  }

  mapConfiguration(): void {
    document.getElementById('map').innerHTML = '';
    let randomGeoPoints = this.dataShareService.generateRandomPoints(
      this.coordinates,
      20000,
      10000
    );
    // console.log("COORD - ", this.coordinates)
    // this.count = 20000;
    // this.features = new Array(this.count);
    // this.e = 4500000;
    // for (let i = 0; i < this.count; ++i) {
    //   const coordinates = [
    //     2 * this.e * Math.random() - this.e,
    //     2 * this.e * Math.random() - this.e,
    //   ];
    //   this.features[i] = new Feature(new Point(coordinates));
    // }

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

    // this.coordinatesSub = this.dataShareService.coordinatesReset.subscribe(() => this.resetCoordinates());

    // this.count = 20000;
    this.features = new Array(this.count);
    for (var i = 0; i < this.count; ++i) {
      var coordinates = [parseFloat(co[i].lng), parseFloat(co[i].lat)];
      this.features[i] = new Feature(
        new Point(proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857'))
      );
    }

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
        var style = styleCache[size];
        // let color = size >= 100 ? 'green' : 'red';
        // let rad = size >= 100 ? 15 : 10;
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: 15,
              // radius: rad,
              fill: new Fill({
                color: '#007bff',
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
      target: 'map',
      // interactions: [],
      view: new View({
        // center: proj.fromLonLat([144.847275, 13.566806]),
        center: proj.fromLonLat([this.coordinates.lng, this.coordinates.lat]),
        zoom: 10,
        projection: 'EPSG:3857',
      }),
      // controls: [],
    });
  }

  resetCoordinates(): void {
    this.emirate = 'dubai';
    this.coordinates = { lat: 25.2048, lng: 55.2708 };
    console.log('COORDINATES RESET...');
    this.logEmirateData();
  }

  logEmirateData(): void {
    console.log('Component: Map 1');
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
