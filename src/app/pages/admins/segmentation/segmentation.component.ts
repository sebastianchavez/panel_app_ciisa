import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>, action?:string, data?:any) {
    let option = { class: ''}
    if(action === 'excel'){
      option.class = 'modal-lg'
    }
    this.modalRef = this.modalService.show(template, option);
  }

}
