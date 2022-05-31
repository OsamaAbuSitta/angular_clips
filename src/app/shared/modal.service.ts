import { Injectable } from '@angular/core';

export interface IModal{
  Id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalsBag : IModal[] = [];

  constructor() { 

  }

  register(modalId: string) {
    if(this.modalsBag.some(m=> m.Id == modalId))
      throw Error(`Dublicate modal key !! 💀💀 ... the key ${modalId} already exists 🤔`);
    
      this.modalsBag.push({Id: modalId, visible : false});
  }
  
  unRegister(modalId: string) {
    this.modalsBag = this.modalsBag.filter(m=> m.Id != modalId);
  }

  public isModalOpen(modalId: string) : boolean{
    return this.modalsBag.find(m=> m.Id == modalId)?.visible ?? false;
  }

  public toggleModal(modalId:string){
    let modal = this.modalsBag.find(m=> m.Id == modalId);
    if(modal)
      modal.visible = !modal?.visible ?? false;
  }
}
