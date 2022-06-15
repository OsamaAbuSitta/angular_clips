import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { AngularFireAuthGuard , redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToHome = ()=> redirectUnauthorizedTo('/');

const routes: Routes = [
  {
    path:'manage-clips',
    redirectTo:'manage',
  },{
    path:'manage',
    component:ManageComponent,
    canActivate:[AngularFireAuthGuard],
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome
    }
  },{
    path:'upload',
    component:UploadComponent,
    canActivate:[AngularFireAuthGuard],
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
