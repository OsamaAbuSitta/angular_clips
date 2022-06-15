import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  orderBy = '1';

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(queryParams=> {
      this.orderBy = queryParams.sort === '2'? queryParams.sort : '1';
    })
  }

  sort($event: Event){
    const {value} = ($event.target as HTMLSelectElement);
    this.router.navigateByUrl(`/manage?sort=${value}`);
  }
}
