import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent,IonButton,IonSpinner,IonCard,IonInput,IonCardContent,IonItem } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { loguinResponse } from 'src/app/models/auth';
import { AdmobService } from 'src/app/services/admob-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent,CommonModule, FormsModule,IonButton,IonSpinner,IonCard,IonCardContent,IonItem,ReactiveFormsModule,IonInput,RouterModule]
})
export class LoginPage implements OnInit {





  loading = false;
  error: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth:AuthService,
    private cdr: ChangeDetectorRef,
  ) { }


   ngOnInit() {
    
  }

  submit() {
  if (this.form.invalid) return;

  this.loading = true;
  this.error = '';

  this.auth.login(this.form.getRawValue()).subscribe({
    next: (res:loguinResponse) => {
      this.loading = false;
      console.log(res)


        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('tokenApp', res.token);

        this.router.navigateByUrl('/tabs/tab1');
      
      this.cdr.detectChanges();
    },

    error: (err: any) => {
      this.loading = false;
      this.error = err.error?.message || 'Credenciales incorrectas';
      this.cdr.detectChanges(); 
    }
  });
}

}
