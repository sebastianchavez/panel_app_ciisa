import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CONSTANTS } from '../../../constants/constants'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  CONSTANTS = CONSTANTS
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
  
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder) { }

  get f() { return this.userForm.controls; }

  ngOnInit(): void {
    this.clearForm()
  }

  searchUser(){

  }

  clearForm(){
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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

}
