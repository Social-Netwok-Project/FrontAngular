import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRightFromBracket, faArrowRightToBracket,
  faGear,
  faLock,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";


export class ProfileMenuItem {
  icon: IconDefinition;
  name: string;
  link: string;

  class: string = "profile-menu-item";
  constructor(icon: IconDefinition, name: string, link: string) {
    this.icon = icon;
    this.name = name;
    this.link = link;
  }
}

export const settings = new ProfileMenuItem(faGear, 'Settings',
  '/user-account/user-settings');
export const connectionAndSecurity = new ProfileMenuItem(faLock,
  'Connection / Security', '/user-account/connection-security');
export const logout = new ProfileMenuItem(faArrowRightFromBracket, 'Logout',
  '');

export const profileMenuItems: ProfileMenuItem[] = [
  settings,
  connectionAndSecurity,
  logout
];
