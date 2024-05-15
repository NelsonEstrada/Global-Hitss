import * as React from 'react';
import { Helpers } from "../Utils/Helpers";

//const jQuery = require('jquery'); 

import 'DataTables.net';  

interface ICrearSolicitudProps{
    context:any;
}
  
export default class CrearSolicitud extends React.Component<ICrearSolicitudProps, any> {

    public Helpers: Helpers;
    public file:any = []; 

    constructor(props:any) {
        super(props); 

        this.state = {
            arrayFiles:[],
            CausalSolicitud:[],
            TipoNegocio:[],
            TipoRegion:[],
            TipoRegionFull:[],
            viewTipoRegion:false,
            selectTipoRegion:0,
            files:0,
            max:0,
            maxSize:10,
            observacionLength: 1000,
            DescripcionSolicitud:''
        }

        this.Helpers = new Helpers(this.props.context);
    }

    componentWillMount(){

        this.Helpers.getItemsList(
        'CausalSolicitud',
        'ID,Title',
        '',
        '',
        ).then((res:any) => {

            this.setState({
                CausalSolicitud:res
            })

        });

        this.Helpers.getItemsList(
        'TipoNegocio',
        'ID,Title',
        '',
        '',
        ).then((res:any) => {

            this.setState({
                TipoNegocio:res
            })

        });

        this.Helpers.getItemsList(
        'TipoRegion',
        'ID,Title,TipoNegocio/Id,TipoNegocio/Title',
        '',
        'TipoNegocio',
        ).then((res:any) => {

            this.setState({
                TipoRegionFull:res
            })

        });

        this.Helpers.getItemsList(
        'ParametrosGenerales',
        '*',
        '',
        '',
        ).then((res:any) => {

            var MD = res.filter(((x:any) => x.Title == 'MaximoDocumentos'))
            if(MD.length > 0) {
                this.setState({
                    maxSize:parseInt(MD[0].Valor)
                })
            }

            var DS = res.filter(((x:any) => x.Title == 'DescripcionSolicitud'))
            if(DS.length > 0) {

                var descripcion = DS[0].ValorDescripcion.replaceAll('&lt;','<').replaceAll('&gt;', '>');

                this.setState({
                    DescripcionSolicitud:descripcion
                })
            }

        });

        this.Helpers.getItemsList(
            'Usuarios',
            'ID,Title,Usuario/Id,Usuario/Title,Usuario/EMail,Perfil/Title',
            '',
            'Usuario,Perfil',
            ).then((res:any) => {
    
                this.setState({
                    Usuarios:res
                })
    
        });

    }

    private inputChange(event: any): void {

    var value = event.target.value;
    var name = event.target.name;

        if(name == 'CausalSolicitud'){

            var CS = this.state.CausalSolicitud.filter(((x:any) => x.Title == value))
            if(CS.length > 0){
                this.setState({
                    selectCausalSolicitud:parseInt(CS[0].ID),
                    valueCausalSolicitud:value
                })
            }

            if(value == 'Reporte Semestral'){

                this.setState({
                    viewTipoRegion:false,
                    selectTipoRegion:0,
                    valueTipoRegion:0
                })

            }else{
                this.setState({
                    viewTipoRegion:true
                })
            }

        }

        if(name == 'TipoNegocio'){

            var TN = this.state.TipoNegocio.filter(((x:any) => x.Title == value))

            if(TN.length > 0){
                this.setState({
                    selectTipoNegocio:parseInt(TN[0].ID),
                    valueTipoNegocio:value
                })
            }

            var auxR:any = []; 
            
            if(value == 'Fija'){
                auxR = this.state.TipoRegionFull.filter((x:any) => x.TipoNegocio.Title == value)
            }else{
                auxR = this.state.TipoRegionFull.filter((x:any) => x.TipoNegocio.Title == value)
            }

            this.setState({
                TipoRegion:[]
            },()=>{
                this.setState({
                    TipoRegion:auxR
                })
            })

        }

        if(name == 'TipoRegion'){

            var TR = this.state.TipoRegion.filter(((x:any) => x.Title == value))

            if(TR.length > 0){
                this.setState({
                    selectTipoRegion:parseInt(TR[0].ID),
                    valueTipoRegion:value
                })
            }
        }

    }

