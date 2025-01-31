import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-navigation',
  template: `
    <mat-toolbar color="primary" class="navigation-toolbar">
      <div class="logo-container">
        <img src="assets/logo.png" alt="Movie App Logo" class="logo" />
        <span class="app-title">Movie Explorer</span>
      </div>

      <nav class="nav-links">
        <button mat-button routerLink="/movies" routerLinkActive="active">
          Popular Movies
        </button>

        <button mat-button routerLink="/search" routerLinkActive="active">
          Search
        </button>

        <mat-menu #genreMenu="matMenu">
          <button
            *ngFor="let genre of genres"
            mat-menu-item
            (click)="navigateToGenre(genre.id)"
          >
            {{ genre.name }}
          </button>
        </mat-menu>

        <button mat-button [matMenuTriggerFor]="genreMenu">Genres</button>

        <div class="spacer"></div>

        <ng-container *ngIf="!authService.isLoggedIn()">
          <button mat-raised-button color="accent" routerLink="/login">
            Login
          </button>
        </ng-container>

        <ng-container *ngIf="authService.isLoggedIn()">
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>

          <mat-menu #userMenu="matMenu">
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </ng-container>
      </nav>
    </mat-toolbar>
  `,
  styles: [
    `
      .navigation-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo-container {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logo {
        height: 40px;
        width: auto;
      }

      .app-title {
        font-size: 1.2em;
        font-weight: bold;
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .spacer {
        flex-grow: 1;
      }

      .active {
        background-color: rgba(255, 255, 255, 0.2);
      }
    `,
  ],
})
export class NavigationComponent implements OnInit {
  genres: any[] = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    private tmdbService: TmdbService
  ) {}

  ngOnInit() {
    // Load genres for the dropdown menu
    this.tmdbService.getGenres().subscribe({
      next: (response) => {
        this.genres = response.genres;
      },
      error: (error) => {
        console.error('Error loading genres', error);
      },
    });
  }

  navigateToGenre(genreId: number) {
    this.router.navigate(['/genre', genreId]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
