import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  AlertController,
  IonicModule,
  LoadingController,
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { MyValidators } from 'src/app/utils/my-validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, RouterModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export default class RegisterPage implements OnInit {
  authService = inject(AuthService);
  form: FormGroup;
  hidden: boolean = false;
  passwordType = 'password';
  eye = 'eye';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.form = this.initForm();
  }

  initForm() {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$'
          ),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.minLength(8),
          Validators.required,
          MyValidators.matchValues('password'),
        ],
      ],
    });
  }

  async register() {
    try {
      const loading = await this.loadingCtrl.create({
        message: 'Signup...',
      });
      await loading.present();
      if (this.form.valid) {
        const { email, password } = this.form.getRawValue();
        const user = await this.authService.register(email, password);
        if (user) {
          console.log('🚀 ~ user', user);
          this.router.navigate(['/tabs']);
          loading.dismiss();
        }
      } else {
        this.form.markAllAsTouched();
        loading.dismiss();
      }
    } catch (error) {
      this.loadingCtrl.dismiss();
      this.showAlert(error.message);
    }
  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Loading Error',
      message,
      buttons: ['OK'],
      backdropDismiss: true,
    });
    alert.present();
  }

  togglePasswordMode() {
    this.hidden = !this.hidden;
    this.passwordType = this.hidden ? 'text' : 'password';
    this.eye = this.hidden ? 'eye-off' : 'eye';
  }
}
