import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { UtilService } from 'app/services/util/util.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoggerService } from 'app/services/logger/logger.service';


@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  idLog: 'ActivitiesComponent';


  initialHour: Date = new Date();
  finishHour: Date = new Date();
  submitted = false;
  btnLoad: Boolean = false;

  activityForm: FormGroup;
  
  segments:Array<any> =  [];

  
  

  constructor(private formBuilder: FormBuilder, private util: UtilService, private api: ApiService, private logger: LoggerService) { }

  get f() { return this.activityForm.controls; }

  ngOnInit(): void {
    this.clearForm()
    this.getSegments()

  }
  clearForm(){
    this.activityForm = this.formBuilder.group({
      tittle: [''],
      description: [''],
      date: [''],
      initialHour: [''],
      finishHour: [''],
      carreer: [''],
      subject: [''],
      section: [''],
      period: ['']
      
    });
  }
  formarFormulario() {
      this.activityForm.setValue({
        ['tittle']: this.activityForm.value.tittle,
        ['description']: this.activityForm.value.description,
        ['date']: this.activityForm.value.date,
        ['initialHour']: this.activityForm.value.initialHour,
        ['finishHour']: this.activityForm.value.finishHour,
        ['carreer']: this.activityForm.value.carreer,
        ['subject']: this.activityForm.value.subject,
        ['section']: this.activityForm.value.section,
        ['period']: this.activityForm.value.period,


      });
    
  }


  onSubmit(value){
    
    this.submitted = true;
    console.log(value)
    this.btnLoad = true;
    let request = value;

    //Envio al backend
    /*
    this.api.post('api/activities/', request).subscribe(res => {
      this.logger.log(this.idLog, 'onSubmit', {info: 'Activity created successfully', response: res})
      Swal.fire({title: 'Actividad agregada', icon:'success'}).then(() => {
        this.btnLoad = false;
      })
      
    }, err => {
      this.btnLoad = false;
      let msg = err.error && err.error.message ? err.error.message : 'Problemas al crear actividad intente mas tarde' 
      Swal.fire({title: msg, icon: 'error'});
      this.logger.error(this.idLog, 'onSubmit', {info: 'Error register activity', error: err})
    })
    */
    
    
  }
  getSegments(){
    this.api.get('api/segments').subscribe((res:any) => {
      this.logger.log(this.idLog, 'getSegments', {info: 'Success getSegments', response: res})
      this.segments = res;
    },err => {
      this.logger.error(this.idLog, 'getUsers', {info: 'Error getUsers', error: err})
    })
  }


}
