import { Component, OnDestroy, OnInit } from '@angular/core';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { Cluster, OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import * as proj from 'ol/proj';
import * as layer from 'ol/layer';
import { Overlay } from 'ol';
import { easeOut } from 'ol/easing';
import { getVectorContext } from 'ol/render';
import { unByKey } from 'ol/Observable';

import { FilterFormData } from '../../models/filter.model';
import { DataShareService } from '../../services/data-share.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-map-two',
  templateUrl: './map-two.component.html',
  styleUrls: ['./map-two.component.scss'],
})
export class MapTwoComponent implements OnInit, OnDestroy {
  formValue: FilterFormData;
  private getSub: Subscription;
  private animationInterval;
  public map!: Map;
  public newMap!: Map;
  distanceInput;
  minDistanceInput;

  count;
  patientFeatures = [];
  schoolFeatures = [];
  occupationFeatures = [];
  allFeatures;
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
      let pCo = []; // All patient coordinates
      let sCo = []; // All student coordinates
      let oCo = []; // All occupation coordinates

      for (let i = 0; i < this.count; i++) {
        const resPatientAddress = randomGeoPoints[i]['patientAddress'];
        const resSchoolAddress = randomGeoPoints[i]['school'];
        const resOccupationAddress = randomGeoPoints[i]['occuapation'];

        pCo.push({
          lng: resPatientAddress.longitude,
          lat: resPatientAddress.latitude,
        });

        sCo.push({
          lng: resSchoolAddress.longitude,
          lat: resSchoolAddress.latitude,
        });

        oCo.push({
          lng: resOccupationAddress.longitude,
          lat: resOccupationAddress.latitude,
        });
      }

