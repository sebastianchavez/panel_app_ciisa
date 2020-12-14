import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'app/services/api/api.service';
import { LoggerService } from 'app/services/logger/logger.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { SELECTS } from '../../../constants/constants'

@Component({
  selector: 'app-segmentation',
  templateUrl: './segmentation.component.html',
  styleUrls: ['./segmentation.component.css']
})
export class SegmentationComponent implements OnInit {
  idLog: string = 'SegmentationComponent'
  SELECTS = SELECTS
  btnLoad: boolean = false;
  modalRef: BsModalRef;
  segmentForm: FormGroup;
  segments:Array<any> = []
  submitted: boolean = false;
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
  
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, private api: ApiService, private logger: LoggerService) { }

  get f() { return this.segmentForm.controls; }

  ngOnInit(): void {
    this.clearForm()
    this.getAllSegments()
    this.getYears()
  }

  clearForm(){
    this.segmentForm = this.formBuilder.group({
      career: ['', Validators.required],
      subject: ['', Validators.required],
      section: ['', [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      year: ['', [Validators.required, Validators.pattern(/^([0-9])*$/)]],
      period: ['', [Validators.required, Validators.pattern(/^([0-9])*$/)]],
    });
  }

  openModal(template: TemplateRef<any>, action?:string, data?:any) {
    this.clearForm()
    this.submitted = false;
    this.modalRef = this.modalService.show(template);
  }

  getAllSegments() {
    this.api.get('api/segments/get-all').subscribe((res:any) => {
      this.segments=res
      console.log('RESPONSE:', res)
    },err => {
      console.log('ERROR:', err)
    })
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

  searchSegment(){
    this.api.get(`api/segments/get-by-criteria?year=${this.filter.year}&period=${this.filter.period}&section=${this.filter.section}&career=${this.filter.career}&subject=${this.filter.subject}&limit=${this.filter.limit}`)
      .subscribe((res:any) => {
        this.logger.info(this.idLog, 'searchSegment', {info: 'Success', response: res})
        this.segments = res.segments
      },err => {
        this.logger.error(this.idLog, 'searchSegment', {info: 'Error', error: err})
      })
  }

  onSubmit(value){
    this.submitted = true;

    console.log(value)
    if (this.segmentForm.invalid) {
      return;
    }
    this.btnLoad = true;
    let request = value;
    this.api.post('api/segments/new-segment', request).subscribe(res => {
      this.logger.log(this.idLog, 'onSubmit', {info: 'Success register user', response: res})
      Swal.fire({title: 'Segmentacion agregada', icon:'success'}).then(() => {
        this.modalRef.hide();
        this.btnLoad = false;
        this.getAllSegments()
      })

    }, err => {
      this.btnLoad = false;
      let msg = err.error && err.error.message ? err.error.message : 'Problemas al crear usuario intente mas tarde' 
      Swal.fire({title: msg, icon: 'error'});
      this.logger.error(this.idLog, 'onSubmit', {info: 'Error register user', error: err})
    })
  }

}
