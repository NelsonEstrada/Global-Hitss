/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useBoolean } from '@fluentui/react-hooks';
import { PeoplePicker } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import styles from '../admonPerfiles/AdmonPerfiles.module.scss';
import { DropdownComponent } from '../utils/DropdownComponent';
import { TextField } from '@fluentui/react';
import '../../assets/css/style.css';


const modelProps = {
  isBlocking: false,
  styles: { main: { maxWidth: 450 } },
};


interface IDialogPerfiles{
  id:number,
  show:boolean,
  title?:string,
  context?:any,
  usuario?:any,
  rol?:any,
  email?:string,
  usuarioId?:any,
  eleccion?:string,
  CrearPerfiles?:(Title:string,Rol:any,Usuario:any, eleccion:string,Email:string)=>Promise<boolean>
  ActualizarPerfiles?:(id:number,Title:string,Rol:any,Usuario:any, eleccion:string,Email:string)=>Promise<boolean>
}


export const DialogPerfilesEditar: React.FunctionComponent<IDialogPerfiles> = (data) => {

  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [Title, setTitle] = React.useState(data.title);
  const [Rol, setRol] = React.useState(data.rol);
  const [Perfil, setPerfil] = React.useState(data.eleccion ? data.eleccion : '');
  const [Email, setEmail] = React.useState(data.email ? data.email : '');
  const [Eleccion, setEleccion] = React.useState(data.eleccion ? data.eleccion : '');
  const [selectedProveedor, setSelectedProveedor] = React.useState(data.eleccion);

  if(data.show){
    toggleHideDialog();
  }
  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Nuevo Perfil",
  };
 
  function _getRolePickerItem(rol: string){
    setRol(rol);
    setTitle('Perfil Actualizado');
  }

  const handleProveedorChange = (event:any) => {
    // Update the selected value when the user selects an option
    setSelectedProveedor(event.target.value);
    setEleccion(event.target.value);
    setPerfil(event.target.value);
  };

  const handleEmailChange = (event:any) => {
    setEmail(event.target.value);
    console.log(Email)
  };
 
  return (
    <>
      <PrimaryButton
         className={ styles.colorButton}
      onClick={toggleHideDialog} text="Editar Perfil" />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >
         
         <DropdownComponent 
         listName="Roles" 
         onChange={_getRolePickerItem} 
         context={data.context}
         fieldName='Roles'
         fieldSearch='Title'
         rol={data.rol}
         />

        {parseInt(Rol) === 2 && (
          <div className="ms-Dropdown-container">
            <label>Operación</label>
            <div className="ms-Dropdown">
              <select id="ProveedorSelect" className='slcDropdown' onChange={handleProveedorChange}>
                <option value="">--Seleccione--</option>
                <option selected={ data.eleccion === 'PRODUCCIÓN' ? true:false } value="PRODUCCIÓN">Producción</option>
                <option selected={ data.eleccion==='RETRIVAL' ? true:false } value="RETRIVAL">Retrival</option>
                <option selected={ data.eleccion==='OTRO' ? true:false } value="OTRO">Otro</option>
              </select>
            </div>
          </div>
        )}

        {parseInt(Rol) === 3 && (
          <div className="ms-Dropdown-container">
            <label className='labelDropdown'>Número de Autorizador</label>
            <div className="ms-Dropdown">
              <select id="AutorizadorSelect" className="slcDropdown" onChange={handleProveedorChange} value={selectedProveedor}>
                <option value="">--Seleccione--</option>
                <option selected={ data.eleccion==='Autorizador1' ? true:false } value="Autorizador1">Autorizador 1</option>
                <option selected={ data.eleccion==='Autorizador2' ? true:false } value="Autorizador2">Autorizador 2</option>
                <option selected={ data.eleccion==='Autorizador3' ? true:false } value="Autorizador3">Autorizador 3</option>
                <option selected={ data.eleccion==='Autorizador4' ? true:false } value="Autorizador4">Autorizador 4</option>
                <option selected={ data.eleccion==='Autorizador5' ? true:false } value="Autorizador5">Autorizador 5</option>
              </select>
            </div> 
          </div>
          
          )}
          
        <br/>
         <TextField
         value={data.usuario}
         disabled={true}
         />

        {Perfil === 'Autorizador1' && (
          <div className="ms-Dropdown-container">
            <label className='labelDropdown'>Correo de Autorizador</label>
            <div className="ms-Dropdown">
              <input id="AutorizadorEmail" onChange={handleEmailChange}  value={Email} className="slcDropdown" ></input>
            </div> 
          </div>
          
        )}

          
        <DialogFooter>
          <PrimaryButton onClick={async ()=>{
              await data.ActualizarPerfiles(data.id, Title, Rol, data.usuarioId, Eleccion, Email)?toggleHideDialog():"error al guardar"}} text="Guardar Cambios" disabled={false}  />
        </DialogFooter>
      </Dialog>
    </>
  );
};


