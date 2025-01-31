import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-genre-filter',
  template: `
    <div class="genre-filter-container">
      <div class="genre-selector">
        <mat-form-field>
          <mat-label>Select Genre</mat-label>
          <mat-select
            [(value)]="selectedGenreId"
            (selectionChange)="filterByGenre()"
          >
            <mat-option *ngFor="let genre of genres" [value]="genre.id">
              {{ genre.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div *ngIf="loading" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading && filteredMovies.length" class="movies-grid">
        <mat-card
          *ngFor="let movie of filteredMovies"
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

      <div *ngIf="!loading && filteredMovies.length === 0" class="no-results">
        <p>No movies found in this genre.</p>
      </div>

      <div class="pagination" *ngIf="filteredMovies.length">
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
      .genre-filter-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      .genre-selector {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
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
export class GenreFilterComponent implements OnInit {
  genres: any[] = [];
  filteredMovies: any[] = [];
  selectedGenreId: number;
  loading = false;
  currentPage = 1;
  totalResults = 0;

  constructor(
    public tmdbService: TmdbService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Load genres
    this.tmdbService.getGenres().subscribe({
      next: (response) => {
        this.genres = response.genres;

        // Check if genre is passed in route
        this.route.paramMap.subscribe((params) => {
          const genreId = params.get('id');
          if (genreId) {
            this.selectedGenreId = Number(genreId);
            this.filterByGenre();
          }
        });
      },
      error: (error) => {
        console.error('Error loading genres', error);
      },
    });
  }

  filterByGenre() {
    if (!this.selectedGenreId) return;

    this.loading = true;
    this.tmdbService
      .getMoviesByGenre(this.selectedGenreId, this.currentPage)
      .subscribe({
        next: (response) => {
          this.filteredMovies = response.results;
          this.totalResults = response.total_results;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error filtering movies by genre', error);
          this.loading = false;
        },
      });
  }

  goToMovieDetail(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.filterByGenre();
  }
}
