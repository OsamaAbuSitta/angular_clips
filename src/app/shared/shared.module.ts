import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal.service';
import { TabsContainerComponent } from './tab/tabs-container/tabs-container.component';
import { TabContentComponent } from './tab/tab-content/tab-content.component';



@NgModule({
  declarations: [
    ModalComponent,
    TabsContainerComponent,
    TabContentComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ModalComponent,
    TabsContainerComponent,
    TabContentComponent
  ],
  providers:[
  ]
})
export class SharedModule { }
