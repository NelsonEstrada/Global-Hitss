/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import {Component} from 'react';
import styles from './AdmonProveedores.module.scss';
import { PrimaryButton } from '@fluentui/react';
import 'office-ui-fabric-react/dist/css/fabric.css';
//import { spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/site-users/web";
import "@pnp/sp/sputilities";
import  "@pnp/sp/attachments";
import { IAdmonProveedores } from './IAdmonProveedores';
import { SPFx, spfi } from '@pnp/sp';
import { DialogProveedoresEditar, DialogProveedoresNew } from '../dialog/DialogProovedores';
import { Helpers } from "../utils/Helpers";

import '../../assets/css/style.css';
import '../../assets/css/dataTables.css';

//import * as jQuery from 'jquery'; 
const jQuery = require('jquery'); 
import 'DataTables.net';  

  
export default class AdmonProveedores extends Component<IAdmonProveedores,any>{
    
    public Helpers: Helpers;

    constructor(props: IAdmonProveedores | Readonly<IAdmonProveedores>){
        super(props);
        this.Helpers = new Helpers(this.props.context);
        this.state = { 
            detailListItems:[],
            request:[],
            proveedorSeleccionado:{
                solicitante:"",
                numeroSolicitante:""
            }
        }

        this.loadProveedores().then(()=> 
        {
            console.log("finaliza cargo proveedores")
        }).catch(
        e =>{ 
            console.log(e);
        });
        console.log("admon proveedores");

    }


    public ActualizarProveedor= async (id:number,title:string,nit:string,centroDeCosto:string,contratoMarco:any,posPre:string,aprobadorFacturacion:any):Promise<boolean>=>{
        const sp = spfi().using(SPFx(this.props.context));
        await sp.web.lists.getByTitle(`Proveedores`).items.getById(id).update({
            Title:title,
            // eslint-disable-next-line dot-notation
            NIT:nit,
            CentroDeCosto:centroDeCosto,
            ContratoMarcoId:contratoMarco,
            PosPre:posPre,
            AprobadorFacturacionId:aprobadorFacturacion
            }).then(async(itemTarea)=>{
                this.loadProveedores();
                return true;
            }).catch(()=>{
                alert("Error: Asegurese de no duplicar el nombre del Proveedor.");
                this.loadProveedores();
            });
        return true;
    }


    
    public CrearProveedor= async (title:string,nit:string,centroDeCosto:string,contratoMarco:any,posPre:string,aprobadorFacturacion:any):Promise<boolean>=>{
        const sp = spfi().using(SPFx(this.props.context));
        await sp.web.lists.getByTitle(`Proveedores`).items.add({
            Title:title,
            // eslint-disable-next-line dot-notation
            NIT:nit,
            CentroDeCosto:centroDeCosto,
            ContratoMarcoId:contratoMarco,
            PosPre:posPre,
            AprobadorFacturacionId:aprobadorFacturacion
            }).then(async(itemTarea)=>{
                this.loadProveedores();
                return true;
            }).catch(()=>{
                alert("Error: Asegurese de no duplicar el nombre del Proveedor.");
                this.loadProveedores();
            });
        return true;
    }

   /* private getData=async (list=''):Promise<any>=>{
        const sp = spfi().using(SPFx(this.props.context));
        const items = await sp.web.lists.getByTitle(list).items.select("*","AprobadorFacturacion/Title", "ContratoMarco/NumeroContrato").expand('AprobadorFacturacion', 'ContratoMarco').orderBy("Id", false)();
        return items;
    }*/
    
