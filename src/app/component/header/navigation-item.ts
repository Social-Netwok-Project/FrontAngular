import {
  faDiagramProject,
  faHome,
  faLocationDot,
  faMagnifyingGlass,
  faMessage, faQuestion,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

class NavigationItem {
  constructor(private name: string, private link: string, private faIcon: IconDefinition) {
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
}

export const homeNavigationItem = new NavigationItem("Home", "/home", faHome);
export const researchNavigationItem = new NavigationItem("Research", "/research", faSearch);
export const interestsNavigationItem = new NavigationItem("Interests", "/interests", faLocationDot);
export const discoverNavigationItem = new NavigationItem("Discover", "/discover", faQuestion);
export const messagesNavigationItem = new NavigationItem("Messages", "/messages", faMessage);
export const siteGraph = new NavigationItem("Site Graph", "/site-graph", faDiagramProject);

export const navigationItems = [
  homeNavigationItem,
  researchNavigationItem,
  interestsNavigationItem,
  discoverNavigationItem,
  messagesNavigationItem,
  siteGraph
];
