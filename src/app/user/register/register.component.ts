import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  showAlert = false;
  alertMessage = '';
  alertColor = 'orange';
  inSubmission = false;

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);

  email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

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
    Validators.required,
    Validators.pattern(/fds/)
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
  });

  constructor(private authService: AuthService) { }

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
      age: this.registerForm.value.age,
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
