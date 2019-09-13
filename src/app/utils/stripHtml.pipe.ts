import { Pipe, PipeTransform } from '@angular/core';
import { decode } from 'he';

@Pipe({
  name: 'stripHtml',
})
export class StripHtmlPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    return decode(value.replace(/<.*?>/g, ''));
  }

}
