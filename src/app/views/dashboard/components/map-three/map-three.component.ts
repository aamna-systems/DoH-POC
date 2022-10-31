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
import { ToastrService } from 'ngx-toastr';

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

  private resCoordinates;
  center: { lat: number; lng: number } = { lat: 25.2048, lng: 55.2708 }; // Dubai

  constructor(
    private toastr: ToastrService,
    private dataShareService: DataShareService
  ) {}

  ngOnInit(): void {
    this.dataShareService.getPatientData().subscribe(
      (res: any) => {
        this.resCoordinates = res;
        this.center = {
          lat: res[0]?.patientAddress?.latitude ?? 25.2048,
          lng: res[0]?.patientAddress?.longitude ?? 55.2708,
        };

        this.mapConfiguration();

        console.log(res);
        console.log('CENTER', this.center);
        this.showSuccess(res?.message);
      },
      (error: any) => {
        this.resCoordinates = [];
        this.center = { lat: 25.2048, lng: 55.2708 }; // Dubai

        this.mapConfiguration();

        console.log(error);
        this.showError(error?.message);
      }
    );
  }

  mapConfiguration(): void {
    document.getElementById('map-three').innerHTML = '';
    let randomGeoPoints = this.resCoordinates;
    this.count = randomGeoPoints?.length;

    if (this.count) {
      let co = [];
      for (let i = 0; i < this.count; i++) {
        co.push({
          lng: randomGeoPoints[i]['patientAddress'].longitude,
          lat: randomGeoPoints[i]['patientAddress'].latitude,
        });
      }
      console.log('coord - ', co);

      this.features = new Array(this.count);
      for (var i = 0; i < this.count; ++i) {
        var coordinates = [parseFloat(co[i].lng), parseFloat(co[i].lat)];
        this.features[i] = new Feature(
          new Point(proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857'))
        );
      }
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
        center: proj.fromLonLat([this.center.lng, this.center.lat]),
        zoom: 13,
        projection: 'EPSG:3857',
      }),
      // controls: [],
    });
  }

  showSuccess(success = 'Data successfully fetched') {
    this.toastr.success(success, 'Success!', {
      timeOut: 5000,
      closeButton: true,
    });
  }

  showError(error = 'Data could not be fetched') {
    this.toastr.error(error, 'Error!', {
      timeOut: 5000,
      closeButton: true,
    });
  }

  ngOnDestroy(): void {
    if (this.formValueSub) {
      this.formValueSub.unsubscribe();
    }
  }
}
