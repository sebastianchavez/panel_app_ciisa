import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

  api: String = environment.apiUrl;

  constructor(private http: HttpClient) { }
  httpHeaders() {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: localStorage.getItem('accessToken') })
    };
  }

  get(url) {
      return this.http.get(`${this.api}${url}`, this.httpOptions);
  }

  post(url, body) {
      return this.http.post(`${this.api}${url}`, body, this.httpOptions);
  }

  put(url, body) {
      return this.http.put(`${this.api}${url}`, body, this.httpOptions);
  }

  delete(url) {
      return this.http.delete(`${this.api}${url}`, this.httpOptions);
  }

}
