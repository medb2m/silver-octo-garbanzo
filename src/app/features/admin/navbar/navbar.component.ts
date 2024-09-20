import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Account, Notification, Role } from '@app/_models';
import { AccountService, NotificationService } from '@app/_services';
import { TranslateService } from '@ngx-translate/core';

@Component({selector: 'admin-navbar', templateUrl: 'navbar.component.html', styleUrls : ['../_assets/admin.css','./navbar.component.css'] })
export class OverviewComponent {
    Role = Role;
    account?: Account | null;

    notifications : Notification[] = []
    unreadCount: number = 0;

    currentLanguageFlag: string = 'assets/flags/ar.png'
    
    constructor(
        private accountService: AccountService,
        private notificationService: NotificationService,
        private translate: TranslateService,
        private router: Router
    ) {
        // Check localStorage for a saved language preference
        const storedLang = localStorage.getItem('language');
        if (storedLang) {
            this.translate.use(storedLang); // Set the language to the stored preference
        } else {
            this.translate.setDefaultLang('ar'); // Fallback to default language
        }

        // Subscribe to language changes and save to localStorage
        this.translate.onLangChange.subscribe(lang => {
            this.updateFlagIcon(lang.lang);
            localStorage.setItem('language', lang.lang); // Save the selected language
        });
     }

    ngOnInit(){
        this.accountService.account.subscribe(x => this.account = x);
        this.fetchNotifications()
        setInterval(() => {
            this.fetchNotifications()
        }, 180000) // 3 min
    }

    fetchNotifications(){
        this.notificationService.getNotifications().subscribe(data => {
            const now = new Date().getTime()
            const seventyTwoHoursAgo = now - (72 * 60 * 60 * 1000)
            this.notifications = data
            .filter(notification => {
                const notificationTime = new Date(notification.date).getTime()
                return notificationTime >= seventyTwoHoursAgo && !notification.isRead
            })
            .sort((a,b) => {
                const dateA = new Date(a.date).getTime()
                const dateB = new Date(b.date).getTime()
                return dateB - dateA
            })
            this.updateUnreadCount()
        })
    }

    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(notification => !notification.isRead).length;
    }

    goto(notification : Notification){
        this.notificationService.setNotificationRead(notification._id).subscribe(() => {
            notification.isRead = true;
            this.updateUnreadCount();
            console.log('You have read the notif !')
        })
        this.router.navigate([`/admin/dashboard/report/view/${notification.reportId}`])
    }

    logout() {
        this.accountService.logout();
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
            case 'ar':
                this.currentLanguageFlag = 'assets/flags/ar.png';
                break;
            default:
                this.currentLanguageFlag = 'assets/flags/en.png';
                break;
        }
    }
 }