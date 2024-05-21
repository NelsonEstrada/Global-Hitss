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
import {
  DatePicker,
} from '@fluentui/react';
import styles from '../admonPerfiles/AdmonPerfiles.module.scss';
import { DropdownComponent } from '../utils/DropdownComponent';
import { MaskedTextField, TextField } from 'office-ui-fabric-react';

/*
const days: IDropdownOption[] = [
  { text: 'Sunday', key: DayOfWeek.Sunday },
  { text: 'Monday', key: DayOfWeek.Monday },
  { text: 'Tuesday', key: DayOfWeek.Tuesday },
  { text: 'Wednesday', key: DayOfWeek.Wednesday },
  { text: 'Thursday', key: DayOfWeek.Thursday },
  { text: 'Friday', key: DayOfWeek.Friday },
  { text: 'Saturday', key: DayOfWeek.Saturday },
];
*/
const modelProps = {
  isBlocking: false,
  styles: { main: { maxWidth: 450 } },
};


interface IDialogPerfiles{
  id:number,
  show:boolean,
  title?:string,
  context?:any,
  NumeroContrato?:any,
  FechaInicio?:any,
  FechaFin?:any,
  FechaFinAnterior?:any,
  Proveedor?:any,
  Accion?:any,
  Valor?:any,
  CrearContratoMarco?:(Proveedor:any,NumeroContrato:any,FechaInicio:any,FechaFin:any,Valor:any)=>Promise<boolean>
  ActualizarContratoMarco?:(id:number,Proveedor:any,NumeroContrato:any,FechaInicio:any,FechaFin:any,FechaFinAnterior:any,Valor:any)=>Promise<boolean>
}


export const DialogContratoMarcoEditar: React.FunctionComponent<IDialogPerfiles> = (data) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [NumeroContrato] = React.useState(data.NumeroContrato);
  const [Proveedor] = React.useState(data.Proveedor);
  const [FechaFinAnterior] = React.useState<Date| null>(data.FechaFin.split('T')[0]);
  const [FechaFin, setFechaFin] = React.useState<Date| null>(null);
  const [FechaInicio] = React.useState<Date| null>(data.FechaInicio.split('T')[0]);
  const [Valor, setValor] = React.useState(data.Valor.toString());
  
  if(data.show ===true){
    toggleHideDialog();
  }
  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Contrato Marco",
  };

  const handleDateChangeFin = (date: Date | null): void => {
    setFechaFin(date);
  };
 
  return (
    <>
      <PrimaryButton
         className={ styles.colorButton}
      onClick={toggleHideDialog} text="Modificar Contrato Marco" />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >
       
        <TextField label="Numero Contrato" id='NumeroContrato'  value={NumeroContrato}  disabled={true}/>
       
        <MaskedTextField 
          mask="9999999999999"
         label="Valor Unitario" id='ValorUnitario'  value={Valor} onChange={(event,value)=> setValor(value!==undefined?value:'')}/>
        <TextField label="Fecha de Inicio"   value={data.FechaInicio.split('T')[0]}  disabled={true}/>
        <TextField label="Fecha de finalizacion Anterior"   value={FechaFinAnterior.toString().split('T')[0].split('T')[0]}  disabled={true}/>
      <DatePicker
        label="Fecha de Finalización"
        placeholder="Select a date..."
        ariaLabel="Select a date"
        onSelectDate={handleDateChangeFin}
        value={FechaFin}
      />  

      <TextField label="Proveedores" 
          value={Proveedor}
          disabled={true}
         />
        <DialogFooter>
        <PrimaryButton onClick={
            async ()=>{
              await data.ActualizarContratoMarco(data.id,Proveedor,NumeroContrato,FechaInicio,FechaFin,FechaFinAnterior,data.Valor)?toggleHideDialog():"error al guardar"}} text="Actualizar" disabled={false}  />
            
        </DialogFooter>
      </Dialog>
    </>
  );
};

export const DialogContratoMarcoNew: React.FunctionComponent<IDialogPerfiles> = (data) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [NumeroContrato, setNumeroContrato] = React.useState(data.NumeroContrato);
  const [Proveedor, setProveedor] = React.useState(data.Proveedor);
  const [FechaFin, setFechaFin] = React.useState<Date| null>(null);
  const [FechaInicio, setFechaInicio] = React.useState<Date| null>(null);
  const [Valor, setValor] = React.useState(data.Valor);
  
  
  if(data.show ===true){
    toggleHideDialog();
  }
  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: "Nuevo Contrato Marco"
  };

  const handleDateChangeInicio = (date: Date | null): void => {
    console.log(date);
    setFechaInicio(date);
  };

  const handleDateChangeFin = (date: Date | null): void => {
    console.log(date);
    setFechaFin(date);
  };
 

  return (
    <>
      <PrimaryButton
         className={ styles.colorButton}
      onClick={toggleHideDialog} text="Nuevo Contrato Marco" />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >
       
        <TextField label="Numero Contrato" id='NumeroContrato'  value={NumeroContrato} onChange={(event,value)=> setNumeroContrato(value!==undefined?value:'')}/>
       
        <MaskedTextField 
          mask="999999999999999"
         label="Valor" id='Valor'  value={Valor} onChange={(event,value)=> setValor(value!==undefined?value:'')}/>

      <DatePicker
        label="Fecha de Inicio"
        placeholder="Select a date..."
        ariaLabel="Select a date"
        value={FechaInicio}
        onSelectDate={handleDateChangeInicio}
        formatDate={(date: Date) => date.toLocaleDateString()}
      />

      <DatePicker
        label="Fecha de Finalización"
        placeholder="Select a date..."
        ariaLabel="Select a date"
        value={FechaFin}
        onSelectDate={handleDateChangeFin}
        formatDate={(date: Date) => date.toLocaleDateString()}
      />  

      <DropdownComponent 
          listName="Proveedores" 
          fieldName='Proveedores'
          fieldSearch='Title'
          onChange={(value: any)=> setProveedor(value!==undefined?value:'')} 
          context={data.context}
          rol={data.Proveedor}
         />
        <DialogFooter>
          <PrimaryButton onClick={
            async ()=>{
              await data.CrearContratoMarco(Proveedor,NumeroContrato,FechaInicio,FechaFin,Valor)?toggleHideDialog():"error al guardar"}} text="Crear" disabled={false}  />
            
        </DialogFooter>
      </Dialog>
    </>
  );
};

