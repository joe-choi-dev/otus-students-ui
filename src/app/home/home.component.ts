import { Component, OnInit } from '@angular/core';
import {Observable, Subject, throwError, of, Subscription} from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, retryWhen, retry } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {SearchService} from '../search.service';

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

const COUNTRIES: Country[] = [
  {
    name: 'Russia',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'United States',
    flag: 'a/a4/Flag_of_the_United_States.svg',
    area: 9629091,
    population: 324459463
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  }
];

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

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

  public model: any;
  public countries = COUNTRIES;

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

  public onClickStudent(event) {
    console.log("hello world");
    this.searchService.getDetails("johnsmith").subscribe(v => {
      this.studentDetails = v;
      console.log(this.studentDetails);
      document.getElementById("myModal").style.display = "block";
    });
  }

  ngOnInit() {
    this.searchService.getAll().subscribe(v => {
      this.loading = false;
      this.searchResults = v;
    });
  }

  closeResult = '';

  open(student, content) {
    console.log('content: ', student);

    this.searchService.getDetails(student.firstName + student.lastName).subscribe(v => {
      this.studentDetails = v;
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}