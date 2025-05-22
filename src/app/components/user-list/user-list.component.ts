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
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

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
    NzModalModule,
    NzPaginationModule,
    RouterLink,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];

  pageIndex: number = 1;
  pageSize: number = 6;

  selectedDropdownItem: string = 'name';
  searchQuery: string = '';
  private searchTerms = new Subject<string>();

  private readonly modal = inject(NzModalService);
  private readonly message = inject(NzMessageService);

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
    this.pageIndex = 1;
    this.applyFilter();
  }

  onSearchInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value.toLowerCase();
    this.pageIndex = 1;
    this.searchTerms.next(this.searchQuery);
  }

  applyFilter(): void {
    let tempUsers = [...this.users];

    if (this.searchQuery) {
      tempUsers = tempUsers.filter((user) => {
        const searchValue = this.searchQuery;

        if (this.selectedDropdownItem === 'name') {
          return user.name.toLowerCase().includes(searchValue);
        } else if (this.selectedDropdownItem === 'email') {
          return user.email.toLowerCase().includes(searchValue);
        }
        return false;
      });
    }
    this.filteredUsers = tempUsers;
    this.paginateUsers();
  }

  paginateUsers(): void {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.paginateUsers();
  }

  showDeleteConfirm(userId: number, userName: string): void {
    this.modal.confirm({
      nzTitle: `Are you sure you want to delete <b>${userName}</b>?`,
      nzContent: '<b>This action cannot be undone</b>',
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.userService.delete(userId).subscribe({
          next: () => {
            this.users = this.users.filter((u) => u.id !== userId);
            this.applyFilter();
            this.message.success(`User '${userName}' deleted successfully`);
          },
          error: (err) => {
            this.message.error(`Failed to delete user '${userName}'`);
          },
        });
      },
    });
  }
}
