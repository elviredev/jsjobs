import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'elv-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  constructor(private authService: AuthService) { }

  jbbData = null;
  isAuthenticated = false;
  welcomeMessage = '';

  ngOnInit() {   
    if(this.authService.userIsLoggedIn()) {
      this.refreshFlags();
    }
  }

  refreshFlags(){
    this.isAuthenticated = true;
    this.welcomeMessage = 'Bienvenue';
  }

  login(formData){
    this.authService.login(formData)
                    .subscribe(
                      data => this.handleLoginSuccess(data),
                      error => this.handleLoginFailure(error)
                    )
  }
  
  handleLoginSuccess(data) {
    console.log('success', data);
    this.jbbData = data;
    this.refreshFlags();
    localStorage.setItem('jbb-data', JSON.stringify(data));
  }

  handleLoginFailure(error) {
   console.error('failure', error);
  }

}
