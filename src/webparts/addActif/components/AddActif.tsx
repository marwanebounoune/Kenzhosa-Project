import * as React from 'react';
import { sp } from '../Constant' ;
import styles from './AddActif.module.scss';
import { IAddActifProps } from './IAddActifProps';
import {Checkbox, DefaultButton, DialogFooter, Dialog, DialogType, Dropdown, IDropdownOption, IDropdownStyles, Label, Panel, PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';
import{createFolder, CreatePage} from "../utils"
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
// import { Dialog } from '@microsoft/sp-dialog';



function Add (props:IAddActifProps){
  let [isOpen, setIsOpen] = React.useState(false);
  let [submitClick, setSubmitClick] = React.useState(false);
  let [form, setForm] = React.useState({Denomination :"", LatLng:"", Ville:0, type_de_bien:"",Nombre_dactifs:0, type_de_commercialisation:[],Valorisation_location:0,Valorisation_Vente:0, Statut_dactivité:"",Commercialisation_en_valeur:0,Commercialisation_en_nombre:0,Date_Mandat:""});
  let [alert, setAlert] = React.useState(false);
  let [alertChampsVide, setAlertChampsVide] = React.useState(false);
  let [villes_options, setVilles_options] = React.useState([]);
  React.useEffect(() => {
    get_ville();
  },[]);
  const onChange_type_de_bien = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, type_de_bien: item.key.toString()});
  };
  const onChange_type_de_commercialisation = (event: React.FormEvent<HTMLDivElement>, isChecked: Boolean): void => {
    let pos = form.type_de_commercialisation.indexOf(event.currentTarget.title);
    if(pos === -1 && isChecked){
      form.type_de_commercialisation.push(event.currentTarget.title);
    }
    if(pos > -1 && !isChecked){
      let removedItem = form.type_de_commercialisation.splice(pos, 1);
    }  
  };
  const onChange_Statut_dactivité = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, Statut_dactivité:  item.key.toString()});
  };
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Félicitation',
    subText: 'L\'actif a été crée avec succès.',
  };
  const dialogCahmpsVide = {
    type: DialogType.normal,
    title: 'Attention',
    subText: "Veuillez remplir tous les champs!",
  };
  const modelProps = {
    isBlocking: false,
    styles: { main: { maxWidth: 650 } },
  };
  const options_villes: IDropdownOption[] = villes_options;
  const options_type_de_bien: IDropdownOption[] = [
    { key: 'Appartement', text: 'Appartement'},
    { key: 'Local commercial', text: 'Local commercial'},
    { key: 'Bureau', text: 'Bureau'},
    { key: 'Lotissement', text: 'Lotissement'},
    { key: 'Immeuble mixte', text: 'Immeuble mixte' },
    { key: 'Immeuble Résidentiel', text: 'Immeuble Résidentiel' },
    { key: 'Immeuble Professionnel', text: 'Immeuble Professionnel' },
    { key: 'Terrain nu', text: 'Terrain nu' },
    { key: 'Villa', text: 'Villa' },
    { key: 'Industriel', text: 'Industriel' },
  ];
  const options_Statut_dactivité: IDropdownOption[] = [
    { key: 'Actif', text: 'Actif'},
    { key: 'Non actif', text: 'Non actif'},
  ];
  
  const onChange_ville = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, Ville: parseInt(item.key.toString())});
  };
  async function get_ville(){
    const villes = await sp.web.lists.getByTitle("Villes").items.getAll();
    var villes_array_options=[];
      villes.map(el => {
        var ville_options = { key: el.Id, text: el.Title}
        villes_array_options.push(ville_options);
      });
    setVilles_options(villes_array_options);
  }
  async function _onSubmit(){
    setIsOpen(false);
    setSubmitClick(true);
    /* Ajouter Nouveau Actif */
    const item2 = await sp.web.lists.getByTitle("Listing").items.getAll();
    if(
      form.Ville === 0 || form.type_de_bien === "" || form.Nombre_dactifs === 0 || form.type_de_commercialisation === [] 
      || form.Valorisation_location === 0 || form.Valorisation_Vente === 0 || form.Statut_dactivité === "" 
      || form.Commercialisation_en_valeur === 0 || form.Commercialisation_en_nombre === 0 || form.Date_Mandat === ""
    ){
      setAlertChampsVide(true);
    }
    else{
      await sp.web.lists.getByTitle("Listing").items.add({
        Title: form.Denomination,
        LatitudeLongitude: form.LatLng,
        Ville_Id: form.Ville,
        Type_x0020_de_x0020_bien: form.type_de_bien,
        Nombre_x0020_d_x0027_actifs: form.Nombre_dactifs,
        Type_x0020_de_x0020_commercialis: form.type_de_commercialisation,
        Valorisation_x0020_location: form.Valorisation_location,
        Valorisation_x0020_Vente: form.Valorisation_Vente,
        Statut_x0020_d_x0027_activit_x00: form.Statut_dactivité,
        Commercialisation_x0020_en_x0020: form.Commercialisation_en_valeur,
        commerciaisation_x0020_en_x0020_: form.Commercialisation_en_nombre,
        Date_x0020_Mandat: form.Date_Mandat
      })
      .then(async item=> {
        setForm({
          ...form, Denomination :"", LatLng:"", Ville:0, type_de_bien:"",Nombre_dactifs:0, type_de_commercialisation:[],Valorisation_location:0,Valorisation_Vente:0, Statut_dactivité:"",Commercialisation_en_valeur:0,Commercialisation_en_nombre:0,Date_Mandat:""
        });
        // console.log(item)
        await createFolder("Photos%20Gnrales", form.Denomination, item.data)
        setAlert(true);
      })
    }
  }
  return(
    <div>
      {alertChampsVide?       
        <Dialog hidden={!alertChampsVide}  onDismiss={()=>setAlertChampsVide(false)}  dialogContentProps={dialogCahmpsVide} modalProps={modelProps} >
          <DialogFooter>
            <DefaultButton onClick={()=>setAlertChampsVide(false)} text="Cancel" />
          </DialogFooter>
        </Dialog>
      :<></>}
      <Stack horizontal horizontalAlign="center"> 
        <a href="#" className={ styles.button } onClick={() => setIsOpen(true)}>
          <span className={ styles.label }>Ajouter</span>
        </a>
      </Stack>
      
      <Panel isOpen={isOpen} onDismiss={()=> setIsOpen(false)} headerText="Information d'Actif" closeButtonAriaLabel="Close">
        <Stack tokens={{childrenGap:10}}>
        <TextField label="Denomination" placeholder="Entrer la Denomination de l'actif" onChange={(e) => setForm({...form, Denomination:(e.target as HTMLInputElement).value}) }/>
        <TextField label="Latitude Longitude" placeholder="Entrer la Latitude et Longitude" onChange={(e) => setForm({...form, LatLng:(e.target as HTMLInputElement).value}) }/>
        <Dropdown  placeholder="Selectionner la ville" label="Villes" options={options_villes}  defaultSelectedKey={form.Ville} onChange={onChange_ville} />
        <Dropdown  placeholder="" label="Type de bien" options={options_type_de_bien}  defaultSelectedKey={form.type_de_bien} onChange={onChange_type_de_bien} />
        <TextField label="Nombre d'actifs" placeholder="" onChange={(e) => setForm({...form, Nombre_dactifs:parseFloat((e.target as HTMLInputElement).value)}) }/>
        <Stack>
          <Label>Type de commercialisation</Label>
          <Stack horizontal horizontalAlign="start">
            <Checkbox  value={0} title="Vente" label="Vente" onChange={onChange_type_de_commercialisation} />
            <Checkbox  value={1} title="Location" label="Location" onChange={onChange_type_de_commercialisation} />
          </Stack>
        </Stack>
        <TextField label="Valorisation location" placeholder="" onChange={(e) => setForm({...form, Valorisation_location:parseFloat((e.target as HTMLInputElement).value)}) }/>
        <TextField label="Valorisation vente" placeholder="" onChange={(e) => setForm({...form, Valorisation_Vente:parseFloat((e.target as HTMLInputElement).value)}) }/>
        <Dropdown  placeholder="" label="Statut d'activité" options={options_Statut_dactivité} defaultSelectedKey={form.Statut_dactivité} onChange={onChange_Statut_dactivité} />
        <TextField label="Commercialisation en valeur %" placeholder="" onChange={(e) => setForm({...form, Commercialisation_en_valeur:parseFloat((e.target as HTMLInputElement).value)}) }/>
        <TextField label="Commercialisation en nombre %" placeholder="" onChange={(e) => setForm({...form, Commercialisation_en_nombre:parseFloat((e.target as HTMLInputElement).value)}) }/>
        <TextField label="Date Mandat" type="date" placeholder="" onChange={(e) => setForm({...form, Date_Mandat:(e.target as HTMLInputElement).value}) }/>


        <Stack horizontal horizontalAlign="end" tokens={{childrenGap:30}}>
                <PrimaryButton text="Ajouter" onClick={async() => await _onSubmit()}></PrimaryButton>
                <DefaultButton text="Cancel" onClick={() => setIsOpen(false)}></DefaultButton>
              </Stack>
        </Stack>

      </Panel>
    </div>
  )
    
}
export default Add;


