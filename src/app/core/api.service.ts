import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient)
  private readonly base = environment.apiUrl

  get<T>(url: string, options?: any) {
    return this.http.get<T>(`${this.base}${url}`, options)
  }
  post<T>(url: string, body: any, options?: any) {
    return this.http.post<T>(`${this.base}${url}`, body, options)
  }
  put<T>(url: string, body: any, options?: any) {
    return this.http.put<T>(`${this.base}${url}`, body, options)
  }
  delete<T>(url: string, options?: any) {
    return this.http.delete<T>(`${this.base}${url}`, options)
  }
}
