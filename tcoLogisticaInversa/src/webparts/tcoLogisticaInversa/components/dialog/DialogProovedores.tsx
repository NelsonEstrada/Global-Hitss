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
import { TextField } from '@fluentui/react';
import { PeoplePicker } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import styles from '../admonProveedores/AdmonProveedores.module.scss';
import { DropdownComponent } from '../utils/DropdownComponent';


const modelProps = {
  isBlocking: false,
  styles: { main: { maxWidth: 450 } },
};


interface IDialogProveedores{
  id:number,
  show:boolean,
  title?:string,
  context?:any,
  nit?:string,
  centroDeCosto?:string,
  contratoMarco?:string,
  posPre?:string,
  aprobadorFacturacion?:any,
  CrearProveedor?:(Title:string,NIT:string,CentroDeCosto:string,ContratoMarco:any,PosPre:string,AprobadorFacturacion:any)=>Promise<boolean>
  ActualizarProveedor?:(id:number,Title:string,NIT:string,CentroDeCosto:string,ContratoMarco:any,PosPre:string,AprobadorFacturacion:any)=>Promise<boolean>
}


export const DialogProveedoresEditar: React.FunctionComponent<IDialogProveedores> = (data) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [Title, setTitle] = React.useState(data.title);
  const [NIT, setNIT] = React.useState(data.nit);
  const [CentroDeCosto, setCentroDeCosto] = React.useState(data.centroDeCosto);
  console.log("MaicolPe");
  const [ContratoMarco, setContratoMarco] = React.useState(data.contratoMarco);
  const [PosPre, setPosPre] = React.useState(data.posPre);
  const [AprobadorFacturacion, setAprobadorFacturacion] = React.useState(0);
  
  if(data.show ===true){
    toggleHideDialog();
  }
  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Nuevo Proveedor",
  };

  function _getPeoplePickerItems(items: any[]){
    console.log(AprobadorFacturacion);
    setAprobadorFacturacion(items[0].id);
  }


  function _getContratoPickerItem(contrato: any){
    console.log(contrato);
    setContratoMarco(contrato);
  }
 
  return (
    <>
      <PrimaryButton
         className={ styles.colorButton}
      onClick={toggleHideDialog} text="Editar Proveedor" />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >

         <TextField label="Nombre Proveedor" id='Title'  value={Title} onChange={(event,value)=> setTitle(value!==undefined?value:'')}/>
         <TextField label="NIT" id='NIT'  value={NIT} onChange={(event,value)=> setNIT(value!==undefined?value:'')}/>
         <TextField label="Centro de Costo" id='CentroDeCosto'  value={CentroDeCosto} onChange={(event,value)=> setCentroDeCosto(value!==undefined?value:'')}/>
         
         <DropdownComponent 
         listName="ContratoMarco" 
         onChange={_getContratoPickerItem} 
         context={data.context}
         fieldName='Contrato Marco'
         fieldSearch='NumeroContrato'
         rol={data.contratoMarco}
         />


         <TextField label="Pos Pre" id='PosPre' value={PosPre} onChange={(event,value)=> setPosPre(value!==undefined?value:'')}/>
         <TextField label="Aprobador Facturación" id='AprobadorFacturacion' value={data.aprobadorFacturacion} disabled={true}/>
         <PeoplePicker
              context={data.context}
              titleText="Nombre del nuevo aprobador facturación"
              personSelectionLimit={1}
              placeholder="Por favor escriba el correo o nombre completo"
              groupName={""} // Leave this blank in case you want to filter from all users
              showtooltip={true}
              required={true}
              onChange={_getPeoplePickerItems}
              showHiddenInUI={false}
              resolveDelay={100} 
              ensureUser={true}
          /> 
        <DialogFooter>
          <PrimaryButton onClick={async ()=>{
              await data.ActualizarProveedor(data.id,Title,NIT,CentroDeCosto,ContratoMarco,PosPre,AprobadorFacturacion)?toggleHideDialog():"error al guardar"}} text="Guardar Cambios" disabled={false}  />
        </DialogFooter>
      </Dialog>
    </>
  );
};


export const DialogProveedoresNew: React.FunctionComponent<IDialogProveedores> = (data) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [Title, setTitle] = React.useState('');
  const [NIT, setNIT] = React.useState('');
  const [CentroDeCosto, setCentroDeCosto] = React.useState('');
  const [ContratoMarco, setContratoMarco] = React.useState('');
  const [PosPre, setPosPre] = React.useState('');
  const [AprobadorFacturacion, setAprobadorFacturacion] = React.useState(0);
  
  if(data.show ===true){
    toggleHideDialog();
  }
  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Nuevo Proveedor"
  };
  
  function _getPeoplePickerItems(items: any[]){
    console.log(AprobadorFacturacion);
    setAprobadorFacturacion(items[0].id);
  }

  function _getContratoPickerItem(contrato: string){
    console.log(contrato);
    setContratoMarco(contrato);
  }

  return (
    <>
      <PrimaryButton
         className={ styles.colorButton}
      onClick={toggleHideDialog} text="Nuevo Proveedor" />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >

         <TextField label="Nombre Proveedor" id='Title'  value={Title} onChange={(event,value)=> setTitle(value!==undefined?value:'')}/>
         <TextField label="NIT" id='NIT'  value={NIT} onChange={(event,value)=> setNIT(value!==undefined?value:'')}/>
         <TextField label="Centro de Costo" id='CentroDeCosto'  value={CentroDeCosto} onChange={(event,value)=> setCentroDeCosto(value!==undefined?value:'')}/>
         
         
         <DropdownComponent 
         listName="ContratoMarco" 
         fieldName='Contrato Marco'
         fieldSearch='NumeroContrato'
         onChange={_getContratoPickerItem} 
         context={data.context}/>



         <PeoplePicker
              context={data.context}
              titleText="Nombre del aprobador Facturacion"
              personSelectionLimit={1}
              placeholder="Por favor escriba el correo o nombre completo"
              groupName={""} // Leave this blank in case you want to filter from all users
              showtooltip={true}
              required={true}
              onChange={_getPeoplePickerItems}
              showHiddenInUI={false}
              resolveDelay={100} 
              ensureUser={true}
          /> 
         <TextField label="Pos Pre" id='PosPre' value={PosPre} onChange={(event,value)=> setPosPre(value!==undefined?value:'')}/>

        <DialogFooter>
          <PrimaryButton onClick={
            async ()=>{
              await data.CrearProveedor(Title,NIT,CentroDeCosto,ContratoMarco,PosPre,AprobadorFacturacion)?toggleHideDialog():"error al guardar"}} text="Crear" disabled={false}  />
        </DialogFooter>
      </Dialog>
    </>
  );
};

