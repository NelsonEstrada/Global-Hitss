import * as React from 'react';
import { Link } from 'react-router-dom';


export interface IHeaderProps{
  Helpers:any;
  rolUsuario:string;
}

export default class Header extends React.Component<IHeaderProps, any> {
  constructor(props:any){
    super(props);
    this.state = {
      title:'Header',
    }   
  }

  public render(): React.ReactElement<IHeaderProps> {

      return (
        <section>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">

                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                      <li className="nav-item">
                          <Link to="/" id="Opc1">Home1
                          </Link>
                      </li>
                      {
                        this.props.rolUsuario === 'Administrador' ? 
                        <>
                          <li className="nav-item">
                              <Link to="/Usuarios" id="Opc2">Usuarios</Link>
                          </li>
                          <li className="nav-item">  
                              <Link to="/Clientes" id="Opc3">Clientes</Link>
                          </li>
                        </>
                        : null
                      }
                      {
                        this.props.rolUsuario === 'Editor' || this.props.rolUsuario === 'Administrador' ? 
                          <li className="nav-item">
                              <Link to="/Campañas" id="Opc4">Campañas</Link>
                          </li>
                        : null
                      }
                      {
                        this.props.rolUsuario === 'Consultor' || this.props.rolUsuario === 'Editor' || this.props.rolUsuario === 'Administrador' ? 
                        <>
                          <li className="nav-item">
                              <Link to="/CargarReportes" id="Opc5">Cargar Reportes</Link>
                          </li>
                          <li className="nav-item">
                              <Link to="/TableroBI" id="Opc6">Tablero BI</Link>
                          </li>
                        </>
                        : null
                      }
              </ul>
            </div>
          </div>
        </nav>

      </section>
    );
  }
}
