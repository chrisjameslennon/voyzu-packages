import type { VoyzuPackageDefinition } from "@voyzu/types/framework";
import leftMenu from "./ui-surface/left-nav";
import { pageRoutes } from "./modules/website/pages.routes";

export const cmsPackage = {
  contracts: {
    uiSurface: {
      "topnav.menu": { website: { label: "Website", routeId: "voyzu.cms.website.page.home" } },
      "leftnav.menu": { "/website": { content: leftMenu } },
    },
    pageRouting: { roots: { "/website": { routes: pageRoutes } } },
  },
} as const satisfies VoyzuPackageDefinition;

export default cmsPackage;
