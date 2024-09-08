import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Social } from '@app/_models';
import { SocialService } from '@app/_services';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  social!: Social;

  constructor(
    private route: ActivatedRoute, 
    private socialService: SocialService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.socialService.getSocialById(id).subscribe((data: Social) => {
        this.social = data
      })
    }
  }

  gotolink(link : string) {
    
    window.open(link, '_blank')
  }
}
