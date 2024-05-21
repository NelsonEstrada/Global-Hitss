/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import {Component} from 'react';
import styles from './AdmonTarifas.module.scss';
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
import { IAdmonTarifas,  } from './IAdmonTarifas';
import { SPFx, spfi } from '@pnp/sp';
import { DialogEditarTarifa, DialogEliminarTarifa, DialogNuevoTarifa } from '../dialog/DialogTarifas';

import '../../assets/css/style.css';
import '../../assets/css/dataTables.css';

//import * as jQuery from 'jquery'; 
const jQuery = require('jquery');  
import 'DataTables.net';  

export default class AdmonTarifas extends Component<IAdmonTarifas,any>{
    

    constructor(props: IAdmonTarifas | Readonly<IAdmonTarifas>){
        super(props);

        this.state = { 
            detailListItems:[],
            request:[],
            proveedorSeleccionado:{
                solicitante:"",
                numeroSolicitante:""
            }
        }
        
        this.loadData().then(()=> 
        {
            console.log("finaliza cargo Tarifas")
        }).catch(
        e =>{ 
            console.log(e);
        });
        console.log("admon Tarifas");
    }


    public ActualizarTarifa= async (id:number,title:string,CodigoTarifa:string,Proveedor:string,Descripcion:string,Labor:string,ValorUnitario:any):Promise<boolean>=>{
        const sp = spfi().using(SPFx(this.props.context));
        let proveedorId = Proveedor;
        await sp.web.lists.getByTitle(`Tarifas`).items.getById(id).update({
            Title:title,
            // eslint-disable-next-line dot-notation
            CodigoTarifa:CodigoTarifa?parseInt(CodigoTarifa.replace(/_/g,'')):"Sin CodigoTarifa",
            ProveedorId:proveedorId,
            Descripcion:Descripcion?Descripcion:"Sin Descripcion",
            Labor:Labor?Labor:"Sin Labor",
            ValorUnitario:ValorUnitario?parseInt(ValorUnitario.replace(/_/g,'')):"Sin ValorUnitario",
            }).then(async(itemTarea)=>{
                this.loadData();
                return true;
            }).catch(()=>{
                alert("Ha ocurrido un error, verifique que no existen códigos repetidos.");
            });
        return true;
    }


    
    public CrearTarifa= async (title:string,CodigoTarifa:string,Proveedor:string,Descripcion:string,Labor:string,ValorUnitario:any):Promise<boolean>=>{
        const sp = spfi().using(SPFx(this.props.context));
        let proveedorId = Proveedor;
        await sp.web.lists.getByTitle(`Tarifas`).items.add({
            Title:"Nueva Tarifa",
            // eslint-disable-next-line dot-notation
            CodigoTarifa:CodigoTarifa?parseInt(CodigoTarifa.replace(/_/g,'')):"Sin CodigoTarifa",
            ProveedorId:proveedorId,
            Descripcion:Descripcion?Descripcion:"Sin Descripcion",
            Labor:Labor?Labor:"Sin Labor",
            ValorUnitario:ValorUnitario?parseInt(ValorUnitario.replace(/_/g,'')):"Sin ValorUnitario",
            }).then(async(itemTarea)=>{
                this.loadData();
                return true;
            }).catch(()=>{
                alert("Ha ocurrido un error, verifique que no existen códigos repetidos.");
                return false;
            });
        return true;
    }



    public EliminarTarifa= async (id:number):Promise<boolean>=>{
        const sp = spfi().using(SPFx(this.props.context));
        await sp.web.lists.getByTitle(`Tarifas`).items.getById(id).delete().then(async(itemTarea)=>{
                this.loadData();
                return true;
            }).catch(()=>{
                return false;
            });
        return true;
    }

    private getData=async (list=''):Promise<any>=>{
        const sp = spfi().using(SPFx(this.props.context));
        const items = await sp.web.lists.getByTitle(list).items.select("*","Proveedor/Title").expand('Proveedor').orderBy("Id", false)();
        return items;
    }

    private formatCurrency=(number: number): string=> {
        return number.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits:0
        });
      }
    
    private loadData=async()=>{
        jQuery("#tablaFacturación").DataTable().destroy();
        // eslint-disable-next-line prefer-const
        let item:IAdmonTarifas[]  = [];
        await this.getData("Tarifas").then(items =>
            {
                items.map((i: {
                    CodigoTarifa: any;
                    Descripcion: any;
                    Labor: any;
                    ValorUnitario: any;
                    Proveedor: any;
                    ProveedorId: any;
                    NIT: any; Id: number; 
                    Title: string;  
                    })=>{
                    item.push({
                            key:i.Id,
                            Title:i.Title?i.Title:"NA",
                            // eslint-disable-next-line dot-notation
                            CodigoTarifa:i.CodigoTarifa?i.CodigoTarifa:"Sin CodigoTarifa",
                            Proveedor:i.Proveedor["Title"]?i.Proveedor["Title"]:"Sin Proveedor",
                            Descripcion:i.Descripcion?i.Descripcion:"Sin Descripcion",
                            Labor:i.Labor?i.Labor:"Sin labor",
                            ValorUnitario:i.ValorUnitario?this.formatCurrency(i.ValorUnitario):"Sin  ValorUnitario",
                            Accion: <><div className="ms-Grid-col ms-md6">
                                <DialogEditarTarifa 
                                    id={i.Id} 
                                    show={false} 
                                    title={i.Title?i.Title:"NA"}
                                    CodigoTarifa={i.CodigoTarifa?i.CodigoTarifa:"Sin CodigoTarifa"}
                                    Descripcion={i.Descripcion?i.Descripcion:"Sin Descripcion"}
                                    Proveedor={i.ProveedorId != null?i.ProveedorId:"Sin Proveedor"}
                                    Labor={i.Labor?i.Labor:"Sin labor"}
                                    ValorUnitario={i.ValorUnitario?i.ValorUnitario:"Sin ValorUnitario"}
                                    context={this.props.context}
                                    ActualizarTarifa={this.ActualizarTarifa}
                                    />
                                    </div>
                                    <div className="ms-Grid-col ms-md6">
                                    <DialogEliminarTarifa 
                                      show={false} 
                                      id={i.Id} 
                                      EliminarTarifa={this.EliminarTarifa}
                                    />
                                    </div>
                                    </>
                        });
                });
            }
        );
       
        this.setState({detailListItems:item});
        this.IniciaTable();
        return "termino";
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
                    <DialogNuevoTarifa 
                    id={0} 
                    show={false} 
                    context={this.props.context}
                    CrearTarifa={this.CrearTarifa}                    
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
                        <th>Código Tarifa</th>
                        <th>Proveedor</th>
                        <th>Descripción</th>
                        <th>Labor</th>
                        <th>Valor Unitario</th>
                        <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.detailListItems && this.state.detailListItems.length > 0 ?
                      this.state.detailListItems.map((val:any, index:number)=>(
                        <tr>
                          <td>{val.CodigoTarifa}</td>
                          <td>{val.Proveedor}</td>
                          <td>{val.Descripcion}</td>
                          <td>{val.Labor}</td>
                          <td>{val.ValorUnitario}</td>
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
