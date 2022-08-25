import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Admin } from '../models/admin';
import { Customer } from '../models/customer';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  loginForm!: FormGroup;

  registerMode = true;
  currentUser$: Observable<User | null>;
  currentAdmin$: Observable<Admin | null>;
  customer!: Customer;
  public isAdmin : Boolean = false;

  constructor(private accountService: AccountService,
    private router: Router,
    private toaster: ToastrService
    ) 
    {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentAdmin$ = this.accountService.currentAdmin$;
   }

  ngOnInit(): void {
   
  }

   

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/home')
    window.location.reload();
  }


  adminLogout(){
    this.accountService.adminLogout();
    this.isAdmin = false;
    location.reload();
  }


   
  registerToggle(){
    this.registerMode = !this.registerMode
  }


  
}
