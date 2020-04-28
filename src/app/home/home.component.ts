import { Component, OnInit } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, retryWhen, retry } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public loading: boolean;
  public searchResults: any;
  public searchTerm = new Subject<string>();
  public studentDetails: any;
  public errorMessage: any;

  constructor(private modalService: NgbModal, private searchService: SearchService) { }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading = true;
        if (term === '')  { return this.searchService._getAllEntries(); }
        return this.searchService._searchEntries(term);
      }),
      catchError((e) => {
        this.loading = false;
        this.errorMessage = e.message;
        return throwError(e);
      }),
    ).subscribe(v => {
        this.loading = false;
        this.searchResults = v;
    });

  ngOnInit() {
    this.searchService.getAll().subscribe(v => {
      this.loading = false;
      this.searchResults = v;
    });
  }

  open(student, content) {
    this.searchService.getDetails(student.firstName + student.lastName).subscribe(v => {
      this.studentDetails = v;
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    });
  }

}