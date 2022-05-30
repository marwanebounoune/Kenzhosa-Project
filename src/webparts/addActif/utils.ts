import { ClientsideWebpart, CreateClientsidePage } from "@pnp/sp/clientside-pages";
import "@pnp/sp/folders";
import { folderFromServerRelativePath, IFolder } from "@pnp/sp/folders";
import { siteRelativeUrl, web, webPartListId, webRelativePagesUrl,sp } from "../addActif/Constant";
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/files";

export async function AddWebpartToPage2(page:any, ActifDestinationUrl:string, Actif:any){
    //const page = await sp.web.loadClientsidePage(webRelativePagesUrl+NameActif+".aspx");
    const partDefs = await sp.web.getClientsideWebParts();
    console.log("partDefs", partDefs)
    const partDef = partDefs.filter(c => c.Id === webPartListId);
    /* section du page */
    const section_1 = page.addSection();
    const column_1_1 = section_1.addColumn(6);
    const column_1_2 = section_1.addColumn(6);

    const section_divider = page.addSection();
    const column_divider_1 = section_divider.addColumn(6);
    const column_divider_2 = section_divider.addColumn(6);

    const section_2 = page.addSection();
    const column_2_1 = section_2.addColumn(6);
    const column_2_2 = section_2.addColumn(6);

    const section_divider2 = page.addSection();
    const column_divider_2_1 = section_divider2.addColumn(6);

    const section_3 = page.addSection();
    const column_3_1 = section_3.addColumn(6);

    const partDefDivider = partDefs.filter(c => c.Id ===  "2161a1c6-db61-4731-b97c-3cdb303f7cbb");
    if (partDefDivider.length < 1) {
        // we didn't find it so we throw an error
        throw new Error("Could not find the web part");
    }
    const DividerWebPart = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart.setProperties({
    length: 100,
    weight: 6
    });
    const partDefDisplayInfo = partDefs.filter(c => c.Id ===  "e6277ddb-aee0-4f26-9275-bc0f73b4ff60");
    if (partDefDisplayInfo.length < 1) {
        // we didn't find it so we throw an error
        throw new Error("Could not find the web part");
    }
    const part_display_info = ClientsideWebpart.fromComponentDef(partDefDisplayInfo[0]);
    part_display_info.setProperties({
        title: "Informations générales",
        description: Actif.Title,//ActifTitle,//
    });
    column_1_1.addControl(part_display_info);
    /*---------------------document actif----------------------------------- */
    const part_document_actif = ClientsideWebpart.fromComponentDef(partDef[0]);
    const serverRealtiveWebUrl7: string = (await sp.web()).ServerRelativeUrl;
    const library_document_actif = await sp.web.lists.getByTitle("Listing").expand("RootFolder")();
    const selectedListId_document_actif: string = library_document_actif.Id;
    const selectedListUrl_document_actif: string = library_document_actif.RootFolder.ServerRelativeUrl;
    const webRelativeListUrl_document_actif: string = selectedListUrl_document_actif.substring(serverRealtiveWebUrl7.length);
    part_document_actif.setProperties({
       //title: "Documents d'Actif",
       isDocumentLibrary: true,
       selectedFolderPath: ActifDestinationUrl,//"Saham/Lot 1/TFZ",
       selectedListId: selectedListId_document_actif,
       selectedListUrl: selectedListUrl_document_actif,
       webRelativeListUrl: webRelativeListUrl_document_actif,
       hideCommandBar: false,
       selectedViewId:1,
       webpartHeightKey: 1,//set size of the webpart to small- about 5 items
       filterBy: {}
    });
    part_document_actif.setServerProcessedContent({
        searchablePlainTexts: {
            listTitle:"Dataroom - "+Actif.Title
        }
    });
    column_2_2.addControl(part_document_actif);

    /*divider webpart */
    const DividerWebPart2_1 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart2_1.setProperties({
       length: 100,
       weight: 6
     });
   
    column_divider_2_1.addControl(DividerWebPart2_1);

}

export async function createFolder(FolderPere:string, ActifFolderName:string) {
        const relativeDestinationUrl:string = siteRelativeUrl+FolderPere;
        const ActifDestinationUrl:string = relativeDestinationUrl+"/"+ActifFolderName;
        //const societeFolder: IFolder = await sp.web.getFolderByServerRelativePath(destinationUrl);
        //const item = await societeFolder.getItem();
        //await sp.web.folders.add('/sites/vlctf-client2/Document Actif/'+societeFolderName+'/'+portefeillleFolderName);
        try{
            console.log(relativeDestinationUrl)
            const societeFolderIsExist: boolean = await (await sp.web.folders.getByUrl(relativeDestinationUrl)()).Exists;
            console.log(societeFolderIsExist)
            if(societeFolderIsExist){
                try{
                    const portefeillleFolderIsExist: boolean = await (await sp.web.getFolderByServerRelativePath(relativeDestinationUrl)()).Exists;       
                    if(portefeillleFolderIsExist){
                        await sp.web.folders.addUsingPath(relativeDestinationUrl+'/'+ActifDestinationUrl);
                    }
                }catch{
                    await sp.web.folders.addUsingPath(relativeDestinationUrl+'/'+relativeDestinationUrl);
                    await sp.web.folders.addUsingPath(relativeDestinationUrl+'/'+ActifDestinationUrl);
                }
            }
        }catch{
            createFolderglobal(relativeDestinationUrl, ActifFolderName);
        }
    }
    

export async function createFolderglobal(relativeDestinationUrl:string, ActifFolderName:string) {
    await sp.web.folders.addUsingPath(relativeDestinationUrl+'/'+ActifFolderName);
}
// export async function createFileInsideFolder(folder: IFolder, file:File, fileName:string) {
//     folder.files.addUsingPath('fileTest', file, { Overwrite: true });
// }

// export async function CreatePage(ActifFolderName:string, Actif:any) {
//     const ActifDestinationUrl:string = ActifFolderName;
//     const actif:number = Actif.Id;
//     const pageNameUrl = 'https://agroupma.sharepoint.com/sites/Kenzhosa/SitePages/'+ActifFolderName + ".aspx";
//     const page = await sp.web.addClientsidePage(ActifFolderName, ActifFolderName, "Article");
//     // page.setBannerImage("/sites/GestionActifs/SiteAssets/__siteIcon__.jpg");
//     let tempPage: any = page; //page object got from above implementation.    
//     let pageItemId: number=tempPage.json.Id;
//     await page.save();
//     AddWebpartToPage2(page, ActifDestinationUrl, Actif);
//     await web.lists.getByTitle("Listing").items.getById(actif).update({
//         Lien: {
//             Description:"Voir plus ...",
//             Url: pageNameUrl
//         }
//     });
//}