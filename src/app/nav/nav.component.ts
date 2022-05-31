import { Component, OnInit } from '@angular/core';
import { ModalService } from '../shared/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public modalService:ModalService) { }

  ngOnInit(): void {
  }


  openModal($event:Event){
    $event.preventDefault();
    this.modalService.toggleModal('auth-modal');
  }

}
