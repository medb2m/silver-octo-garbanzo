import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Account, Notification, Role } from '@app/_models';
import { AccountService, NotificationService } from '@app/_services';

@Component({selector: 'admin-navbar', templateUrl: 'navbar.component.html', styleUrls : ['../_assets/admin.css','./navbar.component.css'] })
export class OverviewComponent {
    Role = Role;
    account?: Account | null;

    notifications : Notification[] = []
    unreadCount: number = 0;
    
    constructor(
        private accountService: AccountService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

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
 }