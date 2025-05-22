import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-layout',
  imports: [NzLayoutModule, NzFlexModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
