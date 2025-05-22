import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { User } from '../../models/user.interface';
import { NzFormModule } from 'ng-zorro-antd/form';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    NzFormModule,
    NzButtonModule,
    NzCheckboxModule,
    NzInputModule,
    NzSelectModule,
    NzFlexModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  private readonly fb = inject(FormBuilder);

  @Input() user: User | null = null;
  @Input() mode: 'create' | 'edit' = 'create';

  @Output() formSubmitted = new EventEmitter<User>();
  @Output() formCancelled = new EventEmitter<void>();

  userForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const nameValidators = [Validators.required];

    const emailValidators =
      this.mode === 'create'
        ? [Validators.email]
        : [Validators.required, Validators.email];

    this.userForm = this.fb.group({
      name: [this.user?.name || '', nameValidators],
      email: [this.user?.email || '', emailValidators],
      city: [this.user?.address?.city || '', []],
    });

    if (this.mode === 'edit' && this.user) {
      this.userForm.setValidators(atLeastOneFieldChangedValidator(this.user));
      this.userForm.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    Object.values(this.userForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });

    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const submittedUser: User = {
        ...this.user,
        name: formValue.name,
        email: formValue.email,
        address: {
          ...this.user?.address,
          city: formValue.city || '',
        } as any,
        id: this.user?.id || 0,
        username: this.user?.username || '',
        phone: this.user?.phone || '',
        website: this.user?.website || '',
        company: this.user?.company || { name: '', catchPhrase: '', bs: '' },
      };

      this.formSubmitted.emit(submittedUser);
    } else {
      console.log('Form is invalid:', this.userForm.errors);
    }
  }

  onCancel(e: MouseEvent): void {
    e.preventDefault();
    this.formCancelled.emit();
  }

  get name() {
    return this.userForm.get('name');
  }
  get email() {
    return this.userForm.get('email');
  }
  get city() {
    return this.userForm.get('city');
  }
}

// TODO: move to helpers
function atLeastOneFieldChangedValidator(
  originalUser: User
): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!originalUser) {
      return null;
    }

    const formGroup = control as FormGroup;
    const nameControl = formGroup.get('name');
    const emailControl = formGroup.get('email');
    const cityControl = formGroup.get('city');

    const nameChanged = nameControl?.value !== originalUser.name;
    const emailChanged = emailControl?.value !== originalUser.email;
    const cityChanged = cityControl?.value !== originalUser.address.city;

    if (!nameChanged && !emailChanged && !cityChanged) {
      return { noChanges: true };
    }
    return null;
  };
}
