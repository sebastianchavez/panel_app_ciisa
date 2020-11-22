import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { LoggerService } from 'app/services/logger/logger.service';

@Component({
  selector: 'app-destinatary',
  templateUrl: './destinatary.component.html',
  styleUrls: ['./destinatary.component.css']
})
export class DestinataryComponent implements OnInit {

  idLog: string = 'DestinataryComponent'
  years: Array<any> = []
  sections: Array<any> = []
  periods: Array<any> = []
  careers: Array<any> = []
  subjects: Array<any> = []
  criteria: {
    year: 0,
    section: 0,
    period: 0,
    career: '',
    subject: ''
  }

  constructor(private api: ApiService, private logger: LoggerService) { 
    this.getYears()
  }

  ngOnInit(): void {
  }

  getYears(){
    this.api.get('api/segments/get-years').subscribe((res: any) => {
      if(res && res.length > 0){
        res.forEach(r => {
          this.criteria.year = r._id.year
          this.years.push(r._id.year)
        });
      }
      this.logger.info(this.idLog, 'getYears', {info: 'Success', response: res, years: this.years})
    },err => {
      this.logger.error(this.idLog, 'getYears', {info: 'Error', error: err})
    })
  }

  getPeriods(){
    this.logger.info(this.idLog, 'getPeriods', {info: 'getPeriods', year: this.criteria.year})
    this.periods = []
    this.sections = []
    this.careers = []
    this.subjects = []
    if(this.criteria.year > 0){
      this.api.get(`api/segments/periods/${this.criteria.year}`).subscribe((res: any) => {
        if(res && res.length > 0){
          res.forEach(r => {
            this.periods.push(r._id.period)
          })
        }
        this.criteria.period = 0
        this.criteria.section = 0
        this.criteria.career = ''
        this.criteria.subject = ''
        this.getSections()
        this.logger.info(this.idLog, 'getPeriods', { info: 'Success', response: res, periods: this.periods})
      },err => {
        this.logger.error(this.idLog, 'getPeriods', { info: 'Error', error: err})
      })
    }
  }

  getSections(){
    this.sections = []
    this.careers = []
    this.subjects = []
    if(this.criteria.year > 0 && this.criteria.period){
      this.api.get(`api/segments/sections/year/${this.criteria.year}/period/${this.criteria.period}`).subscribe((res: any) => {
        if(res && res.length > 0){
          res.forEach(r => {
            this.sections.push(r._id.section)
          })
        }
        this.criteria.section = 0
        this.criteria.career = ''
        this.criteria.subject = ''
        this.logger.info(this.idLog, 'getSections', { info: 'Success', response: res})
      },err => {
        this.logger.error(this.idLog, 'getSections', { info: 'Error', error: err})
      })
    }
  }

  getCareer(){
    this.careers = []
    this.subjects = []
    if(this.criteria.year > 0 && this.criteria.period > 0 && this.criteria.section > 0) {
      this.api.get(`api/segments/careers?year=${this.criteria.year}&period=${this.criteria.period}&section=${this.criteria.section}`)
        .subscribe((res: any) => {
          if(res && res.length > 0) {
            res.forEach(r => {
              this.careers.push(r._id.career)
            })
          }
          this.criteria.career = ''
          this.criteria.subject = ''
          this.logger.info(this.idLog, 'getCareer', { info: 'Success', response: res})
        },err => {
          this.logger.error(this.idLog, 'getCareer', { info: 'Error', error: err})
        })
    }
  }

  getSubjects(){
    this.subjects = []
    if(this.criteria.year > 0 && this.criteria.period > 0 && this.criteria.section > 0 && this.criteria.career != ''){
      this.api.get(`api/segments/subjects?year=${this.criteria.year}&period=${this.criteria.period}&section=${this.criteria.section}&career=${this.criteria.career}`)
        .subscribe((res: any) => {
          this.logger.info(this.idLog, 'getSubjects', { info: 'Success', response: res})
          if(res && res.length > 0) {
            res.forEach(r => {
              this.subjects.push(r._id.subject)
            })
          }
          this.criteria.subject = ''
        },err => {
          this.logger.error(this.idLog, 'getSubjects', { info: 'Error', error: err})
        })
    }
  }

}
