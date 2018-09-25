import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {ApiService} from '../../../core/services/api.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-order-info',
  templateUrl: 'order-info.component.html',
  styleUrls: ['order-info.component.scss']
})

export class OrderInfoComponent implements OnInit {
  info: any;
  loading: boolean;

  constructor(public appComponent: AppComponent, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher, private apiService: ApiService, private router: Router, private snackBar: MatSnackBar) {
    this.info = {};
  }

  ngOnInit() {
    this.appComponent.title = 'Pedido';
    let infoFromTable: any = sessionStorage.getItem('info');
    try {
      infoFromTable = infoFromTable && JSON.parse(infoFromTable);
    } catch (e) {
    }
    const id = this.route.snapshot.params['id'];
    if (infoFromTable && +id === infoFromTable.id) {
      this.info = {...this.info, ...infoFromTable};
    }

    if (id) {
      this.loading = true;
      this.apiService
        .prep('order', 'findById')
        .call({id})
        .subscribe(
          res => {
            this.info = {...this.info, ...res};
          },
          err => {
            // noinspection JSIgnoredPromiseFromCall
            this.router.navigate(['/order']);
            if (err.status === 404) {
              this.snackBar.open(err.error.message, null, {
                duration: 3000
              });
            }
          },
          () => {
            this.loading = false;
          }
        );
    }
  }

  onSubmit(form) {
    Object.keys(form.controls).forEach(i => {
      const input = form.controls[i];
      input.markAsTouched();
      if (input.invalid) {
        const inputElement = (document.querySelector(`form input[name="${i}"]`) as HTMLElement);
        inputElement.focus();
      }
    });

    this.loading = true;
    if (form.invalid) {
      return this.loading = false;
    }

    if (!this.info.id) {
      this.apiService
        .prep('order', 'add')
        .call(this.info)
        .subscribe(
          res => {
            // noinspection JSIgnoredPromiseFromCall
            this.router.navigate(['/order/', res.id]);
            this.snackBar.open(res.message, null, {
              duration: 3000
            });
          },
          err => {
            this.loading = false;
            console.error(err);
          }
        );
    } else {
      this.apiService
        .prep('order', 'update')
        .call(this.info)
        .subscribe(
          res => {
            // noinspection JSIgnoredPromiseFromCall
            this.router.navigate(['/order']);
            this.snackBar.open(res.message, null, {
              duration: 3000
            });
          },
          err => {
            console.error(err);
          },
          () => {
            this.loading = false;
          }
        );
    }
  }

  remove() {
    this.loading = true;
    this.apiService
      .prep('order', 'remove')
      .call(this.info)
      .subscribe(
        res => {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate(['/order']);
          this.snackBar.open(res.message, null, {
            duration: 3000
          });
        },
        err => {
          this.loading = false;
          console.error(err);
        }
      );
  }
}
