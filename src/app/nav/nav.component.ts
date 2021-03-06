import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../shared/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  
  constructor(
    public modalService:ModalService,
    public authService: AuthService,
    private router:Router

    ) {   }

  ngOnInit(): void {
  }

  openModal($event:Event){
    $event.preventDefault();
    this.modalService.toggleModal('auth-modal');
  }

  async logout($event:Event){
    $event.preventDefault();
    await this.authService.logout();
  }
}
