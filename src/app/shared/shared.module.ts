import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabsContainerComponent } from './tab/tabs-container/tabs-container.component';
import { TabContentComponent } from './tab/tab-content/tab-content.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { AlertComponent } from './alert/alert.component';
import { EventBlokerDirective } from './directives/event-bloker.directive';



@NgModule({
  declarations: [
    ModalComponent,
    TabsContainerComponent,
    TabContentComponent,
    InputComponent,
    AlertComponent,
    EventBlokerDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    NgxMaskModule.forRoot()
  ],
  exports:[
    ModalComponent,
    TabsContainerComponent,
    TabContentComponent, 
    InputComponent,
    AlertComponent,
    EventBlokerDirective
  ],
  providers:[
  ]
})
export class SharedModule { }
