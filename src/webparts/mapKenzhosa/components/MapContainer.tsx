import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/webs";
import "@pnp/sp/items/get-all";
import * as React from 'react';
import styles from './MapKenzhosa.module.scss';
import { getAbsoluteRapportUrl, getLat, getLng, WindowPopUp  } from './utils/utils';


import GoogleMapReact from 'google-map-react';
import { ActionButton, Dialog, DialogType, Popup, SearchBox, Stack, PrimaryButton } from 'office-ui-fabric-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { sp } from '../Constant';
import { IMapKenzhosaProps } from "./IMapKenzhosaProps";
import MesBiens from "./utils/MesBien";
interface IMapContainerProps {
    GoogleKey:string;
    context:any;
  }
  export default function MapContainer(props:IMapContainerProps){
    let [updatedMarker, setUpdatedMarker]= React.useState(false);
    let [rightClickMarker, setRightClickMarker]= React.useState(false);
    let [rightClickMap, setRightClickMap]= React.useState(false);
    let [copySuccess, setCopySuccess]= React.useState('');
    let [lat, setLat]= React.useState(null);
    let [lng, setLng]= React.useState(null);
    let [maps, setMaps]= React.useState(null);
    let [map, setMap]= React.useState(null);
    let [popupInfo, setPopupInfo]= React.useState(null);
    let [typeDeBien, setTypeDeBien] = React.useState("");
    let [popOut, setPopOut] = React.useState(false);
    let [DGI, setDGI] = React.useState(null);
    let [information, setInformation] = React.useState(null);
    let [actifs, setActifs_markers]= React.useState(null);
    let [popupInfoDetail, setPopupInfoDetail]= React.useState(null);

    const modelProps = {
        isBlocking: false,
        styles: { main: { maxWidth: 650 } },
    };
    const defaultProps = {
        center: {
            lat: 33.53681110956971,
            lng: -7.529033709989725
        },
        zoom: 11,
        disableDefaultUI: false,
    };
    const handleApiLoaded = (map, maps) => {
        setMaps(maps);
        setMap(map);
        maps.event.addListener(map, "rightclick", async function(event) {
            maps.event.trigger(map, 'resize'); 
            setTimeout(()=> {
                setCopySuccess('Copied');
                setPopupInfo(null);
                setRightClickMarker(rightClickMarker => {
                    if(rightClickMarker){
                        event.preventDefault;
                        setRightClickMarker(false);
                    }
                    else{
                        setRightClickMap(true);
                        setPopupInfo(null);
                        var _lat = parseFloat(event.latLng.lat());
                        var _lng = parseFloat(event.latLng.lng());
                        setLat(_lat);
                        setLng(_lng);
                        navigator.clipboard.writeText(event.latLng.lat()+","+event.latLng.lng());
                    }
                    return rightClickMarker;
                });
            }, 200);
        });
    };
    const Marker_actif = ({ marker, lat, lng, text}) => <div className={ styles.markerActifs }
        onClick={()=> {onMarkerClick(marker);}}
        onContextMenu={()=> onMarkerRightClick(marker)}></div>;
    async function onMarkerClick(marker) {
        setPopupInfo(null);
        setRightClickMap(false);
        setPopupInfo(marker);
    }
    async function onMarkerRightClick(marker) {
        setPopupInfo(null);
        setRightClickMarker(rightClickMarker=> {return true;});
        return rightClickMarker;
    }
    async function displayActifs (item_actifs:any) {
        setPopupInfo(null);
        await setActifs_markers(item_actifs);
    }
    const Popup = ({ lat, lng}) => {
        return  <div className={styles.popupMarker}>
          <div className={styles.CloseDiv} onClick={()=> setPopupInfo(false)}>X</div>
          <div className={styles.arrowPopUp}></div>
          <span className={styles.spanInfo}>Référence: </span>{popupInfo.Title}
          <br/>
          <span className={styles.spanInfo}>Type de bien: </span>{popupInfo.Type_x0020_de_x0020_bien}
          <br/>
          <span className={styles.spanInfo}>Nombre des actifs: </span>{popupInfo.Nombre_x0020_d_x0027_actifs}
          <br/>
          <a className={styles.rightFloat} href="#" onClick={(event)=> {event.preventDefault();WindowPopUp("get info", popupInfo.Voir_x0020_plus.Url, "");}}>Voir plus...</a>
          </div>
    }
    const SearchBox = ({ map, maps, onPlacesChanged, placeholder }) => {
        let input = React.useRef(null);
        const searchBox = React.useRef(null);
        React.useEffect(() => {
          if (!searchBox.current && maps && map) {
            searchBox.current = new maps.places.SearchBox(input.current);
            maps.event.addListener(searchBox.current, 'places_changed', function() {
              var places = searchBox.current.getPlaces();
              places.forEach(place => {
                var myLatlng = new maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());
                map.setCenter(myLatlng);
                var marker = new maps.Marker({
                  position: myLatlng,
                  map:map
                });
              });
            });
          }
          return () => {
            if (maps) {
              searchBox.current = null;
              maps.event.clearInstanceListeners(searchBox);
            }
          };
        });
        let inputSearch = <div key={"inputSearch"}><input ref={input} placeholder={placeholder} className={styles.googleMapSearchBox} type="text" /></div>;
        return inputSearch;
    };
    const PopupRightOrganisme = ({ lat, lng , modaleTitle}) => {
        return <div className={styles.popupRight}>
            <div className={styles.CloseDiv} onClick={()=> setRightClickMap(false)}>X</div>
            <div className={styles.arrowPopUp}></div>
                <br/>
                <div>
                    <CopyToClipboard text={lat+","+lng} onCopy={() => {setCopySuccess('Copied!');}} className={styles.Pointer}>
                    <span>{parseFloat(lat).toFixed(5)},{parseFloat(lng).toFixed(5)}</span>
                    </CopyToClipboard>
                    <span className={styles.CopyToClipboardMsg}>&nbsp;{copySuccess}</span>
                </div>
            </div>
    }
    return (<div className={styles.googleMapReact}>
        {popOut?<Dialog hidden={!popOut} onDismiss={()=> setPopOut(false)} modalProps={modelProps} styles={{main: {selectors: {['@media (min-width: 480px)']: {width: 550, height: 555, minWidth: 450, maxWidth: '1000px'}}}}}>
            </Dialog>
        :<></>}
        <Stack horizontal>
        <div> 
          <SearchBox
                  onPlacesChanged={null}
                  map={map}
                  maps={maps}
                  placeholder={"search..."} />
        </div>
        
        <div className={styles.rightFloatBien}>
            <MesBiens handlerMesBiens={ async (items_actifs) => await displayActifs(items_actifs)} buttonTitle="Mes Biens"/>
        </div>
            <br/>
            <br/>
            
        </Stack>
        <GoogleMapReact bootstrapURLKeys={{ key: props.GoogleKey, libraries:['places'] }} defaultCenter={defaultProps.center} defaultZoom={defaultProps.zoom} yesIWantToUseGoogleMapApiInternals onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)} options={map => ({streetViewControl: true, mapTypeControl: true, mapTypeControlOptions: {style: map.MapTypeControlStyle.DEFAULT, position: map.ControlPosition.TOP_RIGHT, mapTypeIds: [map.MapTypeId.ROADMAP, map.MapTypeId.SATELLITE, map.MapTypeId.HYBRID]}})}>
            {actifs ? actifs.map(marker=>
                <Marker_actif
                    lat={getLat(marker.LatitudeLongitude)}
                    lng={getLng(marker.LatitudeLongitude)}
                    text={marker.Title}
                    marker={marker}
            />):<></>}
            {popupInfo ? <Popup lat={getLat(popupInfo.LatitudeLongitude)} lng={getLng(popupInfo.LatitudeLongitude)}/>
            :<></>}
        </GoogleMapReact>
        </div>
    );
}


