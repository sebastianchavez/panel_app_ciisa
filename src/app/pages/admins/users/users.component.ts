import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'app/services/api/api.service';
import { LoggerService } from 'app/services/logger/logger.service';
import { UtilService } from 'app/services/util/util.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { SELECTS } from '../../../constants/constants'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  idLog = 'UsersComponent';

  SELECTS = SELECTS
  modalRef: BsModalRef;
  userForm: FormGroup;

  submitted = false;
  filter: any = {
    limit: 10,
    name: '',
    rut: '',
    email: ''
  }
  users:Array<any> =  [];
  user:any = {}
  load: Boolean = false;
  btnLoad: Boolean = false;
  query = '';
  validRut: boolean = false;
  
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, private util: UtilService, private api: ApiService, private logger: LoggerService) { }

  get f() { return this.userForm.controls; }

  ngOnInit(): void {
    this.clearForm()
    this.getUsers()
  }

  searchUser(){

  }

  clearForm(){
    this.userForm = this.formBuilder.group({
      rut: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: [''],
      lastname: [''],
      email: ['', [Validators.email]],
      type: ['', [Validators.required]]
    });
  }

  registerUser(){

  }

  openModal(template: TemplateRef<any>, action?:string, data?:any) {
    this.clearForm()
    let option = { class: ''}
    if(action === 'excel'){
      option.class = 'modal-lg'
    }
    this.modalRef = this.modalService.show(template, option);
  }



  onSubmit(value){
    this.submitted = true;

    console.log(value)
    if (this.userForm.invalid || !this.validRut) {
      return;
    }
    this.btnLoad = true;
    let request = value;
    request.rut = value.rut.split('.').join('').split('-').join('');
    this.api.post('api/users/register', request).subscribe(res => {
      this.logger.log(this.idLog, 'onSubmit', {info: 'Success register user', response: res})
      Swal.fire({title: 'Usuario agregado', icon:'success'}).then(() => {
        this.modalRef.hide();
        this.btnLoad = false;
      })
      this.getUsers()
    }, err => {
      this.btnLoad = false;
      let msg = err.error && err.error.message ? err.error.message : 'Problemas al crear usuario intente mas tarde' 
      Swal.fire({title: msg, icon: 'error'});
      this.logger.error(this.idLog, 'onSubmit', {info: 'Error register user', error: err})
    })
  }

  getUsers(){
    this.api.get('api/users/all-users').subscribe((res:any) => {
      this.logger.log(this.idLog, 'getUsers', {info: 'Success getUsers', response: res})
      this.users = res;
    },err => {
      this.logger.error(this.idLog, 'getUsers', {info: 'Error getUsers', error: err})
    })
  }

  formarRut() {
    if (this.userForm.value.rut.length > 2) {
      this.userForm.setValue({
        ['rut']: this.util.formatRut(this.userForm.value.rut.split('.').join('').split('-').join('').split(' ').join('')),
        ['password']: this.userForm.value.password,
        ['name']: this.userForm.value.name,
        ['lastname']: this.userForm.value.lastname,
        ['email']: this.userForm.value.email,
        ['type']: this.userForm.value.type,
      });
      this.validateRut();
    }
  }

  validateRut() {
    if (this.util.ValidateRut(this.util.SinPuntos(this.userForm.value.rut.split('-').join('')))) {
      this.validRut = true;
    } else {
      this.validRut = false;
    }
    console.log(this.validRut)
  }

}
