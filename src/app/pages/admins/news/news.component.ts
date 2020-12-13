import { IfStmt } from '@angular/compiler';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { LoggerService } from 'app/services/logger/logger.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  filter = {
    year: 0,
    section: 0,
    period: 0,
    career: '',
    subject: ''
  }
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
  submitted: boolean = false
  load: boolean = false
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 3000,
    showConfirmButton: false
  })
  modalRef: BsModalRef;
  newsList:Array<any> = [];
  newsView: any = {}
  
  constructor(private api: ApiService, private logger: LoggerService, private modalService: BsModalService) { 
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

  openModal(template: TemplateRef<any>, data?: any) {
    let option = { class: 'modal-lg'}
    if(data){
      option = { class: ''}
      this.newsView = data
    }
    this.modalRef = this.modalService.show(template, option);
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
          this.yearsFilter.push(r._id.year)
        });
      }
    },err => {
    })
  }

  getPeriods(action: number = 0){
    this.logger.info(this.idLog, 'getPeriods', {info: 'getPeriods', year: this.news.criteria.year})
    if(action == 1){
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
          this.getSections(1)
          this.logger.info(this.idLog, 'getPeriods', { info: 'Success', response: res, periods: this.periods})
        },err => {
          this.logger.error(this.idLog, 'getPeriods', { info: 'Error', error: err})
        })
      }
    } else {
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
  }

  getSections(action: number = 0){
    if(action == 1){
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
    } else {
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
  }

  getCareer(action: number = 0){
    if(action == 1) {
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
    } else {
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
  }

  getSubjects(action: number = 0){
    if(action == 1){
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
    }else{
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
      this.modalRef.hide()
      this.searchNews()
    },err => {
      this.load = false
      this.logger.error(this.idLog, 'createNews', {info: 'Error', error: err})
    })
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
}
