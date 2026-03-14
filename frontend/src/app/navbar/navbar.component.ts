import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public authservice:AuthserviceService,private router:Router){
    
  }

  onlogout(){
    localStorage.removeItem("adminemail");
    this.authservice.adminloggedin = false;
    this.router.navigate(["/"])
  }
  onrestlogout(){
    localStorage.removeItem("resid");
    this.authservice.restloggedin = false;
    this.router.navigate(["/"])
  }

   oncustlogout(){
    localStorage.removeItem("custid");
    this.authservice.custloggedin = false;
    this.router.navigate(["/"])
  }
}
