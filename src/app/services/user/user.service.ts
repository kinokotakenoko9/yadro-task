import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}
