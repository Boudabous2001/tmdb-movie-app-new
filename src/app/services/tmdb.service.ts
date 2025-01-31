import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private apiKey = '7c98f4ea1bff8262bb7079a2dccd4456';
  private apiUrl = 'https://api.themoviedb.org/3';
  private imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  constructor(private http: HttpClient) {}

  getPopularMovies(page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString());

    return this.http.get(`${this.apiUrl}/movie/popular`, { params });
  }

  // Search Movies
  searchMovies(query: string, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('query', query)
      .set('page', page.toString());

    return this.http.get(`${this.apiUrl}/search/movie`, { params });
  }

  // Get Movie Details
  getMovieDetails(movieId: number): Observable<any> {
    const params = new HttpParams().set('api_key', this.apiKey);

    return this.http.get(`${this.apiUrl}/movie/${movieId}`, { params });
  }

  // Get Movie Credits
  getMovieCredits(movieId: number): Observable<any> {
    const params = new HttpParams().set('api_key', this.apiKey);

    return this.http.get(`${this.apiUrl}/movie/${movieId}/credits`, { params });
  }

  // Get Genres
  getGenres(): Observable<any> {
    const params = new HttpParams().set('api_key', this.apiKey);

    return this.http.get(`${this.apiUrl}/genre/movie/list`, { params });
  }

  // Filter Movies by Genre
  getMoviesByGenre(genreId: number, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('with_genres', genreId.toString())
      .set('page', page.toString());

    return this.http.get(`${this.apiUrl}/discover/movie`, { params });
  }

  // Helper method to get full image URL
  getImageUrl(posterPath: string): string {
    return posterPath
      ? `${this.imageBaseUrl}${posterPath}`
      : 'assets/placeholder.png';
  }
}
