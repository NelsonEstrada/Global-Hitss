/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import {Component} from 'react';
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
import { IAdmonAsignacionProveedores } from './IAdmonAsignacionProveedores';
import { SPFx, spfi } from '@pnp/sp';
import styles from './AdmonAsignacionProveedores.module.scss';
import { DialogAsignacionProveedoresEditar } from '../dialog/DialogAsignacionProveedores';
import '../../assets/css/style.css';
import '../../assets/css/dataTables.css';
import { Helpers } from "../utils/Helpers";

//import * as jQuery from 'jquery'; 
const jQuery = require('jquery'); 
import 'DataTables.net';  
  
export default class AdmonPerfiles extends Component<IAdmonAsignacionProveedores,any>{
    
    public Helpers: Helpers;

    constructor(props: IAdmonAsignacionProveedores | Readonly<IAdmonAsignacionProveedores>){
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

        this.loadPerfiles().then(()=> 
        {
            console.log("finaliza cargo perfiles")
        }).catch(
        e =>{ 
            console.log(e);
        });
        console.log("admon perfiles");

    }


    public ActualizarProveedorAsignado= async (id:number,title:string,proveedor:any,usuario:any):Promise<boolean>=>{
        const sp = spfi().using(SPFx(this.props.context));
        let proveedorId = proveedor;
        await sp.web.lists.getByTitle(`Usuarios`).items.getById(id).update({
            Title:title,
            ProveedorId:proveedorId
            }).then(async()=>{
                this.loadPerfiles();
                return true;
            }).catch(()=>{
                return false;
            });
        return true;
    }

   /* private getData=async (list=''):Promise<any>=>{
        const sp = spfi().using(SPFx(this.props.context));
        const items = await sp.web.lists.getByTitle(list).items.filter(`Rol/Title eq 'Rol Proveedor Logistica Inversa'`).select("*","Usuario/Title","Proveedor/Title","Rol/Title").expand('Usuario, Proveedor,Rol').orderBy("Id", false)();
        return items;
    }*/
    
    private loadPerfiles=async()=>{
        jQuery("#tablaFacturación").DataTable().destroy();
        
        // eslint-disable-next-line prefer-const
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
                Proveedor:i.Proveedor?i.Proveedor.Title:"Sin Prooveedor Asignado",
                Usuario:i.Usuario?i.Usuario.Title:"Sin Usuario",
                Accion: <DialogAsignacionProveedoresEditar 
                        id={i.Id} 
                        show={false} 
                        title={i.Title?i.Title:"Perfil Asignado"}
                        proveedor={i.ProveedorId != null ?i.ProveedorId:"Sin Prooveedor Asignado"}
                        usuario={i.Usuario?i.Usuario["Title"]:"Sin Usuario"}
                        usuarioId={i.Usuario?i.UsuarioId:"Sin ID"}
                        context={this.props.context}
                        ActualizarProveedorAsignado={this.ActualizarProveedorAsignado}
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

/*
        let item:IAsignacionProveedores[] = [];
        await this.getData("Usuarios").then(items =>
            {
                items.map((i: {
                    Proveedor: any;
                    ProveedorId: any;
                    UsuarioId: any;
                    Usuario: { Title: string; };
                    Id: number; 
                    Title: string;
                    })=>{
                    item.push({
                            key:i.Id,
                            Title:i.Title?i.Title:"Sin Nombre",
                            // eslint-disable-next-line dot-notation
                            Proveedor:i.Proveedor?i.Proveedor["Title"]:"Sin Prooveedor Asignado",
                            Usuario:i.Usuario["Title"]?i.Usuario["Title"]:"Sin Usuario",
                            Accion: <DialogAsignacionProveedoresEditar 
                                    id={i.Id} 
                                    show={false} 
                                    title={i.Title?i.Title:"Perfil Asignado"}
                                    proveedor={i.ProveedorId != null ?i.ProveedorId:"Sin Prooveedor Asignado"}
                                    usuario={i.Usuario?i.Usuario["Title"]:"Sin Usuario"}
                                    usuarioId={i.Usuario?i.UsuarioId:"Sin ID"}
                                    context={this.props.context}
                                    ActualizarProveedorAsignado={this.ActualizarProveedorAsignado}
                                    />
                        });
                });
            }
        );
       
        this.setState({detailListItems:item});
        this.IniciaTable();
        return "termino";*/
    }

    private IniciaTable(){
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


    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    render(){
        return (
            <>
            <div>
                <h2>Asignación de Proveedores</h2>
            </div>
            <div className="ms-Grid-col ms-md12 marginBottom10">
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
                      <th>Usuario</th>
                      <th>Proveedor</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.detailListItems && this.state.detailListItems.length > 0 ?
                      this.state.detailListItems.map((val:any, index:number)=>(
                        <tr>
                          <td>{val.Usuario}</td>
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
