import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AddUserDialogComponent } from './components/add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from './components/edit-user-dialog/edit-user-dialog.component';
import { UserStatsComponent } from './components/user-stats/user-stats.component';
import { UserFilterComponent } from './components/user-filter/user-filter.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { FirestoreDatePipe } from './shared/pipes/firestore-date.pipe';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { MaterialModule } from './shared/modules/material/material-module';

@NgModule({
  declarations: [
    App,
    ManageUsersComponent,
    AddUserDialogComponent,
    EditUserDialogComponent,
    UserStatsComponent,
    UserFilterComponent,
    UsersTableComponent,
    ConfirmationDialogComponent,
    FirestoreDatePipe,
  ],
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
