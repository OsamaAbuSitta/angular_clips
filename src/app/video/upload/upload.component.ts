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
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';

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
  uploadScreenshotTask?: AngularFireUploadTask;
  screenshots:string[] = [];
  selectedScreenshot = '';

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
    private router:Router,
    private ffmpegService : FfmpegService
    ) {
      this.authService.getUser().subscribe(user=> {
        this.user = user;
      })

      this.ffmpegService.init();
   }


  ngOnInit(): void {
  }

  async storeFile($event:Event){
    if(this.ffmpegService.isRunning)
      return;

    this.file = ($event as DragEvent).dataTransfer ?     
                ($event as DragEvent).dataTransfer?.files.item(0) ?? null:
                ($event.target as HTMLInputElement).files?.item(0) ?? null;
    
    if(!this.file || this.file.type !== 'video/mp4'){
        return;
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);
    this.selectedScreenshot = this.screenshots[0];

    this.titleControl.setValue(this.file.name.replace(/\.[^/.]+$/,''));

    this.nextStep = true;
  }


  async uploadFile(){
    this.uploadForm.disable();

    this.isUploading = true;
    const uniqueFileName = uuid();
    const fileExtension = '.mp4';
    const clipPath = `clips/${uniqueFileName}${fileExtension}`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(this.selectedScreenshot);
    const screenshotPath = `screenshots/${uniqueFileName}.png`;

    this.alertMessage = 'Please wait! Your file is being uploaded ...';
    this.alertMessageColor = 'blue';

    this.uploadFileTask = this.storage.upload(clipPath,this.file);
    const clipRef = this.storage.ref(clipPath);

    this.uploadScreenshotTask = this.storage.upload(screenshotPath,screenshotBlob);
    const screenshotRef = this.storage.ref(screenshotPath);

    combineLatest([
      this.uploadFileTask?.percentageChanges(),
      this.uploadScreenshotTask?.percentageChanges()
    ])
    .subscribe((progress) => {
      const [clilpProgress,screenshotProgress] = progress;
      if(!clilpProgress || !screenshotProgress)
        return 

      const total :number = clilpProgress +  screenshotProgress;
      this.percentage = total as number / 200 ;
    });

    forkJoin([
      this.uploadFileTask?.snapshotChanges(),
      this.uploadScreenshotTask.snapshotChanges()])
    .pipe(
      switchMap(()=>  forkJoin([clipRef.getDownloadURL(),screenshotRef.getDownloadURL()]))
      )
    .subscribe({
      next: async (urls) => {
        const [clipUrl,screenshotUrl] = urls;
        const clip :IClip = {
          uid : this.user?.uid as string,
          displayName: this.user?.displayName as string ,
          clipPath: clipPath, 
          screenshotPath: screenshotPath,
          fileName: this.file?.name as string,
          title:this.titleControl.value,
          url:clipUrl,
          screenshotUrl, 
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

  imageSelected(screenshot:string){
      this.selectedScreenshot = screenshot;
  }

  get isReady(): boolean{
    return this.ffmpegService.isReady;
  }

  get isRunning():boolean{
    return this.ffmpegService.isRunning;
  }

}
