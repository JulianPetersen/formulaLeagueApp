import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonButton, IonSpinner, IonCard, IonInput, IonCardContent, IonItem } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { loguinResponse } from 'src/app/models/auth';
import { AdmobService } from 'src/app/services/admob-service';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import { GlobalService } from 'src/app/services/global';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonSpinner, IonCard, IonCardContent, IonItem, ReactiveFormsModule, IonInput, RouterModule]
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
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private global: GlobalService
  ) { }


  ngOnInit() {

  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.auth.login(this.form.getRawValue()).subscribe({
      next: (res: loguinResponse) => {
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



  async loginWithGoogle() {
  try {
    console.log('Iniciando Google Sign In');

    const result: any = await GoogleSignIn.signIn();

    console.log('Google result:', result);

    const idToken = result.idToken;

    if (!idToken) {
      this.global.presentAlert('Error', '', 'Google no devolvió idToken');
      return;
    }

    this.auth.loginGoogle(idToken).subscribe({
      next: (res: any) => {
        console.log('Backend Google OK:', res);
      },
      error: (err) => {
        console.log('Backend Google ERROR:', err);
      }
    });

  } catch (error: any) {
    console.log('Google SignIn ERROR completo:', error);
    this.global.presentAlert('Error', '', error?.message || 'Login con Google falló');
  }
}
}
