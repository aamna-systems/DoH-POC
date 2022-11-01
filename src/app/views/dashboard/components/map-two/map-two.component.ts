import { Component, OnInit } from '@angular/core';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Style, Text } from 'ol/style';
import { Cluster, OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import * as proj from 'ol/proj';
import * as layer from 'ol/layer';
import { Overlay } from 'ol';

import { FilterFormData } from '../../models/filter.model';
import { DataShareService } from '../../services/data-share.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-map-two',
  templateUrl: './map-two.component.html',
  styleUrls: ['./map-two.component.scss'],
})
export class MapTwoComponent implements OnInit {
  formValue: FilterFormData;
  private getSub: Subscription;
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

  private resCoordinates;
  center: { lat: number; lng: number } = { lat: 25.2048, lng: 55.2708 }; // Dubai

  constructor(
    private toastr: ToastrService,
    private dataShareService: DataShareService
  ) {}

  ngOnInit(): void {
    this.getSub = this.dataShareService.getPatientData().subscribe(
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
    document.getElementById('map-two').innerHTML = '';
    let randomGeoPoints = this.resCoordinates;
    this.count = randomGeoPoints?.length;

    if (this.count) {
      let co = [];
      for (let i = 0; i < this.count; i++) {
        const responseAddress = randomGeoPoints[i]['patientAddress'];

        co.push({
          lng: responseAddress.longitude,
          lat: responseAddress.latitude,
        });
      }

      this.features = new Array(this.count);
      for (var i = 0; i < this.count; ++i) {
        const responseAddress = randomGeoPoints[i]['patientAddress'];
        var coordinates = [parseFloat(co[i].lng), parseFloat(co[i].lat)];

        let newFeature = new Feature(
          new Point(proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857'))
        );

        newFeature.setProperties({
          buildingName: responseAddress?.buildingName,
          street: responseAddress?.streetNumber,
          area: responseAddress?.area,
          zone: responseAddress?.zone,
        });

        this.features[i] = newFeature;
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
        var style = styleCache[size];
        let color = size >= 250 ? 'red' : size >= 100 ? 'orange' : 'green';
        let rad = size >= 250 ? 20 : size >= 100 ? 15 : 10;
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              // radius: 15,
              radius: rad,
              fill: new Fill({
                // color: "#007bff",
                color: color,
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
      target: 'map-two',
      view: new View({
        center: proj.fromLonLat([this.center.lng, this.center.lat]),
        zoom: 13,
        projection: 'EPSG:3857',
      }),
    });

    /* Vector Feature Popup */
    const overlayEl = document.getElementById('overlay-container');
    const overlayLayer = new Overlay({
      element: overlayEl,
    });

    map.addOverlay(overlayLayer);

    const buildingNameEl = document.getElementById('building-name');
    const streetEl = document.getElementById('street');
    const areaEl = document.getElementById('area');
    const zoneEl = document.getElementById('zone');

    map.on('click', function (event) {
      overlayEl.classList.add('show-chevron');
      overlayLayer.setPosition(undefined);

      map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        let clickedCoordinate = event.coordinate;
        let feautureCluster = feature.get('features');

        let clickedBuildingName = feautureCluster[0].get('buildingName');
        let clickedStreet = feautureCluster[0].get('street');
        let clickedArea = feautureCluster[0].get('area');
        let clickedZone = feautureCluster[0].get('zone');

        overlayLayer.setPosition(clickedCoordinate);
        buildingNameEl.innerHTML = clickedBuildingName;
        streetEl.innerHTML = clickedStreet;
        areaEl.innerHTML = clickedArea;
        zoneEl.innerHTML = clickedZone;
      });
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
    if (this.getSub) {
      this.getSub.unsubscribe();
    }
  }
}
