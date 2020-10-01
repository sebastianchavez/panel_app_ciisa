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
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') })
    };
  }

  get(url, options: boolean) {
    if (!options) {
      return this.http.get(`${this.api}${url}`, this.httpOptions);
    } else {
      this.httpHeaders();
      return this.http.get(`${this.api}${url}`, this.httpOptions);
    }
  }

  post(url, body, options: boolean) {
    if (!options) {
      return this.http.post(`${this.api}${url}`, body);
    } else {
      this.httpHeaders();
      return this.http.post(`${this.api}${url}`, body, this.httpOptions);
    }
  }

  put(url, body, options: boolean) {
    if (!options) {
      return this.http.put(`${this.api}${url}`, body);
    } else {
      this.httpHeaders();
      return this.http.put(`${this.api}${url}`, body, this.httpOptions);
    }
  }

  delete(url, options: boolean) {
    if (!options) {
      return this.http.delete(`${this.api}${url}`);
    } else {
      this.httpHeaders();
      return this.http.delete(`${this.api}${url}`, this.httpOptions);
    }
  }

}
