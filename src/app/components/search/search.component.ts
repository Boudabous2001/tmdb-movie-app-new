import { Component } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  template: `
    <div class="search-container">
      <mat-form-field appearance="outline" class="search-input">
        <mat-label>Search Movies</mat-label>
        <input
          matInput
          [(ngModel)]="searchQuery"
          (keyup.enter)="searchMovies()"
          placeholder="Enter movie title"
        />
        <mat-icon matSuffix (click)="searchMovies()">search</mat-icon>
      </mat-form-field>

      <div *ngIf="loading" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading && searchResults.length" class="search-results">
        <mat-card
          *ngFor="let movie of searchResults"
          class="movie-card"
          (click)="goToMovieDetail(movie.id)"
        >
          <img
            mat-card-image
            [src]="tmdbService.getImageUrl(movie.poster_path)"
            [alt]="movie.title"
          />
          <mat-card-content>
            <h3>{{ movie.title }}</h3>
            <p>{{ movie.release_date | date }}</p>
            <p>Rating: {{ movie.vote_average | number : '1.1-1' }}/10</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="!loading && searchResults.length === 0" class="no-results">
        <p>No movies found. Try another search term.</p>
      </div>

      <div class="pagination" *ngIf="searchResults.length">
        <ngx-pagination
          [items]="totalResults"
          [itemsPerPage]="20"
          (pageChange)="onPageChange($event)"
        ></ngx-pagination>
      </div>
    </div>
  `,
  styles: [
    `
      .search-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      .search-input {
        width: 100%;
        margin-bottom: 20px;
      }
      .search-results {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
      }
      .movie-card {
        cursor: pointer;
        transition: transform 0.3s ease;
      }
      .movie-card:hover {
        transform: scale(1.05);
      }
      .loading,
      .no-results {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 50px;
      }
      .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class SearchComponent {
  searchQuery = '';
  searchResults: any[] = [];
  loading = false;
  currentPage = 1;
  totalResults = 0;

  constructor(public tmdbService: TmdbService, private router: Router) {}

  searchMovies() {
    if (!this.searchQuery.trim()) return;

    this.loading = true;
    this.tmdbService
      .searchMovies(this.searchQuery, this.currentPage)
      .subscribe({
        next: (response) => {
          this.searchResults = response.results;
          this.totalResults = response.total_results;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching movies', error);
          this.loading = false;
        },
      });
  }

  goToMovieDetail(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.searchMovies();
  }
}
