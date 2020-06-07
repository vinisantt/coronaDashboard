import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class CoordinatesService {
	constructor(private http: HttpClient) {}

	cities() {
		return this.http.get(
			"https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/master/json/municipios.json",
		);
	}

	states() {
		return this.http.get(
			"https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/master/json/estados.json",
		);
	}
}
