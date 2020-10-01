import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'app/services/api/api.service';
import { CONSTANTS } from '../../../constants/constants'
import Swal from 'sweetalert2';

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

  constructor(private router: Router, private formBuilder: FormBuilder, private api: ApiService) { }

  ngOnInit() {
    this.clearForm()
  }

  clearForm(){
    this.loginForm = this.formBuilder.group({
      rut: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(value) {
    this.submitted = true;

    console.log(value)
    if (this.loginForm.invalid) {
      return;
    }

    let body = value
    body.type = 'user'
    this.btnLoad = true
    console.log('BODY:',body)
    document.getElementById('btnSubmit').setAttribute('disabled', 'disabled')
    this.api.put('api/admins/login', body, false).subscribe((res: any) => {
      localStorage.setItem('currentUser',JSON.stringify(res))
      localStorage.setItem('isLogin', 'true')
      this.btnLoad = false
      document.getElementById('btnSubmit').removeAttribute('disabled')
      this.Toast.fire({icon: 'success', title: 'Usuario logueado con éxito'})
      this.router.navigate([''])
    },err => {
      let msg = err.error.message ? err.error.message : 'Error al ingresar' 
      this.btnLoad = false
      document.getElementById('btnSubmit').removeAttribute('disabled')
      this.Toast.fire({icon: 'error', title: msg})
      console.log(err)
    })

  }

  goToRegister(){
    this.router.navigate(['/register'])
  }
}
