import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.css']
})
export class TabContentComponent implements OnInit {
  
  @Input() title:string = '';
  @Input() isActive:boolean = false

  constructor() { }

  ngOnInit(): void {
  }

}
