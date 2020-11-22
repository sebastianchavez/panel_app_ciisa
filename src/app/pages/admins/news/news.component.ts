import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { LoggerService } from 'app/services/logger/logger.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  idLog: string = 'NewsComponent'
  mytime: Date = new Date();
  fileup: any;
  document = {
    type: '',
    imageName: '',
    image: ''
  }
  progress:number = 0;
  flagOk: boolean = false;
  flagError: boolean = false;
  news = {
    image: '',
    imageName: '',
    title: '',
    description: '',
    criteria: {
      year: 0,
      section: 0,
      period: 0,
      career: '',
      subject: ''
    }
  }
  years: Array<any> = []
  sections: Array<any> = []
  periods: Array<any> = []
  careers: Array<any> = []
  subjects: Array<any> = []
  submitted: boolean = false
  load: boolean = false
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 3000,
    showConfirmButton: false
  })
  
  constructor(private api: ApiService, private logger: LoggerService) { 
  }


  ngOnInit(): void {
    this.getYears()
  }

  clearNews(){
    this.news = {
      image: '',
      imageName: '',
      title: '',
      description: '',
      criteria: {
        year: 0,
        section: 0,
        period: 0,
        career: '',
        subject: ''
      }
    }
  }

  onSelectFile(event) {
    this.document.type = event.target.files[0].type.split('/')[1];
    if (event.target.files && event.target.files[0]) {
      this.progress = 0
      this.flagOk = false;
      this.flagOk = false;
      let interval = setInterval(() => {
        if(this.progress < 99){
          this.progress++;
        }
      },100)
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.document.imageName = Date.now() + '.' + event.target.files[0].name.split('.')[1]
        this.document.image = e.target.result.split(',')[1].toString()
        this.api.put('api/news/update-image', this.document).subscribe((res:any) => {
          this.news.image = res.urlImage
          this.news.imageName = this.document.imageName;         
          this.progress = 100
          setTimeout(() => {
          clearInterval(interval)
            this.flagOk = true
          },1000)
        },err => {
          this.progress = 100
          clearInterval(interval)
          setTimeout(() => {
            this.flagError = true
          },1000)
        })
      }
    }
  }

  getYears(){
    this.api.get('api/segments/get-years').subscribe((res: any) => {
      if(res && res.length > 0){
        res.forEach(r => {
          this.years.push(r._id.year)
        });
      }
    },err => {
    })
  }

  getPeriods(){
    this.logger.info(this.idLog, 'getPeriods', {info: 'getPeriods', year: this.news.criteria.year})
    this.periods = []
    this.sections = []
    this.careers = []
    this.subjects = []
    this.news.criteria.career = ''
    this.news.criteria.subject = ''
    if(this.news.criteria.year > 0){
      this.api.get(`api/segments/periods/${this.news.criteria.year}`).subscribe((res: any) => {
        if(res && res.length > 0){
          res.forEach(r => {
            this.periods.push(r._id.period)
          })
        }
        this.news.criteria.period = 0
        this.news.criteria.section = 0
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
    if(this.news.criteria.year > 0 && this.news.criteria.period){
      this.api.get(`api/segments/sections/year/${this.news.criteria.year}/period/${this.news.criteria.period}`).subscribe((res: any) => {
        if(res && res.length > 0){
          res.forEach(r => {
            this.sections.push(r._id.section)
          })
        }
        this.news.criteria.section = 0
        this.news.criteria.career = ''
        this.news.criteria.subject = ''
        this.logger.info(this.idLog, 'getSections', { info: 'Success', response: res})
      },err => {
        this.logger.error(this.idLog, 'getSections', { info: 'Error', error: err})
      })
    }
  }

  getCareer(){
    this.careers = []
    this.subjects = []
    if(this.news.criteria.year > 0 && this.news.criteria.period > 0 && this.news.criteria.section > 0) {
      this.api.get(`api/segments/careers?year=${this.news.criteria.year}&period=${this.news.criteria.period}&section=${this.news.criteria.section}`)
        .subscribe((res: any) => {
          if(res && res.length > 0) {
            res.forEach(r => {
              this.careers.push(r._id.career)
            })
          }
          this.news.criteria.career = ''
          this.news.criteria.subject = ''
          this.logger.info(this.idLog, 'getCareer', { info: 'Success', response: res})
        },err => {
          this.logger.error(this.idLog, 'getCareer', { info: 'Error', error: err})
        })
    }
  }

  getSubjects(){
    this.subjects = []
    if(this.news.criteria.year > 0 && this.news.criteria.period > 0 && this.news.criteria.section > 0 && this.news.criteria.career != ''){
      this.api.get(`api/segments/subjects?year=${this.news.criteria.year}&period=${this.news.criteria.period}&section=${this.news.criteria.section}&career=${this.news.criteria.career}`)
        .subscribe((res: any) => {
          this.logger.info(this.idLog, 'getSubjects', { info: 'Success', response: res})
          if(res && res.length > 0) {
            res.forEach(r => {
              this.subjects.push(r._id.subject)
            })
          }
          this.news.criteria.subject = ''
        },err => {
          this.logger.error(this.idLog, 'getSubjects', { info: 'Error', error: err})
        })
    } else {
      this.subjects = []
      this.news.criteria.subject = ''
    }
  }

  createNews(){
    this.logger.info(this.idLog, 'createNews', {info: 'into', data: this.news})
    
    this.submitted = true
    if(this.news.title.trim() == '' || this.news.description.trim() == '' || this.news.image == '' || this.news.imageName == '') {
      return
    }
    
    this.load = true
    this.api.post(`api/news/create`, this.news).subscribe(res => {
      this.Toast.fire({icon: 'success', title: 'Noticia creada'})
      this.load = false
      this.clearNews()
      this.submitted = false
      this.logger.info(this.idLog, 'createNews', {info: 'Success', response: res})
    },err => {
      this.load = false
      this.logger.error(this.idLog, 'createNews', {info: 'Error', error: err})
    })
  }
}
