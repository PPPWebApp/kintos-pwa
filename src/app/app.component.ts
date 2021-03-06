import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from "./services/auth.service";
import { FirebaseService } from "./services/firebase.service";
import { AngularFireAuth } from 'angularfire2/auth';
import { MDL } from 'app/mdlUpgradeComponent.directive'

@Component({
  selector: 'app-root',
  //template: `<router-outlet></router-outlet>`
  templateUrl: './app.component.html'
  //styleUrls: ['./app.component.css']
})

export class AppComponent {
  public isLoggedIn: boolean;
  public url: string;
  public headerUser = '';
  public user: object;

  constructor(private afAuth: AngularFireAuth,
              private afService: AuthService,
              private router: Router,
              private fbService: FirebaseService) {
    // This asynchronously checks if our user is logged it and will automatically
    // redirect them to the Login page when the status changes.
    // This is just a small thing that Firebase does that makes it easy to use.
    this.afService.af.auth.subscribe(
      (auth) => {
        if (auth == null) {
          // console.log("Not Logged in.");
          //console.log(String(this.router.url))
          this.isLoggedIn = false;
          if(this.url === "/register" || this.url === "/login"){
            // this.router.navigate(['login']);
          }else{
            document.location.href = "/login"
          }
        }else {
          // console.log("Successfully Logged in.");
          // Set the Display Name and Email so we can attribute messages to them
          if(auth.google) {
            this.afService.displayName = auth.google.displayName;
            this.afService.email = auth.google.email;
          }else {
            this.isLoggedIn = true;
            this.user = this.fbService.getUser();
            //this.headerUser = 'mdl-layout--fixed-drawer';
            console.log(this.headerUser);
            this.afService.displayName = auth.auth.displayName;
            this.afService.email = auth.auth.email;
          }
          //this.router.navigate(['']);
        }
      }
    );
  }

  logout() {
    this.afService.logout();
    document.location.href = "/login"
  }


}
