import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  BASE_URL = 'http://localhost:4201/auth';
  //TOKEN_NAME = 'jbb-token';
  decodedToken = null;

  constructor(private http: HttpClient) { }

  // requête POST vers /login
  login(credentials){
    return this.http.post(`${this.BASE_URL}/login`, credentials)
                    .pipe(
                      map(res => res = res)
                    )
  }

  // méthodes pour tester si log ou pas
  userIsLoggedIn(){
    return !!localStorage.getItem('jbb-data'); // si ok retourne true
   
  }

  // vider localStorage 
  logOut(){
    localStorage.removeItem('jbb-data');
    //localStorage.removeItem('token');
  }

  // requête vers backend sur /register
  register(credentials){
    console.log('register', credentials);
    return this.http.post(`${this.BASE_URL}/register`, credentials);
  }
  
  // décoder le token dans page profil
  decodeToken(token){
    return jwtDecode(token);
  }

  addAuthorizationHeader(token: String) {
    return new HttpHeaders({'Authorization': ['Bearer ' + token]});
  }


}
