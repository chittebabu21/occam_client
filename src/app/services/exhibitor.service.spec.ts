import { TestBed } from '@angular/core/testing';

import { ExhibitorService } from './exhibitor.service';

describe('ExhibitorService', () => {
  let service: ExhibitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExhibitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
