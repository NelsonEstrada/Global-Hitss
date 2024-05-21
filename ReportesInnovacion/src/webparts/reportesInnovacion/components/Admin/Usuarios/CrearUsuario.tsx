import * as React from 'react';

export interface ICrearUsuarioProps{
  Helpers:any;
  //context:any
}

export default class CrearUsuario extends React.Component<ICrearUsuarioProps, any> {
  constructor(props:any){
    super(props);
    this.state = {
      title:'CrearUsuario',
      NombreUsuario:'NombreUsuario',
      Rol: 1
    }
  }

  public render(): React.ReactElement<ICrearUsuarioProps> {
    
    const tempStyles = {
      border: '2px solid #b19292',
      borderRadius: '10px',
      height:'100%',
      padding: '10px'
      
    };

    return (
        
      <section>
        <div style={tempStyles}>
          <h2>Crear Usuario</h2>
          {
            this.state.Rol === 1?
            <>
              Nombre Usuario<br/>  
              <input type='text' name='Title' className='form-control' placeholder='Nombres' />
              <br/>
              Correo Usuario<br/>
              <input type='text' name='Cargo' className='form-control' placeholder='correo @claro'/>
              <br/>
              Rol Asignado<br/>
              <input type='text' name='Celular' className='form-control' placeholder='Rol' value={''} onChange={(e)=>{''}} />
              <br/>
              Estado<br/>
              <input type='text' name='Rol' className='form-control' placeholder='Estado' value={''} onChange={(e)=>{''}} />
              <br/><br/>
              <button type='button' value={''} onClick={(e)=>{''}} className='btn btn-outline-success'>Crear</button>
              <button type='button' value={''} onClick={(e)=>{''}} className='btn btn-outline-secondary'>Cerrar</button>
            
            </>
              
            :
              <h2>Lo sentimos, este usuario no tiene acceso!<br/>
                Por favor consulta las opciones disponibles para tu Rol.
              </h2>
          }

        </div>
      </section>

        
    );
  }
}

/*<section>
          <div style={tempStyles}>
            
            <div>
              <button type='button' onClick={()=>{''}} className='btn btn-outline-success'>Crear Usuario</button>
            </div>

            Nombre Usuario<br/>  
            <input type='text' name='Title' className='form-control' value={this.state.NombreUsuario} onChange={(e)=>{''}} />
            <br/>
            Correo Usuario<br/>
            <input type='text' name='Cargo' className='form-control' value={''} onChange={(e)=>{''}} />
            <br/>
            Rol Asignado<br/>
            <input type='text' name='Celular' className='form-control' value={this.state.Rol} onChange={(e)=>{''}} />
            <br/>
            Estado<br/>
            <input type='text' name='Rol' className='form-control' value={''} onChange={(e)=>{''}} />
            <br/>            
            <br/>
              {
                this.state.Rol === 1?
                <>
                  <button type='button' value={''} onClick={(e)=>{''}} className='btn btn-outline-success'>Crear</button>
                  <button type='button' onClick={()=>{''}} className='btn btn-outline-success'>Editar</button>
                  <button type='button' onClick={() => {'';} } className='btn btn-outline-success'>Inactivar</button>
                  <button type='button' value={''} onClick={(e)=>{''}} className='btn btn-outline-secondary'> Cerrar</button>
                </>
                :
                <>
                  <button type='button' value={''} onClick={(e)=>{''}} className='btn btn-outline-secondary'> Cerrar</button>
                </>
              
              }
              <br/>

          </div>

        
        </section>
        */