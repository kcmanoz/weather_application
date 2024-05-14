import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WeatherInfo } from '../utils/types';
@Injectable({
  providedIn: 'root',
})
export class StateService {
  public selectedWeather: BehaviorSubject<WeatherInfo | undefined> =
    new BehaviorSubject<WeatherInfo | undefined>(undefined);

  constructor() {}
}
