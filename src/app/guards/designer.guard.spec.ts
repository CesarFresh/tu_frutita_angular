import { TestBed } from '@angular/core/testing';

import { DesignerGuard } from './designer.guard';

describe('DesignerGuard', () => {
  let guard: DesignerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DesignerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
