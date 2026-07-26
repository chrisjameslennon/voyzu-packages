import type { VoyzuSurfaceNavGroup } from "@voyzu/ui-surface/types";

import { helloModule } from "../modules/hello-module/module";

export const helloModulesLeftNav = [
  {
    label: "Hello",
    items: [
      {
        label: "Hello Module",
        icon: "waving_hand",
        routeId: helloModule.pageRoutes.home.id,
      },
    ],
  },
] satisfies VoyzuSurfaceNavGroup[];
