import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CancelOrderReasonPage } from './cancel-order-reason.page';

describe('CancelOrderReasonPage', () => {
  let component: CancelOrderReasonPage;
  let fixture: ComponentFixture<CancelOrderReasonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelOrderReasonPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelOrderReasonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
