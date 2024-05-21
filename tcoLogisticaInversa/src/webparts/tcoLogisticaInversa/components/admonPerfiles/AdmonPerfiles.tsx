/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import {Component} from 'react';
import styles from './AdmonPerfiles.module.scss';
import { PrimaryButton } from '@fluentui/react';
import 'office-ui-fabric-react/dist/css/fabric.css';
//import { spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/site-users";
import "@pnp/sp/sputilities";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-users";
import  "@pnp/sp/attachments";
import { IAdmonPerfiles } from './IAdmonPerfiles';
import { SPFx, spfi } from '@pnp/sp';
import { DialogPerfilesEditar, DialogPerfilesNew } from '../dialog/DialogPerfiles';

import { Helpers } from "../utils/Helpers";

import '../../assets/css/style.css';
import '../../assets/css/dataTables.css';

//import * as jQuery from 'jquery'; 
const jQuery = require('jquery');  
import 'DataTables.net';  

export default class AdmonPerfiles extends Component<IAdmonPerfiles,any>{
    
    public Helpers: Helpers;

    constructor(props: IAdmonPerfiles | Readonly<IAdmonPerfiles>){
        super(props);

        this.Helpers = new Helpers(this.props.context);

        this.state = { 
            detailListItems:[],
            request:[],
            perfilesSeleccionado:{
                solicitante:"",
                numeroSolicitante:""
            }
        }
       
        this.loadPerfiles();
    }


    public ActualizarPerfil= async (id:number,title:string,rol:any,usuario:any, eleccion:string,Email:string):Promise<boolean>=>{
        const sp = spfi().using(SPFx(this.props.context));
        let rolId = rol;
        await sp.web.lists.getByTitle(`Usuarios`).items.getById(id).update({
            Title:title,
            RolId:rolId,
            Email:Email,
            Eleccion:eleccion
            }).then(async()=>{

                this.loadPerfiles();

                const groupId = await sp.web.siteGroups.getByName(rol).select("Id")();
                const userId = await sp.web.siteUsers.getById(usuario)();

                sp.web.siteGroups.getById(groupId.Id).users.add(userId.LoginName)
                .then(() => {
                    console.log("User with ID added to the group successfully.");
                })
                .catch((error) => {
                    console.log("Error adding user with ID to the group:", error);
                });
                
                return true;
            }).catch((error)=>{
                console.log(error)
                return false;
            });
        return true;
    }

    
    public CrearPerfil= async (title:string,rol:any,usuario:any,eleccion:string,Email:string):Promise<boolean>=>{
        console.log(rol);
        const sp = spfi().using(SPFx(this.props.context));
        let rolId = rol;

        await sp.web.lists.getByTitle(`Usuarios`).items.add({
            Title:title,
            RolId:rolId,
            UsuarioId:usuario,
            Eleccion:eleccion,
            Email:Email
            }).then(async()=>{
                
                this.loadPerfiles();

                const groupId = await sp.web.siteGroups.getByName(rol).select("Id")();
                const userId = await sp.web.siteUsers.getById(usuario)();

                sp.web.siteGroups.getById(groupId.Id).users.add(userId.LoginName)
                .then(() => {
                    console.log("User with ID added to the group successfully.");
                })
                .catch((error) => {
                    console.log("Error adding user with ID to the group:", error);
                });
                return true;
            }).catch((e)=>{
                console.log(e)
                return false;
            });
        return true;
    }

    private loadPerfiles=async()=>{

        // eslint-disable-next-line prefer-const
        jQuery("#tablaFacturación").DataTable().destroy();

        this.Helpers.getItemsList(
            'Usuarios',
            "*,Usuario/Title,Rol/Title,Proveedor/Title",
            '',
            'Usuario,Rol,Proveedor',
            {property : "ID", asc:false}
        ).then((res:any) => {

        var data = new Array();

            res.forEach((i:any, pos:any) => {

                let item = {
                    key:i.Id,
                    Title:i.Title?i.Title:"Sin Nombre",
                    Rol:i.Rol?i.Rol.Title:"Sin Rol",
                    Tipo:i.Eleccion?i.Eleccion:"",
                    Proveedor:i.Proveedor?i.Proveedor.Title:"Sin Proveedor",
                    Usuario:i.Usuario?i.Usuario.Title:"Sin Usuario",
                    Accion: <DialogPerfilesEditar 
                            id={i.Id} 
                            show={false} 
                            title={i.Title?i.Title:"Perfil Asignado"}
                            rol={i.RolId != null ?i.RolId:"Sin Rol"}
                            usuario={i.Usuario?i.Usuario.Title:"Sin Usuario"}
                            eleccion={i.Eleccion}
                            email={i.Email}
                            usuarioId={i.Usuario?i.UsuarioId:"Sin ID"}
                            context={this.props.context}
                            ActualizarPerfiles={this.ActualizarPerfil}
                            />
                    };

                    data.push(item)
            });

            this.setState({
                detailListItems:[]
            },() =>{
                this.setState({
                    detailListItems:data
                },() =>{
                    this.IniciaTable();
                })
            })

        });
          
        return "termino";
    }

    public IniciaTable(){

        jQuery('#tablaFacturación').DataTable({
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Entradas",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }
        });
    }

    render(){
        return (
            <>
            <div className="ms-Grid-col ms-md12 marginBottom10">
                <div className="ms-Grid-col ms-u-sm1 margin-top">
                    <DialogPerfilesNew 
                    id={0} 
                    show={false} 
                    context={this.props.context}
                    CrearPerfiles={this.CrearPerfil}                    
                        />
                </div>
                <div className="ms-Grid-col ms-u-sm1 margin-top">
                    <PrimaryButton 
                        text="Menú principal" 
                        className={ styles.colorButton}
                        onClick={()=>this.props.regresar()}
                        />
                </div>
            </div>
            
            <div className="table-responsive">
              <table id="tablaFacturación" className="table  table-striped table-bordered">
                  <thead>
                    <tr>
                        <th></th>
                        <th>Rol</th>
                        <th>Usuario</th>
                        <th>Tipo</th>
                        <th>Proveedor</th>
                        <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.detailListItems && this.state.detailListItems.length > 0 ?
                      this.state.detailListItems.map((val:any, index:number)=>(
                        <tr>
                          <td>{val.key}</td>
                          <td>{val.Rol}</td>
                          <td>{val.Usuario}</td>
                          <td>{val.Tipo}</td>
                          <td>{val.Proveedor}</td>
                          <td>{val.Accion}</td>
                        </tr>
                      ))
                    :null}
                  </tbody>
              </table>
            </div>
            </>
            
        );
    }
   
}
