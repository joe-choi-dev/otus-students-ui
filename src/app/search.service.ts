import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable, of, empty } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public baseUrl = 'http://localhost:3000/api/v1/students';
  public searchResults: any;
  public studentDetails: any;

  constructor(private httpClient: HttpClient) { }


  // makes the HTTP request to get the resources and returns the response as observable
  public searchEntries(term): Observable<any>{
    if (term === "" ){
      return of(null);
    }else{
      let params = {searchTerm: term }
      return this.httpClient.get(this.baseUrl, {params}).pipe(
        map(response => {
          return this.searchResults = response;
        })
      );
    }
  }

  public getAll(): Observable<any>{
    return this.httpClient.get(this.baseUrl).pipe(
      map(response => {
        return this.searchResults = response;
      })
    );
  }


  public getDetails(name): Observable<any>{
    return this.httpClient.get(this.baseUrl + '/' + name).pipe(
      map(response => {
        return this.studentDetails = response;
      })
    );
  }

}