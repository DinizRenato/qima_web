import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [HttpClientModule, MatSnackBarModule],
  exports: [HttpClientModule],
  providers: [
    AuthService,
    AuthGuard,
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import only in AppModule.');
    }
  }
}
