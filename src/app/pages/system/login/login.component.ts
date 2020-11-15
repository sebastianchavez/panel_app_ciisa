import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'app/services/api/api.service';
import { CONSTANTS } from '../../../constants/constants'
import Swal from 'sweetalert2';
import { UtilService } from 'app/services/util/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 3000,
    showConfirmButton: false
  })

  loginForm: FormGroup;
  submitted = false;
  btnLoad: Boolean = false;
  roles: Array<any> = [
    { name: 'Administrador', value: CONSTANTS.ROLES.ADMIN },
    { name: 'Administrativo', value: CONSTANTS.ROLES.ADMINISTRATIVE }
  ];

  validRut: boolean = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private api: ApiService, private util: UtilService) { }

  ngOnInit() {
    this.clearForm()
  }

  clearForm(){
    this.loginForm = this.formBuilder.group({
      rut: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(value) {
    this.submitted = true;

    console.log(value)
    if (this.loginForm.invalid || !this.validRut) {
      return;
    }

    let body = value
    body.rut = body.rut.split('.').join('').split('-').join('')
    body.role = (<HTMLInputElement>document.getElementById('role')).value;
    this.btnLoad = true
    console.log('BODY:',body)
    document.getElementById('btnSubmit').setAttribute('disabled', 'disabled')
    this.api.put('api/admins/login', body).subscribe((res: any) => {
      localStorage.setItem('isLogin', 'true')
      localStorage.setItem('accessToken',JSON.stringify(res.accessToken))
      delete res.accessToken
      localStorage.setItem('currentUser',JSON.stringify(res))
      this.btnLoad = false
      document.getElementById('btnSubmit').removeAttribute('disabled')
      this.Toast.fire({icon: 'success', title: 'Usuario logueado con éxito'})
      this.router.navigate([''])
    },err => {
      let msg = err.error.message ? err.error.message : 'Error al ingresar' 
      this.btnLoad = false
      document.getElementById('btnSubmit').removeAttribute('disabled')
      Swal.fire({icon: 'error', title: msg})
      console.log(err)
    })

  }

  formarRut() {
    if (this.loginForm.value.rut.length > 2) {
      this.loginForm.setValue({
        ['rut']: this.util.formatRut(this.loginForm.value.rut.split('.').join('').split('-').join('').split(' ').join('')),
        ['password']: this.loginForm.value.password,
      });
      this.validateRut();
    }
  }

  validateRut() {
    if (this.util.ValidateRut(this.util.SinPuntos(this.loginForm.value.rut.split('-').join('')))) {
      this.validRut = true;
    } else {
      this.validRut = false;
    }
    console.log(this.validRut)
  }

  goToRegister(){
    this.router.navigate(['/register'])
  }
}
