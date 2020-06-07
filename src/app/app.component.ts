import { Component, AfterViewInit } from "@angular/core";
import * as L from "leaflet";

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.style.scss"],
})
export class AppComponent implements AfterViewInit {
	private map;

	constructor() {}

	ngAfterViewInit(): void {
		this.initMap();
	}

	private initMap(): void {

		let mark1 = L.marker([-10.1689, -48.3317])
		.bindPopup(L.popup({ maxWidth: 550 }).setContent("Confirmados: 5\nÓbitos: 10"))
	
		let mark2 = L.marker([-12.9264,-46.9352])
			.bindPopup(L.popup({ maxWidth: 550 }).setContent("Confirmados: 50\nÓbitos: 9"))

		let cities = L.layerGroup([mark1, mark2]);

		this.map = L.map("map", {
			center: [-10.296777, -48.310953],
			zoom: 6,
			layers :[cities]
		});

		const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 12,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		});

		tiles.addTo(this.map);

		

	
	}
}
