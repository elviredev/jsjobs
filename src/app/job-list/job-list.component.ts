import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';

@Component({
  selector: 'elv-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  
  jobs: any = [];
  error: '';

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.jobService.getJobs()
                   .subscribe(
                    data => this.jobs = data,
                    error => {
                      console.error(error);
                      this.error = error;
                    }
                  );

    /* s'abonne au Subject du service pour recevoir les données (nouveau job)
    ajoute nouveau job dans son tableau de jobs en tête de liste
    */              
    this.jobService.jobsSubject.subscribe(data => {
      console.log(data);
      this.jobs = [data, ...this.jobs];
    })
  }
}
