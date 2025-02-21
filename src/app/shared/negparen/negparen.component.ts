import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'negParen'
})
export class negParenPipe implements PipeTransform {
  transform(value: number | string): string {
    // If the value is negative, format it with parentheses
    if (typeof value === 'number' && value < 0) {
      return `(${Math.abs(value)})`; // Absolute value inside parentheses
    }
    return value.toString(); // Otherwise, return the value as is
  }
}