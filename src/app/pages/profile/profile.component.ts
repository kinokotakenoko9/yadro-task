import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.interface';
import {
  finalize,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    NzGridModule,
    NzAvatarModule,
    NzSkeletonModule,
    NzSpaceModule,
    NzTypographyModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzFlexModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

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
          finalize(() => {
            dataStatus.complete();
          }),
          shareReplay(1)
        );
      })
    );
  }
}
