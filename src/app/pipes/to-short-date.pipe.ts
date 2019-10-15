import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toShortDate'
})
export class ToShortDatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
   console.log(value);
   // si valeur convertit en minuscule est = à 'asap' retourner 'dès que possible'
   if(value.toLowerCase() === 'asap') {
      return 'dès que possible';

     // si notre date comporte des tirets (destructuring ES6)
   } else if(value.indexOf('-') > -1) {
      let fullDate, rest;
      [fullDate, rest] = value.toLowerCase().split('t'); // on récupère ds fullDate valeur à gauche du T '2019-07-07T15:45:00Z'

      let year, month, date;
      [year, month, date] = fullDate.split('-'); // ['2019', '07', '07']

      return `${date}/${month}/${year}`;

      // sinon si on est dans aucun de ces cas
   } else {
     return '--';
   }
  }

}
