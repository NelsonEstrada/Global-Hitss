/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
//import {Component} from 'react';
import styles from './Body.module.scss';
import { Label, PrimaryButton } from '@fluentui/react';
import { IBodyProps, IRequests } from './IBodyProps';
import {  IColumn} from '@fluentui/react/lib/DetailsList';
import 'office-ui-fabric-react/dist/css/fabric.css';
//import { spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";

import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/site-users/web";
import "@pnp/sp/sputilities";
import "@pnp/sp/attachments";

//import { SPFx, spfi } from '@pnp/sp';

import {Web} from 'sp-pnp-js';

import AdmonProveedores from '../admonProveedores/AdmonProveedores';
import AdmonPerfiles from '../admonPerfiles/AdmonPerfiles';
import AdmonAsignacionProveedores from '../admonAsignacionProveedores/AdmonAsignacionProveedores';
import AdmonTarifas from '../admonTarifas/AdmonTarifas';
import AdmonContratoMarco from '../admonContratoMarco/AdmonContratoMarco';
import CargueFacturacion from '../cargueFacturacion/CargueFacturacion';
import AprobacionFacturacion from '../AprobacionFacturacion/AprobacionFacturacion';
import ConsultaPendientesFacturacion from '../cargueFacturacion/ConsultaPendientesFacturacion';
import FormatoFacturacion from '../cargueFacturacion/FormatoFacturacion';
import ExportarFacturacion from '../cargueFacturacion/ExportarFacturacion';

import { Helpers } from "../utils/Helpers";

import '../../assets/css/style.css';

export interface IDetailsListDocumentsExampleState {
    columns: IColumn[];
    items: IRequests[];
    isModalSelection: boolean;
    isCompactMode: boolean;
    announcedMessage?: string;
  }

  
export default class Body extends React.Component<IBodyProps,any>{
    
    state = { 
        perfil:"administrador",
        vista:"ninguna",
        menu:"principal",
    }
  
    public Helpers: Helpers;
    public web: Web;

    constructor(props:any){
        super(props);

        this.Helpers = new Helpers(this.props.context);
        this._getPerfil();
    }

    private _getPerfil= async()=>{
  
        this.Helpers.getCurrentUser(
        ).then((items:any) => {
            this.setState({
                currentUser:items
            }, ()=>{
                this.getPerfilUser(items)
            })
        });
    }

    public getPerfilUser(currentUser:any){

        this.Helpers.getItemsList(
            'Usuarios',
            "*,Usuario/Title,Rol/Title",
            `Usuario/Id eq '${currentUser.Id}'`,
            'Usuario,Rol',
            {property : "ID", asc:false}
        ).then((items:any) => {
        
            var titles = "";
            for(var i = 0; i < items.length; i++){
                titles=titles+items[i].Rol.Title;
            }
            this.setState({
                perfil:titles
            })

        });
    }
    
    private regresar=()=>{
        this.setState({vista:this.state.perfil,menu:"principal"});
    } 

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getData(list=''){

        this.Helpers.getItemsList(
            list,
            "*,Solicitante/Title",
            '',
            'Solicitante',
            {property : "ID", asc:false}
        ).then((items:any) => {
            return items;
        });

        
    }
    
