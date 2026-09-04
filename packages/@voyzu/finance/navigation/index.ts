import domains from "./domains";
import settingsLeftNav from "./settings.left-nav";

export const navigation = { domains, leftNav: settingsLeftNav } as const;
export default navigation;
