import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Account, Role, Social, SocialNotification } from '@app/_models';
import { AccountService, NotificationService, SocialService } from '@app/_services';
import { TranslateService } from '@ngx-translate/core';


@Component({ selector: 'app-navbar', templateUrl: 'navbar.component.html', styleUrls: ['navbar.component.css'] })
export class NavbarComponent {
    Role = Role;
    account?: Account | null;

    // notification 
    notifications: SocialNotification[] = []
    unreadCount: number = 0;

    currentLanguageFlag: string = 'assets/flags/ar.png'

    social !: Social


    constructor(
        private accountService: AccountService,
        private router: Router,
        private notificationService: NotificationService,
        private translate: TranslateService,
        private socialService: SocialService
    ) {
        // Check localStorage for a saved language preference
        const storedLang = localStorage.getItem('language');
        const storedFlag = localStorage.getItem('flag')
        if (storedLang) {
            this.translate.use(storedLang);
            if (storedFlag)
                this.currentLanguageFlag = storedFlag // Set the language to the stored preference
        } else {
            this.translate.setDefaultLang('ar'); // Fallback to default language
        }

        // Subscribe to language changes and save to localStorage
        this.translate.onLangChange.subscribe(lang => {
            this.updateFlagIcon(lang.lang);
            localStorage.setItem('language', lang.lang); 
            localStorage.setItem('flag', this.currentLanguageFlag)// add a language flag 
        });
    }


    ngOnInit() {
        this.accountService.account.subscribe(x => this.account = x);
        this.fetchNotifications()
        setInterval(() => {
            this.fetchNotifications()
        }, 180000) // 3 min
    }

    logout() {
        this.accountService.logout();
    }

    // notification 
    fetchNotifications() {
        this.notificationService.getSocialNotifications().subscribe(data => {
            const now = new Date().getTime();
            const seventyTwoHoursAgo = now - (72 * 60 * 60 * 1000);

            // Filter notifications from the last 72 hours and unread ones
            this.notifications = data
                .filter(notification => {
                    const notificationTime = new Date(notification.date).getTime();
                    return notificationTime >= seventyTwoHoursAgo && !notification.isRead;
                })
                .sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    return dateB - dateA;
                });

            this.updateUnreadCount();
        });
    }
    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(notification => !notification.isRead).length;
    }

    goto(notification: SocialNotification) {
        this.notificationService.setSocialNotificationRead(notification._id).subscribe(() => {
            notification.isRead = true;
            this.updateUnreadCount();
        })
        this.socialService.getSocialById(notification.socialId).subscribe((data: Social) => {
            this.social = data
        })
        this.router.navigate([`work/social/details/${notification.socialId}`])
    }

    changeLanguage(lang: string) {
        this.translate.use(lang);
        this.updateFlagIcon(lang);
    }

    private updateFlagIcon(lang: string) {
        switch (lang) {
            case 'fr':
                this.currentLanguageFlag = 'assets/flags/fr.png';
                break;
            case 'en':
                this.currentLanguageFlag = 'assets/flags/en.png';
                break;
            default:
                this.currentLanguageFlag = 'assets/flags/ar.png';
                break;
        }
    }
}