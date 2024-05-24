import * as React from 'react';

import DataTable from 'react-data-table-component';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { Helpers } from "../../Helpers/Helpers";

export interface IGestionCampañasProps{
  context:any;
}

const columns = [
	{
		name: 'ID',
		selector: (row:any) => row.ID
	},
	{
		name: 'Nombre',
		selector: (row:any) => row.NombreCampania
	},
	{
		name: 'Fecha inicio',
		selector: (row:any) => new Date(row.FechaInicio).toLocaleDateString()
	},
	{
		name: 'Fecha fin',
		selector: (row:any) => new Date(row.FechaFin).toLocaleDateString()
	},
	{
		name: 'Cantidad contratados',
		selector: (row:any) => row.CantidadContratados
	},
	{
		name: 'Presupuesto',
		selector: (row:any) => row.Presupuesto
	}
];

export default class GestionCampañas extends React.Component<IGestionCampañasProps, any> {

  public Helpers: Helpers;

  constructor(props:any){
    super(props);

    this.state = {
      title:'GestionCampañas',
      NombreUsuario:'NombreUsuario',
      Rol:'Rol Usuario',
      NumeroLinea: 0,
      Servicios: {},
      show:false,
      Lineas:[]
    }

    this.Helpers = new Helpers(this.props.context);
  }

  componentDidMount(): void { 

    this.Helpers.getItemsList(
      "RCILISTClientes",
      "ID,Title,NombreCliente",
      "Activo eq 'SI'",
      "",
      ).then((result:any) => {

        this.setState({
          Clientes:result
        })

    })

    this.Helpers.getItemsList(
      "RCILISTProductos",
      "*,ID,NombreProducto",
      "Activo eq 'SI'",
      "",
      ).then((result:any) => {

        this.setState({
          Productos:result
        })

    })

    this.consultarCampañas('');

  }

  private consultarCampañas(filter:string){

    this.Helpers.getItemsList(
      "RCILISTCampanias",
      "*",
      filter,
      "",
      ).then((result:any) => {

        console.log(result)

        this.setState({
          Campanias:result
        })

    })
  }

  private openNewCampania(){
    this.setState({
      show:true,
      Estado:true,
      NumeroLinea: 0,
      Lineas:[],
      NombreLinea:''
    })
  }

  private Close(){

    this.setState({
      show:false,
      NombreCampania:'',
      idCliente:0,
      FechaInicio:'',
      FechaFin:'',
      NumeroLinea:0,
      Servicios:[]
    })

    this.consultarCampañas('');

  }

  private crearCampaña(){
  
    var presupuesto = 0;
    var contratados = 0;

    this.state.Productos.forEach((val:any) => {
  
      if(this.state.Servicios['Servicio' + val.Title]){
        presupuesto += parseFloat(this.state.Servicios['Presupuesto'+val.Title]);
        contratados += parseFloat(this.state.Servicios['Contratados'+val.Title]);
      }

    });

    var data = {
      Title: this.state.NombreCampania,
      NombreCampania: this.state.NombreCampania,
      ClienteId:parseInt(this.state.idCliente),
      FechaInicio:new Date(this.state.FechaInicio).toISOString(),
      FechaFin:new Date(this.state.FechaFin).toISOString(),
      LineasContratadas:parseInt(this.state.NumeroLinea),
      Presupuesto: presupuesto,
      CantidadContratados: contratados,
      PushMultimedia: this.state.Servicios.ServicioPushMultimedia ? (this.state.Servicios.ServicioPushMultimedia ? 'SI' : 'NO') : 'NO',
      Facebook: this.state.Servicios.ServicioFacebook ? (this.state.Servicios.ServicioPushMultimedia ? 'SI' : 'NO') : 'NO',	
      Native: this.state.Servicios.ServicioNative ? (this.state.Servicios.ServicioFacebook ? 'SI' : 'NO') : 'NO',	
      Display: this.state.Servicios.ServicioDisplay ? (this.state.Servicios.ServicioDisplay ? 'SI' : 'NO') : 'NO'
    }

    this.Helpers.insertItemList('RCILISTCampanias', data)
    .then((res:any)=>{
      
     

      this.createProductoXCampania(0, this.state.Productos, res);

    })

  }

  private createProductoXCampania(pos:number, Productos:any, item:any){

      if(this.state.Servicios['Servicio'+Productos[pos].Title]){

        var data = {
          Title: Productos[pos].Title,
          Producto: Productos[pos].NombreProducto,
          Presupuesto: parseFloat(this.state.Servicios['Presupuesto'+Productos[pos].Title]),
          Cantidad: parseFloat(this.state.Servicios['Contratados'+Productos[pos].Title]),
          CampaniaId: item.ID
        }

        this.Helpers.insertItemList('RCILISTProductosxCampanias', data)
        .then((res:any)=>{
          
          if(this.state.Productos.length-1 == pos){
            this.createLineaXCampaña(0, this.state.Lineas, item);
          }else{
            this.createProductoXCampania(pos+1, Productos, item)
          }
          
        })

      }else{

        if(this.state.Productos.length-1 == pos){
          this.createLineaXCampaña(0, this.state.Lineas, item);
        }else{
          this.createProductoXCampania(pos+1, Productos, item);
        }

      }
  }

