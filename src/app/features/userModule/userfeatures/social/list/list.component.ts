import { Component } from '@angular/core';
import { Social } from '@app/_models';
import { SocialService } from '@app/_services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  socials: Social[] = []

  constructor(
    private socialService: SocialService,
  ) { }

  ngOnInit() {
    this.socialService.getAllSocials().subscribe(socials => {
      this.socials = socials
    });
  }
}