    private uploadFileLibrary(ev:any){

    if(ev) {
        
        let files = ev.target.files;

        for(let i = 0; i < files.length; i++) {
            let file: File = ev.target.files[i]

            if(this.file.length < 15) {
                this.file.push(file)
            }
        }

        var max = 0;

        for(let i = 0; i < this.file.length; i++) {
            let file: File = this.file[i]
            if((file.size/1024/1024) > this.state.maxSize){
                max++;
            }
        }

        this.setState({
            files:this.file.length,
            arrayFiles:[],
            inputFile:'',
            max:max
        },()=>{
            this.setState({
                arrayFiles:this.file
            })
        })
        
    }else{
        this.file = null;
    }
    }

    private deleteFile(index:number){

    this.file.splice(index, 1);

    var max = 0;

    for(let i = 0; i < this.file.length; i++) {
        let file: File = this.file[i]
        if((file.size/1024/1024) > this.state.maxSize){
            max++;
        }
    }

    this.setState({
        files:this.file.length,
        arrayFiles:[],
        max:max
    },()=>{
        this.setState({
            arrayFiles:this.file
        })
    })

    }

    private guardarSolicitud(){

        var thisCurrent = this;

        this.Helpers.loadingModal.show('Registrando solicitud de numeracion...',()=>{

            var data = {
                CausalId: thisCurrent.state.selectCausalSolicitud,	
                TipoNegocioId:thisCurrent.state.selectTipoNegocio,
                TipoRegionId:thisCurrent.state.selectTipoRegion,
                Observacion:thisCurrent.state.observacion,
                Estado:'En curso'
            }

            thisCurrent.Helpers.insertItemList('SolicitudesNumeracion', data)
            .then((res:any) => {

                if(thisCurrent.state.arrayFiles.length > 0) {

                    thisCurrent.Helpers.loadingModal.hide(()=>{

                        thisCurrent.Helpers.loadingModal.show('Registando archivo de la solicitud...',()=>{
                            thisCurrent.uploadFile(0, thisCurrent.state.arrayFiles, res.ID)
                        })
                    });
                }else{
                    thisCurrent.Helpers.loadingModal.hide();
                    thisCurrent.clearForm()
                }

                thisCurrent.crearTarea(res)

            })
            .catch((err) => {
                console.error(err)
            })
        });

    }

    private crearTarea(Solicitud: any){

        var Responsable =  this.state.Usuarios.filter((x:any)=> x.Perfil.Title == 'Cumplimiento')

        var data = {
            SolicitudNumeracionId: Solicitud.ID,	
            UsuarioResponsableId:Responsable.length > 0 ? Responsable[0].Usuario.Id : 0,
            CorreoResponsable:Responsable.length > 0 ? Responsable[0].Usuario.EMail : '',
            Comentario:"Registro de solicutud de numeración",
            Estado:'En curso',
            Responsable:'Cumplimiento'
        }

        this.Helpers.insertItemList('TareasSolicitudes', data)
        .then((res:any) => {
            console.log(res)
        })
       
    }

    private clearForm(){

        this.setState({
            TipoRegion:[],
            viewTipoRegion:false,
            selectCausalSolicitud:0,
            valueCausalSolicitud:0,
            valueTipoNegocio:0,
            valueTipoRegion:0,
            files:0,
            max:0,
            arrayFiles:[],
            observacion:'',
            inputFile:'',
            observacionLength: 1000
        });

        this.file = [];

    }

    private uploadFile(pos:number, arrayFiles:any, IdSolicitud:number){

    let file: File = arrayFiles[pos];
    var fields = {
        SolicitudNumeracionId:IdSolicitud
    } 

        this.Helpers.uploadFileWithFields('DocumentosSolicitud', file, file.name, fields).then(result => {
            
            if(arrayFiles.length-1 == pos){
                
                alert('La solicitud fue creada y documentos cargados correctamente.\n\n'+
                        'Solicitud Radicado: ' + IdSolicitud)

                this.Helpers.loadingModal.hide();
                this.clearForm()
            }else{
                this.uploadFile(pos+1, arrayFiles, IdSolicitud)
            }
        })

    }

    private cancelarSolicitud(){

    this.clearForm()

    }

