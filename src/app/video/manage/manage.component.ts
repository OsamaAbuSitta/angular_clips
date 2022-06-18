import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip-service.service';
import IClip from 'src/app/models/clip';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  orderBy = '1';
  clips: IClip[] = [];

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private clipService : ClipService
    ) { 
    
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
  }

   getUserClips(){
    this.clipService.getUserClips({orderBy: this.orderBy}).then(docs => {
      docs.forEach(doc=> {
        this.clips.push({
          ...doc.data(),
          id : doc.id,
        });

      });
    });
    
  }
}
