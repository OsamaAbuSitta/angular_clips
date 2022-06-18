import { Component, OnDestroy, OnInit } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/compat/storage';
import {v4 as uuid} from 'uuid';
import { AlertColor } from '@shared/constants';
import { AuthService } from 'src/app/services/auth.service';
import firebase from 'firebase/compat/app';
import { last,switchMap } from 'rxjs/operators';
import { ClipService } from 'src/app/services/clip-service.service';
import IClip from 'src/app/models/clip';
import { Router } from '@angular/router';
import { DocumentReference } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit , OnDestroy {
  isUploading = false;
  isDragover = false;
  file: File | null = null;
  nextStep = false;
  alertMessageColor : AlertColor = 'red';
  alertMessage:string = '';
  percentage = 0;
  user:firebase.User | null = null;
  uploadFileTask?: AngularFireUploadTask;

  get showAlertMessage ():boolean{
    return !!this.alertMessage;
  }

  get showPercentage ():boolean{
    return !!this.percentage;
  }

  titleControl = new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ]);

  uploadForm = new FormGroup({
    title: this.titleControl
  });

  constructor(
    private storage: AngularFireStorage,
    private authService : AuthService, 
    private clilpService: ClipService, 
    private router:Router
    ) {
      this.authService.getUser().subscribe(user=> {
        this.user = user;
      })
   }


  ngOnInit(): void {
  }

  storeFile($event:Event){
    this.file = ($event as DragEvent).dataTransfer ?     
                ($event as DragEvent).dataTransfer?.files.item(0) ?? null:
                ($event.target as HTMLInputElement).files?.item(0) ?? null;
    
    if(!this.file || this.file.type !== 'video/mp4'){
        return;
    }

    this.titleControl.setValue(this.file.name.replace(/\.[^/.]+$/,''));

    this.nextStep = true;
  }


  uploadFile(){
    this.uploadForm.disable();

    this.isUploading = true;
    const uniqueFileName = uuid();
    const fileExtension = '.mp4';
    const clipPath = `clips/${uniqueFileName}${fileExtension}`;

    this.alertMessage = 'Please wait! Your file is being uploaded ...';
    this.alertMessageColor = 'blue';

    this.uploadFileTask = this.storage.upload(clipPath,this.file);
    const clipRef = this.storage.ref(clipPath);

    this.uploadFileTask?.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100 ;
    });

    this.uploadFileTask?.snapshotChanges().pipe(
      last(),
      switchMap(()=> clipRef.getDownloadURL())
      )
    .subscribe({
      next: async (url) => {
        const clip :IClip = {
          uid : this.user?.uid as string,
          displayName: this.user?.displayName as string ,
          clipPath: clipPath, 
          fileName: this.file?.name as string,
          title:this.titleControl.value,
          url, 
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }

      const clipDocumentReference: DocumentReference = await this.clilpService.createClip(clip);
      
      this.alertMessage = 'Success! Your clip is now ready to share 🥳';
      this.alertMessageColor = 'green';
      
       this.redirectToClipPage(clipDocumentReference.id);
      },
      error:(error)=>{
        this.alertMessage = 'Upload is failed, Please try again later, Or if you curious check the cosole error ... 🤔';
        console.error(error);
        this.alertMessageColor = 'red';
        this.uploadForm.enable();
      },
      complete:()=> {
        this.isUploading = false;
        this.percentage = 0;
      }
    }
    );

  }

  ngOnDestroy(): void {
    this.uploadFileTask?.cancel();    
  }

  redirectToClipPage(clipId:string){
    setTimeout(()=> {
      this.router.navigate(['clip',clipId])
    },1000)
  }
}
