import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { of } from 'rxjs';
import { PersistedSearchItem, WeatherInfo } from '../utils/types';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpTestingController: HttpTestingController;

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

  const mockPersistedData = {
    cityName: 'London',
    units: 'metric',
    weatherInfo: mockWeatherData,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService],
    });
    service = TestBed.inject(WeatherService);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Spy on localStorage.setItem
    spyOn(localStorage, 'setItem').and.callThrough();
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that no requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve weather data from API', () => {
    const cityName = 'London';
    const units = 'metric';

    spyOn(service, 'getWeatherInfo').and.returnValue(of([mockWeatherData]));

    service.getWeatherInfo(cityName, units).subscribe((weatherData) => {
      expect(weatherData.length).toBe(1);
      expect(weatherData[0].cityName).toBe('London');
      expect(weatherData[0].country).toBe('UK');
      expect(weatherData[0].pressure).toBe(1010);
      expect(weatherData[0].windSpeed).toBe(5);
    });

    expect(service.getWeatherInfo).toHaveBeenCalledWith(cityName, units);
  });

  it('should handle errors properly', () => {
    const cityName = 'NonexistentCity';
    const units = 'metric';

    spyOn(service, 'getWeatherInfo').and.returnValue(of([]));

    service.getWeatherInfo(cityName, units).subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
      },
    });
  });

  it('should retrieve persisted search info from local storage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(mockPersistedData)
    );

    const persistedData = service.getPersistedSearchInfo();

    expect(persistedData).toEqual(mockPersistedData);
  });

  it('should save search info to local storage', () => {
    service.saveSearchInfoToLocalStorage(mockPersistedData);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'searched-data',
      JSON.stringify(mockPersistedData)
    );
  });
});
