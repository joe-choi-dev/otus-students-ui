import { Component, OnInit } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
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
      map(term => {
        this.loading = true;
        if (term === '')  {
          this.searchService.getAll().subscribe(v => {
            this.loading = false;
            this.searchResults = v;
          });
        }
        this.searchService.searchEntries(term).subscribe(v => {
          this.loading = false;
          this.searchResults = v;
        });
      }),
      catchError((e) => {
        this.loading = false;
        this.errorMessage = e.message;
        return throwError(e);
      }),
    )

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