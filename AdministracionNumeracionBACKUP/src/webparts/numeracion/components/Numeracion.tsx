import * as React from 'react';
import { INumeracionProps } from './INumeracionProps';
import {Route, HashRouter, Switch} from 'react-router-dom';

import Header  from './Header/Header'
import Home  from './Home/Home'
import CrearSolicitud  from './CrearSolicitud/CrearSolicitud'
import VerSolicitud from './VerSolicitudes/VerSolicitudes'


import 'bootstrap/dist/css/bootstrap.css';
import '../assets/css/dataTables.css';
import '../assets/css/style.css';

const jQuery = require('jquery'); 

import 'DataTables.net';  

export default class Numeracion extends React.Component<INumeracionProps, {}> {

  componentWillMount(){

    jQuery('#name')

  }

  public render(): React.ReactElement<INumeracionProps> {

    return (
      <section>

        <HashRouter basename="/">

          <Header context={this.props.context}></Header>

          <Switch>
              <Route exact path='/'>
                  <Home context={this.props.context}></Home>
              </Route>

              <Route exact path='/CrearSolicitud'>
                  <CrearSolicitud context={this.props.context}></CrearSolicitud>
              </Route>

              <Route exact path='/VerSolicitud/:idSolicitud?'>
                  <VerSolicitud context={this.props.context}></VerSolicitud>
              </Route>

          </Switch>

        </HashRouter>

        <hr/>
        <div className="text-muted">
            <span >Version @ 1.0.0.1</span>
        </div>

      </section>
    );
  }
}
