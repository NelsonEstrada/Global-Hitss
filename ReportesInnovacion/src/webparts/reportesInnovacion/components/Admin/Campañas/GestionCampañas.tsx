import * as React from 'react';

export interface IGestionCampañasProps{
  gCampañapnp:any;
  //context:any
}

export default class GestionCampañas extends React.Component<IGestionCampañasProps, any> {
  constructor(props:any){
    super(props);
    this.state = {
      title:'GestionCampañas',
      NombreUsuario:'NombreUsuario',
      Rol:'Rol Usuario'
    }
  }

  public render(): React.ReactElement<IGestionCampañasProps> {
    
    const tempStyles = {
      border: '2px solid #b19292',
      borderRadius: '10px',
      height:'100%',
      padding: '10px'
      
    };

      return (

        <section>
          <div style={tempStyles}>
            <h2>Gestión de Campañas</h2>
            
            <div>
              <button type="button" onClick={()=>{''}} className='btn btn-outline-success'>Crear Campaña</button>
            </div>
            DataTableCampañas
            
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
