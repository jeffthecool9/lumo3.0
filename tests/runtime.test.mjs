import {test} from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../.build-server/api/index.js';

test('compiled Vercel entrypoint starts in native Node and serves the API',async()=>{
  const health=await request(app).get('/api/health');
  assert.equal(health.status,200);
  assert.equal(health.body.ok,true);
  assert.equal(health.headers['cache-control'],'no-store');
  const protectedWorkspace=await request(app).get('/api/workspace');
  assert.equal(protectedWorkspace.status,401);
  assert.equal(protectedWorkspace.body.error,'Sign in to continue.');
});
