import * as React from 'react';

export interface ICrearCampañaProps{
  cCampañapnp:any;
  //context:any
}

export default class CrearCampaña extends React.Component<ICrearCampañaProps, any> {
  constructor(props:any){
    super(props);
    this.state = {
      title:'CrearCampaña',
      NombreUsuario:'NombreUsuario',
      Rol: 1
    }
  }

  public render(): React.ReactElement<ICrearCampañaProps> {
    
    const tempStyles = {
      border: '2px solid #b19292',
      borderRadius: '10px',
      height:'100%',
      padding: '10px'
      
    };

    return (
        
      <section>
        <div style={tempStyles}>
          <h2>Crear Campaña</h2>
          {
            this.state.Rol === 1?
            <>
              Nombre Campaña<br/>  
              <input type='text' name='NombreCampaña' className='form-control' value={''} />
              <br/>
              Cliente<br/>
              <input type='text' name='ClienteCampaña' className='form-control' value={''} onChange={(e)=>{''}} />
              <br/>
              Fecha Inicio y Fin<br/>
              <div>
                <input type='date' name='FechaInicio' className='form-controlx2' value={''} onChange={(e)=>{''}} />
                <input type='date' name='FechaFin' className='form-controlx2' value={''} onChange={(e)=>{''}} />
              </div>
              <br/>
              Presupuesto<br/>
              <input type='numeric' name='Presupuesto' className='form-control' value={''} onChange={(e)=>{''}} />
              <br/>              
              Impresiones Contratadas<br/>
              <input type='numeric' name='Contratados' className='form-control' value={''} onChange={(e)=>{''}} />
              <br/>
              Servicios<br/>
              <input type='text' name='sPushMultimedia' className='form-control' value={''} onChange={(e)=>{''}} />
              <input type='text' name='sFacebook' className='form-control' value={''} onChange={(e)=>{''}} />
              <input type='text' name='sNative' className='form-control' value={''} onChange={(e)=>{''}} />
              <input type='text' name='sDisplay' className='form-control' value={''} onChange={(e)=>{''}} />
              <br/>
              <button type='button' value={''} onClick={(e)=>{''}} className='btn btn-outline-warning'>Agregar Línea</button>
              <br/>
              <br/>
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