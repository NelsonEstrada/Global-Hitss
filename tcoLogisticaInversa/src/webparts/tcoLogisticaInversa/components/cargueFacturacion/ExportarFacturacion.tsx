/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import styles from './CargueFacturacion.module.scss';
import { PrimaryButton } from '@fluentui/react';
import { Helpers } from "../utils/Helpers";

interface IExportarFacturacionProps{
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

export default class ExportarFacturacion extends React.Component<IExportarFacturacionProps, any> {

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
      openModalFacturacion:false,
      Meses:this.Meses,
      isAdmin:false
    }

  }

  componentWillMount(): void {

    this.Helpers.getCurrentUser()
    .then((res:any) => {
      this.setState({
        currentUser:res,
      },()=>{
        this.getAutorizadorForUser();
      })
    })

    var iniAnio = new Date().getFullYear() - 2;
    var finAnio = new Date().getFullYear();
    var dataAnios = new Array();

    for (var i = iniAnio; i <= finAnio; i++) {
      let mes = {Anio: i}
      dataAnios.push(mes)
    }

    this.setState({
      Anios:dataAnios
    })

    ///this.getEncabezados()

  }

  private getEncabezados(){

      var filter = "EstadoFlujoRevision ne 'Registrada'";

      jQuery('#tablaExportFacturacion').DataTable().destroy()

      var filters = new Array();
      if(this.state.Proveedor){
        filters.push('Proveedor/ID eq ' + this.state.Proveedor)
      }

      if(this.state.Mes && this.state.Anio){
        filters.push("MesFacturacion eq '" + this.state.Mes + "/"+this.state.Anio+"'")
      }

      filter = filters.join(' and ');
      console.log(filter)

      this.Helpers.getItemsList(
        'EncabezadoFacturacion',
        '*,Proveedor/Title,Proveedor/ID',
        filter,
        'Proveedor',
      ).then((res:any) => {
    
        this.setState({
          EncabezadoFacturacion:res,
        },() =>{
          this.IniciaTable('tablaExportFacturacion')
        
        })

      })
  }

  public render(): React.ReactElement<IExportarFacturacionProps>{
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
        <h2>Exportar Facturación</h2>
            
            <div id="formDatos">

              {this.state.isAdmin ? 
                <div className="fila2" id="fMesFacturación">
                  <div className="nombreCampo">Proveedor</div>
                  <div className="campo">
                    <select id="Proveedor" name="Proveedor" className='slcDropdown' onChange={(e) => {this.inputChange(e.target)  }}>
                      <option value=""></option>
                      {this.state.Proveedores && this.state.Proveedores.length > 0 ?
                        this.state.Proveedores.map((val:any, index:number)=>(
                            <option value={val.ID}>{val.Title}</option>
                        ))
                      : null}
                    </select>
                  </div>
                </div>
              :
                <div className="fila2" id="fProovedor">
                  <div className="nombreCampo">Proovedor</div>
                    <div className="campo">
                      <input type="text" disabled id="Proovedor" value={this.state.NombreProveedor}/>
                    </div>
                </div>
              }

                <div className="fila2" id="fMesFacturación">
                </div>

                <div className="fila2" id="fMesFacturación">
                  <div className="nombreCampo">Mes</div>
                  <div className="campo">
                    <select id="MesFacturación" name='Mes' className='slcDropdown' onChange={(e) => {this.inputChange(e.target) }}>
                      <option value=""></option>
                      {this.state.Meses && this.state.Meses.length > 0 ?
                        this.state.Meses.map((val:any, index:number)=>(
                            <option value={val.Mes}>{val.Mes}</option>
                        ))
                      : null}
                    </select>
                    </div>
                </div>

                <div className="fila2" id="fMesFacturación">
                  <div className="nombreCampo">Año</div>
                  <div className="campo">
                    <select id="MesFacturación" name='Anio' className='slcDropdown' onChange={(e) => {this.inputChange(e.target) }}>
                      <option value=""></option>
                      {this.state.Anios && this.state.Anios.length > 0 ?
                        this.state.Anios.map((val:any, index:number)=>(
                            <option value={val.Anio}>{val.Anio}</option>
                        ))
                      : null}
                    </select>
                    </div>
                </div>


              </div>
            <br/>

            <div className="table-responsive">
              <table id="tablaExportFacturacion" className="table  table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Mes de Facturacion</th>
                      <th>Proveedor</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.EncabezadoFacturacion && this.state.EncabezadoFacturacion.length > 0 ?
                      this.state.EncabezadoFacturacion.map((val:any, index:number)=>(
                        <tr>
                          <td>{val.ID}</td>
                          <td>{val.MesFacturacion}</td>
                          <td>{val.Proveedor.Title}</td>
                          <td>
                            <input className={styles.colorButton} type="button" value="Ver facturación" onClick={()=> this.getFacturacion(val.ID)}/>
                          </td>
                        </tr>
                      ))
                    
                    :null}
                  </tbody>
              </table>
            </div>

            {this.state.openModalFacturacion ? 
                <div id="modal">
                  <div id="content-modalSolicitud" className="modal-Solicitud">
                    <div id="data-modal">
                      <div id="encabezado">
                        <div id="logoApp"></div>
                        <div id="tituloApp">Carga masiva Usuario</div>
                        <div id="closeApp">
                          <svg onClick={()=> this.cerrarModal()} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={"bi bi-x-lg margin5"} viewBox="0 0 16 16" >
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className='content-modal'>

                        <br/>
                        <h1>Facturacion</h1>
                        <br/><br/>

                        <div className="table-responsive table-modal">
                          <table id="tablaAproFacturacion" className="table table-striped table-bordered">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Mes de Facturacion</th>
                                  <th>Proveedor</th>
                                  <th>Codigo</th>
                                  <th>Descripcion de material</th>
                                  <th>UM</th>
                                  <th>Documento de entrada</th>
                                  <th>Tipo</th>
                                  <th>Cant</th>
                                  <th>Centro Destino</th>
                                  <th>Bodega Sap Destino</th>
                                  <th>Destino</th>
                                  <th>Descripcion para Facturacion</th>
                                  <th>Labor</th>
                                  <th>Valor Unitario</th>
                                  <th>Valor Total</th>
                                  <th>Familia</th>
                                  <th>Mes</th>
                                  <th>Operación</th>
                                  <th>Reserva</th>
                                  <th>Lote</th>
                                  <th>Usuario Registr</th>
                                  <th>Fecha registro</th>
                                  <th>Estado</th>
                                </tr>
                              </thead>

                              <tbody>
                                {this.state.Facturacion && this.state.Facturacion.length > 0 ?
                                  this.state.Facturacion.map((val:any, index:number)=>(
                                    <tr>
                                      <td>{val.ID}</td>
                                      <td>{val.MesFacturacion}</td>
                                      <td>{val.Proveedor.Title}</td>
                                      <td>{val.Codigo}</td>
                                      <td>{val.DescripcionMaterial}</td>
                                      <td>{val.UM}</td>
                                      <td>{val.DocumentoEntrada}</td>
                                      <td>{val.Carpeta}</td>
                                      <td>{val.Cant}</td>
                                      <td>{val.CentroDestino}</td>
                                      <td>{val.BodegaSapDestino}</td>
                                      <td>{val.DestinoPedido}</td>
                                      <td>{val.DescripcionFacturacion}</td>
                                      <td>{val.Labor}</td>
                                      <td>{'$ ' + val.ValorUnitario}</td>
                                      <td>{'$ ' + val.ValorTotal}</td>
                                      <td>{val.Familia}</td>
                                      <td>{val.MesServicio}</td>
                                      <td>{val.Operacion}</td>
                                      <td>{val.Reserva}</td>
                                      <td>{val.lote}</td>
                                      <td>{val.Usuario.Title}</td>
                                      <td>{val.FechaRegistro ? (new Date(val.FechaRegistro).getDate() + '/' + (new Date(val.FechaRegistro).getMonth()+1) ) +'/'+ new Date(val.FechaRegistro).getFullYear() : ''}</td>
                                      <td>{val.Estado}</td>
                                    </tr>
                                  ))
                                
                                :null}
                              </tbody>
                          </table>
                        </div>

                        <div id="ms-Grid-col ms-u-sm1 centerButtons">
                          <input className={styles.colorButton} type="button" value="Cancelar" onClick={()=> this.cerrarModal()}/>
                          <input className={styles.colorButton} type="button" value="Exportar" onClick={()=> this.ExportarFacturacion()}/>
                        </div>
                      </div>


                    </div>
                  </div>
                </div>
            : null}
      </section>
    );
  }

  private getAutorizadorForUser(){
    
    this.Helpers.getItemsList(
      'Usuarios',
      '*,Proveedor/ID,Proveedor/Title,Usuario/ID,Usuario/Title,Rol/Title',
      "Usuario/ID eq "+ this.state.currentUser.Id,
      'Proveedor,Usuario,Rol',
    ).then((res:any) => {
  
      var aux = res.filter((x:any)=> x.Rol.Title == 'Rol de Administrador')

      if(aux.length > 0) {
        this.setState({
          isAdmin:true
        },()=>{
          this.getProovedor()
        })
        
      }else{
        this.setState({
          idProveedor:res[0].ProveedorId ? res[0].Proveedor.ID : 0,
          NombreProveedor:res[0].ProveedorId != null? res[0].Proveedor.Title : 'Proveedor sin nombre',
          RolUser:res[0].RolId != null? res[0].Rol.Title : 'Sin rol'
        },() => { 
          this.getProovedor()
        });
      }
    })
  }

  private getProovedor(){
    this.Helpers.getItemsList(
      'Proveedores',
      '*',
      '',
      '',
    ).then((res:any) => {
  
      if(this.state.isAdmin){
        if(res.length > 0){
          this.setState({
            Proveedores:res,
          })
        }
      }else{

        var aux = res//.filter((x:any)=> x.AprobadorFacturacion.ID == this.state.currentUser.Id)

        if(aux.length > 0){
          this.setState({
            Proveedor:this.state.idProveedor,
            NombreProveedor:this.state.NombreProveedor,
          },() => {
            this.getEncabezados()
          })
        }
      }

    })
  }

  public inputChange(target:any) {

    var value = target.value;
    var name = target.name;

    this.setState({
       [name]: value
    },()=> {
      this.getEncabezados();
    })

  }

  private getFacturacion(idFacturacion:number){

    this.Helpers.loadingModal.show('Cargando facturacion...',()=>{

      this.Helpers.getListOverThreshold(
        'CargueFacturacion', 
        '*,EncabezadoFacturacion/Id,Proveedor/Title,Usuario/Title',
        "EncabezadoFacturacion/Id eq " + idFacturacion,
        'EncabezadoFacturacion,Proveedor,Usuario',
      (res:any) => {

        var array = new Array();

        res.forEach((val:any) => {

          array.push({
            'Fecha':val.Created ? (new Date(val.Created).getDate() + '/' + (new Date(val.Created).getMonth()+1) ) +'/'+ new Date(val.Created).getFullYear() : '',
            //'Fecha':val.MesFacturacion,
            'Proveedor':val.Proveedor.Title,
            'Codigo':val.Codigo,
            'Descripción del material':val.DescripcionMaterial,
            'UM':val.UM,
            'Documento de entrada':val.DocumentoEntrada,
            'Tipo':val.Carpeta,
            'Cant':val.Cant,
            'Centro Destino': val.CentroDestino,
            'Bodega Sap Destino':val.BodegaSapDestino,
            'Destino':val.DestinoPedido,
            'Descripcion para Facturacion':val.DescripcionFacturacion,
            'Labor':val.Labor,
            'Valor Unitario':val.ValorUnitario,
            'Valor Total':val.ValorTotal,
            'Familia':val.Familia,
            'Mes':val.MesServicio,
            'Operación':val.Operacion,
            'Reserva':val.Reserva,
            'Lote':val.lote,
            'Labor2':'',
            'Usuario Registro':val.Usuario.Title,
            'Fecha registro':val.FechaRegistro ? (new Date(val.FechaRegistro).getDate() + '/' + (new Date(val.FechaRegistro).getMonth()+1) ) +'/'+ new Date(val.FechaRegistro).getFullYear() : '',
            'Estado':val.Estado
          })

        });

        this.setState({
          Facturacion:res,
          FacturacionExcel:array,
          openModalFacturacion:true
        },()=>{
          this.Helpers.loadingModal.hide();
          this.IniciaTable('tablaAproFacturacion')
        })
  
      })

    });

  }

  private ExportarFacturacion(){

    var fecha = new Date().getFullYear()+''+(new Date().getMonth()+1)+''+new Date().getDate()

    this.Helpers.exportDataToExcel(this.state.FacturacionExcel,'LogisticaInversa_'+fecha,
      (res:any) => {
        console.log(res)
      })

  }

  private IniciaTable(table:string){

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

  private cerrarModal(){
    this.setState({
      openModalFacturacion:false
    })
  }


}
