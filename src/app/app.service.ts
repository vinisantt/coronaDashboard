import { HttpClientModule } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class AppService {
	constructor(private http: HttpClient) {}
}
