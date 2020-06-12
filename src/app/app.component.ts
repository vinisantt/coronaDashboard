import { CoordinatesService } from "./coordinates.service";
import { Component, OnInit } from "@angular/core";
import * as L from "leaflet";
import "leaflet-search";
import { AppService } from "./app.service";

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.style.scss"],
})
export class AppComponent implements OnInit {
	private map;
	private cCities: any;
	private cStates: any;

	constructor(public coordinates$: CoordinatesService, public getData$: AppService) {}

	ngOnInit() {
		this.coordinates$.cities().subscribe((data) => {
			this.cCities = data;
			this.initMap();
		});
		this.coordinates$.states().subscribe((data) => {
			this.cStates = data;
		});
	}

	initMap() {
		let marksCities: Array<any> = [];
		let marksStates: Array<any> = [];
		let isClicked = false;

		for (let citie of this.cCities) {
			let marker = L.circleMarker([citie.latitude, citie.longitude], {
				color: "#3388ff",
				title: citie.nome,
			});

			marker.on({
				mouseover: function () {
					if (!isClicked) {
						this.openPopup();
					}
				},
				mouseout: function () {
					if (!isClicked) {
						this.closePopup();
					}
				},
				click: function () {
					isClicked = true;
					this.openPopup();
				},
			});

			this.getData$.findCity(citie.nome, citie.codigo_uf).subscribe((data) => {
				marker.bindPopup(
					L.popup({ maxWidth: 550 }).setContent(`
				<h5> ${citie.nome} </h5> 
				Casos confirmados: <b>${data["cases"]}</b></br>
				Óbitos: <b>5</b>
				`),
				);
				marksCities.push(marker);
			});
		}
		for (let state of this.cStates) {
			let marker = L.circleMarker([state.latitude, state.longitude], {
				color: "#3388ff",
				radius: 20,
				title: state.nome,
			});

			marker.on({
				mouseover: function () {
					if (!isClicked) {
						this.openPopup();
					}
				},
				mouseout: function () {
					if (!isClicked) {
						this.closePopup();
					}
				},
				click: function () {
					isClicked = true;
					this.openPopup();
				},
			});

			marker.bindPopup(
				L.popup({ maxWidth: 650 }).setContent(`
				<h5> ${state.nome} </h5> 
				Casos confirmados: <b>5</b></br>
				Óbitos: <b>5</b>
			`),
			);
			marksStates.push(marker);
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

		this.map.on({
			click: function () {
				isClicked = false;
			},
			popupclose: function () {
				isClicked = false;
			},
		});

		this.map.setView(brazil, 5);

		const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 11,
			minZoom: 5,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		});

		var searchLayer = L.layerGroup(marksCities.concat(marksStates)).addTo(this.map);
		//... adding data in searchLayer ...
		this.map.addControl(new L.Control.Search({ layer: searchLayer, zoom: 11 }));

		let overlayMaps = {
			Estados: states,
			Cidades: cities,
		};

		L.control.layers(overlayMaps, null, { collapsed: false }).addTo(this.map);

		tiles.addTo(this.map);
	}
}
