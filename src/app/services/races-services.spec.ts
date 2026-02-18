import { TestBed } from '@angular/core/testing';

import { RacesServices } from './races-services';

describe('RacesServices', () => {
  let service: RacesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RacesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
