import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <input
                matInput
                formControlName="username"
                placeholder="Enter your username"
              />
              <mat-error *ngIf="loginForm.get('username').invalid">
                Username is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input
                matInput
                type="password"
                formControlName="password"
                placeholder="Enter your password"
              />
              <mat-error *ngIf="loginForm.get('password').invalid">
                Password is required
              </mat-error>
            </mat-form-field>

            <div class="login-actions">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="loginForm.invalid"
              >
                Login
              </button>
            </div>
          </form>

          <div *ngIf="errorMessage" class="error-message">
            <mat-icon>error</mat-icon>
            <span>{{ errorMessage }}</span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f0f0f0;
      }

      .login-card {
        width: 400px;
        padding: 20px;
      }

      mat-form-field {
        width: 100%;
        margin-bottom: 15px;
      }

      .login-actions {
        display: flex;
        justify-content: center;
        margin-top: 20px;
      }

      .error-message {
        color: red;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 15px;
      }

      .error-message mat-icon {
        margin-right: 10px;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/']);
          } else {
            this.errorMessage = 'Invalid username or password';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred during login';
          console.error('Login error', error);
        },
      });
    }
  }
}
