import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container" *ngIf="user">
      <mat-card class="profile-card">
        <mat-card-header>
          <div mat-card-avatar class="profile-avatar">
            <mat-icon>account_circle</mat-icon>
          </div>
          <mat-card-title>{{ user.username }}</mat-card-title>
          <mat-card-subtitle>Movie Enthusiast</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="profile-sections">
            <div class="profile-section">
              <h3>Account Details</h3>
              <p><strong>Username:</strong> {{ user.username }}</p>
              <p><strong>Joined:</strong> {{ accountCreated | date }}</p>
            </div>

            <div class="profile-section">
              <h3>Favorite Genres</h3>
              <mat-chip-list>
                <mat-chip color="primary" selected *ngFor="let genre of favoriteGenres">
                  {{ genre }}
                </mat-chip>
              </mat-chip-list>
            </div>

            <div class="profile-section">
              <h3>Watched Movies</h3>
              <mat-list>
                <mat-list-item *ngFor="let movie of watchedMovies">
                  {{ movie.title }} ({{ movie.year }})
                </mat-list-item>
              </mat-list>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button 
            mat-raised-button 
            color="warn" 
            (click)="logout()"
          >
            Logout
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .profile-card {
      width: 600px;
      max-width: 100%;
    }
    .profile-sections {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .profile-avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #3f51b5;
      color: white;
      border-radius: 50%;
    }
    .profile-avatar mat-icon {
      font-size: 40px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any;
  accountCreated = new Date(2024, 0, 1);
  favoriteGenres = ['Action', 'Science Fiction', 'Comedy'];
  watchedMovies = [
    { title: 'Inception', year: 2010 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Star Wars', year: 1977 }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get current user from auth service
    this.user = this.authService.getCurrentUser();

    // Redirect to login if no user
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}