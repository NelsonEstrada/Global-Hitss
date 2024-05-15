import * as React from 'react';
import { Helpers } from "../Utils/Helpers";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { withRouter } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const jQuery = require('jquery'); 

import 'DataTables.net'; 

interface IVerSolicitudesProps{
    context:any;
    match: any;
    history: any;
}
  
class VerSolicitudes extends React.Component<IVerSolicitudesProps, any> { 

    public Helpers: Helpers;
    public file:any = []; 

    constructor(props:any) {
        super(props); 

        this.state = {
            Solicitudes:[],
            Solicitud:{},
            idSolicitud:0,
            CausalSolicitud:[],
            TipoNegocio:[],
            TipoRegion:[],
            Usuarios:[],
            filtro:[],
            CausalId:0,
            TipoNegocioId:0,
            TipoRegionId:0,
            UsuarioId:0,
            UsuarioText:'',
            clear:true,
            observacionLength: 1000,
            observacion:'',
            max:0,
            arrayFiles:[],
            countMaxSize:0,
            deleteFile:[]
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
                    TipoRegion:res
                })
    
            });


        this.Helpers.getItemsList(
            'Usuarios',
            'ID,Title,Usuario/Id,Usuario/Title,Usuario/EMail,Perfil/Title',
            '',
            'Usuario,Perfil',
            ).then((res:any) => {
    
                
                this.Helpers.getByTitleUser(this.props.context.pageContext.user.displayName)
                .then((user:any) => {

                    if(user.length > 0) {

                        var perfil = res.filter((x:any) => x.Usuario.Id == user[0].Id)

                        if(perfil.length > 0) {
                            this.setState({
                                PerfilUser:perfil,
                                currentUser:user[0]
                            },()=>{
                                this.consultarSolicitudes('');
                            })

                        }else{
                            this.consultarSolicitudes('');
                        }
                    }  
                })

                this.setState({
                    Usuarios:res
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
    
            });
                
       // this.consultarSolicitudes('');

    }

    private consultarSolicitudes(filtro:string){

        jQuery('#tablaSolicitudes').DataTable().destroy();

        this.Helpers.getItemsList(
        'SolicitudesNumeracion',
        '*,Causal/Title,TipoRegion/Title,TipoNegocio/Title,Author/Title',
        filtro,
        'TipoNegocio,TipoRegion,Causal,Author',
        ).then((res:any) => {
            
            if(this.props.match.params.idSolicitud){

               var Solicitud = res.filter((x:any) => x.ID == this.props.match.params.idSolicitud)

               if(Solicitud.length > 0){
                    this.verRegistro(Solicitud[0])
               }
            }

            this.setState({
                Solicitudes:[]
            },() =>{
                this.setState({
                    Solicitudes:res
                },() =>{
                    this.IniciaTable('tablaSolicitudes','desc')
                  })
    
              })

        });
    }

    private IniciaTable(tableName:string, order:string){

        jQuery('#'+tableName).DataTable({
            fixedHeader: true,
            order:[[0, order]],
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Entradas",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }
        });
    }

    private crearfilter(){

        var filtro:any = [];
        if(this.state.CausalId != 0){
            filtro.push('CausalId eq ' + this.state.CausalId)
        }

        if(this.state.TipoNegocioId != 0){
            filtro.push('TipoNegocioId eq ' + this.state.TipoNegocioId)
        }

        if(this.state.TipoRegionId != 0){
            filtro.push('TipoRegionId eq ' + this.state.TipoRegionId)
        }

        if(this.state.UsuarioText != ''){
            filtro.push("Author/Title eq '" + this.state.UsuarioText + "'")
        }

        var filter = filtro.join(' and ')

        this.consultarSolicitudes(filter);
    }

    private clearfilter(){
        this.setState({
            clear:false
        },() => {
            this.setState({
                clear:true,
                filtro:[],
                anio:0,
                CausalId:0,
                TipoNegocioId:0,
                TipoRegionId:0,
                UsuarioId:0,
                UsuarioText:''
            })
            this.consultarSolicitudes('');
        })
    }

    private inputChange(event: any): void {

        var value = event.target.value;
        var name = event.target.name;
       
        if(name == 'anio'){
            this.setState({
                anio:value
            })
        }

        if(name == 'CausalSolicitud'){
            this.setState({
                CausalId:parseInt(value)
            })
        }

        if(name == 'TipoNegocio'){
            this.setState({
                TipoNegocioId:parseInt(value)
            })
        }

        if(name == 'TipoRegion'){
            this.setState({
                TipoRegionId:parseInt(value)
            })
        }

    }

    private verRegistro(Solicitud:any){
        
        this.Helpers.getItemsList(
        'DocumentosSolicitud',
        '*,File/Name,File/ServerRelativeUrl,File/LinkingUrl',
        'SolicitudNumeracionId eq ' + Solicitud.ID,
        'File',
        ).then((res:any) => {

            this.setState({
                DocumentosSolicitud:res
            })

        });
        
        this.setState({
            show:true,
            Solicitud:Solicitud,
            observacion:Solicitud.Observacion,
            observacionLength:1000-Solicitud.Observacion.length,
            idSolicitud:Solicitud.ID
        })

        this.Helpers.getItemsList(
        'TareasSolicitudes',
        '*,UsuarioResponsable/Title',
        'SolicitudNumeracionId eq ' + Solicitud.ID,
        'UsuarioResponsable',
        ).then((res:any) => {

            this.setState({
                Tareas:res
            })

            if(res.length > 0) {

                var endTask = res[res.length - 1]
                var auxPerfil = this.state.PerfilUser.filter((x:any) => x.Perfil.Title === endTask.Responsable);

                if(auxPerfil.length > 0) {
                    this.setState({
                        Responsable:true
                    })
                }

            }

        });

    }

    private handleClose(){
        this.setState({
            show:false,
            Solicitud:{}
        })
    }
   
    private handleCloseTask(){
        this.setState({
            showTask:false,
            Solicitud:{}
        })
    }

    private handleCloseEdit(){
        
        
        
        this.setState({
            showEdit:false,
            Solicitud:{},
            
        })
    }

    private _getPeoplePickerItems(event:any){
       
        if(event.length > 0){

            this.setState({
                UsuarioText:event[0].text
            })

        }else{
            this.setState({
                UsuarioText:''
            })
        }

    }
    
    private crearTarea(TareaActual: any){

        var thisCurrent = this;

        //var Responsable =  this.state.Usuarios.filter((x:any)=> x.Perfil.Title == TareaActual.Responsable)

        var data = {
            SolicitudNumeracionId: this.state.Solicitud.ID,	
            UsuarioResponsableId:this.state.currentUser ? this.state.currentUser.Id : 0,
            CorreoResponsable:this.state.currentUser ? this.state.currentUser.Email : '',
            Comentario:this.state.comentario,
            Estado:(this.state.Accion == 'Devolver' || this.state.Accion == 'Reenviar') ? 'En curso' : this.state.EstadoAccion,
            Responsable:TareaActual.Responsable == 'Cumplimiento' ? 'Activaciones' : 'Cumplimiento' 
        }

        this.Helpers.insertItemList('TareasSolicitudes', data)
        .then((res:any) => {

            this.Helpers.updateItemList(
                'TareasSolicitudes',
                TareaActual.ID,
                {Estado:this.state.EstadoAccion})
                .then((update:any) => {
                    thisCurrent.setState({
                        showTask:false,
                        showEdit:false,
                        observacion:''
                    })

                    this.Helpers.updateItemList(
                        'SolicitudesNumeracion',
                        this.state.Solicitud.ID,
                        {Estado:data.Estado})
                        .then((updateSol:any) => {
                            this.consultarSolicitudes('');
                        })

                    
                })

        })
       
    }

    private gestionarTarea(Name:string, Estado:string, val:any){

        this.setState({
            showTask:true,
            Accion:Name,
            EstadoAccion:Estado,
            TareaActual:val,
            show:false,
            observacion:'',
            comentario:''
        })

    }

    private gestionarDevolver(Name:string, Estado:string, val:any){

        this.file = [];

        this.setState({
            showEdit:true,
            Accion:Name,
            EstadoAccion:Estado,
            TareaActual:val,
            show:false,
            arrayFiles:[],
            observacionLength:1000 - this.state.Solicitud.Observacion.length,
            files: this.file.length + this.state.DocumentosSolicitud.length,
            max:15 - (this.file.length + this.state.DocumentosSolicitud.length),
            comentario:''
        })

    }

    private deleteFile(index:number, type:string){
        
        if(type == 'old'){

            var auxFiles = [...this.state.DocumentosSolicitud]
            var deleteFile = [...this.state.deleteFile]

            var auxDeleteFile = auxFiles.splice(index, 1);

            deleteFile.push(auxDeleteFile[0]);

            this.setState({
                files:this.file.length + auxFiles.length,
                DocumentosSolicitud:[],
                max:15 - (this.file.length + this.state.DocumentosSolicitud.length),
                deleteFile:deleteFile
            },()=>{
                this.setState({
                    DocumentosSolicitud:auxFiles
                })
            })

        }else{

            this.file.splice(index, 1);

            var max = 0;

            for(let i = 0; i < this.file.length; i++) {
                let file: File = this.file[i]
                if((file.size/1024/1024) > this.state.maxSize){
                    max++;
                }
            }

            this.setState({
                files:this.file.length + this.state.DocumentosSolicitud.length,
                arrayFiles:[],
                max:15 - (this.file.length + this.state.DocumentosSolicitud.length),
                countMaxSize:max
            },()=>{
                this.setState({
                    arrayFiles:this.file
                })
            })

        }

    }

    private uploadFileLibrary(ev:any){

        if(ev) {
            
            let files = ev.target.files;
    
            for(let i = 0; i < files.length; i++) {
                let file: File = ev.target.files[i]
    
                if((this.state.DocumentosSolicitud.length + this.file.length) < 15) {
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
                files:this.file.length + this.state.DocumentosSolicitud.length,
                arrayFiles:[],
                inputFile:'',
                max:15 - (this.file.length + this.state.DocumentosSolicitud.length),
                countMaxSize:max
            },()=>{
                this.setState({
                    arrayFiles:this.file
                })
            })
            
        }else{
            this.file = [];
        }
    }

    private deleteFiles(pos:number, files:any, functionSuccess:any){

        this.Helpers.deleteItemList('DocumentosSolicitud',files[pos].ID)
        .then((res)=>{
            if(pos == files.length-1){
                functionSuccess('allDelete successfully')
            }else{
                this.deleteFiles(pos+1, files, functionSuccess)
            }
        })

    }

    private uploadFile(pos:number, arrayFiles:any, IdSolicitud:number, functionSuccess:any){

        let file: File = arrayFiles[pos];
        var fields = {
            SolicitudNumeracionId:IdSolicitud
        } 
    
        this.Helpers.uploadFileWithFields('DocumentosSolicitud', file, file.name, fields).then(result => {
            
            if(arrayFiles.length-1 == pos){
                functionSuccess('allCreated successfully')
            }else{
                this.uploadFile(pos+1, arrayFiles, IdSolicitud, functionSuccess)
            }
        })
    
    }
    
    private responderDevolucion(){

        var thisCurrent = this;

        this.Helpers.loadingModal.show('Respondiendo solicitud de numeracion...',()=>{

            if(thisCurrent.state.deleteFile.length > 0){
                thisCurrent.deleteFiles(0, thisCurrent.state.deleteFile, function(resDelete:any){
                    if(thisCurrent.state.arrayFiles.length > 0) {
                        thisCurrent.uploadFile(0, thisCurrent.state.arrayFiles, thisCurrent.state.Solicitud.ID, function(resUpload:any){
                            thisCurrent.updateSolicitud()
                        })
                    }
                })
            }else
                if(thisCurrent.state.arrayFiles.length > 0) {
                    thisCurrent.uploadFile(0, thisCurrent.state.arrayFiles, thisCurrent.state.Solicitud.ID, function(resUpload:any){
                        thisCurrent.updateSolicitud()
                    })
                }else{
                    thisCurrent.updateSolicitud()
                } 
        })
    }

    private updateSolicitud(){

        this.Helpers.updateItemList(
            'SolicitudesNumeracion',
            this.state.Solicitud.ID,
            {Observacion:this.state.observacion})
        .then((update:any) => {
            this.crearTarea(this.state.TareaActual)
            this.Helpers.loadingModal.hide();
        })

    }
    
    public render(): React.ReactElement<IVerSolicitudesProps> {

        return (
            <section>
                <div>
                    <br/><br/>
                    <p>
                        <h3 className="form-label" >Listado control de solicitudes</h3>
                    </p>
                </div>
                <br/>
                <div className="container">

                    {this.state.clear ? 
                        <div className="row filtros">
                            <div className="col-sm-2">
                                <h5 className="form-label">Año</h5>
                                <input type='number' name="anio" maxLength={4}  minLength={4} className="form-control" onChange={(e) => {this.inputChange(e)}}></input>
                            </div>
                            <div className="col-sm-2">
                                <h5 className="form-label">Usuario</h5>
                                <PeoplePicker
                                    context={this.props.context}
                                    titleText="People Picker"
                                    personSelectionLimit={1}
                                    showtooltip={true}
                                    onChange={(e) => {this._getPeoplePickerItems(e)}}
                                    principalTypes={[PrincipalType.User]}
                                    defaultSelectedUsers={this.state.selectedusers}
                                    resolveDelay={1000} />
                            </div>
                            <div className="col-sm-2">
                                <h5 className="form-label">Causal Solicitud</h5>
                                <select name="CausalSolicitud" className="form-select" onChange={(e) => {this.inputChange(e)}}>

                                    <option value="0">Seleccione...</option>
                                    {this.state.CausalSolicitud && this.state.CausalSolicitud.length > 0 ? 
                                        this.state.CausalSolicitud.map((val:any, index:number)=>(
                                        <option value={val.ID}>{val.Title}</option>
                                    ))
                                    : null}
                                    
                                </select>
                            </div>

                            <div className="col-sm-2">
                                <h5 className="form-label">Tipo de negocio</h5>
                                <select name="TipoNegocio" className="form-select" onChange={(e) => {this.inputChange(e)}}>
                                    <option value="0">Seleccione...</option>
                                        {this.state.TipoNegocio && this.state.TipoNegocio.length > 0 ? 
                                            this.state.TipoNegocio.map((val:any, index:number)=>(
                                            <option value={val.ID}>{val.Title}</option>
                                        ))
                                    : null}
                                </select>
                            </div>
                            <div className="col-sm-2">
                                <h5 className="form-label">Region tipo</h5>
                                <select name="TipoRegion" className="form-select" onChange={(e) => {this.inputChange(e)}}>
                                    <option value="0">Seleccione...</option>
                                        {this.state.TipoRegion && this.state.TipoRegion.length > 0 ? 
                                            this.state.TipoRegion.map((val:any, index:number)=>(
                                                <option value={val.ID}>{val.Title}</option>
                                            ))
                                        : null}
                                </select>
                            </div>
                            <div className="col-sm-2 btnfiltro">
                                <input type="button" onClick={(e) => this.crearfilter()} value="Filtrar" className="marginButton btn btn-primary"/>
                                <span title={"Limpiar filtros"} >
                                    <svg width="22" height="22" onClick={() => {this.clearfilter()}} fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                    </svg> 
                                </span>
                            </div>
                        </div>
                    :null}
                </div>
                <br/>
                <div className="table-responsive">
                    <table id="tablaSolicitudes" className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Causal</th> 
                                <th>Tipo negocio</th>
                                <th>Region tipo</th>
                                <th>Solicitante</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.Solicitudes && this.state.Solicitudes.length > 0 ?
                            this.state.Solicitudes.map((val:any, index:number)=>(
                                <tr>
                                    <td>{val.ID}</td>
                                    <td>{val.Causal ? val.Causal.Title : ''}</td>
                                    <td>{val.TipoNegocio ? val.TipoNegocio.Title : ''}</td>
                                    <td>{val.TipoRegion ? val.TipoRegion.Title : ''}</td>
                                    <td>{val.Author.Title}</td>
                                    <td>{val.Estado}</td>
                                    <td>
                                        <input className="btn btn-primary" type="button" value="Ver registro" onClick={()=> this.verRegistro(val)}/>
                                    </td>
                                </tr>
                            ))
                            :null}
                        </tbody>
                    </table>
                </div>
            
                <Modal size="xl" centered show={this.state.show} onHide={()=> this.handleClose()}>
                    <Modal.Header closeButton>
                    <Modal.Title>Solicitud de numeración - {this.state.idSolicitud}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.show ? 
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm-4"><br/>
                                        <h5 className="form-label">Causal de Solicitud</h5>
                                        {this.state.Solicitud.Causal.Title}
                                    </div>
                                    <div className="col-sm-4"><br/>
                                        <h5 className="form-label">Tipo Negocio</h5>
                                        {this.state.Solicitud.TipoNegocio.Title}
                                    </div>
                                    <div className="col-sm-4"><br/>
                                        <h5 className="form-label">Tipo Region</h5>
                                        {this.state.Solicitud.TipoRegion.Title}
                                    </div>

                                    <div className="col-sm-4"><br/>
                                        <h5 className="form-label">Solicitante</h5>
                                        {this.state.Solicitud.Author.Title}
                                    </div>

                                    <div className="col-sm-12"><br/>
                                        <h5 className="form-label">Observacion</h5>
                                        {this.state.Solicitud.Observacion}
                                    </div> 

                                    <div className="col-sm-12"><br/>
                                        <h5 className="form-label">Documentos cargados</h5>
                                        {this.state.DocumentosSolicitud && this.state.DocumentosSolicitud.length > 0 ? 
                                            this.state.DocumentosSolicitud.map((val:any, index:number)=>(
                                                <div className={'listFiles'}>
                                                    {index+1} - <a download href={val.File.ServerRelativeUrl}>{val.File.Name}</a>
                                                </div>
                                            ))
                                        : null}
                                    </div>

                                    <hr/>

                                    <h5 className="form-label">Tareas</h5>
                                    <div className="table-responsive">
                                        <table id="tablaTareas" className="table table-striped table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Usuario responsable</th>
                                                    <th>Comentario</th>
                                                    <th>Estado</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.Tareas && this.state.Tareas.length > 0 ?
                                                this.state.Tareas.map((val:any, index:number)=>(
                                                    <tr>
                                                        <td>{val.ID}</td>
                                                        <td>{val.UsuarioResponsable ? val.UsuarioResponsable.Title : ''}</td>
                                                        <td>{val.Comentario}</td>
                                                        <td> {val.Estado}</td>
                                                        <td>
                                                            {val.Estado == 'En curso' ? 
                                                                <div>
                                                                {val.Responsable == 'Activaciones' && this.state.Responsable ? 
                                                                    <input className="btn btn-primary marginLeft10" type="button" value="Responder" onClick={()=> this.gestionarDevolver('Reenviar', 'Reenviada',val)}/>  
                                                                :null}

                                                                {val.Responsable == 'Cumplimiento' && this.state.Responsable?
                                                                    <div>
                                                                        <input className="btn btn-primary marginLeft10" type="button" value="Aprobar" onClick={()=> this.gestionarTarea('Aprobar', 'Aprobada',val)}/> 
                                                                        <input className="btn btn-primary marginLeft10" type="button" value="Rechazar" onClick={()=> this.gestionarTarea('Rechazar','Rechazada',val)}/>
                                                                        <input className="btn btn-primary marginLeft10" type="button" value="Devolver" onClick={()=> this.gestionarTarea('Devolver','Devuelta',val)}/>
                                                                    </div>
                                                                : null}
                                                                </div>
                                                            : null}

                                                            
                                                        </td>
                                                    </tr>
                                                ))
                                                :null}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        :null}
                      
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={()=> this.handleClose()}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal size="xl" centered show={this.state.showTask} onHide={()=> this.handleCloseTask()}>
                    <Modal.Header closeButton>
                    <Modal.Title> [{this.state.Accion}] Solicitud de numeración - {this.state.idSolicitud}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <div className="container">
                                <div className="row">
                                  
                                    <div className="col-sm-12"><br/>
                                        <h5 className="form-label">Comentario</h5>
                                        <textarea 
                                            className="form-control" 
                                            id="comentario" 
                                            rows={2} 
                                            value={this.state.comentario} 
                                            onChange={(e) => {this.setState({comentario: e.target.value}) }}>
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                      
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={()=> this.crearTarea(this.state.TareaActual)}>
                            Aceptar
                        </Button>
                        <Button variant="primary" onClick={()=> this.handleCloseTask()}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal size="xl" centered show={this.state.showEdit} onHide={()=> this.handleCloseEdit()}>
                    <Modal.Header closeButton>
                    <Modal.Title>[Responder] Solicitud de numeración - {this.state.idSolicitud}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        {this.state.showEdit ? 
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm-4"><br/>
                                        <h5 className="form-label">Causal de Solicitud</h5>
                                        {this.state.Solicitud.Causal.Title}
                                    </div>
                                    <div className="col-sm-4"><br/>
                                        <h5 className="form-label">Tipo Negocio</h5>
                                        {this.state.Solicitud.TipoNegocio.Title}
                                    </div>
                                    <div className="col-sm-4"><br/>
                                        <h5 className="form-label">Tipo Region</h5>
                                        {this.state.Solicitud.TipoRegion.Title}
                                    </div>

                                    <div className="col-sm-4"><br/>
                                        <h5 className="form-label">Solicitante</h5>
                                        {this.state.Solicitud.Author.Title}
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

                                    <div className="col-sm-12"><br/>
                                        <h5 className="form-label">Comentario</h5>
                                        <textarea 
                                            className="form-control" 
                                            id="comentario" 
                                            rows={2} 
                                            value={this.state.comentario} 
                                            onChange={(e) => {this.setState({comentario: e.target.value})}}>
                                        </textarea>
                                    </div>

                                    {this.state.max > 0 ? 
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

                                    <div className="col-sm-12"><br/>
                                        <h5 className="form-label">Documentos cargados</h5>
                                        {this.state.DocumentosSolicitud && this.state.DocumentosSolicitud.length > 0 ? 
                                            this.state.DocumentosSolicitud.map((val:any, index:number)=>(
                                                <div className={'listFiles'}>
                                                    {index+1} - <a download href={val.File.ServerRelativeUrl}>{val.File.Name}</a>
                                                    <span>
                                                        <svg width="16" height="16" onClick={() => {this.deleteFile(index,'old')}} fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                        </svg> 
                                                    </span>
                                                </div>
                                            ))
                                        : null}
                                    </div>

                                    <div className="col-sm-12">
                                 
                                        {this.state.arrayFiles && this.state.arrayFiles.length > 0 ? 
                                            <div>
                                                <br/>
                                                <h5 className="form-label">Documentos nuevos</h5>

                                                {this.state.arrayFiles.map((val:any, index:number)=>(
                                                    <div className={'listFiles ' + ((val.size/1024/1024) > this.state.maxSize ? 'maxSize' : '' )}>
                                                        
                                                        {this.state.DocumentosSolicitud.length+index+1} - {val.name} ({(val.size/1024/1024).toFixed(2)} MB)
                                                        {(val.size/1024/1024) > this.state.maxSize ? <span> * El archivo supera el tamaño permitido de (10 MB). </span> : '' }
                                                        
                                                        <span>
                                                            <svg width="16" height="16" onClick={() => {this.deleteFile(index,'new')}} fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                            </svg> 
                                                        </span>
                                                        
                                                    </div>
                                                ))}
                                            </div>
                                                
                                        : null}
                                        
                                        <br/><br/>
                                    </div>

                                </div>
                            </div>
                        : null}
                      
                    </Modal.Body>
                    <Modal.Footer>

                        {this.state.countMaxSize == 0 ? 
                            <Button variant="primary" onClick={()=> this.responderDevolucion()}>
                                Aceptar
                            </Button> 
                        : null}

                        <Button variant="primary" onClick={()=> this.handleCloseEdit()}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>

            </section>
        )
    }

}

export default withRouter(VerSolicitudes);
  