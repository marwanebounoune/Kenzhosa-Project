import * as React from 'react';
import styles from './AddActif.module.scss';
import { IAddActifProps } from './IAddActifProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Add from './AddActif';


export default class AddActifKenzhosa extends React.Component<IAddActifProps, {}> {
  public render(): React.ReactElement<IAddActifProps> {
    return (
          <div className={ styles.addActif }>
          <Add buttonTitle={'Ajouter'} description={''} ></Add>
          </div>
    );
  }
}
