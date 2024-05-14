import * as React from 'react';
import {Link} from 'react-router-dom';
import { Helpers } from "../Utils/Helpers";

//const jQuery = require('jquery'); 

import 'DataTables.net';  

interface IHeaderProps{
  context:any;
}
  
export default class CrearSolicitud extends React.Component<IHeaderProps, any> {

  public Helpers: Helpers;
  public file:any = []; 

  constructor(props:any) {
      super(props); 

      this.state = {
        BannerHeader:''
      }

      this.Helpers = new Helpers(this.props.context);
    
  }

  componentWillMount(){

    this.Helpers.getItemsList(
        'ParametrosGenerales',
        '*',
        '',
        '',
        ).then((res:any) => {

            var BH = res.filter(((x:any) => x.Title == 'BannerHeader'))
            if(BH.length > 0) {

                var descripcion = BH[0].ValorDescripcion.replaceAll('&lt;','<')
                                                        .replaceAll('&gt;', '>')
                                                        .replaceAll('&quot;', '"');

                this.setState({
                  BannerHeader:descripcion
                })
            }

        });

  }

  public render(): React.ReactElement<IHeaderProps> {

        return (
            <section>

              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">

                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/CrearSolicitud">Crear solicitud de numeración</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/VerSolicitud">Listado control de solicitudes</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
              <div dangerouslySetInnerHTML={{__html: this.state.BannerHeader}}></div>
            </section>
        )
    }
  }
  