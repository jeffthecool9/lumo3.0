import {beforeEach,describe,it,expect,vi} from 'vitest';
import express from 'express';
import request from 'supertest';
const mock=vi.hoisted(()=>({calls:[] as {method:string;args:any[]}[],data:null as any}));
vi.mock('../server/db.js',()=>({database:()=>({from:(table:string)=>{mock.calls.push({method:'from',args:[table]});const query:any={then:(resolve:any)=>resolve({data:mock.data,error:null})};for(const method of ['select','eq','order','limit','not','insert','update','single','maybeSingle'])query[method]=(...args:any[])=>{mock.calls.push({method,args});return query;};return query;}}),checked:async(query:any)=>(await query).data}));
import {sales,approvedCatalogue} from '../server/sales';
const app=express();app.use(express.json());app.use((_req,res,next)=>{res.locals.workspace='owner-workspace';next();});app.use('/sales',sales);app.use((error:any,_req:any,res:any,_next:any)=>res.status(error.status??400).json({error:error.message}));
const id='10000000-0000-4000-8000-000000000001';
beforeEach(()=>{mock.calls=[];mock.data=null;});
describe('sales authorization boundaries',()=>{
 it('scopes catalogue retrieval and formats approved exact prices',async()=>{mock.data=[{name:'Package',description:'Facts',terms:'Terms',price_sen:19990}];expect(await approvedCatalogue('owner-workspace')).toEqual([{name:'Package',description:'Facts',terms:'Terms',price:'RM 199.90'}]);expect(mock.calls).toContainEqual({method:'eq',args:['workspace_id','owner-workspace']});expect(mock.calls).toContainEqual({method:'not',args:['approved_at','is',null]});});
 it('fails clearly instead of silently truncating approved offers',async()=>{mock.data=Array(31).fill({});await expect(approvedCatalogue('owner-workspace')).rejects.toThrow(/30 approved/);});
 it('uses ownership and reviewed timestamp in approval update',async()=>{const stamp='2026-10-03T00:00:00Z';const r=await request(app).post(`/sales/offers/${id}/approval`).send({expected_updated_at:stamp});expect(r.status).toBe(409);expect(mock.calls).toContainEqual({method:'eq',args:['workspace_id','owner-workspace']});expect(mock.calls).toContainEqual({method:'eq',args:['updated_at',stamp]});});
 it('cannot inject workspace ownership or approve in an offer edit',async()=>{const r=await request(app).post('/sales/offers').send({name:'Test',price_sen:9900,description:'',terms:'',workspace_id:'other'});expect(r.status).toBe(400);expect(mock.calls).toHaveLength(0);});
 it('scopes task status updates and rejects unknown records',async()=>{const r=await request(app).patch(`/sales/followups/${id}`).send({status:'completed'});expect(r.status).toBe(404);expect(mock.calls).toContainEqual({method:'eq',args:['workspace_id','owner-workspace']});});
});
