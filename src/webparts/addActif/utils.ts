import { ClientsideWebpart, CreateClientsidePage } from "@pnp/sp/clientside-pages";
import "@pnp/sp/folders";
import { folderFromServerRelativePath, IFolder } from "@pnp/sp/folders";
import { siteRelativeUrl, web, webPartListId, webRelativePagesUrl,sp } from "../addActif/Constant";
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/files";
import "@pnp/sp/folders/list";
import { Dialog } from '@microsoft/sp-dialog';

export async function AddWebpartToPage2(page:any, ActifDestinationUrl:string, Actif:any){
    //const page = await sp.web.loadClientsidePage(webRelativePagesUrl+NameActif+".aspx");
    const partDefs = await sp.web.getClientsideWebParts();
    // console.log("partDefs", partDefs);
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
    const column_divider2_1 = section_divider2.addColumn(6);
    const column_divider2_2 = section_divider2.addColumn(6);

    const section_3 = page.addSection();
    const column_3_1 = section_3.addColumn(6);
    const column_3_2 = section_3.addColumn(6);

    const section_divider3 = page.addSection();
    const column_divider3_1 = section_divider3.addColumn(6);
    const column_divider3_2 = section_divider3.addColumn(6);

    const section_4 = page.addSection();
    const column_4_1 = section_4.addColumn(6);
    const column_4_2 = section_4.addColumn(6);


    const partDefDivider = partDefs.filter(c => c.Id ===  "2161a1c6-db61-4731-b97c-3cdb303f7cbb");
    if (partDefDivider.length < 1) {
        throw new Error("Could not find the web part -------------");
    }
    const DividerWebPart = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart.setProperties({
        length: 100,
        weight: 6
    });
    /*---------display actif--------------5621265B-7E03-4705-8AB5-EB790BCBF48F----------- 5621265b-7e03-4705-8ab5-eb790bcbf48f------- */
    const partDefDisplayInfo = partDefs.filter(c => c.Id === "{C67CE3B5-ED2F-4A61-A529-73C3BC2E1859}");
    // const partDefDisplayInfo = partDefs.filter(c => c.Id === "{8e8a5b66-7093-43d3-90a8-80aff7b7a50a}");
    if (partDefDisplayInfo.length < 1) {
        throw new Error("Could not find the web part DISPLAY INFO");
    }
    const part_display_info = ClientsideWebpart.fromComponentDef(partDefDisplayInfo[0]);
    part_display_info.setProperties({
        title: "Informations générales",
        description: Actif.Title,//ActifTitle,//
    });
    column_1_1.addControl(part_display_info);
    /*-------------------bing map web part----------------------------- */
    let pins = [];
    pins.push(location);
    const partDefBingMap = partDefs.filter(c => c.Id === "e377ea37-9047-43b9-8cdb-a761be2f8e09");
    const part_bing = ClientsideWebpart.fromComponentDef(partDefBingMap[0]);
    part_bing.setProperties({
        title: "Localisation du Bien",
        //address: "40.05588912963867,-75.52118682861328",
        pushPins: [{
            title: Actif.Title,//"label of the pin",
            location:{
                latitude: getLat(Actif.LatitudeLongitude),//33.51304233788905,
                longitude: getLng(Actif.LatitudeLongitude)//-7.560209352749043
            }
        }],
        center: {
            latitude: getLat(Actif.LatitudeLongitude),
            longitude: getLng(Actif.LatitudeLongitude)
        },
    });
    column_1_2.addControl(part_bing);
    /*---------------------Add 2 devider----------------------------------- */
    const DividerWebPart1 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart1.setProperties({length: 100, weight: 6});
    column_divider_1.addControl(DividerWebPart1);
    const DividerWebPart2 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart2.setProperties({length: 100, weight: 6});
    column_divider_2.addControl(DividerWebPart2);
    /*---------------------images actif----------------------------------- */
    const part_images_actif = ClientsideWebpart.fromComponentDef(partDef[0]);
    // console.log("part_document_actif", part_document_actif);
    const serverRealtiveWebUrl6: string = (await sp.web()).ServerRelativeUrl;
    // console.log("serverRealtiveWebUrl6", serverRealtiveWebUrl6)
    const library_images_actif = await sp.web.lists.getByTitle("Documents Générales").expand("RootFolder")();
    // console.log("library_images_actif", library_images_actif)
    const selectedListId_images_actif: string = library_images_actif.Id;
    const selectedListUrl_images_actif: string = library_images_actif.RootFolder.ServerRelativeUrl;
    const webRelativeListUrl_images_actif: string = selectedListUrl_images_actif.substring(serverRealtiveWebUrl6.length);
    part_images_actif.setProperties({
        isDocumentLibrary: true,
        selectedFolderPath: ActifDestinationUrl+"/Photos "+ActifDestinationUrl,
        selectedListId: selectedListId_images_actif,
        selectedListUrl: selectedListUrl_images_actif,
        webRelativeListUrl: webRelativeListUrl_images_actif,
        hideCommandBar: false,
        selectedViewId:1,
        webpartHeightKey: 1,
        filterBy: {}
    });
    part_images_actif.setServerProcessedContent({
        searchablePlainTexts: {
            listTitle:"Images - "+Actif.Title
        }
    });
    column_2_1.addControl(part_images_actif);
    /*---------------------document actif----------------------------------- */
    const part_document_actif = ClientsideWebpart.fromComponentDef(partDef[0]);
    // console.log("part_document_actif", part_document_actif);
    const serverRealtiveWebUrl7: string = (await sp.web()).ServerRelativeUrl;
    const library_document_actif = await sp.web.lists.getByTitle("Documents Générales").expand("RootFolder")();
    const selectedListId_document_actif: string = library_document_actif.Id;
    const selectedListUrl_document_actif: string = library_document_actif.RootFolder.ServerRelativeUrl;
    const webRelativeListUrl_document_actif: string = selectedListUrl_document_actif.substring(serverRealtiveWebUrl7.length);
    part_document_actif.setProperties({
        isDocumentLibrary: true,
        selectedFolderPath: ActifDestinationUrl+"/Documents "+ActifDestinationUrl,
        selectedListId: selectedListId_document_actif,
        selectedListUrl: selectedListUrl_document_actif,
        webRelativeListUrl: webRelativeListUrl_document_actif,
        hideCommandBar: false,
        selectedViewId:1,
        webpartHeightKey: 1,
        filterBy: {}
    });
    part_document_actif.setServerProcessedContent({
        searchablePlainTexts: {
            listTitle:"Dataroom - "+Actif.Title
        }
    });
    column_2_2.addControl(part_document_actif);
    /*---------------------Add devider----------------------------------- */
    const DividerWebPart3 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart3.setProperties({length: 100, weight: 6});
    column_divider2_1.addControl(DividerWebPart3);
    const DividerWebPart4 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart4.setProperties({length: 100, weight: 6});
    column_divider2_2.addControl(DividerWebPart4);
    /*---------------------Détail actif----------------------------------- */
    const part_detail_actif = ClientsideWebpart.fromComponentDef(partDef[0]);
    // console.log("part_document_actif", part_document_actif);
    const serverRealtiveWebUrlDetail: string = (await sp.web()).ServerRelativeUrl;
    const library_detail_actif = await sp.web.lists.getByTitle("Détail").expand("RootFolder")();
    const selectedListId_detail_actif: string = library_detail_actif.Id;
    const selectedListUrl_detail_actif: string = library_detail_actif.RootFolder.ServerRelativeUrl;
    const webRelativeListUrl_detail_actif: string = selectedListUrl_detail_actif.substring(serverRealtiveWebUrlDetail.length);
    part_detail_actif.setProperties({
        isDocumentLibrary: true,
        selectedFolderPath: ActifDestinationUrl,
        selectedListId: selectedListId_detail_actif,
        selectedListUrl: selectedListUrl_detail_actif,
        webRelativeListUrl: webRelativeListUrl_detail_actif,
        hideCommandBar: false,
        selectedViewId:1,
        webpartHeightKey: 1,
        filterBy: {}
    });
    part_detail_actif.setServerProcessedContent({
        searchablePlainTexts: {
            listTitle:"Détail - "+Actif.Title
        }
    });
    column_3_1.addControl(part_detail_actif);
    /*---------------------Détail actif----------------------------------- */
    const part_annonces_actif = ClientsideWebpart.fromComponentDef(partDef[0]);
    // console.log("part_document_actif", part_document_actif);
    const serverRealtiveWebUrlAnnonces: string = (await sp.web()).ServerRelativeUrl;
    const library_annonces_actif = await sp.web.lists.getByTitle("Détail").expand("RootFolder")();
    const selectedListId_annonces_actif: string = library_annonces_actif.Id;
    const selectedListUrl_annonces_actif: string = library_annonces_actif.RootFolder.ServerRelativeUrl;
    const webRelativeListUrl_annonces_actif: string = selectedListUrl_annonces_actif.substring(serverRealtiveWebUrlAnnonces.length);
    part_annonces_actif.setProperties({
        isDocumentLibrary: true,
        selectedFolderPath: ActifDestinationUrl,
        selectedListId: selectedListId_annonces_actif,
        selectedListUrl: selectedListUrl_annonces_actif,
        webRelativeListUrl: webRelativeListUrl_annonces_actif,
        hideCommandBar: false,
        selectedViewId:1,
        webpartHeightKey: 1,
        filterBy: {}
    });
    part_annonces_actif.setServerProcessedContent({
        searchablePlainTexts: {
            listTitle:"Annonces - "+Actif.Title
        }
    });
    column_3_2.addControl(part_annonces_actif);
    /*---------------------Add devider----------------------------------- */
    const DividerWebPart5 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart5.setProperties({length: 100, weight: 6});
    column_divider3_1.addControl(DividerWebPart5);
    const DividerWebPart6 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart6.setProperties({length: 100, weight: 6});
    column_divider3_2.addControl(DividerWebPart6);
    /*---------------------Détail actif----------------------------------- */
    const part_offres_actif = ClientsideWebpart.fromComponentDef(partDef[0]);
    // console.log("part_document_actif", part_document_actif);
    const serverRealtiveWebUrlOffres: string = (await sp.web()).ServerRelativeUrl;
    const library_offres_actif = await sp.web.lists.getByTitle("Offres").expand("RootFolder")();
    const selectedListId_offres_actif: string = library_offres_actif.Id;
    const selectedListUrl_offres_actif: string = library_offres_actif.RootFolder.ServerRelativeUrl;
    const webRelativeListUrl_offres_actif: string = selectedListUrl_offres_actif.substring(serverRealtiveWebUrlOffres.length);
    part_offres_actif.setProperties({
        isDocumentLibrary: true,
        selectedFolderPath: ActifDestinationUrl,
        selectedListId: selectedListId_offres_actif,
        selectedListUrl: selectedListUrl_offres_actif,
        webRelativeListUrl: webRelativeListUrl_offres_actif,
        hideCommandBar: false,
        selectedViewId:1,
        webpartHeightKey: 1,
        filterBy: {}
    });
    part_offres_actif.setServerProcessedContent({
        searchablePlainTexts: {
            listTitle:"Offres - "+Actif.Title
        }
    });
    column_4_2.addControl(part_offres_actif);
    // /*---------Desctiptif du bien--------------5621265B-7E03-4705-8AB5-EB790BCBF48F----------- 5621265b-7e03-4705-8ab5-eb790bcbf48f------- */
    // const partDefDescriptifDossier = partDefs.filter(c => c.Id ===  "{B6B42971-ECDB-4BD6-8983-A52521743304}");
    // // const partDefDescriptifDossier = partDefs.filter(c => c.Id ===  "{b6b42971-ecdB-4bd6-8983-a52521743304}");
    // // console.log("partDefMpComparable", partDefDescriptifDossier)
    // if (partDefDescriptifDossier.length < 1) {
    //     throw new Error("Could not find the web part DESCRIPTIF ACTIF");
    // }
    // const part_desc_dossier = ClientsideWebpart.fromComponentDef(partDefDescriptifDossier[0]);
    // // console.log("part_map_comparables", part_desc_dossier)
    // part_desc_dossier.setProperties({
    //     title: "Descriptif du bien",
    //     description: Actif.Title
    // });
    // column_3_1.addControl(part_desc_dossier);
    // /*---------------------document actif----------------------------------- */
    // const part_rapport_actif = ClientsideWebpart.fromComponentDef(partDef[0]);
    // // console.log("part_document_actif", part_document_actif);
    // const serverRealtiveWebUrl8: string = (await sp.web.get()).ServerRelativeUrl;
    // const library_rapport_actif = await sp.web.lists.getByTitle("Rapports").expand("RootFolder").get();
    // const selectedListId_rapport_actif: string = library_rapport_actif.Id;
    // const selectedListUrl_rapport_actif: string = library_rapport_actif.RootFolder.ServerRelativeUrl;
    // const webRelativeListUrl_rapport_actif: string = selectedListUrl_rapport_actif.substring(serverRealtiveWebUrl8.length);
    // part_rapport_actif.setProperties({
    //     isDocumentLibrary: true,
    //     selectedFolderPath: ActifDestinationUrl,
    //     selectedListId: selectedListId_rapport_actif,
    //     selectedListUrl: selectedListUrl_rapport_actif,
    //     webRelativeListUrl: webRelativeListUrl_rapport_actif,
    //     hideCommandBar: false,
    //     selectedViewId:1,
    //     webpartHeightKey: 1,
    //     filterBy: {}
    // });
    // part_rapport_actif.setServerProcessedContent({
    //     searchablePlainTexts: {
    //         listTitle:"Rapport - "+Actif.Title
    //     }
    // });
    // column_3_2.addControl(part_rapport_actif);
    // /*---------------------Add devider----------------------------------- */
    // const DividerWebPart5 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    // DividerWebPart5.setProperties({length: 100, weight: 6});
    // column_divider3_1.addControl(DividerWebPart5);
    // const DividerWebPart6 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    // DividerWebPart6.setProperties({length: 100, weight: 6});
    // column_divider3_2.addControl(DividerWebPart6);
    // /*---------Map comparables--------------5621265B-7E03-4705-8AB5-EB790BCBF48F----------- 5621265b-7e03-4705-8ab5-eb790bcbf48f------- */
    // const partDefMpComparable = partDefs.filter(c => c.Id ===  "{F50E4566-1CDC-4C63-BBA4-EAF5924ABFBE}");
    // // const partDefMpComparable = partDefs.filter(c => c.Id ===  "{f50e4566-1cdc-4c63-bba4-eaf5924abfbe}");
    // if (partDefMpComparable.length < 1) {
    //     throw new Error("Could not find the web part MAP COMPARABLES");
    // }
    // const part_map_comparables = ClientsideWebpart.fromComponentDef(partDefMpComparable[0]);
    // // console.log("part_map_comparables", part_map_comparables)
    // part_map_comparables.setProperties({
    //     title: "Informations générales",
    //     description: "AIzaSyDE7IhtorrPU6os5vAvGCblbDYUv6GJEvY",//ActifTitle,//
    //     reference: Actif.Title
    // });
    // column_4_1.addControl(part_map_comparables);
    // /*---------Charts comparables--------------5621265B-7E03-4705-8AB5-EB790BCBF48F----------- 5621265b-7e03-4705-8ab5-eb790bcbf48f------- */
    // const partDefChartComparable = partDefs.filter(c => c.Id ===  "{75EF4107-C271-46D2-9BF7-C89D3F1A2EF0}");
    // if (partDefChartComparable.length < 1) {
    //     throw new Error("Could not find the web part MAP COMPARABLES");
    // }
    // const part_chart_comparables = ClientsideWebpart.fromComponentDef(partDefChartComparable[0]);
    // // console.log("part_chart_comparables", part_chart_comparables)
    // part_chart_comparables.setProperties({
    //     title: "Informations générales",
    //     description: Actif.Title
    // });
    // column_4_2.addControl(part_chart_comparables);
    /*---------------------Save----------------------------------- */
    await page.save();
}
export async function CreatePage(ActifFolderName:string, Actif:any) {
    const ActifDestinationUrl:string = ActifFolderName;
    const actif:number = Actif.Id;
    // console.log("ID", actif)
    const pageNameUrl = 'https://agroupma.sharepoint.com/sites/Kenzhosa/SitePages/'+ActifFolderName + ".aspx";
    const page = await sp.web.addClientsidePage(ActifFolderName, ActifFolderName, "Article");
    // console.log("page=>", page.toUrl())
    page.setBannerImage("/sites/Kenzhosa/SiteAssets/logo.jpg");
    let tempPage: any = page; //page object got from above implementation.    
    let pageItemId: string=tempPage.json.AbsoluteUrl;
    // console.log("page=>", page)
    await page.save();
    AddWebpartToPage2(page, ActifDestinationUrl, Actif);
    const it = await sp.web.lists.getByTitle("Listing").items.getById(actif)()
    // console.log("it", it)
    await sp.web.lists.getByTitle("Listing").items.getById(actif).update({
        Voir_x0020_plus: {
            Description:"Voir plus ...",
            Url: pageItemId
        }
    })
    .then(()=>{
        Dialog.alert(`Votre actif est crée avec succès.`);
    })
    .catch(()=>{
        Dialog.alert(`Erreur.`);
    });
}
export async function createFolder(FolderPere:string, ActifFolderName:string, Actif:any) {
    const IdActif:number = Actif.Id;
    const relativeDestinationUrl:string = siteRelativeUrl+FolderPere;
    const ActifDestinationUrl:string = relativeDestinationUrl+"/"+ActifFolderName;
    try{
        const actifExists: boolean = await (await sp.web.folders.getByUrl(relativeDestinationUrl)()).Exists;
        if(actifExists){
            try{
                const newFolderResult:any = await sp.web.rootFolder.folders.getByUrl(relativeDestinationUrl).folders.addUsingPath(ActifFolderName)
                .then(async res => {
                    const sousActifExists: boolean = await (await sp.web.folders.getByUrl(relativeDestinationUrl).folders.getByUrl(ActifFolderName)()).Exists;
                    if(sousActifExists){
                        try{
                            const folderUpd = await sp.web.rootFolder.folders.getByUrl(relativeDestinationUrl).folders.getByUrl(ActifFolderName).getItem();
                            // console.log("folderUpd", folderUpd)
                            folderUpd.update({
                                D_x00e9_nomination_Id: IdActif
                            })
                            await sp.web.folders.getByUrl(relativeDestinationUrl).folders.getByUrl(ActifFolderName).folders.addUsingPath("Documents "+ActifFolderName)
                            await sp.web.folders.getByUrl(relativeDestinationUrl).folders.getByUrl(ActifFolderName).folders.addUsingPath("Photos "+ActifFolderName)
                            await sp.web.lists.getByTitle("Détail").rootFolder.addSubFolderUsingPath(ActifFolderName)
                            await sp.web.lists.getByTitle("Annonces").rootFolder.addSubFolderUsingPath(ActifFolderName)
                            await sp.web.lists.getByTitle("Offres").rootFolder.addSubFolderUsingPath(ActifFolderName)
                            await (await sp.web.lists.getByTitle("Détail").rootFolder.folders.getByUrl(ActifFolderName).getItem()).update({
                                D_x00e9_nomination_Id: IdActif
                            });
                            await (await sp.web.lists.getByTitle("Annonces").rootFolder.folders.getByUrl(ActifFolderName).getItem()).update({
                                D_x00e9_nomination_Id: IdActif
                            });
                            await (await sp.web.lists.getByTitle("Offres").rootFolder.folders.getByUrl(ActifFolderName).getItem()).update({
                                D_x00e9_nomination_Id: IdActif
                            });
                            const folderDocs: boolean = await (await sp.web.folders.getByUrl(relativeDestinationUrl).folders.getByUrl(ActifFolderName).folders.getByUrl("Documents "+ActifFolderName)()).Exists;
                            const folderPics: boolean = await (await sp.web.folders.getByUrl(relativeDestinationUrl).folders.getByUrl(ActifFolderName).folders.getByUrl("Documents "+ActifFolderName)()).Exists;
                            if(folderDocs == true && folderPics == true){
                                await CreatePage(ActifFolderName, Actif);
                            }
                        }
                        catch{
                            await sp.web.folders.addUsingPath(relativeDestinationUrl+'/'+relativeDestinationUrl);
                            await sp.web.folders.addUsingPath(relativeDestinationUrl+'/'+ActifDestinationUrl);
                        }
                    }
                })
            }
            catch{
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
export function getLat(latlng:string){
    var lat = latlng.split(",",1)[0];
    return parseFloat(lat);
}
export function getLng(latlng:string){
    var lng = latlng.split(",",2)[1];
    return parseFloat(lng);
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