    private loadProveedores=async()=>{
        jQuery("#tablaFacturación").DataTable().destroy();
        // eslint-disable-next-line prefer-const

        this.Helpers.getItemsList(
            'Proveedores',
            "*,ContratoMarco/NumeroContrato,AprobadorFacturacion/Title",
            '',
            'ContratoMarco,AprobadorFacturacion',
            {property : "ID", asc:false}
        ).then((res:any) => {

        var data = new Array();

        res.forEach((i:any, pos:any) => {
            let item = {
                key:i.Id,
                Title:i.Title?i.Title:"Sin Nombre Proveedor",
                // eslint-disable-next-line dot-notation
                NIT:i.NIT?i.NIT:"Sin NIT",
                CentroDeCosto:i.CentroDeCosto?i.CentroDeCosto:"Sin Centro De Costo",
                ContratoMarco:i.ContratoMarcoId != null?i.ContratoMarco["NumeroContrato"]:"Sin Contrato Marco",
                PosPre:i.PosPre?i.PosPre:"Sin PosPre",
                AprobadorFacturacion:i.AprobadorFacturacion?i.AprobadorFacturacion.Title:"Sin Aprobador Facturacion",
                Accion: <DialogProveedoresEditar 
                        id={i.Id} 
                        show={false} 
                        title={i.Title?i.Title:"Sin Nombre Proveedor"}
                        nit={i.NIT?i.NIT:"Sin NIT"}
                        centroDeCosto={i.CentroDeCosto?i.CentroDeCosto:"Sin Centro de Costo"}
                        contratoMarco={i.ContratoMarcoId!=null?i.ContratoMarcoId:"Sin Contrato Marco"}
                        posPre={i.PosPre?i.PosPre:"Sin Pos Pre"}
                        aprobadorFacturacion={i.AprobadorFacturacion?i.AprobadorFacturacion.Title:"Sin Aprobador Facturacion"}
                        context={this.props.context}
                        ActualizarProveedor={this.ActualizarProveedor}
                        />
            }

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

        let item:IProveedores[]  = [];
        await this.getData("Proveedores").then(items =>
            {
                items.map((i: {
                    CentroDeCosto: any;
                    ContratoMarco: any;
                    ContratoMarcoId: any;
                    PosPre: any;
                    NIT: any; 
                    Id: number; 
                    Title: string; 
                    AprobadorFacturacion: { Title: string; }; 
                    })=>{
                    item.push({
                            key:i.Id,
                            Title:i.Title?i.Title:"Sin Nombre Proveedor",
                            // eslint-disable-next-line dot-notation
                            NIT:i.NIT?i.NIT:"Sin NIT",
                            CentroDeCosto:i.CentroDeCosto?i.CentroDeCosto:"Sin Centro De Costo",
                            ContratoMarco:i.ContratoMarcoId != null?i.ContratoMarco["NumeroContrato"]:"Sin Contrato Marco",
                            PosPre:i.PosPre?i.PosPre:"Sin PosPre",
                            AprobadorFacturacion:i.AprobadorFacturacion["Title"]?i.AprobadorFacturacion["Title"]:"Sin Aprobador Facturacion",
                            Accion: <DialogProveedoresEditar 
                                    id={i.Id} 
                                    show={false} 
                                    title={i.Title?i.Title:"Sin Nombre Proveedor"}
                                    nit={i.NIT?i.NIT:"Sin NIT"}
                                    centroDeCosto={i.CentroDeCosto?i.CentroDeCosto:"Sin Centro de Costo"}
                                    contratoMarco={i.ContratoMarcoId!=null?i.ContratoMarcoId:"Sin Contrato Marco"}
                                    posPre={i.PosPre?i.PosPre:"Sin Pos Pre"}
                                    aprobadorFacturacion={i.AprobadorFacturacion?i.AprobadorFacturacion["Title"]:"Sin Aprobador Facturacion"}
                                    context={this.props.context}
                                    ActualizarProveedor={this.ActualizarProveedor}
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
            <div className="ms-Grid-col ms-md12 marginBottom10">
                <div className="ms-Grid-col ms-u-sm1 margin-top">
                    <DialogProveedoresNew 
                    id={0} 
                    show={false} 
                    context={this.props.context}
                    CrearProveedor={this.CrearProveedor}                    
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
            <div className="ms-Grid-col ms-md12">
            <div className="table-responsive">
              <table id="tablaFacturación" className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>NIT</th>
                      <th>Contrato Marco</th>
                      <th>Centro de Costo</th>
                      <th>PosPre</th>
                      <th>Aprobador Facturación</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.detailListItems && this.state.detailListItems.length > 0 ?
                      this.state.detailListItems.map((val:any, index:number)=>(
                        <tr>
                          <td>{val.Title}</td>
                          <td>{val.NIT}</td>
                          <td>{val.ContratoMarco}</td>
                          <td>{val.CentroDeCosto}</td>
                          <td>{val.PosPre}</td>
                          <td>{val.AprobadorFacturacion}</td>
                          <td>{val.Accion}</td>
                        </tr>
                      ))
                    
                    :null}
                  </tbody>
              </table>
            </div>

            </div>
            </>
            
        );
    }
   
}
