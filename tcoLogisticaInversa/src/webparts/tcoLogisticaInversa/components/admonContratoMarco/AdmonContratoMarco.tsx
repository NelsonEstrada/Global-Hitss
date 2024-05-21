/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import {Component} from 'react';
import styles from './AdmonContratoMarco.module.scss';
import { PrimaryButton } from '@fluentui/react';
import 'office-ui-fabric-react/dist/css/fabric.css';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/site-users";
import "@pnp/sp/sputilities";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-users";
import  "@pnp/sp/attachments";
import { IAdmonContratoMarco } from './IAdmonContratoMarco';
import { SPFx, spfi } from '@pnp/sp';
import { DialogContratoMarcoEditar, DialogContratoMarcoNew } from '../dialog/DialogContratoMarco';

import '../../assets/css/style.css';
import '../../assets/css/dataTables.css';

//import * as jQuery from 'jquery'; 
const jQuery = require('jquery'); 
import 'DataTables.net';  

import { Helpers } from "../utils/Helpers";
  
export default class AdmonContratoMarco extends Component<IAdmonContratoMarco,any>{

    public Helpers: Helpers;
    constructor(props: IAdmonContratoMarco | Readonly<IAdmonContratoMarco>){
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

        this.getEncabezados()

    }

    private getEncabezados(){

        jQuery('#tablaFormatoFacturacion').DataTable().destroy()
    
        this.Helpers.getItemsList(
          'EncabezadoFacturacion',
          '*,Proveedor/Title,Revisor/Title,Proveedor/ID',
          "",
          'Proveedor,Revisor',
        ).then((res:any) => {
      
          var data = res.filter((x:any) => x.EstadoFlujoAprobacion == 'Finalizado')
    
          this.setState({
            ContratoFinalizados:data 
          },()=>{
            this.loadData()
          });

        })

    }

    public ActualizarContratoMarco= async (id:number,Proveedor:any,NumeroContrato:any,FechaInicio:any,FechaFin:any,Valor:any):Promise<boolean>=>{
        const sp = spfi().using(SPFx(this.props.context));
        let proveedorId = Proveedor;
        await sp.web.lists.getByTitle(`ContratoMarco`).items.getById(id).update({
            Title:"Nuevo contrato Marco",
            // eslint-disable-next-line dot-notation
            Estado:"Obsoleto"
            }).then(async()=>{
                await sp.web.lists.getByTitle(`ContratoMarco`).items.add({
                    Title:"Nuevo contrato Marco",
                    // eslint-disable-next-line dot-notation
                    NumeroContrato:NumeroContrato?NumeroContrato:"Sin Numero Contrato",
                    FechaInicio:FechaInicio?FechaInicio:"Sin Fecha de Inicio",
                    FechaFin:FechaFin?FechaFin:"Sin fecha de finalización",
                    ProveedorId:proveedorId,
                    Valor:Valor?parseInt(Valor.replace(/_/g,'')):"Sin ValorUnitario",
                    }).then(async()=>{
                        this.loadData();
                        return true;
                    }).catch((e)=>{
                        console.log(e)
                        return false;
                    });
                return true;
            }).catch((e)=>{
                console.log(e)
                alert("Ha ocurrido un error, verifique que no existen códigos repetidos.");
            });
        return true;
    }

    public CrearContratoMarco= async (Proveedor:any,NumeroContrato:any,FechaInicio:any,FechaFin:any,Valor:any):Promise<boolean>=>{
        
        const sp = spfi().using(SPFx(this.props.context));
        let proveedorId = Proveedor;

        await sp.web.lists.getByTitle(`ContratoMarco`).items.add({
            Title:"Nuevo contrato Marco",
            // eslint-disable-next-line dot-notation
            NumeroContrato:NumeroContrato?NumeroContrato:"Sin Numero Contrato",
            FechaInicio:FechaInicio?FechaInicio:"Sin Fecha de Inicio",
            FechaFin:FechaFin?FechaFin:"Sin fecha de finalización",
            ProveedorId:proveedorId,
            Valor:Valor?parseInt(Valor.replace(/_/g,'')):"Sin ValorUnitario",
            }).then(async()=>{
                this.loadData();
                return true;
            }).catch((e)=>{
                console.log(e)
                alert("Ha ocurrido un error, verifique que no existen códigos repetidos.");
            });
        return true;
    }

