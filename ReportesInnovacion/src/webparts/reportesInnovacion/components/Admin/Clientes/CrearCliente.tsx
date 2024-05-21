import * as React from 'react';

export interface ICrearClienteProps{
  cClientepnp:any;
  //context:any
}

export default class CrearCliente extends React.Component<ICrearClienteProps, any> {
  constructor(props:any){
    super(props);
    this.state = {
      title:'CrearCliente',
      NombreUsuario:'NombreUsuario',
      Rol: 2
    }
  }

  public render(): React.ReactElement<ICrearClienteProps> {
    
    const tempStyles = {
      border: '2px solid #b19292',
      borderRadius: '10px',
      height:'100%',
      padding: '10px'
      
    };

    return (
        
      <section>
        <div style={tempStyles}>
          <h2>Crear Cliente</h2>
          {
            this.state.Rol === 1?
            <>
              Nombre Cliente<br/>  
              <input type='text' name='Title' className='form-control' value={''} onChange={(e)=>{''}} />
              <br/>
              NIT<br/>
              <input type='text' name='Cargo' className='form-control' value={''} onChange={(e)=>{''}} />
              <br/>
              Logo<br/>
              <input type='text' name='Celular' className='form-control' value={''} onChange={(e)=>{''}} />
              <br/>
              Colores Corporativos<br/>
              <input type='text' name='Rol' className='form-control' value={''} onChange={(e)=>{''}} />
              <br/><br/>
              <button type='button' value={''} onClick={(e)=>{''}} className='btn btn-outline-success'>Crear</button>
              <button type='button' value={''} onClick={(e)=>{''}} className='btn btn-outline-secondary'>Cerrar</button>
            
            </>
              
            :
              <h2>Lo sentimos, este usuario no tiene acceso!
                Por favor consulta las opciones disponibles para tu Rol.
              </h2>
          }

        </div>
      </section>

        
    );
  }
}