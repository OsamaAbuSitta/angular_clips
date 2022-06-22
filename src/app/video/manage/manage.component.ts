import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip-service.service';
import IClip from 'src/app/models/clip';
import { ModalService } from '@shared/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  orderBy = '1';
  clips: IClip[] = [];
  currentClip : IClip | null = null; 
  sort$ : BehaviorSubject<string>;

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private clipService : ClipService,
    private modalService : ModalService
    ) { 
       this.sort$ = new BehaviorSubject<string>('1');
    }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(queryParams=> {
      this.orderBy = queryParams.sort === '2'? queryParams.sort : '1';
      this.getUserClips();
    });
  }

  sort($event: Event){
    const {value} = ($event.target as HTMLSelectElement);
    this.router.navigateByUrl(`/manage?sort=${value}`);
    this.sort$.next(value);
  }

   getUserClips(){

    this.clips = [];
    
    this.sort$.subscribe(sort=> {
      this.clipService.getUserClips(sort).then(docs => {
        docs.forEach(doc=> {
          this.clips.push({
            ...doc.data(),
            id : doc.id,
          });
  
        });
      });
    });
    
  }

  openModal($event:Event,clip:IClip)
  {
    $event.preventDefault();
    this.currentClip = clip;
    this.modalService.toggleModal('edit-clip');
  }

  onClipUpdated($event:IClip){
   // this.getUserClips(); no need sice we sent the same object refrence 😇😇
  }

  async deleteClip($event:Event,clip:IClip){
    $event.preventDefault();
    try{
      await this.clipService.deleteClip(clip);
      //this.getUserClips();
      this.clips.forEach((element,index)=> {
          if(element.id == clip.id)
            this.clips.splice(index,1);
      });
    }
    catch(error)
    {
      console.error(error);
    }
  }
}
