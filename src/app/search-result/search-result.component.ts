import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';

@Component({
  selector: 'elv-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  jobs: any = [];

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.jobService.searchResultSubject.subscribe(
      data => this.handleSearchResult(data)
    )
  }

  handleSearchResult(data) {
    this.jobs = data.jobs;
  }

}
