import * as React from 'react';
import { CSSProperties } from "react";

//import { ILoginProps } from './ILoginProps';

export interface IReporteBIProps{
  bipnp:any;
}

export default class ReporteBI extends React.Component<IReporteBIProps, any> {
  constructor(props:any){
    super(props);
    this.state = {
      title:'ReporteBI',
      idCurrent:0,
    }   
  }


  public inputChange(target:any){
    var value = target.value;
    var name = target.name;
       this.setState({
    [name]:value
    })

  }

  public render(): React.ReactElement<IReporteBIProps> {
    
    const tempStyles: CSSProperties = {
      border: '2px solid #b19292',
      borderRadius: '10px',
      height:'300px',
      padding: '10px'
    };
    const tempStyleText: CSSProperties = {
      padding: '5px',
      textAlign: 'center',
    }

      return (
        

        <section>

        <div style={tempStyles}>
            <h1 style={tempStyleText}>
            Lo sentimos, Tablero en Proceso <br/>
            No se encuentra disponible Temporalmente
            </h1>
            <h2>

            </h2>
        </div>        
      </section>
    );
  }
}
