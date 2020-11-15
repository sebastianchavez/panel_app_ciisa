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
  SELECTS = SELECTS
  btnLoad: boolean = false;
  modalRef: BsModalRef;
  segmentForm: FormGroup;
  segments:Array<any> = []
  submitted: boolean = false;
  idLog: string = 'SegmentationComponent'
  
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, private api: ApiService, private logger: LoggerService) { }

  get f() { return this.segmentForm.controls; }

  ngOnInit(): void {
    this.clearForm()
    this.getAllSegments()
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