  private createLineaXCampaña(pos:number, Lineas:any, item:any){

    Lineas[pos].array.forEach((element1:any) => {

      var NombreLinea = element1.NombreLinea
      
      element.Servicio.array.forEach((element:any, index:number) => {
      
        var data = {
          Title: NombreLinea,
          NombreLinea: NombreLinea,
          CampaniaId: item.ID,
          ClienteId:parseInt(this.state.idCliente),
          FechaInicio:new Date(this.state.FechaInicio).toISOString(),
          FechaFin:new Date(this.state.FechaFin).toISOString(),
          Presupuesto:parseFloat(element.Presupuesto);,
          CantidadContratados:parseFloat(element.Contratados),
          [element.Title]:this.state.Servicios['Servicio'+element.Title] ? 'SI' : 'NO'
        }

        this.Helpers.insertItemList('RCILISTLineasCampaas', data)
        .then((res:any)=>{

          if(this.state.Productos.length-1 == pos){
            if(element.Servicio.length-1 == index){
              this.Close();
            }else{
              this.createLineaXCampaña(pos+1, Productos, item)
            }
          }

        })

      });

    });

  }

  private eliminarlinea(e:any, index:number){

    var Lineas = this.state.Lineas;

    var auxLinea = Lineas.splice(index, 1);

    this.setState({
      Lineas:auxLinea,
      NumeroLinea: this.state.NumeroLinea - 1
    },()=>{
      this.generarServicio()
    })


  }

  private gestionarlinea(e:any, lineaPlus:number){
    
    if(this.state.NombreLinea !== '' || lineaPlus < 1){

    var NumeroLinea = this.state.NumeroLinea + lineaPlus;

    var Lineas = this.state.Lineas;

    var linea:any = [];

    this.state.Productos.forEach((val:any, index:number) => {

      if(this.state.Servicios['Servicio' + val.Title]){

        var data = {
          Title: val.Title,
          NombreProducto: val.NombreProducto,
          Presupuesto:'',
          Contratados:''
        }
        linea.push(data)

      }
    });

    Lineas.push({NombreLinea:this.state.NombreLinea,Servicio:linea}) 

    this.setState({
      NumeroLinea: NumeroLinea,
      Lineas:Lineas,
      NombreLinea:''
    })

    }else{
      alert('Nombre de linea es obligatorio.')
    } 

  }

  private UpdateLinea(event:any, indexLinea:number, indexServ:number, Accion:string, servicio:string){

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
 
    var Lineas = this.state.Lineas;

    Lineas[indexLinea].Servicio[indexServ][Accion] = parseFloat(value);

    this.setState({
      Lineas:Lineas
    },()=>{
      this.generarServicio()
    })

  }

  private generarServicio(){

    var Servicios = this.state.Servicios;
    var Lineas = this.state.Lineas;

    this.state.Productos.forEach((val:any, index:number) => {

      if(Servicios['Servicio' + val.Title]){

        Servicios['Contratados' + val.Title] = 0
        Servicios['Presupuesto' + val.Title] = 0

      }

    });

    Lineas.forEach((Line:any) => {

      Line.Servicio.forEach((Serv:any) => {

        var ServContratados = Serv.Contratados ? parseFloat(Serv.Contratados) : 0
        var ServPresupuesto = Serv.Presupuesto ? parseFloat(Serv.Presupuesto) : 0

        Servicios['Contratados' + Serv.Title] = Servicios['Contratados' + Serv.Title] + ServContratados; 
        Servicios['Presupuesto' + Serv.Title] = Servicios['Presupuesto' + Serv.Title] + ServPresupuesto;

      });
      
    });

    console.log(Servicios)

    this.setState({
      Servicios:Servicios
    })

  }
  
  private UpdateServicio(event:any, val:any){

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let Servicios = this.state.Servicios;

    Servicios[name + val.Title] = value;

    this.setState({
      Servicios: Servicios
    },  () => {
      console.log(this.state)
    });
  }

