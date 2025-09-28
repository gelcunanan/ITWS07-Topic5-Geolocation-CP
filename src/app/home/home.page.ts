import { AfterViewInit, Component, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonFooter,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
} from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonFooter,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    DecimalPipe,
  ],
})
export class HomePage implements AfterViewInit {
  map!: L.Map;
  lat!:number;
  long!: number;
  address = signal<string | undefined>('')


  async getCurrentLocation() {
    try {
      const pos = await Geolocation.getCurrentPosition();
      this.lat = pos.coords.latitude;
      this.long = pos.coords.longitude;
      this.mapInit();
    } catch (error) {
      console.log('unable to get the current position', error);
      this.address.set('N/A')
    }
  }

  mapInit() {
    const icon = L.icon({
      iconUrl: 'assets/icon/marker-icon.png',
      shadowUrl: 'assets/icon/marker-shadow.png',
      iconSize: [25, 41], // size of the icon
      iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
    });

    this.map = L.map('map', {
      center: [this.lat, this.long],
      zoom: 17,
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map
    );
    L.marker([this.lat, this.long], { icon: icon }).addTo(this.map);
    L.circle([this.lat, this.long], { radius: 50 }).addTo(this.map);

    L.circleMarker([this.lat, this.long], {
      radius: 8,
      color: 'rgba(0, 157, 255, 1)', // stroke color
      fillColor: 'rgba(0, 255, 251, 0.83)', // fill color with transparency
      fillOpacity: 0.5,
    }).addTo(this.map);

    try {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${this.lat}&lon=${this.long}&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          this.address.set(data.display_name);
          console.log(data);
        });
    } catch (error) {
      alert("Unable to display address name");
      this.address.set('XXX')
    }

    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

  ngAfterViewInit(): void {
    this.getCurrentLocation();
  }
}
