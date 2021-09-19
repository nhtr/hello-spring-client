import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnowledgeComponent } from './knowledge.component';
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: KnowledgeComponent
      }
    ])
  ],
  declarations: [
    KnowledgeComponent
  ],
})
export class KnowledgeModule {}
