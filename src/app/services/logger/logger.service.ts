import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor() { }

  log(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A') {
    this.printLog(page, functionName, data, 'LOG');
  }

  warn(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A') {
    this.printLog(page, functionName, data, 'WARN');
  }

  info(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A') {
    this.printLog(page, functionName, data, 'INFO');
  }

  error(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A') {
    this.printLog(page, functionName, data, 'ERROR');
  }

  printLog(page: string = 'N/A', functionName: string = 'N/A', data: any = 'N/A', type: string = 'LOG') {
    let data2: any;
    if (environment.debbug) {
          try {
            data2 = data;
          } catch (err) {
            console.log('logger trycatch error: ', err)
          }
          if (type == 'LOG') {
            console.log('@@@@@ Page[', page, ']', ' --Func[', functionName, '] -->[', data2, ']');
          }
          if (type == 'INFO') {
            console.log('@@@@@ Page[', page, ']', ' --Func[', functionName, '] -->[', data2, ']');
          }
          if (type == 'WARN') {
            console.warn('@@@@@ Page[', page, ']', ' --Func[', functionName, '] -->[', data2, ']');
          }
          if (type == 'ERROR') {
            console.error('@@@@@ Page[', page, ']', ' --Func[', functionName, '] -->[', data2, ']');
          }
    }
  }
}
