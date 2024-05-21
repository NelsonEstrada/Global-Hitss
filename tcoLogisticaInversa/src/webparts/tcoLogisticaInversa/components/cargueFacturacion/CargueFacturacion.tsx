/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import 'office-ui-fabric-react/dist/css/fabric.css';
import styles from './CargueFacturacion.module.scss';
import { PrimaryButton } from '@fluentui/react';
import { Helpers } from "../utils/Helpers";

interface ICargueFacturacionProps{
  context:any;
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

/**

https://claromovilco.sharepoint.com/sites/SistematizacionDeActas/

Materiales

*/


export default class CargueFacturacion extends React.Component<ICargueFacturacionProps, any> {

  public Helpers: Helpers;
  public file: any;
  public fileName: string;
  
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
      ResumenFacturacion:[],
      idProveedor:0,
      ViewErrorFile:false,
      DataMateriales:[]
    }

  }

  componentWillMount(): void {

    this.Helpers.getCurrentUser()
    .then((res:any) => {
      this.setState({
        currentUser:res,
      }, ()=>{this.getProovedorForUser()})
    })

    if(this.props.urlSitioMateriales && this.props.ListaMateriales){
      this.Helpers.getItemsListExternal(
        this.props.urlSitioMateriales,
        this.props.ListaMateriales,
        '*',
        '',
        '',
        '',
      ).then((res:any) => {
    
        this.setState({
          DataMateriales:res,
        })
      })
    }

    this.Helpers.getItemsList(
      'Tarifas',
      '*,Proveedor/ID,Proveedor/Title',
      '',
      'Proveedor',
    ).then((res:any) => {
  
      this.setState({
        DataTarifas:res,
      })
    });

    var dataMeses = new Array();

    var today2 = new Date();
    today2.setMonth(today2.getMonth() - 2);
    dataMeses.push({
      MesFacturacion: this.Meses[today2.getMonth()].Mes + '/' + today2.getFullYear(), 
      MesServicio:this.Meses[today2.getMonth()].Mes
    })

    var today1 = new Date();
    today1.setMonth(today1.getMonth() - 1);
    dataMeses.push({
          MesFacturacion: this.Meses[today1.getMonth()].Mes + '/' + today1.getFullYear(), 
          MesServicio:this.Meses[today1.getMonth()].Mes
        })

    var today = new Date();
    dataMeses.push({
        MesFacturacion: this.Meses[today.getMonth()].Mes + '/' + today.getFullYear(), 
        MesServicio:this.Meses[today.getMonth()].Mes
      })

    this.setState({
      MesesFacturacion:dataMeses
    })

  }

  public mesSelect(mes:any){

    var m = this.state.MesesFacturacion.filter((x:any)=>x.MesFacturacion === mes)

    if(m.length > 0){
      this.setState({
        MesFacturacion:m[0].MesFacturacion,
        MesServicio:m[0].MesServicio
      })
    }
   
  }

  public render(): React.ReactElement<ICargueFacturacionProps>{
    return (
      <section>
        <div className="ms-Grid-col ms-md12 marginBottom10">
          <div className="ms-Grid-col ms-u-sm1 margin-top">
              <PrimaryButton 
                  text="Menú Principal" 
                  className={ styles.colorButton }
                  onClick={()=>this.props.regresar()}
                  />
                <PrimaryButton 
                  text="Eliminar" 
                  className="OcultarButton"
                  onClick={()=> {this.getFacturacionEliminada()}}
                  />
                   <input type="text" className="OcultarButton" onChange={(e)=>{ this.setState({deleteId:e.target.value})}} value={this.state.deleteId}/>
          </div>
        </div>
        
        <h2>Cargue Facturación</h2>

        <div className="ms-md12 marginBottom10">
            {this.state.idProveedor != 0 ? 
              this.state.DataMateriales && this.state.DataMateriales.length > 0 ? 
              <div className="ms-Grid-col ms-u-sm1 margin-top">
                  <PrimaryButton 
                      className={ styles.colorButton }
                      text="Cargue de Facturación"
                      onClick={()=> this.ModalCargueFacturacion()}            
                    /><br/><br/>
              </div>
              : <div><br/><br/>
                  <div><i>*Consultando recursos para permitir cargue de facturación, espere un momento...</i></div>
              </div>
            : <div><br/><br/>
                <div><i>*No tienes un proveedor asignado, no es posible hacer cargue de facturación</i></div>
              </div>
            }
        </div>

        {this.state.openModalCargue ? 
            <div id="modal">
              <div id="content-modalSolicitud" className="modal-Solicitud">
                <div id="data-modal">
                  <div id="encabezado">
                    <div id="logoApp"></div>
                    <div id="tituloApp">Carga Facturación</div>
                    <div id="closeApp">
                      <svg onClick={()=> this.cerrarModal()} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={"bi bi-x-lg margin5"} viewBox="0 0 16 16" >
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"></path>
                      </svg>
                    </div>
                  </div>
                  <div id="">
                    <div id="formDatos">

                    <div className="fila1" id="fProovedor">
                          <div className="nombreCampo">Proovedor</div>
                            <div className="campo">
                              <input type="text" disabled id="Proovedor" value={this.state.NombreProveedor}/>
                            </div>
                        </div>

                        <div className="fila1" id="fMesFacturación">
                          <div className="nombreCampo">Mes de facturación</div>
                          <div className="campo">
                            <select id="MesFacturación" onChange={(e) => { this.mesSelect(e.target.value) /*this.setState({MesFacturacion:e.target.value}) */}}>
                              <option value=""></option>
                              {this.state.MesesFacturacion && this.state.MesesFacturacion.length > 0 ?
                                this.state.MesesFacturacion.map((val:any, index:number)=>(
                                    <option value={val.MesFacturacion}>{val.MesFacturacion}</option>
                                ))
                              : null}
                            </select>
                            </div>
                        </div>

                        <div className="fila1" id="fMesFacturación">
                          <div className="nombreCampo">Seleccione el documento Excel a cargar.</div>
                          <div className="campo">
                            <input
                              type="file"
                              onInput={(e) => this.readFile(e)}
                            />
                            </div>
                        </div>

                        <div className="fila1" id="fMesFacturación">
                          <div className="nombreCampo">Adjunto</div>
                          <div className="campo">
                            <input
                              type="file"
                              onInput={(e) => this.uploadFileLibrary(e)}
                            />
                            </div>
                        </div>

                    </div>
                    <div className="ms-Grid-col ms-u-sm1 centerButtons">
                      <input className={styles.colorButton} type="button" value="Cancelar" onClick={()=> this.cerrarModal()}/>
                      <input className={styles.colorButton} type="button" value="Cargue Facturación" onClick={()=> this.validarInformacionCargue()}/>
                    </div>
                    {this.state.ViewErrorFile ? 
                    <div>
                      <h2>Errores en archivo facturación</h2>
                      <div id="ListError">
                                
                      </div>
                    </div>
                    :null}
                  </div>
                </div>
              </div>
            </div>
        : null}

        {this.state.openModalFacturacion ? 
            <div id="modal">
              <div id="content-modalSolicitud" className="modal-Solicitud">
                <div id="data-modal">

                  <div id="encabezado">
                    <div id="logoApp"></div>
                    <div id="tituloApp">Carga Masiva Usuario</div>
                    <div id="closeApp" onClick={()=> this.cerrarModal()} >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={"bi bi-x-lg margin5"} viewBox="0 0 16 16" >
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div className='content-modal'>
                    <h1>Facturación</h1>
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
                              <th>Usuario Registro</th>
                              <th>Fecha registro</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.Facturacion && this.state.Facturacion.length > 0 ?
                              this.state.Facturacion.map((val:any, index:number)=>(
                                <tr>
                                  <td title={val.ID} className='textRight'>{index+1}</td>
                                  <td  className='textCenter'>{val.MesFacturacion}</td>
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
                                  <td className='textRight'>{val.ValorUnitario ? '$ ' + val.ValorUnitario : 0}</td>
                                  <td className='textRight'>{val.ValorTotal ? '$ ' + val.ValorTotal : 0}</td>
                                  <td>{val.Familia}</td>
                                  <td>{val.MesServicio}</td>
                                  <td>{val.Operacion}</td>
                                  <td>{val.Reserva}</td>
                                  <td>{val.lote}</td>
                                  <td>{val.Usuario.Title}</td>
                                  <td>{val.FechaRegistro ? (new Date(val.FechaRegistro).getDate() + '/' + (new Date(val.FechaRegistro).getMonth()+1) ) +'/'+ new Date(val.FechaRegistro).getFullYear() : ''}</td>
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
                    <div id="sec-btn">
                      <input className={styles.colorButton} type="button" value="Cerrar" onClick={()=> this.setState({ openModalFacturacion:false })}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        : null}

        <div className="table-responsive">
          <table id="tablaFacturacion" className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mes de Facturación</th>
                  <th>Proveedor</th>
                  <th>Estado</th>
                  <th>Operacion</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {this.state.ResumenFacturacion && this.state.ResumenFacturacion.length > 0 ?
                  this.state.ResumenFacturacion.map((val:any, index:number)=>(
                    <tr>
                      <th>{val.ID}</th>
                      <td>{val.MesFacturacion}</td>
                      <td>{val.Proveedor != null ? val.Proveedor.Title : ''}</td>
                      <td>{val.EstadoFlujoRevision}</td>
                      <td>
                        {val.Operacion1 ? val.Operacion1 + ', ' : ''}
                        {val.Operacion2 ? val.Operacion2 + ', ' : ''}
                        {val.Operacion3 ? val.Operacion3 + ', ' : ''}
                      </td>
                      <td className='marginRight10'>
                        <input className={styles.colorButton} type="button" value="Ver Facturación" onClick={()=> this.getFacturacion(val.ID)}/>
                        {val.EstadoFlujoRevision == 'Registrada' ?
                          <input className={styles.colorButton} type="button" value="Registrar y Reportar Facturación" onClick={()=> this.ReportarFacturacion(val.ID)}/>
                        :null}
                        
                        {val.EstadoFlujoRevision == 'Registrada' ?
                          <input className={styles.colorButton} type="button" value="Rechazar Facturación" onClick={()=> this.AnularFacturacion(val.ID)}/>
                        :null}
                        
                      </td>
                    </tr>
                  ))
                :null}
              </tbody>
          </table>
        </div>
      </section>
    );
  }

  private uploadFileLibrary(ev:any){
    if(ev) {
        let file: File = ev.target.files[0];
        this.file = file;
        this.fileName = file.name;
    }else{
        this.file = null;
    }
  }

  private UploadFiles(Library:string, file:any, nameFile:string, id:number){

    let fields = {
      EncabezadoFacturacionId: id
    }

    this.Helpers.uploadFileWithFields(Library, file, nameFile, fields)
        .then(result => {
          this.createdDataFacturacion(id);
       })

 }
  
  private ReportarFacturacion(idFactura:number){

    jQuery('#tablaFacturacion').DataTable().destroy();

    let dataO = {
      EstadoFlujoRevision:'Cargada',
    }

    this.Helpers.updateItemList(
      'EncabezadoFacturacion',
      idFactura,
      dataO
    ).then((res:any) => {
      this.getEncabezados();
    });

  }

  private AnularFacturacion(idFactura:number){

    jQuery('#tablaFacturacion').DataTable().destroy();

    let dataO = {
      EstadoFlujoRevision:'Rechazada',
    }

    this.Helpers.updateItemList(
      'EncabezadoFacturacion',
      idFactura,
      dataO
    ).then((res:any) => {
      this.getEncabezados();
    });

  }

  private getEncabezados(){

    jQuery('#tablaFacturacion').DataTable().destroy();

    var filter = '';
    if(this.state.RolUser == 'Rol Proveedor Logistica Inversa' && this.state.idProveedor != 0){
      filter = 'Proveedor/ID eq ' + this.state.idProveedor
    }

    this.Helpers.getItemsList(
      'EncabezadoFacturacion',
      '*,Proveedor/ID,Proveedor/Title',
      filter,
      'Proveedor',
      {property : "ID", asc:false}
    ).then((res:any) => {
  
      this.setState({
        ResumenFacturacion:res,
      },() =>{
        this.IniciaTable('tablaFacturacion','desc')
        
      });
    });
  }

  private getProovedorForUser(){
    this.Helpers.getItemsList(
      'Usuarios',
      '*,Proveedor/ID,Proveedor/Title,Rol/Title',
      'Usuario/ID eq '+this.state.currentUser.Id,
      'Proveedor,Rol',
    ).then((res:any) => {
  
      if(res.length > 0){
        
        this.setState({
          idProveedor:res[0].ProveedorId ? res[0].Proveedor.ID : 0,
          NombreProveedor:res[0].ProveedorId != null? res[0].Proveedor.Title : 'Proveedor sin nombre',
          RolUser:res[0].RolId != null? res[0].Rol.Title : 'Sin rol'
        },() => { 
          this.getEncabezados() 
        });
      }
    })
  }

  private IniciaTable(tableName:string, order:string){

    jQuery('#'+tableName).DataTable({
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
        order: [[0, order]]
    });
  }

  private cerrarModal(){
    this.setState({
      openModalCargue:false,
      openModalFacturacion:false
    })
  }

  private ModalCargueFacturacion(){
    this.setState({
      openModalCargue:true
    })
  }
  
  private readFile(e:any){
    this.setState({
      file:e
    })
  }

  public numeroAFecha(numeroDeDias:any) {
    return new Date((numeroDeDias - 25568) * 86400 * 1000);
  }

  private validarInformacionCargue(){
      var ErroresAll = ''

      this.Helpers.loadingModal.show('Trabajando en ello...',()=>{
        console.log('Prueba')
      });

      this.Helpers.readFile(this.state.file,(data:any) => {
  
          data.splice(0, 1);
  
          data.forEach((val:any, i:number) => {
  
            if(val.length > 0){

              var ErroresAux = ''
              var c = 0;

              val[0] = this.numeroAFecha(val[0])
              val[0] = new Date(val[0]).toISOString()

              if(this.state.idProveedor == 0){
                ErroresAux += '<div>- El usuario actual no tiene un proveedor asociado</div>'
                c++
              }
    
              var auxMateriales = this.state.DataMateriales.filter((x:any) => x.codigo_sap == val[1])
              if(auxMateriales.length == 0){
                ErroresAux += '<div>- Codigo no existe en lista de materiales</div>'
                c++
              }
    
              if(val[2].toString().substring(0,2) != '49'){
                ErroresAux += '<div>- El numero de documento de entrada no valido</div>'
                c++
              }
    
            var auxTarifas = this.state.DataTarifas.filter((x:any) => x.CodigoTarifa == val[9] && x.ProveedorId == this.state.idProveedor);
              if(auxTarifas.length== 0){
                ErroresAux += '<div>- Codigo de tarifa no existe</div>'
                c++
              }
    
              if(val[11].toString() != "PRODUCCIÓN" &&
                val[11].toString() != "RETRIVAL" &&
                val[11].toString() != "BAJAS" &&
                val[11].toString() != "OTRO"){
                  ErroresAux += '<div>- El tipo de operacion no valido</div>'
                  c++;
              }
    
              if(val[12].toString().substring(0,1) != '4'){
                ErroresAux += '<div>- El numero de reserva no valido</div>'
                c++
              }
    
              if(val[13].toString() != "VALORADO" &&
                val[13].toString() != "NOVALORADO"){
                  ErroresAux += '<div>- El lote no valido</div>'
                  c++
              }
    
              if(c > 0){
                ErroresAll += '<strong><div>Inconsistencias en el Codigo SAP:'+ val[1] +'</div></strong>  <br/>' + ErroresAux + '<br/>'
              }

          }
  
          })
  
          if(ErroresAll == ''){
  
            this.setState({
              dataFile:data,
              ListError:ErroresAll
            },()=>{
              this.createdEncabezadoFacturacion()
            })
  
          }else{
            this.setState({
              ViewErrorFile:true
            },()=>{
              jQuery('#ListError').append(ErroresAll)
            })
            this.Helpers.loadingModal.hide();
            
          }
      })
  }

  private createdEncabezadoFacturacion(){

    jQuery('#tablaFacturacion').DataTable().destroy()

    var data = {
      MesFacturacion:this.state.MesFacturacion,
      ProveedorId:this.state.idProveedor,
      EstadoFlujoRevision:'Registrada'
    }

    this.Helpers.insertItemList(
      'EncabezadoFacturacion',
      data
    ).then((res:any) => {
      if(this.file){
        this.UploadFiles('BibliotecaFacturacion', this.file, this.fileName, res.ID);
      }else{
        this.createdDataFacturacion(res.ID);
      }
      
    })

  }

  private createdDataFacturacion(idEncabezado:number){

        var dataFacturacion = new Array();
        var dataOperacion = new Array();
        var CantTotal: number = 0;
        var ValorTotalFull: number = 0;

        this.state.dataFile.forEach((val:any) => {

          var auxMateriales = this.state.DataMateriales.filter((x:any) => x.codigo_sap == val[1])

          var Descrip,UM = '';

          if(auxMateriales.length > 0){
            Descrip = auxMateriales[0].Nombre_articulo;
            UM = auxMateriales[0].UMB
          }

          var auxTarifas = this.state.DataTarifas.filter((x:any) => x.CodigoTarifa == val[9] && x.Proveedor.ID == this.state.idProveedor)
          var Labor = '';
          var ValorUnitario,ValorTotal=0;

          if(auxTarifas.length > 0){
            ValorUnitario = auxTarifas[0].ValorUnitario;
            ValorTotal = parseFloat(auxTarifas[0].ValorUnitario) * parseInt(val[4])
            Labor = auxTarifas[0].Labor
          }

          let auxData = {
            EncabezadoFacturacionId:idEncabezado,
            FechaDiagnostico: val[0],
            MesFacturacion:this.state.MesFacturacion,
            ProveedorId:this.state.idProveedor,
            Codigo:val[1].toString(),
            DescripcionMaterial:Descrip,
            UM:UM,
            DocumentoEntrada:val[2].toString(),
            Carpeta:val[3].toString(),
            Cant:val[4].toString(),
            CentroDestino:val[5].toString(),
            BodegaSapDestino:val[6].toString(),
            DestinoPedido:val[7].toString(),
            DescripcionFacturacion:val[8].toString(),
            CodigoTarifa:val[9].toString(),
            ValorUnitario:this.currencyFormat(parseFloat(ValorUnitario ? ValorUnitario : 0), 2, ''),
            ValorTotal:this.currencyFormat(ValorTotal ? ValorTotal : 0, 2, ''),
            Familia:val[10].toString(),
            MesServicio:this.state.MesServicio.toString(),
            Operacion:val[11].toString(),
            Reserva:val[12].toString(),
            lote:val[13].toString(),
            Labor:Labor.toString(),	
            UsuarioId:this.state.currentUser.Id,
            FechaRegistro: new Date().toISOString(),
            Estado:'Cargada'
          }

          var ao = dataOperacion.filter(x => x.Operacion == val[11].toString())

          if(ao.length == 0){
            var operacion = {
              Operacion: val[11].toString()
            }
            dataOperacion.push(operacion)
          }

          CantTotal = CantTotal + parseInt(val[4])
          ValorTotalFull = ValorTotalFull + ValorTotal
          dataFacturacion.push(auxData)

        });

        if(dataOperacion.length > 0){

          let dataO = {
            Operacion1:dataOperacion[0] ? dataOperacion[0].Operacion : '',
            Operacion2:dataOperacion[1] ? dataOperacion[1].Operacion : '',
            Operacion3:dataOperacion[2] ? dataOperacion[2].Operacion : '',
          }

          this.Helpers.updateItemList(
            'EncabezadoFacturacion',
            idEncabezado,
            dataO
          ).then((res:any) => {
           
          })

        }

        this.setState({
          dataFile:dataFacturacion,
          ValorTotal:ValorTotalFull,
          Cant: CantTotal
        },() =>{
          this.saveFacturacionEach(idEncabezado,0)
          //this.saveFacturacion()
        })
     
  }

  private currencyFormat(num:number, decimals:number,type:String) {

    return type +' '+ num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

  }

  private saveFacturacionEach(idEncabezado:number,pos:number){

    this.Helpers.insertItemList('CargueFacturacion', this.state.dataFile[pos]).then(()=>{
      if(this.state.dataFile.length - 1 == pos){
        this.FinSaveFacturacion(idEncabezado)
      }else{
        this.saveFacturacionEach(idEncabezado,pos+1)
      }

    }).catch((error:any)=>{
      console.log(error)
      this.saveFacturacionEach(idEncabezado,pos+1)
    })    

  }

  private FinSaveFacturacion(idEncabezado:number){
   
    this.cerrarModal();
    this.getEncabezados();
    this.Helpers.loadingModal.hide();

    alert('Finalizo la carga \n\n'+
          '- Número de Registros: '+ this.currencyFormat(parseFloat(this.state.dataFile.length), 0, '') +' \n'+
          '- Total de Unidades: '+this.currencyFormat(parseFloat(this.state.Cant), 0, '')+' \n'+
          '- Valor Total: '+ this.currencyFormat(parseFloat(this.state.ValorTotal), 2, '$') +' \n\n'+
          '- Codigo facturación: '+ idEncabezado +' \n\n');

  }

  private getFacturacion(idFacturacion:number){

    this.Helpers.loadingModal.show('Trabajando en ello...',()=>{

      this.Helpers.getListOverThreshold(
        'CargueFacturacion', 
        '*,EncabezadoFacturacion/Id,Proveedor/Title,Usuario/Title',
        'EncabezadoFacturacion/Id eq ' + idFacturacion,
        'EncabezadoFacturacion,Proveedor,Usuario',
        (result:any)=>{

        var array = new Array();

        var res = result.filter((x:any) => x.EncabezadoFacturacion.Id === idFacturacion)

        res.forEach((val:any) => {

          array.push({
            'Fecha':val.MesFacturacion,
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
          
          this.IniciaTable('tablaAproFacturacion', 'asc');
          this.AdjuntosFacturacion(idFacturacion);
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

  private getFacturacionEliminada(){

    this.Helpers.getListOverThreshold(
      'CargueFacturacion', 
      '*,EncabezadoFacturacion/Id,Proveedor/Title,Usuario/Title',
      "EncabezadoFacturacion/Id eq " + this.state.deleteId,
      'EncabezadoFacturacion,Proveedor,Usuario',
    (result:any) => {
      
      this.eliminar(0, result)
    })

  }

  private eliminar(pos:number, data:any){
    this.Helpers.deleteItemList('CargueFacturacion', data[pos].ID).then((res:any) => {
      this.eliminar(pos+1, data)
    })
  }

}
