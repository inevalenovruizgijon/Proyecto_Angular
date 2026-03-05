import { TestBed } from '@angular/core/testing';

import { TcgdexSdkService } from './tcgdex-sdk.service';

describe('TcgdexSdkService', () => {
  let service: TcgdexSdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TcgdexSdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
