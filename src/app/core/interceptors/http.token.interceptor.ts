import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { JwtService } from '../services';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const token = this.jwtService.getToken();

    if (token) {
      headersConfig['Authorization'] = `Token ${token}`;
    }
    let head;
    // const request = req.clone({ setHeaders: headersConfig });
    if (token) head = req.headers.append('Authorization', `Token ${token}`);
    const request = req.clone({
      headers: head
    });
    // return next.handle(request);
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body.profile && event.body.profile.image) {
            if (!this.isUrl(event.body.profile.image)) {
              let baseUrl = environment.api_url.replace('/api', '/')
              event.body.profile.image = `${baseUrl}${event.body.profile.image}`
            }
          } else if (event.body.articles && event.body.articles.length) {
            event.body.articles.map(article => {
              if (article.author.image && !this.isUrl(article.author.image)) {
                let baseUrl = environment.api_url.replace('/api', '/')
                article.author.image = `${baseUrl}${article.author.image}`
              }
              return article;
            })
          } else if (event.body.user) {
            if (event.body.user.image && !this.isUrl(event.body.user.image)) {
              let baseUrl = environment.api_url.replace('/api', '/')
              event.body.user.image = `${baseUrl}${event.body.user.image}`
            }
          } else if (event.body.article) {
            if (event.body.article.author.image && !this.isUrl(event.body.article.author.image)) {
              let baseUrl = environment.api_url.replace('/api', '/')
              event.body.article.author.image = `${baseUrl}${event.body.article.author.image}`
            }
          }
        }
        return event;
      }));
  }
  isUrl(url) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(url);
  }
}

