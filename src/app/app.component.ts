import { CoordinatesService } from "./coordinates.service";
import { Component, AfterViewInit, OnInit } from "@angular/core";
import * as L from "leaflet";

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.style.scss"],
})
export class AppComponent implements OnInit {
	private map;
	private cCities: any;
	private cStates: any;

	constructor(public coordinates$: CoordinatesService) {}

	ngOnInit() {
		this.coordinates$.cities().subscribe((dados) => {
			this.cCities = dados;
			this.initMap();
		});
		this.coordinates$.states().subscribe((dados) => (this.cStates = dados));
	}

	initMap() {
		let marks: Array<any> = [];

		for (let citie of this.cCities) {
			marks.push(
				L.circleMarker([citie.latitude, citie.longitude], {
					color: "#3388ff",
				}).bindPopup(L.popup({ maxWidth: 550 }).setContent(citie.nome)),
			);
		}

		console.log(marks);

		let cities = L.layerGroup(marks);

		let brazil = new L.LatLng(-15.7801, -47.9292);

		this.map = L.map("map", {
			center: [-10.296777, -48.310953],
			zoom: 6,
			layers: [cities],
			preferCanvas: true,
		});

		this.map.setView(brazil, 5);

		const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 11,
			minZoom: 5,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		});

		tiles.addTo(this.map);
	}
}
