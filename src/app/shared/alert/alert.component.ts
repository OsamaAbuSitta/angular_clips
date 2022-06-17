import { Component, Input, OnInit } from '@angular/core';
import { AlertColor } from '@shared/constants';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() color : AlertColor = 'blue';

  get bgColor() : string {
    return `bg-${this.color}-400`;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
