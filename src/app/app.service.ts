import { HttpClientModule } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class AppService {
	constructor(private http: HttpClient) {}

	findCities() {
		return this.http.get(`http://172.18.18.241:5000/cidade/`);
	}

	findStates() {
		return this.http.get(`http://172.18.18.241:5000/estado/`);
	}
}
