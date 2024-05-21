import * as React from 'react';
const jQuery = require("jquery");

import {Helpers} from '../../Helpers/Helpers';

export interface IGestionClientesProps{
  gClientepnp:any;
  context:any
}

export default class GestionClientes extends React.Component<IGestionClientesProps, any> {
  
  public getClients :Helpers;

  constructor(props:any){
    super(props);
    this.getClients = new Helpers(this.props.context)

    this.state = {
      title:'GestionClientes',
      datosClientes:[],
    }
  }

  componentDidMount(): void {
    
    this.getClients.getItemsList(
      "RCILISTClientes",
      "ID,Title,NombreCliente,NIT,Activo,Logo/Id,Colores",
      "",//"Activo eq 'SI'"
      "Logo",
      ).then((result:any) => {

        console.log(result)

        if(result.length > 0) {
          this.setState({
            datosClientes:result},()=>{this.IniciarTabla('tabData')}
          )

        } else{
          console.log("No Results")
        }
    });
  }

  private IniciarTabla(tableName:string){
    
    jQuery('#'+tableName).DataTable({
      
      destroy: true,
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

  public render(): React.ReactElement<IGestionClientesProps> {

      return (
        <section>
          <div className='seccionContenido'>
            <div className="textoEncabezado">Gestión de Clientes</div>
            
            <div>
              <button type="button" onClick={()=>{''}} className='btn btn-outline-success'>Crear Cliente</button>
            </div>
            <div className="d-flex flex-column justify-content-start table-responsive">
              <table id="tabData" className="table table-striped table-sm table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">NIT</th>
                    <th scope="col">Activo</th>
                    <th scope="col">Colores</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.datosClientes && this.state.datosClientes.length > 0? 
                  this.state.datosClientes.map((item:any, index:number)=>(
                      <tr id={item.ID}>
                        <th scope="row">{index+1}</th>
                        <td>{item.NombreCliente}</td>
                        <td>{item.NIT}</td>
                        <td>{item.Activo}</td>
                        <td>{item.Colores}</td>
                        <td>
                          <button type="button" className="btn btn-outline-primary">
                            Editar
                          </button>
                          <button type="button" className="btn btn-outline-danger">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  : null
                  } 
                </tbody>
              </table>
            </div>
            
            <br/>
              {
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
              }
            </div>
        
        </section>
    );
  }
}
