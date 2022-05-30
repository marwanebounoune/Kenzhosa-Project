import * as React from 'react';
import styles from './MapKenzhosa.module.scss';
import { IMapKenzhosaProps } from './IMapKenzhosaProps';
import { escape } from '@microsoft/sp-lodash-subset';
import MapContainer from './MapContainer';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export default class MapKenzhosa extends React.Component<IMapKenzhosaProps, {}> {
  private old_desc = null;
  constructor(props) {
    super(props);
    this.old_desc=props.description;
    this.state = {old_key: props.description};
  }
  public render(): React.ReactElement<IMapKenzhosaProps> {
   

    return (
      <div className={ styles.mapKenzhosa }>
      <div className={ styles.container }>
        <div className={ styles.row }>
        <MapContainer GoogleKey={this.props.description} context={this.props.ctx} />
        </div>
      </div>
    </div>
    );
  }
}
