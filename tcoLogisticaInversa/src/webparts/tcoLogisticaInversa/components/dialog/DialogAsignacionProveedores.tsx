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
import styles from '../admonPerfiles/AdmonPerfiles.module.scss';
import { DropdownComponent } from '../utils/DropdownComponent';
import { TextField } from '@fluentui/react';


const modelProps = {
  isBlocking: false,
  styles: { main: { maxWidth: 450 } },
};


interface IDialogAsignacionProveedores{
  id:number,
  show:boolean,
  title?:string,
  context?:any,
  usuario?:any,
  proveedor?:any,
  usuarioId?:any,
  CrearPerfiles?:(Title:string,Rol:any,Usuario:any)=>Promise<boolean>
  ActualizarProveedorAsignado?:(id:number,Title:string,Rol:any,Usuario:any)=>Promise<boolean>
}


export const DialogAsignacionProveedoresEditar: React.FunctionComponent<IDialogAsignacionProveedores> = (data) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [Title, setTitle] = React.useState(data.title);
  const [Proveedor, setProveedor] = React.useState(data.proveedor);
  if(data.show ===true){
    toggleHideDialog();
  }
  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Asignación Proveedores",
  };

 
  function _getProveedorPickerItem(proveedor: string){
    setTitle("Perfil Asignado");
    setProveedor(proveedor);
  }
 
  return (
    <>
      <PrimaryButton
         className={ styles.colorButton}
          onClick={toggleHideDialog} text="Asignación Proveedores" />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >

        <DropdownComponent 
          listName="Proveedores" 
          fieldName='Proveedores'
          fieldSearch='Title'
          onChange={(value: any)=> _getProveedorPickerItem(value!==undefined?value:'')} 
          context={data.context}
          rol={data.proveedor}
         />

         <TextField
         value={data.usuario}
         disabled={true}
         />
          
        <DialogFooter>
          <PrimaryButton onClick={async ()=>{
              await data.ActualizarProveedorAsignado(data.id,Title,Proveedor,data.usuarioId)?toggleHideDialog():"error al guardar"}} text="Guardar Cambios" disabled={false}  />
        </DialogFooter>
      </Dialog>
    </>
  );
};
