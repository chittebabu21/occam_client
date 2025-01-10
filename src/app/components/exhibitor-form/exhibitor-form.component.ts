import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ExhibitorService } from '../../services/exhibitor.service';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-exhibitor-form',
  templateUrl: './exhibitor-form.component.html',
  styleUrls: ['./exhibitor-form.component.scss']
})
export class ExhibitorFormComponent implements OnInit{
  @Output() remove = new EventEmitter<number>();
  @Input() formGroup!: FormGroup;
  @Input() exhibitorIndex!: number;
  countryList: any[] = [];

  constructor(
    private exhibitorService: ExhibitorService
  ) {}

  ngOnInit(): void {
    this.getCountryList();
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

  removeExhibitor() {
    this.remove.emit(this.exhibitorIndex);
  }
}
