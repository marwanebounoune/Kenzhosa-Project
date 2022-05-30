import "@pnp/sp/webs";
import "@pnp/sp/items/get-all";
import { sp } from "../../Constant";

export function getLat(latlng:string){
    var lat = latlng.split(",",1)[0];
    return parseFloat(lat);
}
export function getLng(latlng:string){
    var lng = latlng.split(",",2)[1];
    return parseFloat(lng);
}
export function extendDistanceFiltrer(itemsDexa:any, type_de_bien:string, type_de_commercialisation:string[]){
    var query = function(element) {
        var lat = getLat(element.Latitude_Longitude);
        var lng = getLng(element.Latitude_Longitude);
        
        //console.log("element =>",element)
        console.log("type_de_ref.indexOf(element.Type_x0020_de_x0020_R_x00e9_f_x0)!=-1", type_de_commercialisation.indexOf(element.Type_x0020_de_x0020_commercialis)!=-1)
        return element.is_deleted ==="Non" && element.Type_x0020_de_x0020_bien[0] === type_de_bien && type_de_commercialisation.indexOf(element.Type_x0020_de_x0020_commercialis)!=-1 ;
    };
    
}
export function getAbsoluteRapportUrl(EncodedAbsUrl:string, FileLeafRef:string){
    var pathUrl = EncodedAbsUrl.split(FileLeafRef);
    return pathUrl[0];
}
export async function WindowPopUp(modalTitle:string, url:string, from_list:string){
    var left = (screen.width/2)-(840/2);
    var top = (screen.height/2)-(600/2);
    var url_page = url;
    var credit = null;
  
    //console.log("email: ", userId);
   
    const modalWindow = window.open(url_page, modalTitle, "width=840,height=600,menubar=no,toolbar=no,directories=no,titlebar=no,resizable=no,scrollbars=no,status=no,location=no,top="+top+", left="+left);
}