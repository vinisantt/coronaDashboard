import { CoordinatesService } from "./coordinates.service";
import { Component, OnInit } from "@angular/core";
import * as L from "leaflet";
import "leaflet-search";
import { stat } from "fs";

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
		this.coordinates$.states().subscribe((dados) => {
			this.cStates = dados;
		});
	}

	initMap() {
		let marksCities: Array<any> = [];
		let marksStates: Array<any> = [];

		for (let citie of this.cCities) {
			marksCities.push(
				L.circleMarker([citie.latitude, citie.longitude], {
					color: "#3388ff",
					title: citie.nome,
				}).bindPopup(L.popup({ maxWidth: 550 }).setContent(citie.nome)),
			);
		}
		for (let state of this.cStates) {
			marksStates.push(
				L.circleMarker([state.latitude, state.longitude], {
					color: "#3388ff",
					radius: 20,
					title: state.nome,
				}).bindPopup(L.popup({ maxWidth: 550 }).setContent(state.nome)),
			);
		}

		let cities = L.layerGroup(marksCities);
		let states = L.layerGroup(marksStates);

		let brazil = new L.LatLng(-15.7801, -47.9292);

		this.map = L.map("map", {
			center: [-10.296777, -48.310953],
			zoom: 6,
			layers: [cities, states],
			preferCanvas: true,
		});

		this.map.setView(brazil, 5);

		const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 11,
			minZoom: 5,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		});

		var searchLayer = L.layerGroup(marksStates).addTo(this.map);
		//... adding data in searchLayer ...
		this.map.addControl(new L.Control.Search({ layer: searchLayer }));

		let overlayMaps = {
			Estados: states,
			Cidades: cities,
		};

		L.control.layers(overlayMaps, null, { collapsed: false }).addTo(this.map);

		tiles.addTo(this.map);
	}
}
