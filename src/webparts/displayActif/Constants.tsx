import { spfi, SPBrowser   } from "@pnp/sp";

export const sp = spfi().using(SPBrowser({ baseUrl: "https://agroupma.sharepoint.com/sites/Kenzhosa/" }));
