import {
  faArrowRightToBracket,
  faDiagramProject,
  faHome,
  faLocationDot,
  faMagnifyingGlass,
  faMessage, faQuestion,
  faSearch, faSignsPost
} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {ProfileMenuItem} from "../user-account/profile-menu-item/profile-menu-item";

class NavigationItem {
  constructor(private name: string, private link: string, private faIcon: IconDefinition, private isLoggedIn: boolean = false) {
  }

  getName(): string {
    return this.name;
  }

  getLink(): string {
    return this.link;
  }

  getIcon(): IconDefinition {
    return this.faIcon;
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}

export const homeNavigationItem = new NavigationItem("Home", "/home", faHome);
export const researchNavigationItem = new NavigationItem("Research", "/research", faSearch, true);
export const interestsNavigationItem = new NavigationItem("Interests", "/interests", faLocationDot, true);
export const discoverNavigationItem = new NavigationItem("Discover", "/discover", faQuestion, true);
export const messagesNavigationItem = new NavigationItem("Messages", "/messages", faMessage, true);
export const myPostsNavigationItem = new NavigationItem("My Posts", "/my-posts", faSignsPost, true);
export const siteGraphNavigationItem = new NavigationItem("Site Graph", "/site-graph", faDiagramProject);
export const switchUsersNavigationItem = new NavigationItem('Switch Users', '/switch-users', faArrowRightToBracket);

export const navigationItems = [
  homeNavigationItem,
  researchNavigationItem,
  interestsNavigationItem,
  discoverNavigationItem,
  messagesNavigationItem,
  myPostsNavigationItem,
  siteGraphNavigationItem,
  switchUsersNavigationItem
];
