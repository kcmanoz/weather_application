import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService],
    });
    service = TestBed.inject(WeatherService);
    httpTestingController = TestBed.inject(HttpTestingController);
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
    const mockWeatherData = {
      list: [
        {
          id: 1,
          name: 'London',
          main: {
            feels_like: 10,
            temp: 15,
            temp_min: 10,
            temp_max: 20,
            pressure: 1010,
            humidity: 50,
          },
          coord: { lat: 51.5074, lon: -0.1278 },
          sys: { country: 'UK' },
          wind: { speed: 5 },
          weather: [{ main: 'Cloudy', description: 'Cloudy weather' }],
        },
      ],
    };

    service.getWeatherInfo(cityName, units).subscribe((weatherData) => {
      expect(weatherData.length).toBe(1);
      expect(weatherData[0].cityName).toBe('London');
      expect(weatherData[0].country).toBe('UK');
    });

    const req = httpTestingController.expectOne(
      `http://api.openweathermap.org/data/2.5/find?q=${cityName}&units=${units}&appid=1cb6ace31e50401f28b864f0b23fdc68`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockWeatherData);
  });
});
