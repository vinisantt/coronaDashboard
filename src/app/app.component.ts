import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
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
	private casesS: any;
	private casesC: any;

	constructor(public getData$: AppService, private datePipe: DatePipe) {}

	ngOnInit() {
		this.getData$.findStates().subscribe((states) => {
			this.casesS = JSON.parse(states.toString());

			this.getData$.findCities().subscribe((cities) => {
				this.casesC = JSON.parse(cities.toString());
				this.initMap();
			});
		});
	}

	initMap() {
		let marksCities: Array<any> = [];
		let marksStates: Array<any> = [];
		let isClicked = false;

		for (let citie of this.casesC) {
			let marker = L.circleMarker([citie.latitude, citie.longitude], {
				color: "#3388ff",
				title: citie.cidade,
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
			let data = this.datePipe.transform(new Date(citie.data), "dd-MM-yyyy");
			marker.bindPopup(
				L.popup({ maxWidth: 550 }).setContent(`
			<h5> ${citie.cidade} </h5> 
			Casos confirmados: <b>${citie.casos_confirmados}</b></br>
			Óbitos: <b>${citie.obitos}</b></br>
			Última atualização: <b>${data}</b>
			`),
			);
			marksCities.push(marker);
		}
		for (let state of this.casesS) {
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
			let data = this.datePipe.transform(new Date(state.data), "dd-MM-yyyy");
			marker.bindPopup(
				L.popup({ maxWidth: 650 }).setContent(`
					<h5> ${state.nome} </h5> 
					Casos confirmados: <b>${state.casos_confirmados}</b></br>
					Casos suspeitos: <b>${state.suspeitos}</b></br>
					Recuperados: <b>${state.recuperados}</b></br>
					Óbitos: <b>${state.obitos}</b></br>
					Última atualização: <b>${data}</b>
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
		this.map.addControl(new L.Control.Search({ layer: searchLayer, zoom: 11, marker: false }));

		let overlayMaps = {
			Estados: states,
			Cidades: cities,
		};

		L.control.layers(overlayMaps, null, { collapsed: false }).addTo(this.map);

		tiles.addTo(this.map);
	}
}
