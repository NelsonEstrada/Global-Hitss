import * as React from 'react';
import DataTable from 'react-data-table-component';

export interface IHomeProps{
  Helpers:any;
  datosUsuario:any;
}

const columns = [
	{
		name: 'Title',
		selector: (row:any) => row.title,
	},
	{
		name: 'Year',
		selector: (row:any) => row.year,
	},
];

const data = [
  	{
		id: 1,
		title: 'Beetlejuice',
		year: '1988',
	},
	{
		id: 2,
		title: 'Ghostbusters',
		year: '1984',
	},
]

export default class Home extends React.Component<IHomeProps, any> {
  constructor(props:any){
    super(props);
    this.state = {
      title:'Header',
      nombreUsuario:'',
      rolUsuario:'',
      activoUsuario:'',
    }   
  }

  componentDidMount(): void {
  
    console.log(this.props.datosUsuario)

    this.setState({
      nombreUsuario:this.props.datosUsuario.nombreUsuario,
      rolUsuario:this.props.datosUsuario.rolUsuario,
      activoUsuario:this.props.datosUsuario.activoUsuario,
    })
   
  }

  public getItems(){
    this.props.Helpers.getItemsList('UsuariosSpfx')
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

  public render(): React.ReactElement<IHomeProps> {

    return (

      <section>
        <div className='tempStyles'>
            <h1 className='tempStyleText'>
              {
                this.state.activoUsuario === "SI" ?
                <div>{this.state.nombreUsuario}, estás en Reportes Campañas de Innovación</div>
                :
                <div>{this.state.nombreUsuario}, Reportes Campañas de Innovación informa que el usuario no se encuentra activo.</div>
              }
              <br/>              
            </h1>
            
        </div>

        <hr/><hr/>
          <h2>Ejemplo Tabla</h2>      
          <DataTable
            columns={columns}
            data={data}
          />
          <hr/>
          <h2>Ejemplo formulario</h2>   
          <div className="container">
              <div className="row">
          
                  <div className="col-sm-12">
                      <p>
                          <h3 className="form-label" >Crear solicitud </h3>
                      </p>
                  </div>
              
                  <div className="col-sm-4"><br/>
                      <h5 className="form-label">Solicitud</h5>
                      <input type="text" className="form-control" />
                  </div>

                  <div className="col-sm-4"><br/>
                      <h5 className="form-label">descripcion Solicitud</h5>
                      <textarea className="form-control"  />
                  </div>

                  <div className="col-sm-4"><br/>
                      <h5 className="form-label">tipo Solicitud</h5>
                      <select name="CausalSolicitud" value={this.state.valueCausalSolicitud} className="form-select" onChange={(e) => {this.inputChange(e)}}>
                          <option value="0">Seleccione...</option>
                          <option value="1">Seleccione... 2</option>
                      </select>
                  </div>

              </div>
          </div>
          
      </section>
  );
}
  

  
  
}
