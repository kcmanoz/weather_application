import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformUnitValue',
  standalone: true,
})
export class TransformUnitValuePipe implements PipeTransform {
  transform(
    value: number,
    unitType: 'temp' | 'windSpeed' | 'pressure' | 'humidity',
    units: 'metric' | 'imperial'
  ): number {
    if (unitType === 'pressure' && units === 'imperial') {
      // Convert hPa to inHg (1 hPa ≈ 0.02953 inHg)
      return Math.floor(value * 0.02953);
    }
    return Math.floor(value);
  }
}