  public render(): React.ReactElement<any> {

    const { Servicios } = this.state;

    return (
        <section>

          <div className='tempStyles'>

            <br/>
            <h3 className="form-label">Gestión de Campañas</h3>

            <div>
                <button type="button" onClick={()=>this.openNewCampania()} className='btn btn-primary'>Crear Campaña</button>
            </div>
          
            <br/>
            {this.state.Campanias && this.state.Campanias.length > 0 ?  
                <DataTable
                  columns={columns}
                  data={this.state.Campanias}
                  pagination
                />
            : null}

            <br/>

          </div>

        <Modal size="lg" centered show={this.state.show} onHide={()=> this.Close()}>
            <Modal.Header closeButton>
            <Modal.Title>Crear campaña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
              <div className="container">

                  <div className="row">
                    
                      <div className="col-sm-12"><br/>
                          <h5 className="form-label">Nombre de la Campaña</h5>
                          <input type='text'
                              className="form-control" 
                              value={this.state.NombreCampania} 
                              onChange={(e) => {this.setState({NombreCampania: e.target.value}) }}
                          />
                      </div>


                      <div className="col-sm-12"><br/>
                          <h5 className="form-label">Cliente</h5>
                          <select name="CausalSolicitud" value={this.state.idCliente} className="form-select" onChange={(e) => {this.setState({idCliente: e.target.value}) }}>
                              <option value="0">Seleccione...</option>
                              {this.state.Clientes && this.state.Clientes.length > 0 ?
                                  
                                  this.state.Clientes.map((val:any) => (
                                    <option value={val.ID}>{val.NombreCliente}</option>
                                  ))

                              : null}
                          </select>
                      </div>


                      <div className="col-sm-6"><br/>
                        <h5 className="form-label">Fecha de inicio de la Campaña</h5>
                        <input 
                          type="date" 
                          className="form-control"  
                          value={this.state.FechaInicio} 
                          onChange={(e) => {this.setState({FechaInicio: e.target.value}) }}>
                        </input>
                      </div>
                      <div className="col-sm-6"><br/>
                        <h5 className="form-label">Fecha de fin de la Campaña</h5>
                        <input 
                          type="date" 
                          className="form-control" 
                          value={this.state.FechaFin} 
                          onChange={(e) => {this.setState({FechaFin: e.target.value}) }}>
                        </input>
                      </div>


                      <div className="col-sm-12"><br/>
                        <h5 className="form-label">Servicios contratados</h5> 
                        <table>
                          <thead>
                            <tr>
                              <th></th>
                              <th>Servicio</th>
                              <th>Contratados</th>
                              <th>Presupuesto</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.Productos && this.state.Productos.length > 0 ?  
                              this.state.Productos.map((val:any, index:any) => (
                                <tr>
                                  <td> 
                                    <input 
                                      type="checkbox" 
                                      className="form-checkbox"
                                      name="Servicio"
                                      value={Servicios['Servicio'+val.Title]} 
                                      onChange={(e) => {this.UpdateServicio(e, val)}}>
                                    </input>
                                  </td>
                                  <td>{val.NombreProducto}</td>
                                  <td>{Servicios['Contratados'+val.Title]}</td>
                                  <td>{Servicios['Presupuesto'+val.Title]}</td>
                                </tr>
                              ))
                            : null}
                          </tbody>
                        </table>
                      </div>


                      <div className="col-sm-5"><br/>
                          <h5 className="form-label">Número de líneas contratadas:</h5> 
                      </div>
                      <div className="col-sm-6"><br/>
                          <h5 className="form-label">{this.state.NumeroLinea}</h5> 
                      </div>

                      <div className="col-sm-12">
                     
                        {this.state.Lineas && this.state.Lineas.length > 0 ?  
                          this.state.Lineas.map((item:any, index:any) => (
                          
                          <table className="tableLineas">
                            <thead>
                              <tr>
                                <th colSpan={4}>{item.NombreLinea}
                                
                                  <span
                                    className="btnDelete btn btn-primary" 
                                    onClick={(e) => {this.eliminarlinea(e, index) }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                      </svg>
                                  </span> 

                                </th>
                              </tr>
                            </thead>
                            <tbody>
                                {item.Servicio.map((val:any, i:any) => (
                                  <tr>
                                    <td>{val.NombreProducto}</td>
                                    <td><input type="number" name="Contratados" className="form-control" value={val.Contratados} onChange={(e) => {this.UpdateLinea(e, index, i, 'Contratados', val.Title)}}></input></td>
                                    <td><input type="number" name="Presupuesto" className="form-control" value={val.Presupuesto} onChange={(e) => {this.UpdateLinea(e, index, i, 'Presupuesto', val.Title)}}></input></td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                          ))
                        : null}
                        
                      </div>


                      <div className="col-sm-4">
                          <h5 className="form-label">Nombre linea:</h5> 
                          <input 
                            className="form-control"
                            type="text"
                            value={this.state.NombreLinea} 
                            onChange={(e) => {this.setState({NombreLinea: e.target.value}) }}>
                          </input> 
                      </div>
                      <div className="col-sm-4">
                        <input 
                          type="button"
                          className="lblmargintop btn btn-primary" 
                          value="Agregar linea"
                          onClick={(e) => {this.gestionarlinea(e, 1) }}>
                        </input> 
                      </div>

                  </div>
              </div>
              
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={()=> this.crearCampaña()}>
                    Aceptar
                </Button>
                <Button variant="primary" onClick={()=> this.Close()}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>

      </section>
    );

  }
}
