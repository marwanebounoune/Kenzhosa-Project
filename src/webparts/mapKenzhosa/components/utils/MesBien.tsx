import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import "@pnp/sp/items/get-all";
import * as React from 'react';
import { ActionButton, DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, IDropdownOption, IDropdownStyles, Panel, PrimaryButton, Stack } from 'office-ui-fabric-react';
import { sp } from '../../Constant';
import { extendDistanceFiltrer, getLat, getLng } from "./utils";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import styles from "../MapKenzhosa.module.scss";


interface IMesBiensProps {
  buttonTitle:string;
  handlerMesBiens({}):any;
}

function MesBiens (props:IMesBiensProps){
  let [alert, setAlert] = React.useState(false);
  
  React.useEffect(() => {
  },[]); 
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Attention',
    subText: 'Veuillez Préciser le Protefeuilles Souhaité',
  };
  const modelProps = {
    isBlocking: false,
    styles: { main: { maxWidth: 650 } },
  };
  async function _onSubmit(){
    const all_actifs: any[] = await sp.web.lists.getByTitle("Listing").items.getAll();
    var query = function(element) {
      return element.Statut_x0020_d_x0027_activit_x00 === "Actif";
    };
    var actifs = await all_actifs.filter(query);
    console.log("All Actifs", actifs);
    props.handlerMesBiens(actifs);
  }
   
  return (
    <div>

      {alert?       
        <Dialog 
          hidden={!alert} 
          onDismiss={()=>setAlert(false)} 
          dialogContentProps={dialogContentProps}
          modalProps={modelProps}
        >
          <DialogFooter>
            <DefaultButton onClick={()=>setAlert(false)} text="Cancel" />
          </DialogFooter>
        </Dialog>
      :<></>}
        <Stack horizontal horizontalAlign="end">
          <ActionButton iconProps={{iconName: 'RedEye'}} text={props.buttonTitle} onClick={() => _onSubmit()}/>
        </Stack>
    </div>
  );
}
export default MesBiens;


