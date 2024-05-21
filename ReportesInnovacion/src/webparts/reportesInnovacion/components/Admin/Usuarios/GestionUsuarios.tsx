import * as React from 'react';

import {Helpers} from '../../Helpers/Helpers'

export interface IGestionUsuariosProps{
  context:any;
  datosUsuarios:any
}

export default class GestionUsuarios extends React.Component<IGestionUsuariosProps, any> {
  
  public GestHelp :Helpers;

  constructor(props:any){
    super(props);

    this.state = {
      datosUsuariosActuales:[]
    }
  }

  componentDidMount(): void {
    this.getAllItemsInList();
  }

  public getAllItemsInList() {
    
    this.setState({
      datosUsuariosActuales:this.props.datosUsuarios},()=>{this.IniciarTabla('tabData')}
    )
  }


  private IniciarTabla(tableName:string){
    
   ///Reemplazar por el ejemplo del HOME
   
  }



  public render(): React.ReactElement<IGestionUsuariosProps> {
    
    const tempStyles = {
      border: '2px solid #b19292',
      borderRadius: '10px',
      height:'100%',
      padding: '10px'
      
    };

      return (

        <section>
          <div style={tempStyles}>
            <div className="textoEncabezado">Gestión de Usuarios</div>
            
            <div>
              <button type="button" onClick={()=>{''}} className='btn btn-outline-success'>Crear Usuario</button>
            </div>
            <div className="d-flex flex-column justify-content-start table-responsive">
              <table id="tabData" className="table table-striped table-sm table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Rol</th>
                    <th scope="col">Activo</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.datosUsuariosActuales && this.state.datosUsuariosActuales.length > 0? 
                  this.state.datosUsuariosActuales.map((item:any, index:number)=>(
                      <tr id={item.ID}>
                        <th scope="row">{index+1}</th>
                        <td>{item.Usuario.Title}</td>
                        <td>{item.Usuario.EMail}</td>
                        <td>{item.RolUsuario.Title}</td>
                        <td>{item.Activo}</td>
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

/*

Nombre Usuario<br/>  
            <input type="text" name="Title" className="form-control" value={this.state.NombreUsuario} onChange={(e)=>{''}} />
            <br/>
            Correo Usuario<br/>
            <input type="text" name='Cargo' className="form-control" value={''} onChange={(e)=>{''}} />
            <br/>
            Rol Asignado<br/>
            <input type="text" name='Celular' className="form-control" value={this.state.Rol} onChange={(e)=>{''}} />
            <br/>
            Estado<br/>
            <input type="text" name='Rol' className="form-control" value={''} onChange={(e)=>{''}} />
            <br/>

 */
