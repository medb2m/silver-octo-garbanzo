import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any[] | undefined, searchText: string): any {
    if(!value) return [];
    if (!searchText) return value
    searchText = searchText.toLowerCase()
    return value.filter((item : any) => {
      if (item.name) {
        if (item.email){
          return JSON.stringify(item.email).toLowerCase().includes(searchText)
        }
        return JSON.stringify(item.name).toLowerCase().includes(searchText)
      }
      
      return JSON.stringify(item).toLowerCase().includes(searchText)
    })
  }

}
