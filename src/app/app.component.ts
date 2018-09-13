import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {ApiService} from './utils/api.service';
import {environment} from '../environments/environment';
import {UserService} from './utils/user.service';
import {ColorProvider} from './utils/color.provider';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  navOpened: boolean;
  @ViewChild('snav') snav;
  menu: any;
  title: string;
  user: any;
  readyToGo = false;
  loading = true;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private apiService: ApiService, private userService: UserService,
              public colorProvider: ColorProvider, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.menu = [
      {title: 'Início', icon: 'home', url: '/'},
      {title: 'Iniciar sessão', icon: 'person', url: '/sign-in'},
    ];
    this.apiService.init({
      apiUrl: environment.apiHost + environment.apiRoutes,
      apiHost: environment.apiHost,
    }).subscribe(
      () => {
        this.userService.checkToken().then(() => {
          this.readyToGo = true;
          this.loading = false;
        });
      },
      () => {
        this.readyToGo = false;
        this.loading = false;
      },
      () => {
        this.loading = true;
      }
    );
    this.userService.userChange.subscribe(user => this.user = user);
  }

  ngOnInit() {
    this.navOpened = <any>localStorage.getItem('snav');
    this.snav.openedChange.subscribe(state => {
      localStorage.setItem('snav', state);
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  signOut() {
    this.userService.set(null);
    this.userService.setToken(null);
    this.router.navigate(['/']);
  }
}
