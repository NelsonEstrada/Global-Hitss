import * as React from 'react';
import styles from './TcoLogisticaInversa.module.scss';
import { ITcoLogisticaInversaProps } from './ITcoLogisticaInversaProps';

import Header from './header/Header';
import Body from './body/Body';

export default class TcoLogisticaInversa extends React.Component<ITcoLogisticaInversaProps, any> {

  constructor(props: ITcoLogisticaInversaProps | Readonly<ITcoLogisticaInversaProps>){
    super(props);
  }

  public render(): React.ReactElement<ITcoLogisticaInversaProps> {

    return (
      <div className={ styles.spFxLogisticaInversa }>
        <div className='ms-Grid'>
          <div className='ms-Grid-row'>
            <Header title={this.props.description}/>
          </div>
          <div className='ms-Grid-row'>
          <Body
            context={this.props.context}
            urlSitioMateriales={this.props.urlSitioMateriales}
            ListaMateriales={this.props.ListaMateriales}
           />
          </div>
        </div>
        <hr/>
        <div>
            <span className="text-muted fw-bold me-1">Version @ 1.0.2.7</span>
        </div>
      </div>
    );
  }
}
