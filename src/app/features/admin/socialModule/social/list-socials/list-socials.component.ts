import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { Social } from '@app/_models';
import { SocialService } from '@app/_services/social.service';


@Component({
  selector: 'list-socials',
  templateUrl: './list-socials.component.html',
  styleUrls: ['./list-socials.component.css']
})
export class ListSocialsComponent {
  socials: any[] = []
  searchText: string = '';
  selectedSocials: Social[] = [];

  // Pagination 
  currentPage = 1;
  itemsPerPage = 10; // Set the number of items per page


  constructor(
    private socialService: SocialService,
  ) { }

  ngOnInit() {
    this.loadSocials();
  }
  
  loadSocials(){
    this.socialService.getAllSocials().subscribe(socials => {
      this.socials = socials
    })
  }

  deleteSocial(id: string) {
    const social = this.socials!.find(x => x._id === id);
    if (!social) return
    social.isDeleting = true;
    this.socialService.deleteSocial(id)
        .pipe(first())
        .subscribe(() => {
            this.socials = this.socials!.filter(x => x._id !== id)
        });
  }

  toggleAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked
      this.socials.forEach(social => social.selected = isChecked)
      this.updateSelection()
  }

  updateSelection() {
    this.selectedSocials = this.socials.filter(social => social.selected)
  }

  deleteSelectedEntities(): void {
    this.selectedSocials.forEach(social => {
      this.socialService.deleteSocial(social._id).subscribe(() => {
        this.socials = this.socials.filter(x => x.id !== social._id);
        this.updateSelection();
      });
    });
  }
}
