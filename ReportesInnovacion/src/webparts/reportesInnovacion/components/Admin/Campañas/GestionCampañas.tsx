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
		selector: (row:any) => row.ID,
	},
	{
		name: 'Nombre',
		selector: (row:any) => row.NombreCampania,
	},
	{
		name: 'Fecha inicio',
		selector: (row:any) => row.FechaInicio,
	},
	{
		name: 'Fecha fin',
		selector: (row:any) => row.FechaFin,
	},
	{
		name: 'Cantidad contratados',
		selector: (row:any) => row.CantidadContratados,
	},
	{
		name: 'Presupuesto',
		selector: (row:any) => row.Presupuesto,
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
      NumeroLinea: 1,
      Servicios: {},
      show:false
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

        this.setState({
          Campanias:result
        })

    })
  }

  private openNewCampania(){
    this.setState({
      show:true,
      Estado:false
    })
  }

  private Close(){
    this.setState({
      show:false
    })
  }

  private crearCampaña(){

    console.log(this.state)
    this.setState({
      show:false
    })

  }


  private updateInput(event:any){

    const target = event.target;
    var value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    
    if(name === 'NumeroLinea'){

      if(parseInt(value) < 1 || value == ''){
        value = 1;
      }

    }

    this.setState({
      [name]:value
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

            {/*
                this.state.Rol === 1?
                <>
                  <button type="button" value={''} onClick={(e)=>{''}} className='btn btn-outline-success'>Crear</button>
                  <button type="button" onClick={()=>{''}} className='btn btn-outline-success'>Editar</button>
                  <button type='button' onClick={() => {'';} } className='btn btn-outline-success'>Inactivar</button>
                  <button type="button" value={''} onClick={(e)=>{''}} className='btn btn-outline-secondary'> Cerrar</button>
                </>
                :
                <>
                  <button type="button" value={''} onClick={(e)=>{''}} className='btn btn-outline-secondary'> Cerrar</button>
                </>
            */}


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

                      <div className="col-sm-12"><br/>
                        <h5 className="form-label">Estado de campaña 
                          <input 
                            type="checkbox" 
                            className="form-checkbox"  
                            value={this.state.Estado} 
                            onChange={(e) => {this.setState({Estado: !this.state.Estado}) }}>
                          </input>
                        </h5> 
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
                              <th>Servicio</th>
                              <th>Contratados</th>
                              <th>Presupuesto</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.Productos && this.state.Productos.length > 0 ?  
                              this.state.Productos.map((val:any, index:any) => (
                                <tr>
                                  <td>{val.NombreProducto}</td>
                                  <td><input type="number" name="Contratados" className="form-control" value={Servicios['Contratados'+val.Title]} onChange={(e) => {this.UpdateServicio(e, val)}}></input></td>
                                  <td><input type="number" name="Presupuesto" className="form-control" value={Servicios['Presupuesto'+val.Title]} onChange={(e) => {this.UpdateServicio(e, val)}}></input></td>
                                </tr>
                              ))
                            : null}
                          </tbody>
                        </table>
                      </div>

                      <div className="col-sm-6"><br/>
                          <h5 className="form-label">Número de líneas contratadas</h5> 
                      </div>
                      <div className="col-sm-2"><br/>
                        <input 
                          type="number"
                          name="NumeroLinea" 
                          className="form-control" 
                          value={this.state.NumeroLinea} 
                          min="1" 
                          max="10" 
                          onChange={(e) => {this.updateInput(e) }}>
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
