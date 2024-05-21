import * as React from 'react';

import type { IReportesInnovacionProps } from './IReportesInnovacionProps';
import {HashRouter,Switch,Route} from 'react-router-dom'
import Header from './Header/Header';
import Home from './Home/Home';

import { Helpers } from "./Helpers/Helpers";

import 'bootstrap/dist/css/bootstrap.css';
import '../assets/css/dataTables.css';
import '../assets/css/style.css';

export default class ReportesInnovacion extends React.Component<IReportesInnovacionProps, any> {

  public Helpers: Helpers;

  constructor(props:any){
    super(props);

    this.state = {
      title:'ReportesInnovacion',
      Usuarios:[],
      rolUsuario:'',
      idRolUsuario:0,
      nombreUsuario:''
    }

    this.Helpers = new Helpers(this.props.context);
  }

  componentDidMount(): void { //invocar
    
    this.Helpers.getItemsList(
      "RCILISTUsuarios",
      "ID,Title,Usuario/Id,Usuario/Title,Usuario/EMail,RolUsuario/Id,RolUsuario/Title,Activo",
      "",//"Activo eq 'SI'"
      "Usuario,RolUsuario",
      ).then((result:any) => {

          
        this.Helpers.getByTitleUser(this.props.context.pageContext.user.displayName)
        .then((user:any) => {

          if(user.length > 0) {

            var rolUsuario = result.filter((x:any) => x.Usuario.Id == user[0].Id)
            if(rolUsuario.length > 0) {

              var usuarioActivo = rolUsuario.filter((x:any) => x.Activo == "SI")
              if(usuarioActivo.length === 1){

                this.setState({
                  nombreUsuario:rolUsuario[0].Usuario.Title.toUpperCase(),
                  rolUsuario:rolUsuario[0].RolUsuario.Title,
                  activoUsuario:"SI"
                })
              }
              else if(usuarioActivo.length > 0){

                this.setState({
                  nombreUsuario:"*" + rolUsuario[0].Usuario.Title.toUpperCase() + "*",
                  rolUsuario:rolUsuario[0].RolUsuario.Title + " (Duplicado)",
                  activoUsuario:"SI"
                })
              }
              else{

                this.setState({
                  nombreUsuario:"*" + rolUsuario[0].Usuario.Title.toUpperCase() + "*",
                  rolUsuario:rolUsuario[0].RolUsuario.Title + " (Inactivo)",
                  activoUsuario:"NO"
                })
              }
            }
            else {
              this.setState({
                  nombreUsuario:"*" + this.props.context.pageContext.user.displayName,
                  rolUsuario:"Sin Usuario",
                  activoUsuario:"NO"
              })
            }
          }   
        })

        this.setState({
            Usuarios:result
        })
    });

  }


  public render(): React.ReactElement<IReportesInnovacionProps> {

    return (
      <div className="" id="contenido">
      <div className='head'>
        <div className="headRow">
          <div className="headColumn1">
            REPORTES CAMPAÑAS DE INNOVACIÓN
          </div>
          <div className="headColumn2">
            {this.state.nombreUsuario} <br/>{this.state.rolUsuario}
          </div>
        </div>
        <span>
        </span>
      </div>
      {<div className="">
        <HashRouter basename='/'>
          <Header Helpers={this.Helpers} rolUsuario={this.state.rolUsuario}></Header>
          <div>
            <div>
              <Switch>
                <Route exact path="/" component={()=><Home Helpers={this.Helpers}  datosUsuario={this.state} ></Home>}></Route>
                {/*<Route exact path="/Usuarios" component={()=><GestionUsuarios context={this.props.context} datosUsuarios={this.state.Usuarios} ></GestionUsuarios>}></Route>
                <Route exact path="/CrearUsuario" component={()=><CrearUsuario cUsuariopnp={this.RIpnp} ></CrearUsuario>}></Route>
                <Route exact path="/Clientes" component={()=><GestionClientes context={this.props.context} gClientepnp={this.props.context}></GestionClientes>}></Route>
                <Route exact path="/Campañas" component={()=><GestionCampañas gCampañapnp={this.props.context}></GestionCampañas>}></Route>
                <Route exact path="/CargarReportes" component={()=><GestionClientes context={this.props.context} gClientepnp={this.props.context}></GestionClientes>}></Route>
                <Route exact path="/TableroBI" component={()=><ReporteBI bipnp={this.props.context}></ReporteBI>}></Route>*/}
              </Switch>
            </div>
          </div>
        </HashRouter>
      </div>}
    </div>
    );
  }
}
