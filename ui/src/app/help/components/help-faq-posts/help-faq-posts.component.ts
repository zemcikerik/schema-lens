import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FaqPost } from '../../models/faq-post.model';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';

@Component({
  selector: 'app-help-faq-posts',
  templateUrl: './help-faq-posts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelContent,
  ],
})
export class HelpFaqPostsComponent {
  faqPosts = input.required<FaqPost[]>();
}
