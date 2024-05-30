import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';
import { WeatherService } from '../../services/weather.service';
import {
  PersistedSearchItem,
  SearchParamsWithData,
  WeatherInfo,
  WeatherUnit,
} from '../../utils/types';
import { MatDialog } from '@angular/material/dialog';
import { PromptComponent } from '../../components/prompt/prompt.component';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CardComponent],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent implements OnInit, OnDestroy {
  public $_destory = new Subject<void>();
  public searchForm = new FormGroup({
    cityName: new FormControl('', [Validators.required]),
    units: new FormControl<WeatherUnit>('metric', [Validators.required]),
  });

  public selectedWeatherInfo?: WeatherInfo;
  public isLoading = false;
  public error?: string;

  constructor(
    private weatherService: WeatherService,
    private dialog: MatDialog,
    private stateService: StateService
  ) {}

  get cityName() {
    return this.searchForm.value.cityName;
  }

  get units() {
    return this.searchForm.value.units;
  }

  ngOnInit(): void {
    this.handlePersistedState();

    // listen to selected weather info changed
    this.stateService.selectedWeather
      .pipe(takeUntil(this.$_destory))
      .subscribe((weatherData) => {
        this.selectedWeatherInfo = weatherData;
      });

    // subscribe to changes in the units form control
    this.searchForm.controls.units.valueChanges
      .pipe(takeUntil(this.$_destory))
      .subscribe((units) => {
        if (this.cityName && units) {
          this.updateWeatherUnits(units);
        }
      });
  }

  ngOnDestroy(): void {
    this.$_destory.next();
    this.$_destory.complete();
  }

  onSearch() {
    const cityName = this.cityName;
    const units = this.units;

    if (!cityName || !units) return;

    this.isLoading = true;
    this.error = undefined;

    this.weatherService
      .getWeatherInfo(cityName, units)
      .pipe(take(1))
      .subscribe({
        next: (weatherDataResponse) => {
          const weatherData = weatherDataResponse;
          const searchParamsWithData: SearchParamsWithData = {
            cityName,
            units,
            weatherInfo: weatherData,
          };

          if (weatherData.length === 0) {
            this.error = 'City not found! Please enter a valid city name.';
          } else if (weatherData.length > 1) {
            this.dialog.open(PromptComponent, {
              data: searchParamsWithData,
            });
          } else {
            this.stateService.selectedWeather.next(weatherData[0]);
            // Save the new search info to local storage
            this.weatherService.saveSearchInfoToLocalStorage({
              cityName,
              units,
              weatherInfo: weatherData[0],
            });
          }

          this.isLoading = false;
        },
        error: (err) => {
          this.error =
            'Unable to retrieve weather data. Please verify the city name and try again, or check your internet connection.';
          this.isLoading = false;
        },
      });
  }

  updateWeatherUnits(units: WeatherUnit) {
    if (this.selectedWeatherInfo) {
      this.isLoading = true;
      this.error = undefined;

      this.weatherService
        .getWeatherInfo(this.selectedWeatherInfo.cityName, units)
        .pipe(take(1))
        .subscribe({
          next: (weatherDataResponse) => {
            const weatherData = weatherDataResponse;
            if (weatherData.length > 0) {
              this.stateService.selectedWeather.next(weatherData[0]);
              // Save the updated weather info to local storage
              this.weatherService.saveSearchInfoToLocalStorage({
                units: units,
                cityName: weatherData[0].cityName,
                weatherInfo: weatherData[0],
              });
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.error =
              'Unable to retrieve weather data. Please verify the city name and try again, or check your internet connection.';
            this.isLoading = false;
          },
        });
    }
  }

  handlePersistedState() {
    const persistedData = this.weatherService.getPersistedSearchInfo();

    if (persistedData === undefined) return;

    // update the component state
    this.searchForm.patchValue({
      cityName: persistedData.cityName,
      units: persistedData.units as WeatherUnit,
    });
    this.stateService.selectedWeather.next(persistedData.weatherInfo);
  }

  resetSelectedWeather() {
    this.stateService.selectedWeather.next(undefined);
  }
}
