import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })

export class DataService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = 'https://rickandmortyapi.com/api/character/2';

  getCharacter(): Observable<any> {
    return this._http.get<any>(this._apiUrl)
  }
}
