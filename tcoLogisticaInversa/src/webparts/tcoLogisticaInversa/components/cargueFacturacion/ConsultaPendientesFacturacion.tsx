/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Helpers } from "../utils/Helpers";
import { PrimaryButton } from '@fluentui/react';
import styles from './CargueFacturacion.module.scss';
interface IConsultaPendientesFacturacionProps{
  context:any;
  urlSitioMateriales:string;
  ListaMateriales:string;
  regresar?:()=>any;
  getData?:()=>any;
}

import '../../assets/css/style.css';
import '../../assets/css/dataTables.css';

//import * as jQuery from 'jquery'; 
const jQuery = require('jquery'); 

import 'DataTables.net';  

export default class ConsultaPendientesFacturacion extends React.Component<IConsultaPendientesFacturacionProps, any> {

  public Helpers: Helpers;

  public Meses = [{Mes:"Enero"},
                  {Mes:"Febrero"},
                  {Mes:"Marzo"},
                  {Mes:"Abril"},
                  {Mes:"Mayo"},
                  {Mes:"Junio"},
                  {Mes:"Julio"},
                  {Mes:"Agosto"},
                  {Mes:"Septiembre"},
                  {Mes:"Octubre"},
                  {Mes:"Noviembre"},
                  {Mes:"Diciembre"}]

  constructor(props:any) {
    super(props); 

    this.Helpers = new Helpers(this.props.context);

    this.state = {
      proveedores:[],
      dataFile:[],
      DataTarifas:[],
      currentUser:[],
      MesFacturacion:'',
      Facturacion:[],
      form: {},
      btnAllSelect:'Seleccionar todo',
      Operacion:'active'
    }
  }

  componentWillMount(): void {
    this.Helpers.getCurrentUser()
    .then((res:any) => {
      this.setState({
        currentUser:res,
      }, ()=>{
        this.getAutorizadorForOperacion()
        this.getAutorizadorForAprobacion()
      })
    })
  }

  private getAutorizadorForOperacion(){
    this.Helpers.getItemsList(
      'Usuarios',
      '*,Usuario/ID,Rol/Title',
      "Rol/Title eq 'Rol Proveedor Logistica Inversa' and  Usuario/ID eq "+this.state.currentUser.Id,
      'Usuario,Rol'
    ).then((res:any) => {
  
      if(res.length > 0){
          var filter = "Operacion1 eq '"+ res[0].Eleccion + "' or Operacion2 eq '"+ res[0].Eleccion + "' or Operacion3 eq '"+ res[0].Eleccion + "'";
          this.getEncabezados(filter, 'tablaConFacturacion','EncabezadoFacturacionO');
      }
    })
  }

  private getAutorizadorForAprobacion(){
    this.Helpers.getItemsList(
      'Usuarios',
      '*,Proveedor/ID,Proveedor/Title,Usuario/ID,Usuario/Title,Rol/Title',
      "Rol/Title eq 'Rol Autorizador Resumen Facturacion' and Usuario/ID eq "+ this.state.currentUser.Id,
      'Proveedor,Usuario,Rol',
    ).then((res:any) => {

      var array = new Array();

      res.forEach((val:any, i:number) => {
        
        var filter = "EstadoFlujoAprobacion eq '"+ val.Eleccion +"' and Proveedor/ID eq "+ val.Proveedor.ID
        //this.getEncabezados(filter, 'tablaConFacturacion2', 'EncabezadoFacturacionA');

        this.Helpers.getItemsList(
          'EncabezadoFacturacion',
          '*,Proveedor/ID,Proveedor/Title',
          filter,
          'Proveedor',
        ).then((resEF:any) => {
          if(resEF.length > 0) {
            if(array.length == 0){ 
              array = resEF
            }else{
              array = array.concat(resEF)
            }
          }

          if(res.length-1 == i){
              this.setState({
                EncabezadoFacturacionA:array,
              },() =>{
                this.IniciaTable('tablaConFacturacion2');
              });
          }
        })
      });
    })
  }

  private getEncabezados(filter:string, table:string, tipoAuto:string){

    jQuery('#'+table).DataTable().destroy()

    this.Helpers.getItemsList(
      'EncabezadoFacturacion',
      '*,Proveedor/ID,Proveedor/Title',
      filter,//"Operacion1 eq '"+ this.state.OperacionAutorizador + "' or Operacion2 eq '"+ this.state.OperacionAutorizador + "' or Operacion3 eq '"+ this.state.OperacionAutorizador + "'",
      'Proveedor',
    ).then((res:any) => {
  
      this.setState({
        [tipoAuto]:res,
      },() =>{
        this.IniciaTable(table)
      });
    })
  }

  public render(): React.ReactElement<IConsultaPendientesFacturacionProps>{
    return (
      <section>
        <div className="ms-Grid-col ms-md12 marginBottom10">
            <div className="ms-Grid-col ms-u-sm1 margin-top">
                <PrimaryButton 
                    text="Menú principal" 
                    className={ styles.colorButton}
                    onClick={()=>this.props.regresar()}
                    />
            </div>
        </div>
          <h2>Consulta Pendientes Facturación</h2>
            <div id="Operacion" className={"tabcontent " + this.state.Operacion}>
              <br/>
              <div className="table-responsive">
                <table id="tablaConFacturacion" className="table  table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Mes de Facturacion</th>
                        <th>Proveedor</th>
                        <th>Estado</th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.EncabezadoFacturacionO && this.state.EncabezadoFacturacionO.length > 0 ?
                        this.state.EncabezadoFacturacionO.map((val:any, index:number)=>(
                          <tr>
                            <th>{val.ID}</th>
                            <td>{val.MesFacturacion}</td>
                            <td>{val.Proveedor.Title}</td>
                            <td>{val.EstadoFlujoRevision}</td>
                          </tr>
                        ))
                      
                      :null}
                    </tbody>
                </table>
              </div>
              <br/>
            </div>

            <h2>Aprobaciones</h2>

            <div id="Aprobacion" className={"tabcontent " + this.state.Aprobacion}>
            <br/>
              <div className="table-responsive">
                <table id="tablaConFacturacion2" className="table  table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Mes de Facturacion</th>
                        <th>Proveedor</th>
                        <th>Estado</th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.EncabezadoFacturacionA && this.state.EncabezadoFacturacionA.length > 0 ?
                        this.state.EncabezadoFacturacionA.map((val:any, index:number)=>(
                          <tr>
                            <th>{val.ID}</th>
                            <td>{val.MesFacturacion}</td>
                            <td>{val.Proveedor.Title}</td>
                            <td>{val.EstadoFlujoAprobacion}</td>
                          </tr>
                        ))
                      :null}
                    </tbody>
                </table>
              </div>
              <br/>
            </div>
      </section>
    );
  }

  private IniciaTable(table:any){
    jQuery('#'+table).DataTable({
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
        },
        order: [[0, 'desc']]
    });
  }
}