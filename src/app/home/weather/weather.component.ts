import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
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
  imports: [ReactiveFormsModule, CardComponent],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent implements OnInit, OnDestroy {
  public $_destory = new Subject<void>();
  public searchForm = new FormGroup({
    cityName: new FormControl(''),
    units: new FormControl<WeatherUnit>('metric'),
  });

  public selectedWeatherInfo?: WeatherInfo;

  constructor(
    private weatherService: WeatherService,
    private dialog: MatDialog,
    private stateService: StateService
  ) {}

  get cityName() {
    return this.searchForm.value.cityName;
  }

  get units() {
    // For temperature in Fahrenheit and wind speed in miles/hour, use imperial as units

    //For temperature in Celsius and wind speed in meter/sec, use metric as units

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
  }

  ngOnDestroy(): void {
    this.$_destory.next();
    this.$_destory.complete();
  }

  onSearch() {
    const cityName = this.cityName;
    const units = this.units;

    if (!cityName || !units) return;

    this.weatherService
      .getWeatherInfo(cityName, units)
      .pipe(take(1))
      .subscribe((weatherDataResponse) => {
        const weatherData = weatherDataResponse;

        const searchParamsWithData: SearchParamsWithData = {
          cityName,
          units,
          weatherInfo: weatherData,
        };

        if (weatherData.length > 1) {
          this.dialog.open(PromptComponent, {
            data: searchParamsWithData,
          });
          return;
        }

        this.stateService.selectedWeather.next(
          weatherData.length === 1 ? weatherData.pop() : undefined
        );
      });
  }

  handlePersistedState() {
    const presistedData = this.weatherService.getPersistedSearchInfo();

    if (presistedData === undefined) return;

    // update the component state
    this.searchForm.patchValue({
      cityName: presistedData.cityName,
      units: presistedData.units as WeatherUnit,
    });
    this.stateService.selectedWeather.next(presistedData.weatherInfo);
  }

  resetSelectedWeather() {
    this.stateService.selectedWeather.next(undefined);
  }
}
