import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'elv-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  // appel méthode de auth.service qui récupère credentials
  register(formData){
    this.authService.register(formData)
                    .subscribe(
                      data => this.handleRegisterSuccess(data),
                      error => this.handleRegisterFailure(error)
                    )
  }
  
  handleRegisterSuccess(data) {
    console.log('success', data)
    this.router.navigate(['/']); // renvoi vers page d'accueil
    
  }

  handleRegisterFailure(error) {
    console.error('failure', error);
  }

}
