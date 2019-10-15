import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { JobService } from '../services/job.service';


@Component({
  selector: 'elv-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  decodedToken = null;
  isAdmin = false;
  userEmail = '';
  jobs: any = [];
  adsTitle = ''; //annonce title

  constructor(private authService: AuthService, private jobService: JobService) { }

  ngOnInit() {
    if(this.authService.userIsLoggedIn()) {
      const jbbToken = JSON.parse(localStorage.getItem('jbb-data'));
      this.decodedToken = this.authService.decodeToken(jbbToken.token);
      console.log(this.decodedToken);
      if(this.decodedToken && this.decodedToken.role === 'admin') {
        this.isAdmin = true;
      }
      this.userEmail = this.decodedToken.email;
      // admin must see all jobs
      if(this.isAdmin) {
        this.loadJobsWithoutFilter();
      } else {
        this.loadJobs(this.userEmail);
      }
     
    }
  }

  loadJobs(userEmail) {
    this.jobService.getJobsByUserEmail(userEmail)
                   .subscribe(
                     (data: any) => {
                       this.displayJobs(data.jobs);
                     },
                     err => console.error(err)
                   )
  }

  loadJobsWithoutFilter() {
    this.jobService.getJobs()
                   .subscribe(
                     data => this.displayJobs(data), // retourne directement le tableau de jobs
                     err => console.error(err)
                   )
  }

  displayJobs(jobs) {
    console.log('jobs ', jobs);
    this.jobs = jobs;
    switch(this.jobs.length) {
      case 0:
        this.adsTitle = 'Aucune annonce postée à ce jour';
        return;
      case 1:
        this.adsTitle = '1 annonce postée';
        return;
      default:
        this.adsTitle = `${this.jobs.length} annonces postées`;
    }
  }

}
