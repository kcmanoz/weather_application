import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformUnitValue',
  standalone: true,
})
export class TransformUnitValuePipe implements PipeTransform {
  transform(value: number): unknown {
    console.log(Math.floor(value));
    return Math.floor(value);
  }
}
