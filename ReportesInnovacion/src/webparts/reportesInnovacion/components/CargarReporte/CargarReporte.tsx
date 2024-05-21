import * as React from 'react';

//import { ILoginProps } from './ILoginProps';

export interface ICargarReporteProps{
  pnp:any;
}

export default class CargarReporte extends React.Component<ICargarReporteProps, any> {
  constructor(props:any){
    super(props);
    this.state = {
      title:'CargarReporte',
      Aprobador:[],
      idCurrent:0,
      save:'Guardar',
      idEliminar:0
    }   
  }

  componentDidMount(): void {
    
    this.getItems();
    
  }

  public getItems(){
    this.props.pnp.getItemsList('UsuariosSpfx')
    .then((res:any)=>{
      this.setState({Aprobador:res})
    })
    
  }

  public inputChange(target:any){
    var value = target.value;
    var name = target.name;
       this.setState({
    [name]:value
    })

  }

  public render(): React.ReactElement<ICargarReporteProps> {
      return (

        <section>

          <div>
            <nav id='menu' className='menuDesplegable'>
              <ul className='menuPrincipal'> 
                <li><a href=''>OPC1</a></li>
                <li><a href=''>OPC2</a></li>
              </ul>
            </nav>

          </div>

          
          Nombre<br/>  
          <input type="text" name="Title" className="form-control" value={this.state.Title} onChange={(e)=>{this.inputChange(e.target)}} />
          <br/>
          <br/>
          Cargo<br/>
          <input type="text" name='Cargo' className="form-control" value={this.state.Cargo} onChange={(e)=>{this.inputChange(e.target)}} />
          <br/>
          <br/>
          Celular<br/>
          <input type="text" name='Celular' className="form-control" value={this.state.Celular} onChange={(e)=>{this.inputChange(e.target)}} />
          <br/>
          <br/>
          Rol<br/>
          <input type="text" name='Rol' className="form-control" value={this.state.Rol} onChange={(e)=>{this.inputChange(e.target)}} />
          <br/>
          <br/>
          <br/>
          <button type="button" value={this.state.save} onClick={(e)=>{''}} className='btn btn-outline-success'> Guardar</button>
          <br/>
          <br/>
          <br/>
          <ul>
              <li>Ti <span> -- </span> <button type="button" onClick={()=>{''}} className='btn btn-outline-secondary'>Editar</button>
              </li>
            
          </ul>
        
        </section>
    );
  }
}
