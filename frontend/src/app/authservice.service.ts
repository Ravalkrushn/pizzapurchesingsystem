import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  public adminloggedin = false;
  public adminemail;
  public restloggedin = false;
  public resid;
   public custloggedin = false;
  public custid;
  constructor() { 
    this.adminemail = localStorage.getItem("adminemail");
    if(this.adminemail!=null){
      this.adminloggedin =true;
    }

    this.resid = localStorage.getItem("resid");
    if(this.resid!=null){
      this.restloggedin =true;
    }
     this.custid = localStorage.getItem("custid");
    if(this.custid!=null){
      this.custloggedin =true;
    }
  }
}
