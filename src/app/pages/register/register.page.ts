import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent,IonButton,IonSpinner,IonCard,IonInput,IonCardContent,IonItem,IonCheckbox  } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { loguinResponse } from 'src/app/models/auth';
import { GlobalService } from 'src/app/services/global';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent,CommonModule,FormsModule,IonButton,IonSpinner,IonCheckbox,IonCard,IonCardContent,IonItem,ReactiveFormsModule,IonInput,RouterModule]
})
export class RegisterPage implements OnInit {

   loading = false;
  error: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username:['', [Validators.required]],
    password: ['', Validators.required],
    aceptTerms: [false, Validators.requiredTrue],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth:AuthService,
    private cdr: ChangeDetectorRef,
    private global:GlobalService
  ) { }


   ngOnInit() {
    
  }

  submit() {
  if (this.form.invalid) return;

  this.loading = true;
  this.error = '';

  console.log(this.form.getRawValue())
  this.auth.register(this.form.getRawValue()).subscribe({
    next: (res:any) => {
      this.loading = false;
        this.global.presentAlert('ATENCION', 'Confirma tu mail', 'Hemos enviado un mail para que verifiques tu cuenta.')
        this.router.navigateByUrl('/login');
      
      this.cdr.detectChanges();
    },

    error: (err: any) => {
      this.loading = false;
      this.error = err.error?.message || 'Credenciales incorrectas';
      this.cdr.detectChanges(); 
    }
  });
}


async openterms(){
   await Browser.open({ url: 'https://formulaleague.site/termsandcondtions' });
}
}


