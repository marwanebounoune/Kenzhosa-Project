import * as React from 'react';
import styles from './DisplayActif.module.scss';
import { IDisplayActifProps } from './IDisplayActifProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { spfi, SPBrowser   } from "@pnp/sp";
import * as moment from 'moment';

export const sp = spfi().using(SPBrowser({ baseUrl: "https://agroupma.sharepoint.com/sites/Kenzhosa/" }));


function AfficherActifs (props:any){
   let [info, setInfo] = React.useState(null);
   const actif_title = props.actif_title;
   console.log("actif_title",actif_title);
   async function getInformation(){
       var query = function(element) {
           return element.Title === actif_title;
       };
       const act = await sp.web.lists.getByTitle('Listing').items.getAll();
       console.log("act",act);
       
       const actifs = await sp.web.lists.getByTitle('Listing').items.select("*", "Ville_/Title").expand("Ville_").getAll();
       const actif = actifs.filter(query);
       
       setInfo(actif[0]);
   }

   React.useEffect(() => {
       getInformation();
   },[actif_title]);
   console.log("Info -> ", info)
    return (
          
        <>
        <table><tr><td><h1>Informations générales</h1></td></tr></table>
             
            {info?
             <div className={styles.DivAffichage}>
             <table>
             {info.Title ? 

                 <tr>
                 <td><span className={styles.spanInfo} >Dénomination : </span></td>
                 <td><th><span>{info.Title}</span></th></td> 
                 </tr>:<></>}
                 {info.Type_x0020_de_x0020_bien ? 

                 <tr>
                    <td><span className={styles.spanInfo}>Type de bien : </span></td>
                    <td><th><span>{info.Type_x0020_de_x0020_bien}</span></th></td>
                    </tr>:<></>}
                 {info.Ville_.Title ? 

                 <tr>
                    <td><span className={styles.spanInfo}>Ville : </span></td>
                    <td><th><span>{info.Ville_.Title}</span></th></td>
                    </tr>:<></>}
                 {info.Nombre_x0020_d_x0027_actifs ? 

                 <tr>
                    <td><span className={styles.spanInfo}>Nombre d'actifs     : </span></td>
                    <td><th><span>{info.Nombre_x0020_d_x0027_actifs}</span></th></td>
                    </tr>:<></>}
                 {info.Type_x0020_de_x0020_commercialis ? 
                <tr>
                    <td><span className={styles.spanInfo}>Type de commercialisation  : </span></td>
                    <td><th><span>{info.Type_x0020_de_x0020_commercialis}</span></th></td>
                    </tr>:<></>}
                 {info.Valorisation_x0020_location ? 
                 <tr>
                    <td><span className={styles.spanInfo}>Valorisation de location  : </span></td>
                    <td><th><span>{info.Valorisation_x0020_location}</span></th></td>
                 </tr>:<></>}
                 {info.Valorisation_x0020_Vente ? 

                 <tr>
                    <td><span className={styles.spanInfo}>Valorisation de vente  : </span></td>
                    <td><th><span>{info.Valorisation_x0020_Vente}</span></th></td>
                    </tr>:<></>}
                    {info.Statut_x0020_d_x0027_activit_x00 ? 

                 <tr>
                    <td><span className={styles.spanInfo}>Statut d'activité    : </span></td>
                    <td><th><span>{info.Statut_x0020_d_x0027_activit_x00}</span></th></td>
                    </tr>:<></>}
                    {info.commerciaisation_x0020_en_x0020_ ? 

                 <tr>
                    <td><span className={styles.spanInfo}>Commercialisation en valeur % : </span></td>
                    <td><th><span>{info.commerciaisation_x0020_en_x0020_}</span></th></td>
                    </tr>:<></>}
                    {info.Commercialisation_x0020_en_x0020 ? 

                 <tr>
                    <td><span className={styles.spanInfo}>Commercialisation en nombre % : </span></td>
                    <td><th><span>{info.Commercialisation_x0020_en_x0020}</span></th></td>
                    </tr>:<></>}
                    {info.Date_x0020_Mandat ? 

                 <tr>
                    <td><span className={styles.spanInfo}>Date mandat                   : </span></td>
                    <td><th><span>{moment(info.Date_x0020_Mandat).format("DD-MM-YY")}</span></th></td>
                    </tr>:<></>}
                
                 
                 </table>
            </div>
            :<></>}
        </>
    );

}
export default AfficherActifs;


