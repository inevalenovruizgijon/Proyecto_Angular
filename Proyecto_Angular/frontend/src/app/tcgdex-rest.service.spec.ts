import { TestBed } from '@angular/core/testing';

import { TcgdexRestService } from './tcgdex-rest.service';

describe('TcgdexRestService', () => {
  let service: TcgdexRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TcgdexRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
