export interface IAdmonProveedores{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context?:any;
    getData?:()=>any;
    regresar?:()=>any;
}

export interface IProveedores{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key?:any;
    Title?:string;
    NIT?:string;
    CentroDeCosto?:string;
    ContratoMarco?:string;
    PosPre?:string;
    AprobadorFacturacion?:any;
    Accion?:any;
}