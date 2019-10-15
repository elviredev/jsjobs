import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';

@Component({
  selector: 'elv-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  jobs: any = [];

  constructor(private jobService: JobService) { }

  ngOnInit() {
  }

  searchJobs(searchData){
    this.jobService.searchJob(searchData)
                   .subscribe(
                     data => this.jobs = data,
                     error => console.error(error)
                   )
  }

}
