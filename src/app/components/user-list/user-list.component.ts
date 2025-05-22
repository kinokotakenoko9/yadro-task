import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.interface';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { debounceTime, Subject } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [
    NzListModule,
    NzTagModule,
    NzFlexModule,
    NzInputModule,
    NzIconModule,
    NzDropDownModule,
    NzButtonModule,
    RouterLink,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  users: User[] = [];
  filteredUsers: User[] = [];

  selectedDropdownItem: string = 'name';
  searchQuery: string = '';
  private searchTerms = new Subject<string>();

  ngOnInit() {
    this.userService.getAll().subscribe((data) => {
      this.users = data;
      this.applyFilter();
    });

    this.searchTerms.pipe(debounceTime(300)).subscribe(() => {
      this.applyFilter();
    });
  }

  onMenuItemClick(item: string): void {
    this.selectedDropdownItem = item;
    this.applyFilter();
  }

  onSearchInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value.toLowerCase();
    this.searchTerms.next(this.searchQuery);
  }

  applyFilter(): void {
    if (!this.searchQuery) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter((user) => {
      const searchValue = this.searchQuery;

      if (this.selectedDropdownItem === 'name') {
        return user.name.toLowerCase().includes(searchValue);
      } else if (this.selectedDropdownItem === 'email') {
        return user.email.toLowerCase().includes(searchValue);
      }

      return false;
    });
  }
}
