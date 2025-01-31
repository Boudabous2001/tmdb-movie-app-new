import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-movie-detail',
  template: `
    <div *ngIf="loading" class="loading">
      <mat-spinner></mat-spinner>
    </div>

    <div *ngIf="!loading && movie" class="movie-detail-container">
      <div class="movie-header">
        <img
          [src]="tmdbService.getImageUrl(movie.poster_path)"
          [alt]="movie.title"
          class="movie-poster"
        />
        <div class="movie-info">
          <h1>{{ movie.title }}</h1>
          <div class="movie-metadata">
            <span>{{ movie.release_date | date }}</span>
            <span>{{ movie.runtime }} mins</span>
            <span>Rating: {{ movie.vote_average | number : '1.1-1' }}/10</span>
          </div>
          <div class="movie-genres">
            <mat-chip-list>
              <mat-chip *ngFor="let genre of movie.genres">
                {{ genre.name }}
              </mat-chip>
            </mat-chip-list>
          </div>
        </div>
      </div>

      <div class="movie-overview">
        <h2>Overview</h2>
        <p>{{ movie.overview }}</p>
      </div>

      <div *ngIf="credits" class="movie-credits">
        <h2>Cast</h2>
        <div class="cast-grid">
          <mat-card
            *ngFor="let actor of credits.cast.slice(0, 10)"
            class="actor-card"
          >
            <img
              mat-card-image
              [src]="tmdbService.getImageUrl(actor.profile_path)"
              [alt]="actor.name"
            />
            <mat-card-content>
              <h3>{{ actor.name }}</h3>
              <p>{{ actor.character }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .movie-detail-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      .movie-header {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
      }
      .movie-poster {
        max-width: 300px;
        border-radius: 10px;
      }
      .movie-info {
        flex-grow: 1;
      }
      .movie-metadata {
        display: flex;
        gap: 15px;
        margin-bottom: 10px;
      }
      .movie-genres {
        margin-bottom: 20px;
      }
      .cast-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
      }
      .actor-card {
        text-align: center;
      }
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
    `,
  ],
})
export class MovieDetailComponent implements OnInit {
  movieId!: number;
  movie: any;
  credits: any;
  loading = true;

  constructor(private route: ActivatedRoute, public tmdbService: TmdbService) {}

  ngOnInit() {
    // Retrieve movie ID from route parameter
    this.route.paramMap.subscribe((params) => {
      this.movieId = Number(params.get('id'));
      this.loadMovieDetails();
    });
  }

  loadMovieDetails() {
    // Load movie details
    this.tmdbService.getMovieDetails(this.movieId).subscribe({
      next: (movieResponse) => {
        this.movie = movieResponse;

        // After movie details are loaded, load credits
        this.tmdbService.getMovieCredits(this.movieId).subscribe({
          next: (creditsResponse) => {
            this.credits = creditsResponse;
            this.loading = false;
          },
          error: (creditsError) => {
            console.error('Error loading movie credits', creditsError);
            this.loading = false;
          },
        });
      },
      error: (movieError) => {
        console.error('Error loading movie details', movieError);
        this.loading = false;
      },
    });
  }
}