      // Patient Address
      for (var i = 0; i < this.count; i++) {
        const resPatientAddress = randomGeoPoints[i]['patientAddress'];
        var coordinates = [parseFloat(pCo[i].lng), parseFloat(pCo[i].lat)];

        let newFeature = new Feature(
          new Point(proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857'))
        );

        newFeature.setProperties({
          buildingName: resPatientAddress?.buildingName,
          zone: resPatientAddress?.zone,
          buildingType: 'patient',
        });

        this.patientFeatures.push(newFeature);
      }

      // School Address
      for (var i = 0; i < this.count; i++) {
        const resSchoolAddress = randomGeoPoints[i]['school'];
        var coordinates = [parseFloat(sCo[i].lng), parseFloat(sCo[i].lat)];

        let newFeature = new Feature(
          new Point(proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857'))
        );

        newFeature.setProperties({
          buildingName: resSchoolAddress?.schoolName,
          zone: resSchoolAddress?.zone,
          buildingType: 'school',
        });

        this.schoolFeatures.push(newFeature);
      }

      // Occupation Address
      for (var i = 0; i < this.count; i++) {
        const resOccupationAddress = randomGeoPoints[i]['occuapation'];
        var coordinates = [parseFloat(oCo[i].lng), parseFloat(oCo[i].lat)];

        let newFeature = new Feature(
          new Point(proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857'))
        );

        newFeature.setProperties({
          buildingName: resOccupationAddress?.placeOfWork,
          zone: resOccupationAddress?.zone,
          buildingType: 'occupation',
        });

        this.occupationFeatures.push(newFeature);
      }

      console.log('Patient Features', this.patientFeatures);
      console.log('School Features', this.schoolFeatures);
      console.log('Occupation Features', this.occupationFeatures);
    }

    this.allFeatures = [
      ...this.patientFeatures,
      ...this.schoolFeatures,
      ...this.occupationFeatures,
    ];

    var allSources = new VectorSource({
      features: this.allFeatures,
    });

    var clusterSource = new Cluster({
      distance: parseInt('60'),
      source: allSources,
    });

    var styleCache = {};
    var clusters = new layer.Vector({
      source: clusterSource,
      style: function (feature) {
        let featureCluster = feature.get('features');
        var size = featureCluster.length;
        var style = styleCache[size];

        let buildingType: string = featureCluster[0].get('buildingType');
        let previousBuildingType: string = buildingType;
        let isClusterOfSameType: boolean = true;

        for (let i = 0; i < featureCluster.length; i++) {
          let currenttBuildingType = featureCluster[i].get('buildingType');

          if (currenttBuildingType !== previousBuildingType) {
            isClusterOfSameType = false;
            break;
          }

          previousBuildingType = currenttBuildingType;
          isClusterOfSameType = true;
        }

        let color: string;

        if (isClusterOfSameType) {
          if (buildingType === 'patient') {
            color = '#0c63e7'; //blue
          } else if (buildingType === 'school') {
            color = '#8900f2'; //purple
          } else if (buildingType === 'occupation') {
            color = '#ff00c1'; //pink
          }
        } else {
          color = 'black'; //cluster of several building types
        }

        // if (!style) {
        style = new Style({
          image: new CircleStyle({
            radius: 18,
            fill: new Fill({
              color: color,
            }),
            stroke: new Stroke({
              color: 'rgba(255, 255, 255, 0.8)',
              width: 4,
            }),
          }),
          text: new Text({
            text: size.toString(),
            font: 'Normal 15px Monaco',
            scale: 1.1,
            textAlign: 'center',
            textBaseline: 'middle',
            fill: new Fill({
              color: '#fff',
            }),
          }),
        });

        styleCache[size] = style;
        // }
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

    /* Feature Animation */
    function flash(feature, duration = 3000) {
      const start = Date.now();
      const flashGeom = feature.getGeometry().clone();
      const listenerKey = raster.on('postrender', animate);

      function animate(event) {
        const frameState = event.frameState;
        const elapsed = frameState.time - start;
        if (elapsed >= duration) {
          unByKey(listenerKey);
          return;
        }

        const vectorContext = getVectorContext(event);
        const elapsedRatio = elapsed / duration;
        const radius = easeOut(elapsedRatio) * 25 + 5; // radius will be 5 at start and 30 at end
        const opacity = easeOut(1 - elapsedRatio);

        const style = new Style({
          image: new CircleStyle({
            radius: radius,
            stroke: new Stroke({
              color: 'rgba(255, 0, 0, ' + opacity + ')',
              width: 0.75 + opacity,
            }),
          }),
        });

        vectorContext.setStyle(style);
        vectorContext.drawGeometry(flashGeom);
        map.render(); // tell OpenLayers to continue postrender animation
      }
    }

    function addAnimationToFeature() {
      clusterSource.forEachFeature((feature) => {
        let featureCluster = feature.get('features');
        var size = featureCluster.length;

        let buildingType: string = featureCluster[0].get('buildingType');
        let previousBuildingType: string = buildingType;
        let isClusterOfSameType: boolean = true;

        for (let i = 0; i < featureCluster.length; i++) {
          let currenttBuildingType = featureCluster[i].get('buildingType');

          if (currenttBuildingType !== previousBuildingType) {
            isClusterOfSameType = false;
            break;
          }

          previousBuildingType = currenttBuildingType;
          isClusterOfSameType = true;
        }

        if (isClusterOfSameType) {
          if (buildingType === 'patient' && size > 4) {
            flash(feature);
          } else if (buildingType === 'school' && size > 4) {
            flash(feature);
          } else if (buildingType === 'occupation' && size > 4) {
            flash(feature);
          }
        }

        map.render();
      });
    }

    this.animationInterval = window.setInterval(addAnimationToFeature, 2000);

    /* Feature Popup */
    const overlayEl = document.getElementById('overlay-container');
    const overlayLayer = new Overlay({
      element: overlayEl,
    });

    map.addOverlay(overlayLayer);

    const buildingNameEl = document.getElementById('building-name');
    const zoneEl = document.getElementById('zone');

    map.on('click', function (event) {
      overlayEl.classList.add('show-chevron');
      overlayLayer.setPosition(undefined);

      map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        let clickedCoordinate = event.coordinate;
        let feautureCluster = feature.get('features');

        let clickedBuildingName = feautureCluster[0].get('buildingName');
        let clickedZone = feautureCluster[0].get('zone');

        overlayLayer.setPosition(clickedCoordinate);
        buildingNameEl.innerHTML = clickedBuildingName;
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

    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }
}
