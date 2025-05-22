import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { catchError, EMPTY, Observable, Subject, switchMap } from 'rxjs';
import { User } from '../../models/user.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    UserFormComponent,
    CommonModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly message = inject(NzMessageService);
  private readonly router = inject(Router);

  user!: Observable<User>;

  ngOnInit(): void {
    this.user = this.route.paramMap.pipe(
      switchMap((params) => {
        const userId = Number(params.get('id'));

        return this.userService.get(userId).pipe(
          catchError((err) => {
            this.router.navigate(['/404']); // TODO: proper route
            return EMPTY;
          })
        );
      })
    );
  }

  formSubmitted(newUser: User) {
    this.userService.update(newUser).subscribe({
      next: (updatedUser) => {
        this.message.success(`User '${newUser.name}' updated successfully`);
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.message.error('Failed to update user. Try again');
      },
    });
  }

  formCancelled() {
    this.router.navigate(['/users']);
  }
}
