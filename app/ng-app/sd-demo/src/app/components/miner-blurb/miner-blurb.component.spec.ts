import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinerBlurbComponent } from './miner-blurb.component';

describe('MinerBlurbComponent', () => {
  let component: MinerBlurbComponent;
  let fixture: ComponentFixture<MinerBlurbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinerBlurbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinerBlurbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
