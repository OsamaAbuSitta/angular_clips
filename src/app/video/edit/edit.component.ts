import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertColor } from '@shared/constants';
import { ModalService } from '@shared/modal.service';
import IClip from 'src/app/models/clip';
import { ClipService } from 'src/app/services/clip-service.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit , OnChanges {
  @Input() clip :  IClip | null = null; 
  @Output() clipUpdated = new  EventEmitter<IClip>() ;

  alertMessageColor : AlertColor = 'red';
  alertMessage:string = '';

  titleControl = new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ]);

  clipFormGroup = new FormGroup({
    title:this.titleControl
  });

  constructor(
    private clipService:ClipService,
    private modalService:ModalService
    ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.clip) return 

    this.titleControl.setValue(this.clip.title);
  }

  ngOnInit(): void {
  }

  get showAlertMessage ():boolean{
    return !!this.alertMessage;
  }

  updateClip(){
    this.clip!.title = this.titleControl.value;
    this.clipFormGroup.disable();

    this.alertMessage = 'Please wait! Your clip is being updated ...';
    this.alertMessageColor = 'blue';

    this.clipService.updateClip(this.clip!).subscribe({
      next:()=> {
        this.alertMessage = 'Success! Your clip is updated 🥳';
        this.alertMessageColor = 'green';
        setTimeout(()=>{
          this.modalService.toggleModal('edit-clip');
        },1000);

        this.clipUpdated.emit(this.clip!);
      },
      error:(error)=> {
        this.alertMessage = 'Update is failed, Please try again later, Or if you curious check the cosole error ... 🤔';
        console.error(error);
        this.alertMessageColor = 'red';
      }
    });

    this.clipFormGroup.enable();
  }

}
