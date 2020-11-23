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
      title: '',
      description: '',
      date: '',
      initialHour: '',
      finishHour: '',
      year: 0,
      carreer: '',
      subject: '',
      section: 0,
      period: 0
      
    });
  }
  formarFormulario() {
      this.activityForm.setValue({
        ['title']: (<HTMLInputElement>document.getElementById("title")).value,
        ['description']: (<HTMLInputElement>document.getElementById("description")).value,
        ['date']: (<HTMLInputElement>document.getElementById("date")).value,
        ['initialHour']: (<HTMLInputElement>document.getElementById("initialHour")).value,
        ['finishHour']: (<HTMLInputElement>document.getElementById("finishHour")).value,
        ['year']: (<HTMLInputElement>document.getElementById("year")).value,
        ['carreer']: (<HTMLInputElement>document.getElementById("carreer")).value,
        ['subject']: (<HTMLInputElement>document.getElementById("subject")).value,
        ['section']: (<HTMLInputElement>document.getElementById("section")).value,
        ['period']: (<HTMLInputElement>document.getElementById("period")).value,


      });
    
  }


  onSubmit(value){
    
    this.submitted = true;
    this.btnLoad = true;
    let request = value;
    request.initialHour = this.initialHour
    request.finishHour = this.finishHour
    this.logger.info(this.idLog, 'onSubmit', { info: 'onSubmit', request})
    //Envio al backend
    console.log(request)
    
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