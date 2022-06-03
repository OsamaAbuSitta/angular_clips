import { Component, OnInit } from '@angular/core';
import { Constants } from '@shared/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constatns = Constants;

  credentials = {
    email : '',
    password:''
  };

  constructor() { }

  ngOnInit(): void {
  }

}