  /*  private getData=async (list=''):Promise<any>=>{
        const sp = spfi().using(SPFx(this.props.context));
        const items = await sp.web.lists.getByTitle(list).items.select("*","Proveedor/Title").expand('Proveedor').orderBy("Id", false)();
        return items;
    }*/

    private formatCurrency=(number: number, digits?:number): string=> {
        return number.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits:digits? digits : 0
        });
    }

    private loadData=async()=>{
        // eslint-disable-next-line prefer-const
        jQuery("#tablaFacturación").DataTable().destroy();
     
    this.Helpers.getItemsList(
        'ContratoMarco',
        '*,Proveedor/Id,Proveedor/Title',
        "",
        'Proveedor',
        {property : "ID", asc:false}
    ).then((res:any) => {

    var data = new Array();

    res.forEach((i:any, pos:any) => {

        var data2 = this.state.ContratoFinalizados.filter((x:any) => x.Proveedor.Id == i.Proveedor.ID)

        var ValorTotalFactura = 0;
            
        data2.forEach((val:any) => {
            ValorTotalFactura = ValorTotalFactura + parseFloat(val.ValorTotalFactura)
        });

        let item = {
                key:i.Id,
                Title:i.Title?i.Title:"Sin Nombre",
                NumeroContrato:i.NumeroContrato?i.NumeroContrato:"Sin Numero Contrato",
                FechaInicio:i.FechaInicio?i.FechaInicio.split('T')[0]:"Sin Fecha de Inicio",
                FechaFin:i.FechaFin?i.FechaFin.split('T')[0]:"Sin fecha de finalización",
                Estado:i.Estado?i.Estado:"Sin Estado",
                Proveedor:i.Proveedor["Title"] != null?i.Proveedor["Title"]:"Sin Proveedor",
                Valor:i.Valor?this.formatCurrency(i.Valor, 2):"Sin valor",
                ValorVigente: this.formatCurrency(i.Valor - ValorTotalFactura,2),
                Accion: <>{i.Estado==="Vigente" ? <DialogContratoMarcoEditar 
                        id={i.Id} 
                        show={false} 
                        title={i.Title?i.Title:"Perfil Asignado"}
                        NumeroContrato={i.NumeroContrato?i.NumeroContrato:"Sin Numero Contrato"}
                        FechaInicio={i.FechaInicio?i.FechaInicio:"Sin fehca de Inicio"}
                        FechaFin={i.FechaFin?i.FechaFin:"Sin Fecha de Finalización"}
                        FechaFinAnterior={i.FechaFin?i.FechaFin:"Sin Fecha de Finalización"}
                        Proveedor={i.Proveedor["Title"]?i.Proveedor["Title"]:"Sin Proveedor"}
                        context={this.props.context}
                        Valor={i.Valor?i.Valor:"Sin valor"}
                        ActualizarContratoMarco={this.ActualizarContratoMarco}
                        />
                        : <div> "No acciones"</div>}
                        </>

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
                    <DialogContratoMarcoNew 
                    id={0} 
                    show={false} 
                    context={this.props.context}
                    CrearContratoMarco={this.CrearContratoMarco}                    
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
                        <th>Proveedor</th>
                        <th>Estado</th>
                        <th>Valor</th>
                        <th>Valor disponible</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Número Contrato</th>
                        <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.detailListItems && this.state.detailListItems.length > 0 ?
                      this.state.detailListItems.map((val:any, index:number)=>(
                        <tr>
                          <td>{val.Proveedor}</td>
                          <td>{val.Estado}</td>
                          <td>{val.Valor}</td>
                          <td>{val.ValorVigente}</td>
                          <td>{val.FechaInicio}</td>
                          <td>{val.FechaFin}</td>
                          <td>{val.NumeroContrato}</td>
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
