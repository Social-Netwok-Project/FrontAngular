import { Routes } from '@angular/router';
import {HomeComponent} from "./component/home/home.component";
import {UserAccountComponent} from "./component/user-account/user-account.component";
import {MessagesComponent} from "./component/messages/messages.component";
import {ConnectionSecurityComponent} from "./component/user-account/connection-security/connection-security.component";
import {UserSettingsComponent} from "./component/user-account/user-settings/user-settings.component";
import {LoginComponent} from "./component/authentication/login/login.component";
import {StorageKeys} from "./component/misc/storage-keys";
import {RegisterComponent} from "./component/authentication/register/register.component";
import {PasswordRecoveryComponent} from "./component/authentication/password-recovery/password-recovery.component";
import {PasswordResetComponent} from "./component/authentication/password-reset/password-reset.component";
import {SwitchUsersComponent} from "./component/switch-users/switch-users.component";
import {SiteGraphComponent} from "./component/site-graph/site-graph.component";
import {ResearchComponent} from "./component/research/research.component";
import {MyPostsComponent} from "./component/my-posts/my-posts.component";
import {InterestsComponent} from "./component/interests/interests.component";
import {DiscoverComponent} from "./component/discover/discover.component";

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: `register`, component: RegisterComponent},
  {path: 'password-recovery', component: PasswordRecoveryComponent},
  {path: `password-reset/:${StorageKeys.USER_TOKEN}`, component: PasswordResetComponent},
  {path: 'messages', component: MessagesComponent},
  {path: 'my-posts', component: MyPostsComponent},
  {path: 'my-posts/:id', component: MyPostsComponent},
  {path: 'interests', component: InterestsComponent},
  {path: 'discover', component: DiscoverComponent},
  {path: 'research', component: ResearchComponent},
  {path: 'switch-users', component: SwitchUsersComponent},
  {path: 'site-graph', component: SiteGraphComponent},
  {
    path: 'user-account', component: UserAccountComponent, children: [
      {path: 'connection-security', component: ConnectionSecurityComponent},
      {path: 'user-settings', component: UserSettingsComponent},
    ],
  },
];
