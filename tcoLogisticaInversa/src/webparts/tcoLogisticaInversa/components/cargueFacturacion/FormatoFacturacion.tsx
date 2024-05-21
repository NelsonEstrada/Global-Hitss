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

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

interface IFormatoFacturacionProps{
  context:any;
  urlSitioMateriales:string;
  ListaMateriales:string;
  regresar?:()=>any;
  getData?:()=>any;
}

import '../../assets/css/style.css';
import '../../assets/css/dataTables.css';

//import * as jQuery from '$'; 
const jQuery = require('jquery'); 


import 'DataTables.net';


interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

export default class FormatoFacturacion extends React.Component<IFormatoFacturacionProps, any> {

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
      form:{},
      SOLPED:'',
      Proveedor:''
    }
    
  }

  componentWillMount(): void {

    this.Helpers.getCurrentUser()
    .then((res:any) => {

      console.log(res)

      this.setState({
        currentUser:res,
      }, ()=>{
        this.getProovedorForUser()
      })
    })

  }

  public render(): React.ReactElement<IFormatoFacturacionProps>{

    return (
      <section>
        <div className="ms-Grid-col ms-md12 marginBottom10">
            <div className="ms-Grid-col ms-u-sm1 margin-top">
                <PrimaryButton 
                    text="Menú principal"
                    className={styles.colorButton}
                    onClick={()=>this.props.regresar()}
                    />
            </div>
        </div>
 
            <h2>Formato Facturación</h2>
            <div className="table-responsive">
              <table id="tablaFormatoFacturacion" className="table  table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Mes de Facturación</th>
                      <th>Proveedor</th>
                      <th>Revisor</th>
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
                          <td>{val.Proveedor.Title}</td>
                          <td>{val.RevisorId ? val.Revisor.Title : ''}</td>
                          <td>{val.EstadoFlujoAprobacion}</td>
                          <td>
                            <input className={styles.colorButton} type="button" value="Ver formato" onClick={()=> this.getFacturacion(val)}/>
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
                        <div id="tituloApp">Resumen de facturación {this.state.MesFacturacion}</div>
                        <div id="closeApp" onClick={()=> this.cerrarModal()} >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={"bi bi-x-lg margin5"} viewBox="0 0 16 16" >
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className='content-modal'>

                      {this.state.EstadoFlujoAprobacion != 'Finalizado' ? 
                        <>
                        
                        <table id="tablePDFHead" className='noBorder'>
                          <thead>
                              <tr>
                                <td className='tdCenter'>
                                  <strong>RESUMEN DE FACTURACIÓN</strong>
                                <br/>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td><strong>SOLPED: {this.state.SOLPED}</strong></td>
                              </tr>
                              <tr>
                                <td><strong>PROVEEDOR: {this.state.Proveedor}</strong></td>
                              </tr>
                              <tr>
                                <td><strong>MES SERVICIO: {this.state.MesFacturacion}</strong></td>
                              </tr>
                            </tbody>
                        </table>
                        <br/>

                        {this.state.dataFacturacion && this.state.dataFacturacion.length > 0 ?
                              this.state.dataFacturacion.map((vali:any, i:number)=>(
                                <>
                                  <table id={"tablaAproFacturacion"+vali[1]} className="tablaAproFacturacion table table-striped table-bordered">
                                      <thead>
                                        <tr>
                                          <th colSpan={5}>{vali[0]}</th>
                                        </tr>
                                        <tr>
                                          <th>Descripcion de material</th>
                                          <th>Proceso</th>
                                          <th>Vlr Unitario</th>
                                          <th>Cant</th>
                                          <th>Valor Total</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {vali[2] && vali[2].length > 0 ?
                                          vali[2].map((val:any, index:number)=>(
                                            <tr>
                                              <td>{val.Familia}</td>
                                              <td>{val.Labor}</td>
                                              <td className='tdRight'>{'$ ' + val.ValorUnitario}</td>
                                              <td className='tdRight'>{this.currencyFormat(parseFloat(val.Cant), 0, '')}</td>
                                              <td className='tdRight'>{'$ ' + val.ValorTotal}</td>
                                            </tr>
                                          ))
                                        
                                        :null}
                                      </tbody>
                                      <tfoot>
                                        <tr>
                                          <td colSpan={3}>TOTAL {vali[0]}</td>
                                          <td className='tdRight'>{this.currencyFormat(parseFloat(this.state['CantFull'+i]), 0,'')}</td>
                                          <td className='tdRight'>{this.currencyFormat(parseFloat(this.state['ValorTotalFull'+i]), 2, '$')}</td>
                                        </tr>
                                      </tfoot>
                                  </table>
                                  <br/>
                                </>
                              ))
                        :null}
                        
                        <table id="tablePDFFoot" className="tablaAproFacturacion table table-striped table-bordered">
                            <tbody>
                              <tr>
                                <td colSpan={4} className='fondoColor'>Total</td>
                                <td className='tdRight fondoColor' colSpan={1}>{this.state.TotalCantidad}</td>
                                <td className='tdRight fondoColor' colSpan={1}>{'$ ' + this.state.ValorTotalFactura}</td>
                              </tr>
                              <tr>
                                <td colSpan={1}>CONTRATO MARCO</td>
                                <td colSpan={1}>{this.state.NumeroContrato}</td>
                                <td colSpan={1}></td>
                                <td colSpan={3} className='fondoColor'></td>
                              </tr>
                              <tr>
                                <td colSpan={1}>VALOR TOTAL</td>
                                <td className='tdRight' colSpan={1}>{this.currencyFormat(parseFloat(this.state.ValorContratoMarco ? this.state.ValorContratoMarco : 0), 2, '$')}</td>
                                <td colSpan={1}></td>
                                <td colSpan={2} className='fondoColor'>Total</td>
                                <td className='tdRight fondoColor' colSpan={1}>{'$ ' + this.state.ValorTotalFactura }</td>
                              </tr>
                              <tr>
                                <td colSpan={1}>VALOR EJECUTADO</td>
                                <td className='tdRight' colSpan={1}>{this.currencyFormat(parseFloat(this.state.ValorEjecutadoCM ?this.state.ValorEjecutadoCM : 0), 2, '$')}</td>
                                <td colSpan={4}></td>
                              </tr>
                              <tr>
                                <td colSpan={1}>VALOR DISPONIBLE</td>
                                <td className='tdRight' colSpan={1}>{this.currencyFormat(parseFloat(this.state.ValorDisponibleCM ? this.state.ValorDisponibleCM : 0), 2, '$')}</td>
                                <td colSpan={4}></td>
                              </tr>
                            </tbody>
                        </table>

                        <br/>

                       
                          <table id="tablePDFAprobacion" className='noBorder'> 
                              
                              <tbody>
                                
                              {this.state.Autorizadores && this.state.Autorizadores.length > 0 ?
                                  this.state.Autorizadores.map((vali:any, index:number)=>(
                                    <>
                                    <tr>
                                        {vali.map((val:any, index:number)=>(
                                          <td>
                                            <strong>{val.FirmadoPor}<br/>
                                            {val.FechaFirma}</strong>
                                          </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        {vali.map((val:any, index:number)=>(
                                          <td>
                                            ___________________________________<br/>
                                            {/*val.Usuario*/}<br/>
                                            {val.Cargo}<br/>
                                            <br/>
                                          </td>
                                        ))}
                                    </tr>
                                    </>
                                  ))
                                  
                              :null}
                            </tbody>
                          </table>
                        </>
                          
                        : 
                        
                        <>
                          <iframe src={this.state.ServerRelativeUrl} width="100%" height="600px"></iframe>
                          <br/>
                          <a href={this.state.ServerRelativeUrl} download>{this.state.NameFile}</a>
                        </>

                      }
                        

                        <div className="ms-Grid-col ms-u-sm1 centerButtons">
                          <input className={styles.colorButton} type="button" value="Cancelar" onClick={()=> this.cerrarModal()}/>
                          
                          {this.state.EstadoFlujoAprobacion != 'Finalizado' ? 
                            <input className={styles.colorButton} type="button" value="Generar reporte" onClick={()=> this.generatePDF(false)}/>
                          :null}

                          {this.state.enableAutorizar ?
                            <input className={styles.colorButton} type="button" value="Aprobar" onClick={()=> this.AprobarAutorizador()}/>
                          :null}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            : null}
      </section>
    );

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
        },() => { this.getEncabezados() });
      }
    })
  }

  private getEncabezados(){

    jQuery('#tablaFormatoFacturacion').DataTable().destroy()

    var filter = "EstadoFlujoRevision eq 'Finalizado'";
    if(this.state.RolUser == 'Rol Proveedor Logistica Inversa' && this.state.idProveedor != 0){
      filter = filter + 'and Proveedor/ID eq ' + this.state.idProveedor
    }

    this.Helpers.getItemsList(
      'EncabezadoFacturacion',
      '*,Proveedor/Title,Revisor/Title,Proveedor/ID',
      filter,
      'Proveedor,Revisor',
    ).then((res:any) => {
  
      var data = res.filter((x:any) => x.EstadoFlujoRevision == 'Finalizado')

      this.setState({
        EncabezadoFacturacion:[],
        allEncabezadosFacturacion:[]
      },() =>{
        this.setState({
          EncabezadoFacturacion:data,
          allEncabezadosFacturacion:res,
          enableAutorizar:false
        },() =>{
          this.IniciaTable()
        })
      })
    })
  }

  private getAutorizadorForUser(){
    
    this.Helpers.getItemsList(
      'Usuarios',
      '*,Proveedor/ID,Proveedor/Title,Usuario/ID,Usuario/Title,Rol/Title',
      "Rol/Title eq 'Rol Autorizador Resumen Facturacion' && Eleccion ne null",// and ProveedorId eq "+ this.state.ProveedorId,
      'Proveedor,Usuario,Rol',
      {property : "Eleccion", asc:true}
    ).then((res:any) => {
  
      var array = new Array()
      var array2 = new Array()

      var b = 0;

      for(var i = 0; i < 5; i++){
        var firma = this.state.EncabezadoFactura['Autorizador'+(i+1)] ? this.state.EncabezadoFactura['Autorizador'+(i+1)].split('|') : ''

        array2.push({FirmadoPor: firma[0] ? firma[0] : '',
                     FechaFirma: firma[1] ? firma[1] : '',
                     Cargo:'Autorizador '+(i+1)
                    })

        b++;
        if(b == 2 || 4 == i){
          array.push(array2)
          array2 = []
          b = 0;
        }
      }

      this.setState({
        Autorizadores:array
      })

      if(this.state.EstadoFlujoAprobacion == 'Autorizador1'){
        res = res.filter((x:any) => x.ProveedorId == this.state.ProveedorId)
      }

      var auto = res.filter((x:any) => x.Eleccion == this.state.EstadoFlujoAprobacion && 
                                        x.Usuario.ID == this.state.currentUser.Id)
      if(auto.length > 0){
        this.setState({
          enableAutorizar:true,
        })
      }

    })
  }

  private AprobarAutorizador(){
    
    var estado='';
    var auxAuto = this.state.EstadoFlujoAprobacion.replace('Autorizador','')

    if(auxAuto == '5'){
      estado='Finalizado'
    }else{
      estado='Autorizador' + (parseInt(auxAuto)+1)
    }

    let dataO = {
      EstadoFlujoAprobacion:estado,
      [this.state.EstadoFlujoAprobacion]:this.state.currentUser.Title +"|"+ new Date().toISOString()
    }

    this.Helpers.updateItemList(
      'EncabezadoFacturacion',
      this.state.idFacturacion,
      dataO
    ).then((resU:any) => {

      if(estado=='Finalizado'){
        this.generatePDF(true)
        
      }else{
        alert('Su aprobación quedo registrada.')
        this.getEncabezados()
        this.cerrarModal()
      }

    })

  }

  private getFacturacion(idItem:any){

      this.Helpers.getListOverThreshold(
        'CargueFacturacion', 
        '*,EncabezadoFacturacion/Id,Proveedor/Title,Usuario/Title',
        "EncabezadoFacturacion/Id eq "+ idItem.Id,
        'EncabezadoFacturacion,Proveedor,Usuario',
      (result:any) => {

        var res = result.filter((x:any) => x.Estado == 'Revisada - Sin Aprobación')
    
        var data = this.agrupar(res,'Carpeta')
        var auxData = new Array()

        data.forEach((val:any,i:number) => {

          var data2 = this.agrupar(val[2],'Familia')

          var auxVal = new Array()

          data2.forEach((valF:any,f:number) => {

            var data3 = this.agrupar(valF[2],'Labor')

              data3.forEach((valL:any,j:number) => {

                var cantInter = 0;
                var valorTotalInter = 0;
                var valorInter = 0;
                
                valL[2].forEach((valL2:any,j:number) => {
            
                  cantInter = cantInter + parseInt(valL2.Cant)
                  valorInter = valorInter + parseFloat(valL2.ValorUnitario.replaceAll(',',''))
                  var total = parseFloat(valL2.ValorUnitario.replaceAll(',','')) * parseInt(valL2.Cant)

                  valorTotalInter = valorTotalInter + total
                  
                });

                valorInter = valorInter / valL[2].length;

                auxVal.push({
                    Labor: valL[0],
                    Familia: valF[0],
                    ValorUnitario: this.currencyFormat(valorInter, 2, ''),
                    Cant: cantInter,
                    ValorTotal: this.currencyFormat(valorTotalInter, 2, '')
                  })
              
              });

            })

         auxData.push([val[0], val[1], auxVal])

        });

        auxData.forEach((val:any,i:number) => {
          
          var cant = 0
          var valorTotal = 0
       
          val[2].forEach((valj:any,j:number) => {
          
            cant = cant + parseInt(valj.Cant)
            valorTotal = valorTotal + parseFloat(valj.ValorTotal.replaceAll(',',''))
          
          });

          this.setState({
            ['CantFull'+i]:cant,
            ['ValorTotalFull'+i]:valorTotal
          })

        });



        this.setState({
            Facturacion:[],
            dataFacturacion: auxData
        },() => {
          this.setState({
            Facturacion:res,
            idFacturacion: idItem.Id,
            Revisor:idItem.RevisorId,
            MesFacturacion: idItem.MesFacturacion,
            ValorTotalFactura:idItem.ValorTotalFactura,
            SOLPED:idItem.SOLPED,
            Proveedor:idItem.Proveedor.Title,
            ProveedorId:idItem.Proveedor.ID,
            TotalCantidad:idItem.TotalCantidad,
            EstadoFlujoAprobacion:idItem.EstadoFlujoAprobacion,
            openModalFacturacion:true,
            EncabezadoFactura:idItem
          },()=>{
            this.consultarPDFFacturacion(idItem.Id);
            this.getAutorizadorForUser();
            this.contratoMarco()
            this.Helpers.loadingModal.hide()
          })
        });

      })

  }

  private consultarPDFFacturacion(idItem:number){

    this.Helpers.getItemsList(
      'ResumenFacturacion',
      '*,EncabezadoFacturacion/Id',
      "EncabezadoFacturacion/Id eq "+ idItem,
      'EncabezadoFacturacion,File',
    ).then((res:any) => {

      console.log(res)

      if(res.length > 0){

        this.setState({
          ServerRelativeUrl:res[0].File.ServerRelativeUrl,
          NameFile:res[0].File.Name
        })

      }else{
        this.setState({
          ServerRelativeUrl:'',
          NameFile:''
        })
      }

    })

  }

  private contratoMarco(){

    this.Helpers.getItemsList(
      'ContratoMarco',
      '*,Proveedor/Id,Proveedor/Title',
      "Proveedor/Id eq "+  this.state.ProveedorId +" and Estado eq 'Vigente'",
      'Proveedor',
      {property : "ID", asc:false},
      1
    ).then((res:any) => {

      var data = this.state.allEncabezadosFacturacion.filter((x:any) => x.EstadoFlujoAprobacion == 'Finalizado' && 
                                                                        x.Proveedor.Id == this.state.ProveeedorId)
                           
      var ValorTotalFactura = 0;
                                                                      
      data.forEach((val:any) => {
        ValorTotalFactura = ValorTotalFactura + parseFloat(val.ValorTotalFactura)
      });

      if(res.length > 0){
        console.log(res[0].NumeroContrato) 
      }

      this.setState({
        NumeroContrato: res[0].NumeroContrato,
        ValorContratoMarco: res[0].Valor,
        ValorEjecutadoCM: ValorTotalFactura,
        ValorDisponibleCM: res[0].Valor - ValorTotalFactura
      });
    });
  }

  private agrupar(arrayRespuesta:any,column:any){

    let nuevoObjeto = new Array()

    arrayRespuesta.forEach((x:any) => {

      var pos = nuevoObjeto.map(e => e[0]).indexOf(x[column]);

      if(pos < 0){
        nuevoObjeto.push([x[column],x.ID,[]])
      }

      const pos2 = nuevoObjeto.map(e => e[0]).indexOf(x[column]);

      nuevoObjeto[pos2][2].push({
        Labor: x.Labor,
        Familia: x.Familia,
        ValorUnitario: x.ValorUnitario,
        Cant: x.Cant,
        ValorTotal: x.ValorTotal
      })

    })

    return nuevoObjeto;

  }

  private currencyFormat(num:number, decimals:number,type:String) {

    return type +' '+ num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

  }

  private generatePDF(bool:boolean){

      const doc = new jsPDF('portrait', 'mm', 'a4') as jsPDFCustom;
  
      doc.autoTable({
        html: '#tablePDFHead',
        styles: { cellWidth: 'wrap', cellPadding: 1, fontSize: 7 },
        bodyStyles: { cellPadding:{ top:2, bottom:2, left: 3, right:3 } },
        margin:{ right: 5, left:9, top:5},
        theme: 'plain',
  
        tableWidth:"wrap",
        columnStyles: {
          0: {cellWidth: 192}
        },
        didParseCell : (data) => {      
  
          if(data.section==='head'){
            
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.textColor = '000 ';
                data.cell.styles.lineColor = '000';
                data.cell.styles.halign='center';
                data.cell.styles.fontSize = 10;
          }

          if(data.section==='body'){
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.textColor = '000 ';
                data.cell.styles.lineColor = '000';
                data.cell.styles.fontSize = 8;
          }

        } 
  
      });
  
      this.state.dataFacturacion.forEach((val:any) => {
          
        doc.autoTable({
          html: '#tablaAproFacturacion'+val[1],
          styles: { cellWidth: 'wrap', cellPadding: 1, fontSize: 7, lineColor: '000'},
          bodyStyles: { cellPadding:{ top:2, bottom:2, left: 2, right:2 } },
          footStyles: { cellPadding:{ top:2, bottom:2, left: 2, right:2 } },
          margin:{ right: 5, left:7},
          theme: 'grid',
    
          tableWidth:"wrap",
          columnStyles: {
            0: {cellWidth: 44},
            1: {cellWidth: 37},
            2: {cellWidth: 37},
            3: {cellWidth: 37},
            4: {cellWidth: 37}
          },
          didParseCell : (data) => {      
    
            if(data.section==='head'){
                    data.cell.styles.fillColor = 'e03224';
                    data.cell.styles.textColor = 'fff ';
                    data.cell.styles.halign='center';
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.lineColor = 'fff';
            }

            if(data.section==='body'){

                if(data.column.index===2 || data.column.index===3 || data.column.index===4){
                    data.cell.styles.halign='right';
                }

            }

            if(data.section==='foot'){
              data.cell.styles.fillColor = 'e3e3e3';
              data.cell.styles.textColor = '000 ';
              data.cell.styles.fontStyle = 'bold';

              if(data.column.index===2 || data.column.index===3 || data.column.index===4){
                  data.cell.styles.halign='right';
              }

            }

          }
        });
      
      })

      doc.autoTable({
        html: '#tablePDFFoot',
        styles: { cellWidth: 'wrap', cellPadding: 1, fontSize: 7, lineColor: '000'},
        bodyStyles: { cellPadding:{ top:2, bottom:2, left: 3, right:3 } },
        margin:{ right: 5, left:7, top:5},
        theme: 'grid',
  
        tableWidth:"wrap",
        columnStyles: {
          0: {cellWidth: 42},
          1: {cellWidth: 30},
          2: {cellWidth: 30},
          3: {cellWidth: 30},
          4: {cellWidth: 30},
          5: {cellWidth: 30}
        },
        didParseCell : (data) => {      
  
          if(data.section==='body'){

            if(data.row.index===0){
              data.cell.styles.fillColor = 'e03224';
              data.cell.styles.textColor = 'fff ';
              data.cell.styles.fontStyle = 'bold';
              if(data.column.index===4 || data.column.index===5){
                data.cell.styles.halign='right';
               
              }
            }

            if(data.row.index===1){

              data.cell.styles.fontStyle = 'bold';

              if(data.column.index===3 || data.column.index===4 || data.column.index===5){
                data.cell.styles.fillColor = 'e03224';
                data.cell.styles.textColor = 'fff ';
                
              }
            }

            if(data.row.index===2){
              
              if(data.column.index===1 || data.column.index===5){
                data.cell.styles.halign='right';
                data.cell.styles.fontStyle = 'bold';
              }

              if(data.column.index===3 || data.column.index===4 || data.column.index===5){
                data.cell.styles.fillColor = 'e03224';
                data.cell.styles.textColor = 'fff ';
                data.cell.styles.fontStyle = 'bold';
              }
            }

            if(data.row.index===3 || data.row.index===4){
              
              if(data.column.index===1){
                data.cell.styles.halign='right';
                data.cell.styles.fontStyle = 'bold';
              }
            }
          }     
        }
      });

      doc.autoTable({
        html: '#tablePDFAprobacion',
        styles: { cellWidth: 'wrap', cellPadding: 1, fontSize: 7 },
        bodyStyles: { cellPadding:{ top:2, bottom:2, left: 3, right:3 } },
        margin:{ right: 5, left:9, top:5},
        theme: 'plain',
  
        tableWidth:"wrap",
        columnStyles: {
          0: {cellWidth: 96},
          1: {cellWidth: 96},
        },
        didParseCell : (data) => {      
  
          
          if(data.section==='body'){

            if(data.row.index===0 || data.row.index===2 || data.row.index===4){
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.textColor = '000 ';
            }

            data.cell.styles.fontSize = 8;
          } 
        }
      });

      var MesFact = this.state.MesFacturacion.replace('/','');

      let nameFile ='Facturacion-'+this.state.Proveedor+'-'+MesFact+'.pdf';

      let newBlob=doc.output('blob');
      var myFile = new File([newBlob], nameFile);
  
      if(bool){
        doc.save(nameFile);
        alert('Su aprobación quedo registrada.')
        this.UploadFiles('ResumenFacturacion', myFile, nameFile, this.state.idFacturacion)
        this.getEncabezados()
        this.cerrarModal()
      } else{
        doc.save(nameFile);
        this.cerrarModal()
      }

  }

  private UploadFiles(Library:string, file:any, nameFile:string, id:number){

    let fields = {
      EncabezadoFacturacionId: id
    }

    this.Helpers.uploadFileWithFields(Library, file, nameFile, fields)
        .then(result => {

          let data = {
            NotificarAprobacion: true
          }

          this.Helpers.updateItemList('EncabezadoFacturacion',id,data)

          .then(result => {
            this.getEncabezados()
            this.cerrarModal()
          })

        })

  }

  private IniciaTable(){

    jQuery('#tablaFormatoFacturacion').DataTable({
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