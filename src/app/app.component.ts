import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AccountService } from './_services';
import { Account, Role } from './_models';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Component({ selector: 'app-root', templateUrl: 'app.component.html', styleUrls: ['app.component.css'] })
export class AppComponent {
  Role = Role;
  account?: Account | null;
  showBackButton = true
  showNav = true

  isRTL = false;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('en'); // default language
    this.translate.onLangChange.subscribe((event) => {
      this.isRTL = event.lang === 'ar';
    });
  }


  ngOnInit() {
    this.accountService.account.subscribe(x => this.account = x);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNav = event.urlAfterRedirects !== '/account/login' && this.account!.role !== Role.Admin
      }
    })

    // titles 
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      map(route => route.snapshot.data)
    ).subscribe(data => {
      if (data['title']) {
        this.titleService.setTitle(data['title']);
      }
    });

    // Subscribe to language changes
    this.translate.onLangChange.subscribe((event) => {
      if (event.lang === 'ar') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    });

    // Initial check when the app starts
    if (this.translate.currentLang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }

  logout() {
    this.accountService.logout();
  }

}