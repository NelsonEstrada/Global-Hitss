export interface IRequests{
    key:number;
    Title:string;
    Solicitante:string;
    Estado?:string;
    SolicitudId?:number;
}

export interface IBodyProps{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context?:any;
    ListaMateriales: string;
    urlSitioMateriales: string;
}