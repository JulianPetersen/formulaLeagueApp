import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent,IonButton,IonSpinner,IonCard,IonInput,IonCardContent,IonItem } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-reset-passwrod',
  templateUrl: './reset-passwrod.page.html',
  styleUrls: ['./reset-passwrod.page.scss'],
  standalone: true,
  imports: [IonContent,CommonModule, FormsModule,IonButton,IonSpinner,IonCard,IonCardContent,IonItem,ReactiveFormsModule,IonInput,RouterModule]
})
export class ResetPasswrodPage implements OnInit {


  
  loading = false;
  error: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });


  constructor(private fb: FormBuilder,private auth:AuthService) { }

  ngOnInit() {
  }


    submit(){
      this.auth.recoveryPassword(this.form.getRawValue())
        .subscribe({
          next :((res) => {
            console.log(res)
          }),
          error: ((err) => {
            console.log(err)
          })
        })
    }
}
