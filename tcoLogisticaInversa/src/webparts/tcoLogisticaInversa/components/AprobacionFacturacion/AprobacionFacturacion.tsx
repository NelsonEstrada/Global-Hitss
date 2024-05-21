/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import styles from './AprobacionFacturacion.module.scss';
import { PrimaryButton } from '@fluentui/react';
import { Helpers } from "../utils/Helpers";

interface IAprobacionFacturacionProps{
  context:{};
  urlSitioMateriales:string;
  ListaMateriales:string;
  getData?:()=>any;
  regresar?:()=>any;
}

import '../../assets/css/style.css';
import '../../assets/css/dataTables.css';

//import * as jQuery from 'jquery'; 
const jQuery = require('jquery'); 

import 'DataTables.net';  

export default class AprobacionFacturacion extends React.Component<IAprobacionFacturacionProps, any> {

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
      form: {},
      btnAllSelect:'Seleccionar todo' 
    }

  }

  componentWillMount(): void {

    this.Helpers.getCurrentUser()
    .then((res:any) => {
      this.setState({
        currentUser:res,
      }, ()=>{this.getAutorizadorForUser()})
    })

  }

  private getAutorizadorForUser(){

    this.Helpers.getItemsList(
      'Usuarios',
      '*,Usuario/ID,Rol/Title,Proveedor/ID',
      "Rol/Title eq 'Rol Proveedor Logistica Inversa' and  Usuario/ID eq "+this.state.currentUser.Id,
      'Usuario,Rol,Proveedor'
    ).then((res:any) => {
  
      if(res.length > 0){
        this.setState({
          OperacionAutorizador:res[0].Eleccion,
          RolUser:res[0].RolId != null? res[0].Rol.Title : 'Sin rol',
          idProveedor:res[0].ProveedorId ? res[0].Proveedor.ID : 0
        },() =>{
          this.getEncabezados()
        })
      }
    })
  }

  private getEncabezados(){

    this.Helpers.getItemsList(
      'EncabezadoFacturacion',
      '*,Proveedor/ID,Proveedor/Title',
      "EstadoFlujoRevision eq 'Cargada'",
      'Proveedor',
    ).then((resa:any) => {
      
      let res:any = [];

      if(this.state.OperacionAutorizador){
        res = resa.filter((x:any)=> x.Operacion1 == this.state.OperacionAutorizador || x.Operacion2 == this.state.OperacionAutorizador || x.Operacion3 == this.state.OperacionAutorizador)
      }
      
      if(this.state.RolUser == 'Rol Proveedor Logistica Inversa' && this.state.idProveedor != 0){
        res = res.filter((x:any)=> x.Proveedor.ID == this.state.idProveedor)
      }
      
      /*this.setState({
        EncabezadoFacturacion:[],
      },() =>{
        this.setState({
          EncabezadoFacturacion:res,
        })
      })*/

      this.getFacturacionPend(res)

    })
  }

  public render(): React.ReactElement<IAprobacionFacturacionProps>{
    
    const { form } = this.state;

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
          <h2>Aprobación Facturación</h2>
          <div className="ms-Grid-col ms-md12">
              <div className="table-responsive">
                <table id="tablaFacturacion" className="table  table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Mes de Facturación</th>
                        <th>Proveedor</th>
                        <th>Estado</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.EncabezadoFacturacion && this.state.EncabezadoFacturacion.length > 0 ?
                        this.state.EncabezadoFacturacion.map((val:any, index:number)=>(
                          <tr>
                            <th>{val.ID}</th>
                            <td>{val.MesFacturacion}</td>
                            <td>{val.Proveedor != null ? val.Proveedor.Title : ''}</td>
                            <td>{val.EstadoFlujoRevision}</td>
                            <td>
                              {val.Revisado !== 'OK' ?  
                                <input className={styles.colorButton} type="button" value="Ver Facturación" onClick={()=> this.getFacturacion(val.ID, val.MesFacturacion)}/>
                              :null}
                            </td>
                          </tr>
                        ))
                      
                      :null}
                    </tbody>
                </table>
              </div>
          </div>

          {this.state.openModalFacturacion ? 
              <div id="modal">
                <div id="content-modalSolicitud" className="modal-Solicitud">
                  <div id="data-modal">

                    <div id="encabezado">
                      <div id="logoApp"></div>
                      <div id="tituloApp">Revisión de Facturación {this.state.MesFacturacion}</div>

                      <div id="closeApp" onClick={()=> this.cerrarModal()} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={"bi bi-x-lg margin5"} viewBox="0 0 16 16" >
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"></path>
                        </svg>
                      </div>

                    </div>
                    
                    <div className='content-modal'>
                      <h1>Facturación</h1>

                      <div className="ms-md12 marginBottom10">
                          <input className={styles.colorButton} type="button" value={this.state.btnAllSelect} onClick={()=> this.SeleccionarTotal()}/>
                      </div>

                      <div className="table-responsive table-modal">
                        <table id="tablaAproFacturacion" className="table table-striped table-bordered">
                            <thead>
                              <tr>
                                <th>Rechazar o Aprobar</th>
                                <th>Mes de Facturación</th>
                                <th>Proveedor</th>
                                <th>Código</th>
                                <th>Descripcion de Material</th>
                                <th>UM</th>
                                <th>Documento de Entrada</th>
                                <th>Tipo</th>
                                <th>Cant</th>
                                <th>Centro Destino</th>
                                <th>Bodega Sap Destino</th>
                                <th>Destino</th>
                                <th>Descripcion para Facturación</th>
                                <th>Labor</th>
                                <th>Valor Unitario</th>
                                <th>Valor Total</th>
                                <th>Familia</th>
                                <th>Mes</th>
                                <th>Operación</th>
                                <th>Reserva</th>
                                <th>Lote</th>
                                <th>Usuario Registro</th>
                                <th>Fecha Registro</th>
                                <th>Estado</th>
                                
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.Facturacion && this.state.Facturacion.length > 0 ?
                                this.state.Facturacion.map((val:any, index:number)=>(
                                  <tr>
                                    {val.Estado == 'RECHAZADO' ? 
                                      <td></td>
                                    :
                                      <td className='tdCenter'>
                                        <input 
                                          className={'chk'+val.ID} 
                                          defaultChecked={form['chk'+val.ID]} 
                                          type="checkbox"
                                          onClick={(e) => {this.inputChangechk(e, val.ID)}}
                                        ></input>
                                      </td>
                                    }
                                    <td>{val.MesFacturacion}</td>
                                    <td>{val.Proveedor != null ? val.Proveedor.Title : ''}</td>
                                    <td>{val.Codigo}</td>
                                    <td>{val.DescripcionMaterial}</td>
                                    <td>{val.UM}</td>
                                    <td>{val.DocumentoEntrada}</td>
                                    <td>{val.Carpeta}</td>
                                    <td className='tdCenter'>{val.Cant}</td>
                                    <td>{val.CentroDestino}</td>
                                    <td>{val.BodegaSapDestino}</td>
                                    <td>{val.DestinoPedido}</td>
                                    <td>{val.DescripcionFacturacion}</td>
                                    <td>{val.Labor}</td>
                                    <td className='tdRight'>{'$ ' + val.ValorUnitario}</td>
                                    <td className='tdRight'>{'$ ' + val.ValorTotal}</td>
                                    <td>{val.Familia}</td>
                                    <td>{val.MesServicio}</td>
                                    <td>{val.Operacion}</td>
                                    <td>{val.Reserva}</td>
                                    <td>{val.lote}</td>
                                    <td>{val.Usuario.Title}</td>
                                    <td>{val.FechaRegistro ? (new Date(val.FechaRegistro).getDate() + '/' + (new Date(val.FechaRegistro).getMonth()+1) ) +'/'+ new Date(val.FechaRegistro).getFullYear() : ''}</td>
                                    <td className='tdCenter'>{val.Estado}</td>
                                  </tr>
                                ))
                              
                              :null}
                            </tbody>
                        </table>
                      </div>

                      <div id="formDatos">
                        <div className="fila1" id="fProovedor">
                          <div className="nombreCampo">Adjuntos:</div>
                          {this.state.Adjuntos && this.state.Adjuntos.length > 0 ?
                              this.state.Adjuntos.map((val:any, index:number)=>(
                                <div className="campo">
                                  <a href={val.File.ServerRelativeUrl} target="_blank">{val.File.Name}</a>
                                </div>
                              ))
                              :
                              null}
                        </div>
                      </div>
                      
                      <h1>Datos de Facturación</h1>
                      <div id="formDatos">
                        <div className="fila2" id="fSOLPED">
                          <div className="nombreCampo">SOLPED</div>
                            <div className="campo">
                              <input 
                                type="number" 
                                id="Proovedor" 
                                onChange={(e) => { this.setState({SOLPED: e.target.value}) }} 
                                value={this.state.SOLPED}
                                className="inputText inputBorder" />
                            </div>
                        </div>
                        <div className="fila2" id="fOC">
                          <div className="nombreCampo">OC</div>
                            <div className="campo">
                              <input 
                                type="number" 
                                id="Proovedor" 
                                onChange={(e) => { this.setState({OC: e.target.value}) }} 
                                value={this.state.OC}
                                className='inputText inputBorder'/>
                            </div>
                        </div>
                      </div>

                      <div className="ms-Grid-col ms-u-sm1 centerButtons">
                        <input className={styles.colorButton} type="button" value="Cancelar" onClick={()=> this.cerrarModal()}/>
                        <input className={styles.colorButton} type="button" value="Terminar Revisión" onClick={()=> this.aprobacionFacturacion()}/>
                      </div> 
                      <br/><br/>
                    </div>
                  </div>
                </div>
              </div>
          : null}
      </section>
    );
  }

  private getFacturacion(idFacturacion:number, MesFacturacion:String){

    this.Helpers.loadingModal.show('Trabajando en ello...',()=>{
      
        var result = this.state.CargueFacturacion;

        var res = result.filter((x:any) => x.EncabezadoFacturacionId === idFacturacion && 
                                           x.Operacion == this.state.OperacionAutorizador)

        this.setState({
            Facturacion:[]
        },() => {
          this.setState({
            Facturacion:res,
            idFacturacion: idFacturacion,
            MesFacturacion: MesFacturacion,
            openModalFacturacion:true
          },() => {
            this.IniciaTable('tablaAproFacturacion')
            this.AdjuntosFacturacion(idFacturacion)
            this.Helpers.loadingModal.hide();
          })
        })
     

    });

  }

  private AdjuntosFacturacion(idFacturacion:number){
    this.Helpers.getItemsList(
      'BibliotecaFacturacion',
      '*',
      "EncabezadoFacturacionId eq "+ idFacturacion,
      'File',
    ).then((res:any) => {
      this.setState({
        Adjuntos:res
      });
    })
  }

  private inputChangechk(event:any, Id:number){
    
    //const target = event.target;
    //const value = target.type === 'checkbox' ? target.checked : target.value;

    jQuery('#tablaAproFacturacion').DataTable().destroy()
    let form = this.state.form;

    form['chk'+Id] = !form['chk'+Id]

    this.setState({
      form:form
    },() => {
      this.IniciaTable('tablaAproFacturacion')
    });

  }

  private SeleccionarTotal(){

    jQuery('#tablaAproFacturacion').DataTable().destroy()

    var form = this.state.form;

    this.state.Facturacion.forEach((val:any) => {
      form['chk'+val.ID] = !form['chk'+val.ID]
    });

    this.setState({
      form:[]
    },() => {
      this.setState({
        form:form,
        btnAllSelect: this.state.btnAllSelect == 'Seleccionar todo' ? 'Quiar seleccion' : 'Seleccionar todo'
      })
      this.IniciaTable('tablaAproFacturacion')
    });

  }

  private getFacturacionCantidadApro(idFacturacion:number, MesFacturacion:String){

    this.Helpers.loadingModal.show('Trabajando en ello...',()=>{

      this.Helpers.getListOverThreshold(
        'CargueFacturacion',
        '*,EncabezadoFacturacion/Id,Proveedor/Title,Usuario/Title',
        "EncabezadoFacturacion/Id eq " + idFacturacion,
        'EncabezadoFacturacion,Proveedor,Usuario',
      (res:any) => {

        var AuxRes = res.filter((x:any) => x.Estado === 'Cargada' && x.Operacion != 'BAJAS');

        if(AuxRes.length == 0){

          var totalFactura = res.reduce((a:any, b:any) => {
                  return a = a + (b.ValorTotal ? parseFloat(b.ValorTotal.replaceAll(',','')) : 0)
              }, 0)

          var TotalCantidad = res.reduce((a:any, b:any) => {
                return a = a + parseInt(b.Cant)
            }, 0)

          let dataO = {
            EstadoFlujoRevision:'Finalizado',
            RevisorId: this.state.currentUser.Id,
            EstadoFlujoAprobacion:'Autorizador1',
            ValorTotalFactura:this.currencyFormat(totalFactura ? totalFactura : 0, 2, ''),
            TotalCantidad:TotalCantidad.toString(),
            SOLPED:this.state.SOLPED ? this.state.SOLPED : '',
            OC:this.state.OC ? this.state.OC : '',
          }

          this.Helpers.updateItemList(
            'EncabezadoFacturacion',
            idFacturacion,
            dataO
          ).then((resU:any) => {

            this.setState({
              SOLPED : '',
              OC : ''
            });
            this.getEncabezados()
            this.cerrarModal()
  
          })

        }else{
          this.getEncabezados()
          this.cerrarModal()
         
        }
          this.Helpers.loadingModal.hide()
      })

    })
  }

  private aprobacionFacturacion(){

    var thisCurrent = this;

    if(this.state.SOLPED && this.state.OC){

      let form = this.state.form;

      this.Helpers.loadingModal.show('Trabajando en ello...',()=>{

        this.aprobacionFacturacionfull(0, this.state.Facturacion, form, function(result:any){

          thisCurrent.getFacturacionCantidadApro(thisCurrent.state.idFacturacion, thisCurrent.state.MesFacturacion)

        })
        
      });
      
    }else{
      alert('Se requiere número "SOLPED" y número "OC" para poder aprobar la facturación')
    }

  }


  // private async aprobacionFacturacionAux(){

  //   if(this.state.SOLPED && this.state.OC){

  //     let form = this.state.form;

  //     const result = await this.Helpers.updateItemList('CargueFacturacion', this.state.idFacturacion.Id,)
    
      
  //   }else{
  //     alert('Se requiere número "SOLPED" y número "OC" para poder aprobar la facturación')
  //   }

  // }


  private aprobacionFacturacionfull(pos:number, data:any, form:any, functionSuccess:any){
    
    let aprob = {
      Estado:form['chk'+data[pos].Id] ? 'Revisada - Sin Aprobación' : 'RECHAZADO',
    }
  
    this.Helpers.updateItemList('CargueFacturacion', data[pos].Id, aprob)
    .then((res:any) => {
      
      if(data.length - 1 == pos){
        functionSuccess(data.length)
      }else{
        this.aprobacionFacturacionfull(pos+1, data, form, functionSuccess)
      }

    })

  }

  private currencyFormat(num:number, decimals:number,type:String) {

    return type + num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

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
            "loadingRecords": "Trabajando en ello...",
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
      openModalFacturacion:false,
      btnAllSelect: 'Seleccionar todo' 
    })
  }

  private getFacturacionPend(Encabezados:any){
    
    jQuery('#tablaFacturacion').DataTable().destroy()

    var Operacion = this.state.OperacionAutorizador;

    Encabezados.forEach((element:any,i:number) => {

        this.Helpers.getListOverThreshold(
          'CargueFacturacion',
          '*,EncabezadoFacturacion/Id,Proveedor/Title,Usuario/Title',
          "EncabezadoFacturacion/Id eq " + element.Id,
          'EncabezadoFacturacion,Proveedor,Usuario',
        (result:any) => {

            var res = result.filter((x:any) => x.Estado == 'Cargada' &&
                                                x.Operacion == Operacion) 
            console.log(res)

            if(res.length == 0){
              element['Revisado'] = 'OK';
            }else{
              element['Revisado'] = 'Pendiente';
            }

            if(Encabezados.length-1 == i){

              this.setState({
                EncabezadoFacturacion:[],
                CargueFacturacion:[]
              },() =>{
                this.setState({
                  EncabezadoFacturacion:Encabezados,
                  CargueFacturacion:result
                },() =>{
                  this.IniciaTable('tablaFacturacion')
                  
                })
              })

            }
            
        });

    })

  }
  
}