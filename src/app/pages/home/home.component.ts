import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly userService = inject(UserService);
  users: User[] = [];

  ngOnInit() {
    this.userService.getAll().subscribe((data) => {
      this.users = data;
    });
  }
}
