import { spfi, SPBrowser   } from "@pnp/sp";

export const sp = spfi().using(SPBrowser({ baseUrl: "https://agroupma.sharepoint.com/sites/Kenzhosa/" }));
export const web =  sp.web;
export const webRelativePagesUrl = "/sites/Kenzhosa/SitePages/";
export const siteRelativeUrl = "/sites/Kenzhosa/";
export const webPartListId = "f92bf067-bc19-489e-a556-7fe95f508720";
export const webPartDisplayActifId  = "e6277ddb-aee0-4f26-9275-bc0f73b4ff60";

