import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal.service';
import { TabsContainerComponent } from './tab/tabs-container/tabs-container.component';



@NgModule({
  declarations: [
    ModalComponent,
    TabsContainerComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ModalComponent
  ],
  providers:[
  ]
})
export class SharedModule { }
