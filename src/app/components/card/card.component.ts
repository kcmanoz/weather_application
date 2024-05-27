import { Component, Input } from '@angular/core';
import { WeatherInfo, WeatherUnit } from '../../utils/types';
import { CommonModule } from '@angular/common';
import { TransformUnitValuePipe } from '../../pipes/transform-unit-value.pipe';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    TransformUnitValuePipe,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() weather?: WeatherInfo;
  @Input() units?: WeatherUnit;

  public unitMapper = {
    metric: {
      tempUnit: '°C',
      windSpeedUnit: 'm/s',
      pressureUnit: 'hPa', // Add this line
    },
    imperial: {
      tempUnit: '°F',
      windSpeedUnit: 'mi/h',
      pressureUnit: 'inHg', // Add this line
    },
  };

  get weatherDescription() {
    return this.weather?.weather.map((desc) => desc.description).join(', ');
  }

  getIconUrl(icon: string): string {
    return `http://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}
