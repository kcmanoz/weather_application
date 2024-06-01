import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { PersistedSearchItem, WeatherInfo } from '../utils/types';

const SEARCH_DATA_KEY = 'searched-data';
const BASE_URL = 'https://api.openweathermap.org';
const API_KEY = '1cb6ace31e50401f28b864f0b23fdc68';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  private transformWeatherData(data: any): WeatherInfo[] {
    return data.list.map((weatherInfo: any) => ({
      id: weatherInfo.id,
      cityName: weatherInfo.name,
      feelsLike: weatherInfo.main.feels_like,
      latitude: weatherInfo.coord.lat,
      longitude: weatherInfo.coord.lon,
      temp: weatherInfo.main.temp,
      minTemp: weatherInfo.main.temp_min,
      maxTemp: weatherInfo.main.temp_max,
      pressure: weatherInfo.main.pressure,
      humidity: weatherInfo.main.humidity,
      country: weatherInfo.sys.country,
      windSpeed: weatherInfo.wind.speed,
      weather: weatherInfo.weather.map((data: any) => ({
        main: data.main,
        description: data.description,
        icon: data.icon,
      })),
    }));
  }

  private filterAndtransformWeatherData(data: any): WeatherInfo[] {
    const transformedWeatherData = this.transformWeatherData(data);

    const uniqueCoordinates = new Set();
    const filteredWeatherData: WeatherInfo[] = [];

    for (const weather of transformedWeatherData) {
      const { latitude, longitude } = weather;
      const roundedLat = Math.floor(weather.latitude);
      const roundedLong = Math.floor(weather.longitude);
      const coordinatePair = `${roundedLat},${roundedLong}`;

      if (!uniqueCoordinates.has(coordinatePair)) {
        uniqueCoordinates.add(coordinatePair);
        filteredWeatherData.push(weather);
      }
    }

    return filteredWeatherData;
  }

  getWeatherInfo(
    cityName: string,
    units: 'metric' | 'imperial'
  ): Observable<WeatherInfo[]> {
    return this.http
      .get<WeatherInfo[]>(
        BASE_URL +
          `/data/2.5/find?q=${cityName}&units=${units}&appid=${API_KEY}`
      )
      .pipe(
        map((weatherData) => this.filterAndtransformWeatherData(weatherData)),
        catchError((error) => {
          console.error('Error fetching weather data', error);
          return throwError(() => new Error('Failed to fetch weather data'));
        })
      );
  }

  getPersistedSearchInfo(): PersistedSearchItem | undefined {
    const persistedSearchData = localStorage.getItem(SEARCH_DATA_KEY);

    if (persistedSearchData === null) return undefined;

    return JSON.parse(persistedSearchData);
  }

  saveSearchInfoToLocalStorage(data: PersistedSearchItem): void {
    localStorage.setItem(SEARCH_DATA_KEY, JSON.stringify(data));
  }
}
