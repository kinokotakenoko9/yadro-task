import { Component, inject } from '@angular/core';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-create',
  imports: [UserFormComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  private readonly message = inject(NzMessageService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  formSubmitted(newUser: User) {
    this.userService.create(newUser).subscribe({
      next: (createdUser) => {
        this.message.success(`User '${createdUser.name}' created successfully`);
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.message.error('Failed to create user. Try again');
      },
    });
  }

  formCancelled() {
    this.router.navigate(['/users']);
  }
}
