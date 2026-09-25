import { app } from './app';
import { config } from './config';
import express from 'express';
import {fileURLToPath} from 'node:url';
const dist=fileURLToPath(new URL('../dist/',import.meta.url));
if(config.NODE_ENV==='production'){
  app.use(express.static(dist,{index:false}));
  app.get(['/','/workspace','/sample','/terms','/privacy'],(_req,res)=>res.sendFile(`${dist}/index.html`));
}
app.listen(config.PORT, config.HOST,()=>console.log(`Lumo: http://${config.HOST}:${config.PORT}`));
