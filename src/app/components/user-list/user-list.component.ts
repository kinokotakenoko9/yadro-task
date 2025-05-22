import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.interface';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-user-list',
  imports: [NzListModule, NzTagModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  users: User[] = [];

  ngOnInit() {
    this.userService.getAll().subscribe((data) => {
      this.users = data;
    });
  }
}
