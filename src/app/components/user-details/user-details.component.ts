import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import {
  catchError,
  EMPTY,
  finalize,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { User } from '../../models/user.interface';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { CommonModule, Location } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-user-details',
  imports: [
    CommonModule,
    NzFlexModule,
    NzAvatarModule,
    NzSkeletonModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzIconModule,
    NzButtonModule,
    RouterLink,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  user!: Observable<User>;
  showSkeleton: boolean = false;

  ngOnInit(): void {
    this.user = this.route.paramMap.pipe(
      switchMap((params) => {
        const userId = Number(params.get('id'));

        const dataStatus = new Subject<void>();

        timer(30)
          .pipe(
            takeUntil(dataStatus),
            tap(() => {
              this.showSkeleton = true;
            })
          )
          .subscribe();

        return this.userService.get(userId).pipe(
          tap(() => {
            this.showSkeleton = false;
            dataStatus.next();
          }),
          catchError((err) => {
            this.showSkeleton = false;
            this.router.navigate(['/404']); // TODO: proper route
            return EMPTY;
          }),
          finalize(() => {
            dataStatus.complete();
          }),
          shareReplay(1)
        );
      })
    );
  }

  goBack(): void {
    this.location.back();
  }
}
