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
import { MaskedTextField, TextField } from '@fluentui/react';
import styles from '../admonProveedores/AdmonProveedores.module.scss';
import { DropdownComponent } from '../utils/DropdownComponent';


const modelProps = {
  isBlocking: false,
  styles: { main: { maxWidth: 450 } },
};


interface IDialogTarifa{
  id:number,
  show:boolean,
  title?:string,
  context?:any,
  CodigoTarifa?:any;
  Proveedor?:any;
  Descripcion?:any;
  Labor?:any;
  ValorUnitario?:any;
  CrearTarifa?:(Title:string,CodigoTarifa:string,Proveedor:string,Descripcion:string,Labor:string,ValorUnitario:any)=>Promise<boolean>;
  ActualizarTarifa?:(id:number,Title:string,CodigoTarifa:string,Proveedor:string,Descripcion:string,Labor:string,ValorUnitario:any)=>Promise<boolean>;
  EliminarTarifa?:(id:number)=>Promise<boolean>;
}


export const DialogEditarTarifa: React.FunctionComponent<IDialogTarifa> = (data) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [Title] = React.useState("Nueva Tarifa");
  const [CodigoTarifa, setCodigoTarifa] = React.useState(data.CodigoTarifa.toString());
  const [Proveedor, setProveedor] = React.useState(data.Proveedor);
  const [Descripcion, setDescripcion] = React.useState(data.Descripcion);
  const [Labor, setLabor] = React.useState(data.Labor);
  const [ValorUnitario, setValorUnitario] = React.useState(data.ValorUnitario.toString());
  
  if(data.show ===true){
    toggleHideDialog();
  }
  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Tarifa",
  };

  return (
    <>
      <PrimaryButton
         className={ styles.colorButton}
      onClick={toggleHideDialog} text="Editar Tarifa" />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >

      <MaskedTextField 
          mask="99999"
         label="Codigo Tarifa" id='CodigoTarifa'  value={CodigoTarifa} onChange={(event,value)=> setCodigoTarifa(value!==undefined?value:'')}/>
          <DropdownComponent
          listName="Proveedores" 
          onChange={(value: any)=> setProveedor(value!==undefined?value:'')} 
          context={data.context}
          fieldName='Proveedores'
          fieldSearch='Title'
          rol={data.Proveedor}
         />
         <TextField label="Descripción" id='Descripcion'  value={Descripcion} onChange={(event,value)=> setDescripcion(value!==undefined?value:'')}/>
        
         <TextField label="Labor" id='Labor' value={Labor} onChange={(event,value)=> setLabor(value!==undefined?value:'')}/>
         <MaskedTextField 
          mask="9999999999999"
         label="Valor Unitario" id='ValorUnitario'  value={ValorUnitario} onChange={(event,value)=> setValorUnitario(value!==undefined?value:'')}/>
        <DialogFooter>
          <PrimaryButton onClick={async ()=>{
              await data.ActualizarTarifa(data.id,Title,CodigoTarifa,Proveedor,Descripcion,Labor,ValorUnitario)?toggleHideDialog():"error al guardar"}} text="Guardar Cambios" disabled={false}  />
        </DialogFooter>
      </Dialog>
    </>
  );
};


export const DialogNuevoTarifa: React.FunctionComponent<IDialogTarifa> = (data) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [CodigoTarifa, setCodigoTarifa] = React.useState(data.CodigoTarifa);
  const [Proveedor, setProveedor] = React.useState(data.Proveedor);
  const [Descripcion, setDescripcion] = React.useState(data.Descripcion);
  const [Labor, setLabor] = React.useState(data.Labor);
  const [ValorUnitario, setValorUnitario] = React.useState(data.ValorUnitario);
  
  if(data.show ===true){
    toggleHideDialog();
  }
  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Nueva Tarifa"
  };
  
  
  return (
    <>
      <PrimaryButton
         className={ styles.colorButton}
      onClick={toggleHideDialog} text="Nueva Tarifa" />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >

         <MaskedTextField 
          mask="99999"
         label="Codigo Tarifa" id='CodigoTarifa'  value={CodigoTarifa} onChange={(event,value)=> setCodigoTarifa(value!==undefined?value:'')}/>
          <DropdownComponent 
          listName="Proveedores" 
          onChange={(value: any)=> setProveedor(value!==undefined?value:'')}
          fieldName='Proveedores'
          fieldSearch='Title'
          context={data.context}
          rol={data.Proveedor}
         />
         <TextField label="Descripción" id='Descripcion'  value={Descripcion} onChange={(event,value)=> setDescripcion(value!==undefined?value:'')}/>
        
         <TextField label="Labor" id='Labor' value={Labor} onChange={(event,value)=> setLabor(value!==undefined?value:'')}/>
         <MaskedTextField 
          mask="9999999999999"
         label="Valor Unitario" id='ValorUnitario'  value={ValorUnitario} onChange={(event,value)=> setValorUnitario(value!==undefined?value:'')}/>
        <DialogFooter>
          <PrimaryButton onClick={
            async ()=>{
              await data.CrearTarifa("Nueva Tarifa",CodigoTarifa,Proveedor,Descripcion,Labor,ValorUnitario)?toggleHideDialog():"error al guardar"}} text="Crear" disabled={false}  />
        </DialogFooter>
      </Dialog>
    </>
  );
};



export const DialogEliminarTarifa: React.FunctionComponent<IDialogTarifa> = (data) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  
  if(data.show ===true){
    toggleHideDialog();
  }
  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Eliminar"
  };
  
  
  return (
    <>
      <PrimaryButton
         className={ styles.colorButton}
      onClick={toggleHideDialog} text="Eliminar" />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >

         <>Desea Eliminar esta Tarifa</>
        <DialogFooter>
          <PrimaryButton onClick={
            async ()=>{
              await data.EliminarTarifa(data.id)?toggleHideDialog():"error al Eliminar"}} text="Eliminar" disabled={false}  />
          <PrimaryButton onClick={()=>toggleHideDialog()} text="Cancelar" disabled={false}  />
        </DialogFooter>
      </Dialog>
    </>
  );
};

