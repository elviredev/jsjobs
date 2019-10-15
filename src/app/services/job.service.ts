import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class JobService {

  initialJobs: any = []; // tableau contenant les données de jobs.json
  jobs: any = []; // tableau avec les jobs créés par le formulaire
  jobsSubject = new Subject();
  searchResultSubject = new Subject();

  BASE_URL = 'http://localhost:4201';

  constructor(private http: HttpClient, private authService: AuthService) { }

    // requête GET vers /jobs
    getJobs(){
      return this.http.get(this.BASE_URL + '/api/jobs')
                      .pipe(
                        map(res => this.jobs = res)
                    )
      }    
 
    // le service pousse les données saisies (il faudra s'y abonner pour les recevoir)
    // requête POST vers /jobs
    addJob(jobData: any, token){
      console.log('inside addJob');
      const httpOptions: HttpHeaders = this.authService.addAuthorizationHeader(token);
      jobData.id = Date.now(); // notre id est unique car ça génére le nombre de ms depuis le 010/01/70
      /* this.jobs = [jobData, ...this.jobs]; // on ajoute tous les éléments de jobData devant this.jobs
      return this.jobsSubject.next(jobData); */

      return this.http.post(this.BASE_URL + '/api/jobs', jobData, {headers: httpOptions})
                      .pipe(
                        map(res => {
                          console.log(res);
                          this.jobsSubject.next(jobData);
                        })
                      )
    }

    // requête GET by Email vers /jobs/email
    getJobsByUserEmail(userEmail){
      return this.http.get(this.BASE_URL + `/api/jobs/${userEmail}`)
                      .pipe(
                        map(res => this.jobs.userEmail = res)
                      )
    }

    // requête GET by ID vers /jobs/id
    getJob(id) {
      return this.http.get(this.BASE_URL + `/api/jobs/${id}`)
                      .pipe(
                        map(res => this.jobs.id = res)
                      )
    }

     // requête GET vers /search
    searchJob(criteria){
      console.log(criteria);
      // on se créé notre url de recherche avec template string
      return this.http.get(`${this.BASE_URL}/api/search/${criteria.term}/${criteria.place}`)
                      .pipe(
                        map(res => this.jobs = res),
                        tap(res => this.searchResultSubject.next(res))
                      )
    }

}
