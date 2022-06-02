import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name= new FormControl('',[
    Validators.required, 
    Validators.minLength(3)
  ]);
  
  email= new FormControl('',[
    Validators.required,
    Validators.email
  ]);

  age = new FormControl('',[
       Validators.required,
       Validators.min(18),
       Validators.max(120)
    ]);
  
  password= new FormControl('',[
    Validators.required,
    Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ]);
  
  confirm_password= new FormControl('',[
    Validators.required,
    Validators.pattern(/fds/)
  ]);
  
  phoneNumber= new FormControl('',[
    Validators.required,
    Validators.minLength(15),
    Validators.maxLength(15)
  ]);
  
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber,
  });

  constructor() { }

  ngOnInit(): void {
  }

log(x:any){
  console.log(x);
}

}
