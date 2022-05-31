import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabContentComponent } from '../tab-content/tab-content.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements  AfterContentInit {

  @ContentChildren(TabContentComponent) tabs : QueryList<TabContentComponent> = new QueryList();

  constructor() { }

  ngAfterContentInit(): void {
   const activeTabs = this.tabs.filter(t=> t.isActive);

   if(!activeTabs?.length){
     this.selectTab(this.tabs.first);
   }

   if(activeTabs?.length > 1 ){
    this.selectTab(activeTabs[0]);
   }

  }

  selectTab(tab:TabContentComponent){
    this.tabs.forEach(t=> {t.isActive = false;});
    tab.isActive = true;
    return false;
  }

}
