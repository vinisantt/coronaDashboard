import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
	providedIn: "root",
})
export class CoordinatesService {
	constructor(private http: HttpClient) {}

	cities() {
		return this.http.get("assets/cities.json");
	}

	states() {
		return this.http.get("assets/states.json");
	}
}
