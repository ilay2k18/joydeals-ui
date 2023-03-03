import { TestBed } from '@angular/core/testing';

import { JoyDealsFormService } from './joy-deals-form.service';

describe('JoyDealsFormService', () => {
  let service: JoyDealsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoyDealsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
