import { Component, OnInit } from '@angular/core';
import { Constants } from '@shared/constants';
import { ModalService } from '@shared/modal.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constatns = Constants;
  showAlert = false;
  alertColor = '';
  alertMessage ='';

  credentials = {
    email : '',
    password:''
  };

  constructor(private auth:AuthService,private modalService: ModalService) {

   }

  ngOnInit(): void {
  }

  async login(){
    try
    { 
        this.showAlert = true;
        this.alertColor = 'orange';
        this.alertMessage = 'Please wait ... 😇';

        const {email,password} = this.credentials;
        await this.auth.login(email,password);
        
        this.showAlert = false;
        this.modalService.toggleModal('auth-modal');
    }
    catch(error)
    {
        this.showAlert = true;
        this.alertColor = 'red';
        this.alertMessage = (<any>error).message ?? 'somthing went wrong !! 😖😓';
        
        console.error(error);
    }
  }

}