    public render(): React.ReactElement<ICrearSolicitudProps> {

        return (
            <section>
                <div className="container">
                    <div className="row">
                
                        <div className="col-sm-12">
                        <br/><br/>
                            <p>
                                <h3 className="form-label" >Crear solicitud de numeración</h3>
                            </p>
                            <div dangerouslySetInnerHTML={{__html: this.state.DescripcionSolicitud}}></div>
                        </div>
                    
                        <div className="col-sm-4"><br/>
                            <h5 className="form-label">Causal de Solicitud</h5>
                            <select name="CausalSolicitud" value={this.state.valueCausalSolicitud} className="form-select" onChange={(e) => {this.inputChange(e)}}>
                                <option value="0">Seleccione...</option>
                                {this.state.CausalSolicitud && this.state.CausalSolicitud.length > 0 ? 
                                    this.state.CausalSolicitud.map((val:any, index:number)=>(
                                    <option value={val.Title}>{val.Title}</option>
                                ))
                                : null}
                                
                            </select>
                        </div>

                        <div className="col-sm-4"><br/>
                            <h5 className="form-label">Tipo de negocio</h5>
                            <select name="TipoNegocio" value={this.state.valueTipoNegocio} className="form-select" onChange={(e) => {this.inputChange(e)}}>
                                <option value="0">Seleccione...</option>
                                {this.state.TipoNegocio && this.state.TipoNegocio.length > 0 ? 
                                    this.state.TipoNegocio.map((val:any, index:number)=>(
                                    <option value={val.Title}>{val.Title}</option>
                                ))
                                : null}
                            </select>
                        </div>
                        <div className="col-sm-4"><br/>
                            <h5 className="form-label">Región tipo</h5>
                            {this.state.viewTipoRegion ? 
                                <select name="TipoRegion" value={this.state.valueTipoRegion} className="form-select" onChange={(e) => {this.inputChange(e)}}>
                                    <option value="0">Seleccione...</option>
                                        {this.state.TipoRegion && this.state.TipoRegion.length > 0 ? 
                                            this.state.TipoRegion.map((val:any, index:number)=>(
                                                <option value={val.Title}>{val.Title}</option>
                                            ))
                                        : null}
                                </select>
                            : null}
                        </div>

                        <div className="col-sm-12"><br/>
                            <h5 className="form-label">Observaciones</h5>
                            <textarea 
                                className="form-control" 
                                id="observacion" 
                                rows={4} 
                                value={this.state.observacion} 
                                onChange={(e) => {this.setState({observacion: e.target.value, observacionLength: 1000 - e.target.value.length})}}
                                maxLength={1000}>
                            </textarea>
                            <i>Caracteres restantes: {this.state.observacionLength}</i>
                        </div>
                        
                        {this.state.files < 15 ? 
                            <div className="col-sm-8"><br/>
                                <h5 className="form-label">Adjuntos</h5>
                                <input 
                                    type='file' 
                                    multiple 
                                    className="form-control" 
                                    id="inputFile"
                                    value={this.state.inputFile}
                                    onInput={(e) => this.uploadFileLibrary(e)}/>
                                <p>
                                    <i>Cantidad de archivos restante: {15-this.state.files}</i>
                                </p>
                            </div> 
                        : null}
                        
                        <div className="col-sm-12">
                            {this.state.arrayFiles && this.state.arrayFiles.length > 0 ? 
                                    this.state.arrayFiles.map((val:any, index:number)=>(
                                        <div className={'listFiles ' + ((val.size/1024/1024) > this.state.maxSize ? 'maxSize' : '' )}>
                                            
                                            {index+1} - {val.name} ({(val.size/1024/1024).toFixed(2)} MB)
                                            {(val.size/1024/1024) > this.state.maxSize ? <span> * El archivo supera el tamaño permitido de (10 MB). </span> : '' }
                                            
                                            <span>
                                                <svg width="16" height="16" onClick={() => {this.deleteFile(index)}} fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                </svg> 
                                            </span>
                                            
                                        </div>
                                    ))
                            : null}
                            
                            <br/><br/>
                        </div>

                        <div className="col-sm-2"></div>
                        <div className="col-sm-4 btnCenter">
                            {this.state.max == 0 ? 
                                <input type="button" onClick={(e) => this.guardarSolicitud()}  value="Crear"className="btn btn-primary"/> : 
                            null }
                        </div>
                        <div className="col-sm-4 btnCenter">
                            <input type="button" onClick={(e) => this.cancelarSolicitud()} value="Cancelar" className="btn btn-primary"/>
                        </div>
                        <div className="col-sm-2"></div>
                    </div>
                </div>
            </section>
        )
    }
    
  }
  