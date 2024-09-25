import { Component, HostBinding } from '@angular/core';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent { 
    @HostBinding('attr.id') layoutComponentId = `layout-component-${Math.random().toString(36).substr(2, 9)}`;
}