    public handlerVista=(nuevaVista:string="ninguna")=>{
        this.setState({vista:nuevaVista,menu:nuevaVista});
    }
    

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    render(){
        return (
            <>
            <div className="ms-Grid-col ms-md12">

                {this.state.perfil.indexOf("Rol de Administrador") !== -1 &&this.state.menu=="principal"?
                    <>
                    <div>
                        <h2>Menú Principal</h2>
                    </div>
                        <div className={styles.sectionOne}>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/delivery-man.png' title='Proveedor' />
                                </div>
                                </>
                            
                                <PrimaryButton 
                                    text="Administrar Proveedores" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Administrar Proveedores")}
                                    />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/creative-idea.png' title='Perfiles' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Administrar Perfiles" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Administrar Perfiles")}
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/server.png' title='Asignación Proveedor Perfil' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Asignación Proveedores Perfiles" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Asignacion Proveedores Perfiles")}
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/computer-science.png' title='Configuración Tarifas' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Configuración Tarifas" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Configuracion Tarifas")}
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                                <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/business-report.png' title='Contrato Marco' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Configuración Contrato Marco"  
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Configuracion Contrato Marco")}
                                />
                            </div>
                        </div>
                        <div className={styles.sectionTwo}>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/data-science.png' title='Información Proveedor' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Cargue Información Proveedor" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Cargue Informacion Proveedor")}
                                
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/planificacion.png' title='Información Proveedor' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Consulta de Tareas Pendientes o Aprobación" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Consultar Tareas")}
                                
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/business-report_folder.png' title='Aprobación Facturación' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Aprobación Facturación" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Aprobacion Facturacion")}
                                
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/lista-de-verificacion.png' title='Información Proveedor' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Formato Resumen Facturación" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Formato Resumen")}
                                
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/business-presentation.png' title='Información Proveedor' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Consultar y Exportar Información"
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Exportar")}
                                
                                />
                            </div>
                        </div>
                    </>
                : this.state.perfil.indexOf("Rol Proveedor Logistica Inversa") !== -1 &&this.state.menu==="principal"?
                <>
                    <div>
                        <h2>Menú Principal</h2>
                    </div>
                        <div className={styles.sectionOne}>
                    <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/data-science.png' title='Información Proveedor' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Cargue Información Proveedor" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Cargue Informacion Proveedor")}
                                
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/planificacion.png' title='Información Proveedor' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Consulta de Tareas Pendientes o Aprobación" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Consultar Tareas")}
                                
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/business-report_folder.png' title='Aprobación Facturación' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Aprobación Facturación" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Aprobacion Facturacion")}
                                
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/lista-de-verificacion.png' title='Información Proveedor' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Formato Resumen Facturación" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Formato Resumen")}
                                
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/business-presentation.png' title='Información Proveedor' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Consultar y Exportar Información"
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Exportar")}
                                
                                />
                            </div>
                            </div>
                </>: this.state.perfil.indexOf("Rol Autorizador Resumen Facturacion") !== -1 &&this.state.menu=="principal"?
                <>
                <div>
                        <h2>Menú Principal</h2>
                    </div>
                        <div className={styles.sectionOne}>
                    <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/data-science.png' title='Información Proveedor' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Cargue Información Proveedor" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Cargue Informacion Proveedor")}
                                
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/planificacion.png' title='Información Proveedor' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Consulta de Tareas Pendientes o Aprobación" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Consultar Tareas")}
                                
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/business-report_folder.png' title='Aprobación Facturación' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Aprobación Facturación" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Aprobacion Facturacion")}
                                
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/lista-de-verificacion.png' title='Información Proveedor' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Formato Resumen Facturación" 
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Formato Resumen")}
                                
                                />
                            </div>
                            <div className={`ms-md3 bms-u-sm1 margin-top ${styles.menubox}`}>
                            <>
                                <div className={ styles.center }>
                                    <img className={ styles.imgMenuSize} src='https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/business-presentation.png' title='Información Proveedor' />
                                </div>
                                </>
                                <PrimaryButton 
                                    text="Consultar y Exportar Información"
                                    className={ styles.menuButton}
                                    onClick={()=>this.handlerVista("Exportar")}
                                
                                />
                            </div>
                            </div>
                </>:
                <></>
                }
            </div>
            <div className="ms-Grid-col ms-md12 altura">
                {
                    this.state.vista=="Administrar Proveedores"?
                        <>
                          <AdmonProveedores
                            getData={this.getData}
                            context={this.props.context}
                            regresar={this.regresar}
                            />
                        </>
                    :
                    this.state.vista=="Administrar Perfiles"?
                        <>
                            <AdmonPerfiles
                                getData={this.getData}
                                context={this.props.context}
                                regresar={this.regresar}
                            /> 
                        </>
                    :
                    this.state.vista=="Asignacion Proveedores Perfiles"?
                        <>
                            <AdmonAsignacionProveedores 
                                getData={this.getData}
                                context={this.props.context}
                                regresar={this.regresar}
                            />
                        </>
                    :
                    this.state.vista=="Cargue Informacion Proveedor"?
                    <>
                        <CargueFacturacion
                            getData={this.getData}
                            context={this.props.context}
                            regresar={this.regresar}
                            urlSitioMateriales={this.props.urlSitioMateriales}
                            ListaMateriales={this.props.ListaMateriales}
                        />
                    </>
                    :
                    this.state.vista=="Aprobacion Facturacion"?
                    <>
                        <AprobacionFacturacion
                            getData={this.getData}
                            context={this.props.context}
                            regresar={this.regresar}
                            urlSitioMateriales={this.props.urlSitioMateriales}
                            ListaMateriales={this.props.ListaMateriales}
                        />
                    </>
                    :
                    this.state.vista=="Configuracion Tarifas"?
                    <>
                        <AdmonTarifas 
                            getData={this.getData}
                            context={this.props.context}
                            regresar={this.regresar}
                        />
                    </>
                    :
                    this.state.vista=="Configuracion Contrato Marco"?
                    <>
                        <AdmonContratoMarco 
                            getData={this.getData}
                            context={this.props.context}
                            regresar={this.regresar}
                        />
                    </>
                    :
                    this.state.vista=="Consultar Tareas"?
                    <>
                        <ConsultaPendientesFacturacion 
                            context={this.props.context}
                            regresar={this.regresar}
                            getData={this.getData}
                            urlSitioMateriales={this.props.urlSitioMateriales}
                            ListaMateriales={this.props.ListaMateriales}
                        />
                    </>
                    :
                    this.state.vista=="Formato Resumen"?
                    <>
                        <FormatoFacturacion 
                            context={this.props.context}
                            regresar={this.regresar}
                            getData={this.getData}
                            urlSitioMateriales={this.props.urlSitioMateriales}
                            ListaMateriales={this.props.ListaMateriales}
                        />
                    </>
                    :
                    this.state.vista=="Exportar"?
                    <>
                        <ExportarFacturacion 
                            context={this.props.context}
                            regresar={this.regresar}
                            getData={this.getData}
                            urlSitioMateriales={this.props.urlSitioMateriales}
                            ListaMateriales={this.props.ListaMateriales}
                        />
                    </>
                :
                    <div>
                        <Label disabled>Por favor seleccione una opción</Label>
                    </div>
                }
            </div>

            </>
        );
    }
   
}
