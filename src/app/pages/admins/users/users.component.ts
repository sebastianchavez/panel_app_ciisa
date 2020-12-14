import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'app/services/api/api.service';
import { LoggerService } from 'app/services/logger/logger.service';
import { UtilService } from 'app/services/util/util.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { CONSTANTS, SELECTS } from '../../../constants/constants'

import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  data: AOA = [[], []];
  headerTable:AOA = [];
  bodyTable:AOA = [];

  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  idLog = 'UsersComponent';

  SELECTS = SELECTS
  modalRef: BsModalRef;
  userForm: FormGroup;

  submitted = false;
  filter = {
    limit: 10,
    name: '',
    rut: '',
    email: ''
  }
  segments: Array<any> = [];
  users:Array<any> =  [];
  newUsers = [{
    rut: '',
    name: '',
    email: '',
    password: '',
    career: '',
    category: '',
    segments: []
  }]
  user:any = {}
  load: boolean = false;
  btnLoad: Boolean = false;
  validRut: boolean = false;
  validateExcel = {
    isValid: false,
    load: false,
    finish: false,
    segmentsIsValid: true
  };
  query = '';
  
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, private util: UtilService, private api: ApiService, private logger: LoggerService) { 
    this.getAllSegment()
  }

  get f() { return this.userForm.controls; }

  ngOnInit(): void {
    this.clearForm()
    this.getUsers()
  }

  searchUser(){
    this.api.get(`api/users/search-user?name=${this.filter.name}&email=${this.filter.email}&rut=${this.filter.rut}&limit=${this.filter.limit}`)
      .subscribe((res: any) => {
        this.logger.info(this.idLog, 'searchUser', {info: 'Success searchUser', response: res})
        this.users = res.users;
    },err => {
        this.logger.error(this.idLog, 'searchUser', {info: 'Error searchUser', error: err})
    })
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

  /**Funcionalidad de abrir modal 
   * @param template nombre template de modal en html
   * @param action accion que define la clase del modal
   * @param data   */
  openModal(template: TemplateRef<any>, action?:string, data?:any) {
    this.validateExcel = {
      isValid: false,
      load: false,
      finish: false,
      segmentsIsValid: true
    }
    this.newUsers = [{
      rut: '',
      name: '',
      email: '',
      password: '',
      career: '',
      category: '',
      segments: []
    }]
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
  

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      this.validateExcel.load = true
      this.validateExcel.segmentsIsValid = true
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.headerTable = []
      this.bodyTable = []
      let header:Array<any> = []
      this.data.forEach((val, ind) => {
        if(ind == 0){
          this.headerTable.push(val);
          val.forEach((h:string) => header.push(h.toLowerCase()))
        } else {
          this.bodyTable.push(val);
        }
      })
      this.logger.log(this.idLog, 'onFileChange', {info: 'Validate excel', headerTable: this.headerTable, bodyTable: this.bodyTable})
      setTimeout(() => {
        if(header.length > 9 && header.toString() == ["rut", "nombre", "email", "contraseña", "carrera", "categoria", "asignatura", "seccion", "año", "periodo"].toString()){
          console.log('FORMATO OK')
          this.validateExcel.isValid = true
        } else {
          this.validateExcel.isValid = false
          console.log('FORMATE ERRONEO')
        }
        this.validateExcel.finish = true
        this.validateExcel.load = false
        this.validateSegments()
      },1000)

    };
    reader.readAsBinaryString(target.files[0]);
  }

  saveUsers(){
    this.api.post('api/users/register-by-excel', {users: this.newUsers}).subscribe(res => {
      Swal.fire({icon:'success', title: 'Usuarios agregados'}).then(() => {
        this.modalRef.hide()
        console.log(res)
        this.getUsers()
      })
    },err => {
      Swal.fire({icon: 'error', title: 'Problemas al agregar usuarios'})
      console.log('ERROR:', err)
    }) 
  }

  validateSegments(){
    let rut:string = ''
    let count:number = 0
    this.bodyTable.forEach((row, indexRow) => {
      let name:string = row[1]
      let email:string = row[2]
      let password:string = row[3]
      let career: string = row[4];
      let category: string;
      switch(row[5].toLowerCase()){
        case 'alumno':
          category = CONSTANTS.ROLES.STUDENT
          break;
        case 'profesor':
          category = CONSTANTS.ROLES.TEACHER
          break;
        case 'administrativo':
          category = CONSTANTS.ROLES.ADMINISTRATIVE
          break;
      }
      
      let subject: string = '';
      let section: number = 0;
      let year: number = 0;
      let period: number = 0;
      row.forEach((col, index) => {
          if(index == 0){
            if(rut != col) {
              this.newUsers[count].rut = col
              this.newUsers[count].name = name
              this.newUsers[count].email = email
              this.newUsers[count].password = password
              this.newUsers[count].career = career
              this.newUsers[count].category = category
              if(rut != ''){
                count++
              }
              rut = col
            }
          } else {
            switch(index){
              case 6: // asignatura
                subject = col
                break;
              case 7: // seccion
                section = col;
                break;
              case 8: // año
                year = col;
                break;
              case 9: // periodo
                period = col;
            }
            if(subject != '' && section > 0 && year > 0 && period > 0){
              const seg = this.segments.filter(segment => segment.career == career.toLowerCase() && segment.subject == subject.toLowerCase() && segment.section == section && segment.year == year && segment.period == period)
              if(seg.length > 0){
                this.newUsers[count].segments.push({segmentId: seg[0]._id })
              } else {
                this.bodyTable[indexRow][6] = 'ERROR!' 
                this.bodyTable[indexRow][7] = 'ERROR!' 
                this.bodyTable[indexRow][8] = 'ERROR!'
                this.bodyTable[indexRow][9] = 'ERROR!'
                this.validateExcel.segmentsIsValid = false;
              }
            }
          }
      })
    })
  }

  getAllSegment(){
    this.api.get('api/segments/get-all').subscribe((res:any) => {
      this.segments = res
    },err => {
      console.log('ERROR:',err)
    })
  }

}
