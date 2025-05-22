import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UserListComponent } from '../../components/user-list/user-list.component';

@Component({
  selector: 'app-home',
  imports: [NzButtonModule, UserListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
