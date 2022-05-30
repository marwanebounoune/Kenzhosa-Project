import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'KenzhosaCssApplicationCustomizerStrings';

const LOG_SOURCE: string = 'KenzhosaCssApplicationCustomizer';

export interface IKenzhosaCssApplicationCustomizerProperties {
  cssurl: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class KenzhosaCssApplicationCustomizer
  extends BaseApplicationCustomizer<IKenzhosaCssApplicationCustomizerProperties> {

  @override
  public async onInit(): Promise<void> {
    const head: any = document.getElementsByTagName("body")[0] || document.documentElement;
    let customStyle: HTMLLinkElement = document.createElement("link");
    /* hide page site contents */
    var currentPageUrl = this.context.pageContext.site.serverRequestPath;
    console.log("currentPageUrl", currentPageUrl);

    /* change favicon */
    var favicon = document.querySelector("link[rel*='icon']") as HTMLElement || document.createElement('link') as HTMLElement;
    const faviconUrl: string= "https://agroupma.sharepoint.com/sites/Kenzhosa/SiteAssets/Kenzhosa.ico";
    console.log("before favicon", favicon);
    favicon.setAttribute('type', 'image/x-icon');

    favicon.setAttribute('rel', 'shortcut icon');

    favicon.setAttribute('href', faviconUrl);//////////////////
    document.getElementsByTagName("head")[0].appendChild(favicon);
    /* hide app launcher and settings gear*/
    const currentUser: any = this.context.pageContext.user;
    console.log("currentUser", currentUser);
    var email: string = currentUser.email.toString();
    if(email != "alami.saad@agroup.ma" && email != "valactif.dev@agroup.ma" && email != "valactif@agroup.ma"){
      const cssUrl: string = this.properties.cssurl;
      if (cssUrl) {
        customStyle.href = cssUrl;
        customStyle.rel = "stylesheet";
        customStyle.type = "text/css";
        head.insertAdjacentElement("beforeEnd", customStyle);
      }
      if(currentPageUrl === "/_layouts/15/viewlsts.aspx"){
       
        customStyle.href = "https://agroupma.sharepoint.com/sites/Kenzhosa/SiteAssets/InjectionCss.css";
        customStyle.rel = "stylesheet";
        customStyle.type = "text/css";
        head.insertAdjacentElement("beforeEnd", customStyle);
        window.location.href = "https://agroupma.sharepoint.com/sites/Kenzhosa/SitePages/Home.aspx";
      }               
      return Promise.resolve();
    }
    else{
      const cssUrl: string = this.properties.cssurl;
      if (cssUrl) {
        customStyle.href = "https://agroupma.sharepoint.com/sites/Kenzhosa/SiteAssets/HideLogoSharePoint.css";
        customStyle.rel = "stylesheet";
        customStyle.type = "text/css";
        head.insertAdjacentElement("beforeEnd", customStyle);
      }           
      return Promise.resolve();
    }
  }
}
