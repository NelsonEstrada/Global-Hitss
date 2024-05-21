
/* eslint-disable prefer-const */

/* eslint-disable no-new */

/* eslint-disable no-void */

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/* eslint-disable @typescript-eslint/no-explicit-any */


import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
//import * as jQuery from 'jquery'; 
const jQuery = require('jquery'); 

import {Web,Item} from 'sp-pnp-js';

import '@pnp/sp/folders'
//import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
 

export class Helpers {

    public web: Web;
    public webExternal: Web;
    public siteRelativeUrl: string;

    constructor(context: any) {
      this.web = new Web(context.pageContext.web.absoluteUrl);
      this.siteRelativeUrl = context.pageContext.web.serverRelativeUrl;
    }

    public getCurrentUser(): Promise<any> {
      return this.web.currentUser.get();
    }

    public readFile = async (e: any, funcionSuccess:any) => {

        //  npm i xlsx

        console.log('reading input file:');
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

        if(funcionSuccess){
            funcionSuccess(jsonData)
        }else{
            console.log(jsonData);
        }
        
    }

    public exportDataToExcel = async (apiData:any,fileName:any,  funcionSuccess:any) => {

        //  npm i xlsx
        //  npm install file-saver
        //  npm i --save-dev @types/file-saver

        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".csv";

        const ws = XLSX.utils.json_to_sheet(apiData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);

        if(funcionSuccess){
            funcionSuccess('Success')
        }else{
            console.log('Success');
        }
    }

    public getItemsListExternal(
        urlExternal?:string,
        listName?: string,
        fieldsItem?: string,
        filtersItem?: string,
        expandItem?: string,
        sortid?: any,
      ): Promise<any> {
  
        this.webExternal = new Web(urlExternal);

        const sort = sortid ? sortid : {property : "ID", asc:true};
        const fields = fieldsItem ? fieldsItem : '*';
        const filters = filtersItem ? filtersItem : '';
        const expand = expandItem ? expandItem : '';
        
        return new Promise((resolve, reject) => {
          let list = this.webExternal.lists.getByTitle(listName);
          if (list) {
            list.items
              .filter(filters)
              .select(fields)
              .expand(expand)
              .orderBy(sort.property, sort.asc)
              .getAll()
              .then((items: any[]) => {
                resolve(items);
              })
              .catch(err => {
                reject(null);
              });
          }
        });
    }

    public getItemsList(
        listName: string,
        fieldsItem?: string,
        filtersItem?: string,
        expandItem?: string,
        sortid?: any,
        topItem?: number
      ): Promise<any> {
  
        const top = topItem ? topItem : 4999;
        const sort = sortid ? sortid :{property : "ID", asc:true}
        const fields = fieldsItem ? fieldsItem : '*'
        const filters = filtersItem ? filtersItem : ''
        const expand = expandItem ? expandItem : ''
        
        return new Promise((resolve, reject) => {
          let list = this.web.lists.getByTitle(listName);
          if (list) {
            list.items
              .filter(filters)
              .select(fields)
              .expand(expand)
              .orderBy(sort.property, sort.asc)
              .top(top)
              .get()
              .then((items: any[]) => {
                resolve(items);
              })
              .catch(err => {
                reject(null);
              });
          }
        });
    }

    public getItemsListFull(
      listName: string,
      fieldsItem?: string,
      filtersItem?: string,
      expandItem?: string,
      sortid?: any,
      topItem?: number
    ): Promise<any> {

      const sort = sortid ? sortid :{property : "ID", asc:true}
      const fields = fieldsItem ? fieldsItem : '*'
      const filters = filtersItem ? filtersItem : ''
      const expand = expandItem ? expandItem : ''
 
      return new Promise((resolve, reject) => {
        let list = this.web.lists.getByTitle(listName);
        if (list) {
          list.items
 
            .filter(filters)
            .select(fields)
            .expand(expand)
            .orderBy(sort.property, sort.asc)
            .getAll()
            .then((items: any[]) => {
              resolve(items);
            })
            .catch(err => {
              reject(null);
            });
        }
      });
    }

