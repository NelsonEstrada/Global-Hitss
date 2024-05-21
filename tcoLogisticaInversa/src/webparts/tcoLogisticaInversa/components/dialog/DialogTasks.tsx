/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { useBoolean } from '@fluentui/react-hooks';
import { TextField } from '@fluentui/react';


const modelProps = {
  isBlocking: false,
  styles: { main: { maxWidth: 450 } },
};


interface IDialog{
  id:number,
  show:boolean,
  title?:string,
  responsable?:string,
  AprobarTask:(observaciones:string)=>Promise<boolean>,
  NoAprobarTask:(observaciones:string)=>Promise<boolean>,
  observaciones:string,
  estado:string
}


export const DialogTask: React.FunctionComponent<IDialog> = (data) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [observaciones, setObervaciones] = React.useState('');
  if(data.show ===true){
    toggleHideDialog();
  }
  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: `Tarea --> ${data.title}`,
    subText: `Responsable --> ${data.responsable}`,
  };

  const vista:boolean =data.estado==='En curso' ? true:false;

  return (
    <>
      <DefaultButton onClick={toggleHideDialog} text="Ver Tarea" />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >
        <TextField
            multiline
            rows={4}
            label="Observaciones"
            placeholder="Ingrese las Observaciones pertinentes"
            value={vista?observaciones:data.observaciones}
            disabled={!vista}
            
            onChange={(event,value)=> setObervaciones(value!==undefined?value:'')}
        />
        <DialogFooter>
          {vista&&<PrimaryButton onClick={()=>data.AprobarTask(observaciones).then(()=>toggleHideDialog)} text="Aprobar" disabled={false} />}
          {vista&&<DefaultButton onClick={()=>data.NoAprobarTask(observaciones).then(()=>toggleHideDialog)} text="No Aprobar" disabled={false}/>}
          <PrimaryButton onClick={toggleHideDialog} text="Volver" disabled={false} />
        </DialogFooter>
      </Dialog>
    </>
  );
};
