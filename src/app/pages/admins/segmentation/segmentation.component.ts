import { Component, OnInit } from '@angular/core';
import { SELECTS } from '../../../constants/constants'

@Component({
  selector: 'app-segmentation',
  templateUrl: './segmentation.component.html',
  styleUrls: ['./segmentation.component.css']
})
export class SegmentationComponent implements OnInit {
  SELECTS = SELECTS
  constructor() { }

  ngOnInit(): void {
  }

}
