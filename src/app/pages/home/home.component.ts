import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { ExhibitorService } from '../../services/exhibitor.service';
import { Company } from '../../interfaces/company';
import { Country } from '../../interfaces/country';
import { AddRequestBody } from '../../interfaces/add-request-body';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  eventSelectionForm!: FormGroup;
  chosenEvent = '';
  companyList!: Company[];
  countryList!: string[];
  errorMsg = '';
  emailError = '';
  isLoading = false;
  showAlert = false;
  uniqueId = '';

  constructor(
    private exhibitorService: ExhibitorService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCompanyList();

    this.eventSelectionForm = this.formBuilder.group({
      event: new FormControl(null, {
        validators: [Validators.required]
      }),
      company: new FormControl(null, {
        validators: [Validators.required]
      }),
      exhibitors: this.formBuilder.array([])
    });

    this.eventSelectionForm.valueChanges.subscribe(() => {
      if (this.eventSelectionForm.valid && this.exhibitors.length === 0) {
        this.addExhibitor();
      }
    })
  }

  get exhibitors(): FormArray {
    return this.eventSelectionForm.get('exhibitors') as FormArray;
  }

  newExhibitor(): FormGroup {
    this.getCountryList();

    return this.formBuilder.group({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      nameOnBadge: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)]
      }),
      jobTitle: new FormControl(null, {
        validators: [Validators.required]
      }),
      country: new FormControl(null, {
        validators: [Validators.required]
      }),
      company: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  getCompanyList() {
    this.exhibitorService.getCompanyList().subscribe({
      next: (res) => {
        this.companyList = res.message;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getCountryList() {
    this.exhibitorService.getCountryList().subscribe({
      next: (res) => {
        const responseArray = res as any[];
        const uniqueCountries = Array.from(new Set(responseArray.map((item: Country) => item.country)));
        this.countryList = uniqueCountries;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  filterCompany(event: string) {
    return this.companyList.filter((company) => company.S_event === event);
  }

  addExhibitor() {
    this.exhibitors.push(this.newExhibitor());
  }

  removeExhibitor(index: number) {
    this.exhibitors.removeAt(index);
  }

  checkIsSelected(): boolean {
    const event = this.eventSelectionForm.get('event')?.value;
    const company = this.eventSelectionForm.get('company')?.value;

    if (event && company) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit() {
    const event = this.eventSelectionForm.get('event')?.value;
    const company = this.eventSelectionForm.get('company')?.value;

    if (event && company) {
      const exhibitorFormControls = this.exhibitors.controls as FormGroup[];

      exhibitorFormControls.forEach((exhibitorForm: FormGroup) => {
        if (exhibitorForm.valid) {
          this.isLoading = true;

          const request: AddRequestBody = {
            S_added_via: 'Web Form',
            S_company: company,
            S_email_address: exhibitorForm.get('email')?.value,
            S_group_reg_id: this.generateRandomId(),
            S_name_on_badge: exhibitorForm.get('nameOnBadge')?.value,
            S_job_title: exhibitorForm.get('jobTitle')?.value,
            S_country: exhibitorForm.get('country')?.value,
            S_company_on_badge: exhibitorForm.get('company')?.value,
            SB_event_fha: event === 'FHA-Food & Beverage',
            SB_event_prowine: event === 'Prowine Singapore'
          };

          this.exhibitorService.postRequest(request).subscribe({
            next: (res: any) => {
              const jsonResponse = res as { message: string; status: boolean; user_id: string; };
              console.log(jsonResponse);

              this.isLoading = false;
              this.uniqueId = request.S_group_reg_id;
              this.showAlert = true;
              
              this.errorMsg = '';
              this.emailError = '';

              exhibitorForm.reset();
              this.eventSelectionForm.reset();
            },
            error: (err: any) => {
              console.log(err);
              this.isLoading = false;
              this.emailError = '';
              this.errorMsg = 'Error in submitting request';
            }
          });
        } else {
          console.log('Invalid form.');

          if (exhibitorForm.get('email')?.invalid) {
            this.isLoading = false;
            this.errorMsg = '';
            this.emailError = 'Invalid email address.';
          } else {
            this.isLoading = false;
            this.emailError = '';
            this.errorMsg = 'Please complete all fields.';
          }
        }
      })
    } else {
      console.log('Company or event not selected.');
      this.isLoading = false;
      this.emailError = '';
      this.errorMsg = 'Please select an event and company.';
    }
  }

  handleClose() {
    this.showAlert = false;
    this.router.navigateByUrl('/');
  }

  private generateRandomId() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let counter = 0;

    while (counter < 5) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
      counter++;
    }

    return result;
  }
}