    public getListOverThreshold(ListName: string,select:string, filtro: string, adicionales: string, funcionexitosa?: any) {

      var Filter = '';
  
      this.getItemsList(ListName,'ID', '','', {property : "ID", asc:false},1
      ).then((result:any) => {
  
          var IdFinal = (result[0] ? result[0].Id : 0);
             var bloque = 5000

              var ciclo = (IdFinal / bloque) > Math.round(IdFinal / bloque) ? Math.round(IdFinal / bloque) + 1 : Math.round(IdFinal / bloque);
              ciclo = ciclo == 0 ? 1 : ciclo;
              var cantidadMaxima = 1

              var countIteractionEntrada = 0;
              var datosListaModificada:any = [];
      
              for (var i = 0; i < ciclo; i++) {
                  cantidadMaxima += bloque;
                  if (!filtro) {
                      Filter = "(Id ge " + (cantidadMaxima - bloque) + ") and (Id le " + (cantidadMaxima-1) + ")";
                  }else{
                      Filter = "(Id ge " + (cantidadMaxima - bloque) + ") and (Id le " + (cantidadMaxima-1) + ") and " + filtro;
                  }
        
                      this.getItemsList(ListName, select, Filter, adicionales, {property : "ID", asc:true}, bloque
                      ).then((result:any) => {
                        
                          countIteractionEntrada++;
                          datosListaModificada = datosListaModificada.concat(result);
          
                          if (ciclo == countIteractionEntrada) {
                              if(funcionexitosa){
                                  funcionexitosa(datosListaModificada);
                              }
                          }
                     

                      })

              }
          
  
      })

    }

    public insertItemList(
      listName: string,
      properties: any,
      attachment?: File
    ): Promise<any> {
      return new Promise((resolve, reject) => {
        let list = this.web.lists.getByTitle(listName);
        list.items
          .add(properties)
          .then(res => {
            if (attachment) {
              res.item.attachmentFiles
                .add(attachment.name, attachment)
                .then(_ => {
                  resolve(res.data);
                }).catch(err => {
                  reject(err);
                });
            } else {
              resolve(res.data);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    }
      
    public updateItemList(
      listname: string,
      id: number,
      properties: any,
      attachment?: File
    ): Promise<any> {
      
      let list = this.web.lists.getByTitle(listname);
      return list.items
        .getById(id)
        .update(properties)
        .then(res => {
          if (attachment) {
            return this.finishSave(res.item, attachment, attachment.name).then(item => {
              return item;
            });
          }else{
            return res;
          }
        });
    }

    public deleteItemList(
      listName: string, 
 id: number): Promise<any> {
      let list = this.web.lists.getByTitle(listName);
      return list.items.getById(id).delete();
    }

    async finishSave(item: Item, attachment: File, attachmentName:string) {
      if (attachment) {
        await item.attachmentFiles.add(attachmentName, attachment);
        const itemUpdated = await item
          .get();
        return itemUpdated;
      } else {
        const itemUpdated = await item
          .get();
        return itemUpdated;
      }
    }

    public uploadFile(repository: string, file: File, name: string): Promise<any> {
      return this.web
        .getFolderByServerRelativeUrl(
          this.siteRelativeUrl+'/'+repository+'/'
        )
        .files.add(name, file, true);
    }
    
    public uploadFileWithFields(
      repository: string, 
      file: File, 
      name: string, 
      fields?: any
    ): Promise<any> {

      return new Promise((resolve, reject) => {
        const fileobject = this.web.getFolderByServerRelativeUrl(this.siteRelativeUrl+'/'+repository+'/');
            fileobject.files
            .add(name, file, true)
            .then(res =>{
              if(fields){
                res.file.getItem().then((item) => {
                  /*item.update(fields).then((myupdate) => {
                    resolve(myupdate);
                  })
                  .catch(err => {
                    reject(err);
                  });*/

                  this.updateFile(item, fields, function(data:any){
                    resolve(data)
                  })

               })
               .catch(err => {
                reject(err);
              });
              }
            })
            .catch(err => {
              reject(err);
            });
      })

    }

    public updateFile(item:any, fields:any, functionSuccess:any){

      this.updateItemList(
        'BibliotecaFacturacion',
        item.ID,
        fields
      ).then(() => {
        functionSuccess('Actulizado')
      })

    }


    public loadingModal = {

      show: function(texto:string, funcionSuccess:any) {
  
          if(!jQuery('#loadingModal')[0]){
  
              jQuery('body').append(
                      '<style>'+
                          '#loadingModal {background: #0003;display:none;position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 10;}'+
                          '.contentModal{top: 150px;left: 0;margin: 150px auto;width: 300px;text-align: center;background: #fff;padding: 20px;border-radius: 8px;font-style: italic;}'+
                          '.imgModal{width: 150px;padding-top: 20px;}'+
                      '</style>'+
                      '<div id="loadingModal">'+
                          '<div class="contentModal">'+
                              '<div class="textModal">'+texto+'</div>'+
                              '<img src="https://claromovilco.sharepoint.com/sites/TCOCPEUMM/SiteAssets/Imagenes/LoadingGif.gif" class="imgModal"></img>'+
                          '</div>'+
                      '</div>')
          }
  
          jQuery('#loadingModal').show();
  
          setTimeout(function(){
            funcionSuccess('OK')
          }, 100);
  
      },
      hide: function() {
          jQuery('.textModal').html();
          jQuery('#loadingModal').hide();
      }

      /* 
      
      Ejemplo Uso 

        private mostarTexto(){
          this.Helpers.loadingModal.show('Texto prueba',()=>{
            console.log('Prueba')
          })
        }
      
      */
  }
}