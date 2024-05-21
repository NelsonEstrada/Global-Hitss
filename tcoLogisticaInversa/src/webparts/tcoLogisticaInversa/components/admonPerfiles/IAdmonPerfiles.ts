export interface IAdmonPerfiles{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context?:any;
    getData?:()=>any;
    regresar?:()=>any;
}

export interface IPerfiles{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key?:any;
    Title?:string;
    Rol?:string;
    Proveedor?:string;
    Tipo?:string;
    Usuario?:any;
    Accion?:any;
}