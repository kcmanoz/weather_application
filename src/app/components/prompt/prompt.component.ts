import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { SearchParamsWithData, WeatherInfo } from '../../utils/types';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { StateService } from '../../services/state.service';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-prompt',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
  ],
  templateUrl: './prompt.component.html',
  styleUrl: './prompt.component.scss',
})
export class PromptComponent {
  public selectedWeatherInfo?: WeatherInfo;

  constructor(
    @Inject(MAT_DIALOG_DATA) public searchParamsWithData: SearchParamsWithData,
    private stateService: StateService,
    private weatherService: WeatherService
  ) {}

  onConfirm() {
    // change the state of selected weather
    this.stateService.selectedWeather.next(this.selectedWeatherInfo);

    // save selected info with searched params to local storage
    if (this.selectedWeatherInfo !== undefined) {
      this.weatherService.saveSearchInfoToLocalStorage({
        units: this.searchParamsWithData.units,
        cityName: this.searchParamsWithData.cityName,
        weatherInfo: this.selectedWeatherInfo,
      });
    }
  }
}
