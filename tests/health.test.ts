import {afterEach,describe,expect,it,vi} from 'vitest';
import request from 'supertest';
import {app} from '../server/app';
import {readiness} from '../server/config';
import * as storage from '../server/db';

const originalDatabaseReadiness=readiness.database;
afterEach(()=>{readiness.database=originalDatabaseReadiness;vi.restoreAllMocks();});

function mockDatabase(result:unknown,throws=false){
  const query={select:vi.fn().mockReturnThis(),eq:vi.fn().mockReturnThis(),
    abortSignal:vi.fn().mockReturnThis(),maybeSingle:throws?vi.fn().mockRejectedValue(result):vi.fn().mockResolvedValue(result)};
  const from=vi.fn().mockReturnValue(query);
  vi.spyOn(storage,'database').mockReturnValue({from} as unknown as ReturnType<typeof storage.database>);
  readiness.database=true;
  return {from,...query};
}

describe('hosted database health',()=>{
  it('distinguishes a fixture preview from a connected database',async()=>{
    readiness.database=false;
    const response=await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.databaseStatus).toBe('not_configured');
  });
  it('checks only the control row and bounds the request duration',async()=>{
    const query=mockDatabase({data:{id:1},error:null});
    const response=await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.databaseStatus).toBe('ready');
    expect(query.from).toHaveBeenCalledWith('platform_controls');
    expect(query.select).toHaveBeenCalledWith('id');
    expect(query.abortSignal).toHaveBeenCalledWith(expect.any(AbortSignal));
    expect(response.headers['cache-control']).toBe('no-store');
  });
  it.each([
    {data:null,error:{message:'private provider diagnostic'}},
    {data:null,error:null},
  ])('returns unavailable without exposing provider errors',async result=>{
    mockDatabase(result);
    const response=await request(app).get('/api/health');
    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({ok:false,databaseStatus:'unavailable'});
    expect(JSON.stringify(response.body)).not.toContain('private provider diagnostic');
  });
  it('handles network failures without revealing credentials',async()=>{
    mockDatabase(new Error('private connection data'),true);
    const response=await request(app).get('/api/health');
    expect(response.status).toBe(503);
    expect(response.body.databaseStatus).toBe('unavailable');
    expect(JSON.stringify(response.body)).not.toContain('private connection data');
  });
});
