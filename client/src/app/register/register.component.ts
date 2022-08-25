import { HtmlParser } from '@angular/compiler';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Admin } from '../models/admin';
import { Customer } from '../models/customer';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
 
  @Output() cancelRegister = new EventEmitter<boolean>();
  
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  model: any = {};

  validationErrors: string[] = [];
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
    this.initializeForm();
  }
  
  initializeForm() {
    
     this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      city: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      email: new FormControl( '',  [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.email]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')]),
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  register() {
    this.accountService.register(this.registerForm?.value).subscribe(
      (re) => {
        this.router.navigate(['/home']);
        this.cancel();
      },
      error => {
        if(Array.isArray(error)) {
          this.validationErrors = error;
        }
      }
    )

  }

  cancel() {
    this.cancelRegister.emit(false);
  }
  

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.value;
      const controlToMatch = (control?.parent as FormGroup)?.controls[matchTo];
      const controlToMatchValue = controlToMatch?.value;
      return controlValue === controlToMatchValue ? null : { isMatching: true };
    }
  }


  


   login(){

    this.accountService.Adminlogin(this.model)
    .subscribe(next =>{
      this.isAdmin = true;
      this.router.navigateByUrl('/home');
      this.toaster.success('Admin logged in');
      
    }, 
    error=>{
   
    if(this.isAdmin == false){
      this.Userlogin();
    }})
  } 
   
  
 
  Userlogin(){
    this.accountService.login(this.model).subscribe(next =>{
      this.router.navigateByUrl('/home');
      this.toaster.success("User logged in")
      location.reload();
      
    },
    error=>{
      this.toaster.error("login failed")
    }
    )
  }


  switch(){
  const signUpButton = document.getElementById('signUp') as HTMLElement;
  const signInButton = document.getElementById('signIn') as HTMLElement;
  const container = document.getElementById('container') as HTMLElement;

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});
  }
  
}
