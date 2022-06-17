import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompareValueValidator } from '@shared/validators/compare-value-validator';
import { AuthService } from 'src/app/services/auth.service';
import { EmailValidator } from '../validators/email-validator';
import { AlertColor } from '@shared/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[EmailValidator]
})
export class RegisterComponent implements OnInit {
  showAlert = false;
  alertMessage = '';
  alertColor : AlertColor = 'orange';
  inSubmission = false;

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);

  email = new FormControl('', [
    Validators.required,
    Validators.email
  ],[this.emailTaken.validate]);

  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ]);

  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ]);

  confirm_password = new FormControl('', [
    Validators.required
  ]);

  phoneNumber = new FormControl('', [
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
  },[CompareValueValidator.match('password','confirm_password','Confirm password doesn\'t match the entered password 🤔🤔')]);

  constructor(private authService: AuthService,private emailTaken : EmailValidator) { }

  ngOnInit(): void {
  }

  register() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMessage = 'Please wait you account is being created. 😇';
    const password = this.registerForm.value.password;
    const user = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      age: +this.registerForm.value.age,
      phoneNumber: this.registerForm.value.phoneNumber,
    }

    try {
      this.authService.createUser(user, password)
        .subscribe({
          next: (result) => {
            this.alertMessage = 'Success! Your account has been created. 👌👌';
            this.alertColor = 'green';
          },
          error: (error) => {
            console.error(error)
            this.alertMessage = (<any>error).message;
            this.alertColor = 'red';
            this.inSubmission = false;
          },
          complete:()=> {
            this.inSubmission = false;
          }
        })

    }
    catch (error) {
      console.error(error)
      this.alertMessage = (<any>error).message;
      this.alertColor = 'red';
      return;
    }

  }



}
