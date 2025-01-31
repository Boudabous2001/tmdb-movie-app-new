import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1>Discover Amazing Movies</h1>
        <p>Explore, search, and dive into the world of cinema</p>
        
        <mat-form-field appearance="outline" class="search-input">
          <mat-label>Search Movies</mat-label>
          <input 
            matInput 
            [(ngModel)]="searchQuery" 
            (keyup.enter)="searchMovies()"
            placeholder="Enter movie title"
          >
          <mat-icon matSuffix (click)="searchMovies()">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="featured-sections">
        <div class="section">
          <h2>Popular Movies</h2>
          <div class="movie-carousel">
            <mat-card 
              *ngFor="let movie of popularMovies" 
              class="movie-card"
              (click)="goToMovieDetail(movie.id)"
            >
              <img 
                mat-card-image 
                [src]="tmdbService.getImageUrl(movie.poster_path)" 
                [alt]="movie.title"
              >
              <mat-card-content>
                <h3>{{ movie.title }}</h3>
                <p>Rating: {{ movie.vote_average | number:'1.1-1' }}/10</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="section genres-section">
          <h2>Browse by Genre</h2>
          <div class="genre-grid">
            <button 
              mat-raised-button 
              color="primary" 
              *ngFor="let genre of genres"
              (click)="navigateToGenre(genre.id)"
            >
              {{ genre.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .hero-section {
      text-align: center;
      margin-bottom: 40px;
      background-color: #f0f0f0;
      padding: 40px;
      border-radius: 10px;
    }

    .search-input {
      width: 500px;
      max-width: 100%;
    }

    .featured-sections {
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    .movie-carousel {
      display: flex;
      overflow-x: auto;
      gap: 20px;
      padding-bottom: 20px;
    }

    .movie-card {
      min-width: 200px;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .movie-card:hover {
      transform: scale(1.05);
    }

    .genre-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }

    .genres-section {
      text-align: center;
    }
  `]
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  popularMovies: any[] = [];
  genres: any[] = [];

  constructor(
    public tmdbService: TmdbService,
    private router: Router
  ) {}

  ngOnInit() {
    // Load popular movies
    this.tmdbService.getPopularMovies().subscribe({
      next: (response) => {
        this.popularMovies = response.results.slice(0, 10);
      },
      error: (error) => {
        console.error('Error loading popular movies', error);
      }
    });

    // Load genres
    this.tmdbService.getGenres().subscribe({
      next: (response) => {
        this.genres = response.genres;
      },
      error: (error) => {
        console.error('Error loading genres', error);
      }
    });
  }

  searchMovies() {
    if (!this.searchQuery.trim()) return;
    this.router.navigate(['/search'], { 
      queryParams: { query: this.searchQuery } 
    });
  }

  goToMovieDetail(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  navigateToGenre(genreId: number) {
    this.router.navigate(['/genre', genreId]);
  }
}