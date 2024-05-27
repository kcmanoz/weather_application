export interface WeatherInfo {
  id: number;
  cityName: string;
  feelsLike: number;
  latitude: number;
  longitude: number;
  temp: number;
  minTemp: number;
  maxTemp: number;
  pressure: number;
  humidity: number;
  country: string;
  windSpeed: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}

export type WeatherUnit = 'metric' | 'imperial';

export interface SearchParams {
  cityName: string;
  units: string;
}

export interface PersistedSearchItem extends SearchParams {
  weatherInfo: WeatherInfo;
}

export interface SearchParamsWithData extends SearchParams {
  weatherInfo: WeatherInfo[];
}
