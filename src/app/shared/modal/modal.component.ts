import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit , OnDestroy {
  private _modalId = ''

  constructor(public modalService:ModalService,public element:ElementRef) { 
  }

  @Input()
  set modalId(value:string){
    this.modalService.register(value);
    this._modalId = value;
  }

  get modalId():string {
    return this._modalId;
  }

  closeModal(){
    this.modalService.toggleModal(this.modalId);
  }

  isModalOpen():boolean{
    return this.modalService.isModalOpen(this.modalId);
  }

  ngOnInit(): void {
    document.body.appendChild(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.modalService.unRegister(this.modalId);
    document.body.removeChild(this.element.nativeElement);
  }
}
