import * as React from 'react';
import { Helpers } from "../Utils/Helpers";


//const jQuery = require('jquery'); 

import 'DataTables.net';  

interface IHomeProps{
  context:any;
}


export default class CrearSolicitud extends React.Component<IHomeProps, any> {

    public Helpers: Helpers;
    public file:any = []; 

    constructor(props:any) {
        super(props); 

        this.state = {
          DescripcionHome:''
        }


        this.Helpers = new Helpers(this.props.context);
  }

  componentWillMount(){

      this.Helpers.getItemsList(
        'ParametrosGenerales',
        '*',
        '',
        ''
        ).then((res:any) => {

            var DH = res.filter(((x:any) => x.Title == 'DescripcionHome'))
            if(DH.length > 0) {

                var descripcion = DH[0].ValorDescripcion.replaceAll('&lt;','<')
                                                        .replaceAll('&gt;', '>')
                                                        .replaceAll('&quot;', '"');

                this.setState({
                    DescripcionHome:descripcion
                })
            }

        })

    }

  public render(): React.ReactElement<IHomeProps> {

    console.log('ok')

        return (
            <section>
              <div dangerouslySetInnerHTML={{__html: this.state.DescripcionHome}}></div>
            </section>
        )
    }
  }
  