export const DialogPerfilesNew: React.FunctionComponent<IDialogPerfiles> = (data) => {

  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [Title, setTitle] = React.useState('');
  const [Rol, setRol] = React.useState('');
  const [Perfil, setPerfil] = React.useState('');
  const [Email, setEmail] = React.useState('');
  const [Usuario, setUsuario] = React.useState(0);
  const [Eleccion, setEleccion] = React.useState(data.eleccion);
  const [selectedProveedor, setSelectedProveedor] = React.useState(data.eleccion);
  
  if(data.show ===true){
    toggleHideDialog();
  }
  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Nuevo Usuario"
  };
  
  function _getRolePickerItem(rol: string){
    setTitle("Perfil Asignado");
    setRol(rol);

  }

  function _getPeoplePickerItems(items: any[]){
    setUsuario(items[0].id);
  }

  const handleProveedorChange = (event:any) => {
    // Update the selected value when the user selects an option
    setSelectedProveedor(event.target.value);
    setEleccion(event.target.value);
    setPerfil(event.target.value);
  };

  const handleEmailChange = (event:any) => {
    setEmail(event.target.value);
    console.log(Email)
  };
 

  return (
    <>
      <PrimaryButton
         className={ styles.colorButton}
      onClick={toggleHideDialog} text="Nuevo Usuario" />
        <Dialog
          hidden={hideDialog}
          onDismiss={toggleHideDialog}
          dialogContentProps={dialogContentProps}
          modalProps={modelProps}
        >
         <DropdownComponent 
          listName="Roles" 
          fieldName='Roles'
          fieldSearch='Title'
          onChange={_getRolePickerItem} 
          context={data.context}
         />

        {parseInt(Rol) === 2 && (
          <div className="ms-Dropdown-container">
            <label>Operación</label>
            <div className="ms-Dropdown">
              <select id="ProveedorSelect" className='slcDropdown'>
                <option value="">--Seleccione--</option>
                <option value="Produccion">Producción</option>
                <option value="Retrival">Retrival</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
        )}

        {parseInt(Rol) === 3 && (
          <div className="ms-Dropdown-container">
            <label className='labelDropdown'>Número de Autorizador</label>
            <div className="ms-Dropdown">
              <select id="AutorizadorSelect" className="slcDropdown" onChange={handleProveedorChange} value={selectedProveedor}>
                <option value="">--Seleccione--</option>
                <option value="Autorizador1">Autorizador 1</option>
                <option value="Autorizador2">Autorizador 2</option>
                <option value="Autorizador3">Autorizador 3</option>
                <option value="Autorizador4">Autorizador 4</option>
                <option value="Autorizador5">Autorizador 5</option>
              </select>
            </div> 
          </div>
          
          )}

         <PeoplePicker
              context={data.context}
              titleText="Usuario"
              personSelectionLimit={1}
              placeholder="Por favor escriba el correo o nombre completo"
              groupName={""} 
              showtooltip={true}
              required={true}
              onChange={_getPeoplePickerItems}
              showHiddenInUI={false}
              resolveDelay={100} 
              ensureUser={true}
          /> 



        {Perfil === 'Autorizador1' && (
          <div className="ms-Dropdown-container">
            <label className='labelDropdown'>Correo de Autorizador</label>
            <div className="ms-Dropdown">
              <input id="AutorizadorEmail" onChange={handleEmailChange}  value={Email} className="slcDropdown" ></input>
            </div> 
          </div>
          
        )}

        <DialogFooter>
          <PrimaryButton onClick={
            async ()=>{
              await data.CrearPerfiles(Title,Rol,Usuario, Eleccion,Email)?toggleHideDialog():"error al guardar"}} text="Crear" disabled={false}  />
          </DialogFooter>
        </Dialog>
    </>
  );
};

