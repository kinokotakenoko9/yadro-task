import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'app-layout',
  imports: [
    NzLayoutModule,
    NzBreadCrumbModule,
    NzFlexModule,
    NzGridModule,
    RouterOutlet,
    NzInputModule,
    NzIconModule,
    NzSpaceModule,
    NzDropDownModule,
    NzButtonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
