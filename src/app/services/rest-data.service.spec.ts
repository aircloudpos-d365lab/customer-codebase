import { TestBed } from '@angular/core/testing';

import { RestDataService } from './rest-data.service';

describe('RestDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestDataService = TestBed.get(RestDataService);
    expect(service).toBeTruthy();
  });
});
