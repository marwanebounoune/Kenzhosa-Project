import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/folders";
const relativeDestinationUrl:string = "/sites/Kenzhosa/"

export async function createFolder(nombreSousDossier:number, FolderPere:string, referenceContrat:string, id_contrat:number, LatLng:string){
    const destinationUrl:string = FolderPere+"/"+referenceContrat;
    let folderName:string = null;
    try{
        console.log("Hello")
        const referenceFolderIsExist: boolean = await (await sp.web.getFolderByServerRelativePath(destinationUrl).get()).Exists;
        if(referenceFolderIsExist && FolderPere === "Grands actifs") {
            for(let index=0; index<nombreSousDossier; index++){
                let folderName = relativeDestinationUrl+FolderPere+'/'+referenceContrat+'/'+referenceContrat+'-'+(index+1);
                await createForlderPere(folderName, id_contrat);
            }
        }
        else if(referenceFolderIsExist && FolderPere === "Actifs simlpes") {
            const contrat: any = await sp.web.lists.getByTitle("Contrats").items.getById(id_contrat).get();
            console.log("contrat", contrat)
            let newRefContrat = referenceContrat+" ("+contrat.Nombre_x0020_d_x0027_actifs+")"
            await createActifSimple(folderName, destinationUrl, FolderPere, newRefContrat, id_contrat, LatLng)
            await sp.web.lists.getByTitle("Contrats").items.getById(id_contrat).update({
                Nombre_x0020_d_x0027_actifs: contrat.Nombre_x0020_d_x0027_actifs+1,
                En_x0020_vente: contrat.En_x0020_vente
            })
        }
    }catch{
        if(FolderPere === "Grands actifs") {
            await createDrandsActifs(folderName, destinationUrl, FolderPere, referenceContrat, id_contrat, LatLng, nombreSousDossier)
        }
        else if(FolderPere === "Actifs simlpes"){
            console.log("Hello 2")
            await createActifSimple(folderName, destinationUrl, FolderPere, referenceContrat, id_contrat, LatLng)
        }
    }
}
async function createForlder(folderName:string){
    await sp.web.folders.add(folderName);
}
async function createForlderPere(folderName:string, id_contrat:any){
    await sp.web.folders.add(folderName).then(res => {
        console.log("res->", res)
    });
    const folder: any = await sp.web.getFolderByServerRelativePath(folderName).getItem();
    const contrat: any = await sp.web.lists.getByTitle("Contrats").items.getById(id_contrat).get();
    console.log("folder", folder.get())
    console.log("contrat", contrat)
    console.log()
    await folder.update({
        R_x00e9_f_x00e9_rence_x0020_contratId: contrat.Id,
        Soci_x00e9_t_x00e9__x0020_clientId: contrat.Soci_x00e9_t_x00e9__x0020_clientId,
        Montant_x0020_commercialisation: contrat.Montant_x0020_commercialisation,
        Statut_x0020_d_x0027_actif: "En cours de vente"
    });
}
async function _createExcelSuiviCommercial(referenceContrat:string, TypeActif:string, folderName:string){
    const fileName:string = "Suivi Commercial - "+referenceContrat+".xlsx";
    const templateUrl = "/sites/Kenzhosa/"+TypeActif+"/Forms/SuiviCommercial/SuiviCommercialModel.xlsx";
    await sp.web.getFileByServerRelativeUrl(templateUrl).getBuffer()
    .then(templateData => {
        return sp.web.getFolderByServerRelativeUrl(folderName)
            .files.add(fileName, templateData);
    }).then(file=>{
        return file.file.getItem()
        .then(async item=>{
            await item.get();
            return item.update({
                ContentTypeId: "0x0101000F01C5A4DE868142BF20CD126FD5A4C501"
            })
        });
    });
}
async function _createExcelSuiviMarketing(referenceContrat:string, TypeActif:string, folderName:string){
    const fileName:string = "Suivi Marketing - "+referenceContrat+".xlsx";
    const templateUrl = "/sites/Kenzhosa/"+TypeActif+"/Forms/SuiviMarketing/SuiviMarketingModel.xlsx";
    await sp.web.getFileByServerRelativeUrl(templateUrl).getBuffer()
    .then(templateData => {
        return sp.web.getFolderByServerRelativeUrl(folderName)
            .files.add(fileName, templateData);
    }).then(file=>{
        return file.file.getItem()
        .then(async item=>{
            await item.get();
            return item.update({
                ContentTypeId: "0x0101000F01C5A4DE868142BF20CD126FD5A4C502"
            })
        });
    });
}
async function createActifListing(idContrat:number, LatLng:string, folderName:string, refernceActif:string){
    const contrat: any = await sp.web.lists.getByTitle("Contrats").items.getById(idContrat).get();
    console.log("contrat->",contrat)
    const listing: any = await sp.web.lists.getByTitle("Listing").items.getAll();
    console.log("listing->",listing)
    await sp.web.lists.getByTitle("Listing").items.add({
        Title: refernceActif,
        Montant_x0020_commercialisation: contrat.Montant_x0020_commercialisation,
        LatitudeLongitude: LatLng,
        Voir_x0020_plus: {
            Description:"Voir plus ...",
            Url: "https://agroupma.sharepoint.com"+folderName
        }
    })
}
async function createActifSimple(folderName:string, destinationUrl:string, FolderPere:string, referenceContrat:string, id_contrat:number, LatLng:string){
    folderName = relativeDestinationUrl+FolderPere+'/'+referenceContrat;
    var folderName2 = folderName+'/Documents - '+referenceContrat;
    var folderName3 = folderName+'/Photos - '+referenceContrat;
    var folderName4 = folderName+'/Dossier des annonces - '+referenceContrat;
    await createForlderPere(folderName, id_contrat);
    console.log("relativeDestinationUrl", relativeDestinationUrl)
    await createForlder(folderName2);
    await createForlder(folderName3);
    await createForlder(folderName4);
    await _createExcelSuiviCommercial(referenceContrat, "Actifs%20simlpes", folderName)
    await _createExcelSuiviMarketing(referenceContrat, "Actifs%20simlpes", folderName)
    await createActifListing(id_contrat, LatLng, folderName, referenceContrat)
    console.log("folderName", folderName)
}
async function createDrandsActifs(folderName:string, destinationUrl:string, FolderPere:string, referenceContrat:string, id_contrat:number, LatLng:string, nombreSousDossier:number){
    folderName = relativeDestinationUrl+FolderPere+'/'+referenceContrat;
    await createForlderPere(folderName, id_contrat);
    await createActifListing(id_contrat, LatLng, folderName, referenceContrat)
    for(let index=0; index<nombreSousDossier; index++){
        folderName = relativeDestinationUrl+FolderPere+'/'+referenceContrat+'/'+referenceContrat+' - A'+(index+1);
        var folderName2 = folderName+'/Documents '+referenceContrat+' - A'+(index+1);
        var folderName3 = folderName+'/Photos '+referenceContrat+' - A'+(index+1);
        var folderName4 = folderName+'/Dossier des annonces '+referenceContrat+' - A'+(index+1);
        await createForlderPere(folderName, id_contrat);
        await createForlder(folderName2);
        await createForlder(folderName3);
        await createForlder(folderName4);
        await _createExcelSuiviCommercial(referenceContrat, "Grands%20actifs", folderName)
        await _createExcelSuiviMarketing(referenceContrat, "Grands%20actifs", folderName)
        console.log("folderName", folderName)
    }
}

