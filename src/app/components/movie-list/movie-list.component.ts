import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  template: `
    <div class="movie-list-container">
      <h2>Popular Movies</h2>

      <div *ngIf="loading" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading" class="movies-grid">
        <mat-card
          *ngFor="let movie of movies"
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
            <p>Release Date: {{ movie.release_date | date }}</p>
            <p>Rating: {{ movie.vote_average | number : '1.1-1' }}/10</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="pagination">
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
      .movie-list-container {
        padding: 20px;
      }
      .movies-grid {
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
      .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];
  loading = true;
  currentPage = 1;
  totalResults = 0;

  constructor(public tmdbService: TmdbService, private router: Router) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.loading = true;
    this.tmdbService.getPopularMovies(this.currentPage).subscribe({
      next: (response) => {
        this.movies = response.results;
        this.totalResults = response.total_results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movies', error);
        this.loading = false;
      },
    });
  }

  goToMovieDetail(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadMovies();
  }
}
