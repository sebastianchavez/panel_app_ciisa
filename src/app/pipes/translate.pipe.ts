import { Pipe, PipeTransform } from '@angular/core';
import { dictionary } from '../constants/dictionary'

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  dictionary = dictionary

  transform(value) {
    if (!value || value == ''){
      return
    }
    value = value.toLowerCase()
    if(this.dictionary.filter(d => d.en == value).length > 0){
      return this.dictionary.filter(d => d.en == value)[0].es
    } else {
      return
    }
  }

}
