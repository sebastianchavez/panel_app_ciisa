import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { LoggerService } from 'app/services/logger/logger.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report-news',
  templateUrl: './report-news.component.html',
  styleUrls: ['./report-news.component.css']
})
export class ReportNewsComponent implements OnInit {
  idLog: string = 'ReportNewsComponent'
  years: Array<any> = []
  yearsFilter: Array<any> = []
  sections: Array<any> = []
  sectionsFilter: Array<any> = []
  periods: Array<any> = []
  periodsFilter: Array<any> = []
  careers: Array<any> = []
  careersFilter: Array<any> = []
  subjects: Array<any> = []
  subjectsFilter: Array<any> = []
  filter = {
    year: 0,
    section: 0,
    period: 0,
    career: '',
    subject: '',
    limit: 'all'
  }
  newsList:Array<any> = [];
  data:Array<Array<any>> = []

  constructor(private api: ApiService, private logger: LoggerService) { }

  ngOnInit(): void {
    this.getYears()
    this.searchNews()
  }

  getYears(){
    this.api.get('api/segments/get-years').subscribe((res: any) => {
      if(res && res.length > 0){
        res.forEach(r => {
          this.years.push(r._id.year)
          this.yearsFilter.push(r._id.year)
        });
      }
    },err => {
    })
  }

  getPeriods(){
    this.logger.info(this.idLog, 'getPeriods', {info: 'getPeriods'})
      this.periodsFilter = []
      this.sectionsFilter = []
      this.careersFilter = []
      this.subjectsFilter = []
      this.filter.career = ''
      this.filter.subject = ''
      if(this.filter.year > 0){
        this.api.get(`api/segments/periods/${this.filter.year}`).subscribe((res: any) => {
          if(res && res.length > 0){
            res.forEach(r => {
              this.periodsFilter.push(r._id.period)
            })
          }
          this.filter.period = 0
          this.filter.section = 0
          this.getSections()
          this.logger.info(this.idLog, 'getPeriods', { info: 'Success', response: res, periods: this.periods})
        },err => {
          this.logger.error(this.idLog, 'getPeriods', { info: 'Error', error: err})
        })
      }
  }

  getSections(){
      this.sectionsFilter = []
      this.careersFilter = []
      this.subjectsFilter = []
      if(this.filter.year > 0 && this.filter.period){
        this.api.get(`api/segments/sections/year/${this.filter.year}/period/${this.filter.period}`).subscribe((res: any) => {
          if(res && res.length > 0){
            res.forEach(r => {
              this.sectionsFilter.push(r._id.section)
            })
          }
          this.filter.section = 0
          this.filter.career = ''
          this.filter.subject = ''
          this.logger.info(this.idLog, 'getSections', { info: 'Success', response: res})
        },err => {
          this.logger.error(this.idLog, 'getSections', { info: 'Error', error: err})
        })
      }
  }

  getCareer(){
      this.careersFilter = []
      this.subjectsFilter = []
      if(this.filter.year > 0 && this.filter.period > 0 && this.filter.section > 0) {
        this.api.get(`api/segments/careers?year=${this.filter.year}&period=${this.filter.period}&section=${this.filter.section}`)
          .subscribe((res: any) => {
            if(res && res.length > 0) {
              res.forEach(r => {
                this.careersFilter.push(r._id.career)
              })
            }
            this.filter.career = ''
            this.filter.subject = ''
            this.logger.info(this.idLog, 'getCareer', { info: 'Success', response: res})
          },err => {
            this.logger.error(this.idLog, 'getCareer', { info: 'Error', error: err})
          })
      }
  }

  getSubjects(){
      this.subjectsFilter = []
      if(this.filter.year > 0 && this.filter.period > 0 && this.filter.section > 0 && this.filter.career != ''){
        this.api.get(`api/segments/subjects?year=${this.filter.year}&period=${this.filter.period}&section=${this.filter.section}&career=${this.filter.career}`)
          .subscribe((res: any) => {
            this.logger.info(this.idLog, 'getSubjects', { info: 'Success', response: res})
            if(res && res.length > 0) {
              res.forEach(r => {
                this.subjectsFilter.push(r._id.subject)
              })
            }
            this.filter.subject = ''
          },err => {
            this.logger.error(this.idLog, 'getSubjects', { info: 'Error', error: err})
          })
      } else {
        this.subjectsFilter = []
        this.filter.subject = ''
      }
  }

  searchNews(){
    this.logger.info(this.idLog, 'searchNews', {info: 'into', filter: this.filter})
    let query = `?year=${this.filter.year}&period=${this.filter.period}&section=${this.filter.section}&career=${this.filter.career}&subject=${this.filter.subject}`
    this.api.get(`api/news/get-by-criteria${query}`).subscribe((res: any) => {
      this.newsList = res.news;
      this.logger.info(this.idLog, 'searchNews', {info: 'Success', response: res})
    },err => {
      this.logger.error(this.idLog, 'searchNews', {info: 'Error', error: err})
    })
  }

  exportToExcel(){
    this.data.push(['Titulo','Descripción', 'URL Imagen', 'Fecha creación'])
      this.newsList.forEach(u => this.data.push([u.title, u.description, u.image, u.createdAt]))
      this.logger.info(this.idLog, 'exportToExcel', {info: 'into', data: this.data, news: this.newsList})
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
      XLSX.utils.book_append_sheet(wb, ws, 'Usuarios ');  
      XLSX.writeFile(wb, `UsersReport_${Date.now()}.xlsx`);
  }
}
