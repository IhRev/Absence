import { Component, inject, OnInit, output, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserDetails } from '../../models/auth.models';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Message } from '../../models/user-profile.models';
import { FormErrorComponent } from '../../../common/form-error/form-error.component';

@Component({
  selector: 'app-user-general-tab',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './user-general-tab.component.html',
  styleUrl: './user-general-tab.component.css',
})
export class UserGeneralTabComponent implements OnInit {
  readonly #authService = inject(AuthService);

  form = new FormGroup({
    email: new FormControl(''),
    firstName: new FormControl('', { validators: [Validators.required] }),
    lastName: new FormControl('', { validators: [Validators.required] }),
  });
  loaded = signal(false);
  isProcessing = signal(false);
  displayMessage = output<Message>();

  ngOnInit() {
    this.form.setValue(this.#authService.userDetails()!);
  }

  edit() {
    if (this.form.invalid) {
      return;
    }

    this.isProcessing.set(true);
    this.#authService
      .updateUserDetails(
        new UserDetails(
          this.form.value.firstName!,
          this.form.value.lastName!,
          this.form.value.email!
        )
      )
      .subscribe({
        next: (res) => {
          this.#displayMsg(res.isSuccess, res.message);
          this.isProcessing.set(false);
        },
      });
  }

  #displayMsg(isSuccess: boolean, message: string | null) {
    this.displayMessage.emit(new Message(isSuccess, message));
  }
}
