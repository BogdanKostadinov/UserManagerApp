import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { MaterialModule } from './shared/modules/material/material-module';

@NgModule({
  declarations: [App, ManageUsersComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [App],
})
export class AppModule {}
