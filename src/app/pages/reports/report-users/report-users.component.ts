import { Component, OnInit } from '@angular/core';
import { ChartType, LegendItem } from 'app/lbd/lbd-chart/lbd-chart.component';
import { ApiService } from 'app/services/api/api.service';
import { LoggerService } from 'app/services/logger/logger.service';
import { SELECTS } from '../../../constants/constants'
import { dictionary } from '../../../constants/dictionary'
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report-users',
  templateUrl: './report-users.component.html',
  styleUrls: ['./report-users.component.css']
})
export class ReportUsersComponent implements OnInit {
  idLog: string = 'ReportUsersComponent'
  users: Array<any>
  SELECTS = SELECTS
  dictionary = dictionary
  
    filter = {
      limit: 10,
      name: '',
      rut: '',
      email: ''
    }
    data:Array<Array<any>> = []
  constructor(private api: ApiService, private logger: LoggerService) { }

  ngOnInit() {
    this.getUsers()
  }

    searchUser(){
      this.api.get(`api/users/search-user?name=${this.filter.name}&email=${this.filter.email}&rut=${this.filter.rut}&limit=${this.filter.limit}`)
        .subscribe((res: any) => {
          this.logger.info(this.idLog, 'searchUser', {info: 'Success searchUser', response: res})
          this.users = res.users;
      },err => {
          this.logger.error(this.idLog, 'searchUser', {info: 'Error searchUser', error: err})
      })
    }

    exportToExcel(){
      this.data.push(['Nombre','Apellido', 'Email', 'Rut', 'Habilitado', 'Tipo de usuario', 'Fecha de registro'])
      this.users.forEach(u => this.data.push([u.name, u.lastname, u.email, u.rut.substr(0, u.rut.length - 1) + '-' + u.rut.substr(u.rut.length - 1), u.state ? 'Si' : 'No', u.type && this.dictionary.filter(d => d.en == u.type.toLowerCase()).length > 0 ? this.dictionary.filter(d => d.en == u.type.toLowerCase())[0].es : u.type.toLowerCase(), u.createdAt]))
      this.logger.info(this.idLog, 'exportToExcel', {info: 'into', data: this.data, users: this.users})
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
      XLSX.utils.book_append_sheet(wb, ws, 'Usuarios ');  
      XLSX.writeFile(wb, `UsersReport_${Date.now()}.xlsx`);
    }  

    getUsers(){
      this.api.get('api/users/all-users').subscribe((res:any) => {
        this.logger.log(this.idLog, 'getUsers', {info: 'Success getUsers', response: res})
        this.users = res;
      },err => {
        this.logger.error(this.idLog, 'getUsers', {info: 'Error getUsers', error: err})
      })
    }

}
