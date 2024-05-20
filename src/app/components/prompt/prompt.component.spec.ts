import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromptComponent } from './prompt.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  PersistedSearchItem,
  WeatherInfo,
  SearchParamsWithData,
} from '../../utils/types';

describe('PromptComponent', () => {
  let component: PromptComponent;
  let fixture: ComponentFixture<PromptComponent>;
  let dialogRefSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
      'afterClosed',
      'close',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatButtonModule,
        MatRadioModule,
        HttpClientModule,
        BrowserAnimationsModule, // Add BrowserAnimationsModule here
      ],
      declarations: [], // Remove PromptComponent from declarations array
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have "Confirm" and "Cancel" buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('should call onConfirm method when Confirm button is clicked', () => {
    spyOn(component, 'onConfirm');
    const confirmButton = fixture.nativeElement.querySelector(
      'button[mat-dialog-close][type="button"]'
    );

    confirmButton.click();

    expect(component.onConfirm).toHaveBeenCalled();
  });

  it('should close the dialog when Cancel button is clicked', () => {
    const cancelButton = fixture.nativeElement.querySelector(
      'button[mat-dialog-close][type="button"]'
    );

    cancelButton.click();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should update selectedWeatherInfo on radio button selection', () => {
    const mockWeatherData: WeatherInfo = {
      id: 1,
      cityName: 'London',
      country: 'UK',
      temp: 15,
      feelsLike: 10,
      humidity: 50,
      pressure: 1010,
      windSpeed: 5,
      latitude: 0,
      longitude: 0,
      minTemp: 0,
      maxTemp: 0,
      weather: [{ main: 'Cloudy', description: 'Cloudy weather' }],
    };

    // Provide cityName and units along with weatherInfo
    const searchParamsWithData: SearchParamsWithData = {
      cityName: 'London',
      units: 'metric',
      weatherInfo: [mockWeatherData],
    };

    component.searchParamsWithData = searchParamsWithData;

    fixture.detectChanges();
    const radioInput = fixture.nativeElement.querySelector(
      'input[type="radio"]'
    );

    radioInput.click();

    expect(component.selectedWeatherInfo).toEqual(mockWeatherData);
  });
});
