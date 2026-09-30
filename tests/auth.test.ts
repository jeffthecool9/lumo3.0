import {describe,it,expect} from 'vitest';
import {normalizePhone,authError} from '../src/auth-utils';
import {hasVerifiedIdentity} from '../server/firebase';
import {availableAuthMethods} from '../shared/auth-methods';

describe('sign-up availability',()=>{
  const configured={auth:true,authServer:true,database:true,authMethods:{google:true,email:true,phone:false}};
  it('offers only explicitly enabled providers',()=>{
    expect(availableAuthMethods(configured)).toEqual({google:true,email:true,phone:false});
    expect(availableAuthMethods({...configured,authMethods:undefined})).toEqual({google:false,email:false,phone:false});
    expect(availableAuthMethods(null)).toEqual({google:false,email:false,phone:false});
  });
  it.each(['auth','authServer','database'] as const)('blocks account creation without %s',missing=>{
    expect(availableAuthMethods({...configured,[missing]:false})).toEqual({google:false,email:false,phone:false});
  });
  it('requires an explicit phone opt-in',()=>{
    expect(availableAuthMethods({...configured,authMethods:{google:true,email:true,phone:true}}).phone).toBe(true);
  });
});
describe('verified Firebase account requirements',()=>{
  it('requires email verification for password accounts',()=>{
    expect(hasVerifiedIdentity({email:'owner@example.com',email_verified:false})).toBe(false);
    expect(hasVerifiedIdentity({email:'owner@example.com',email_verified:true})).toBe(true);
  });
  it('accepts a provider-verified phone identity',()=>{
    expect(hasVerifiedIdentity({phone_number:'+60123456789'})).toBe(true);
    expect(hasVerifiedIdentity({})).toBe(false);
  });
  it('normalizes Malaysian and international phone numbers',()=>{
    expect(normalizePhone('012 345 6789','MY')).toBe('+60123456789');
    expect(normalizePhone('+44 7911 123456','MY')).toBe('+447911123456');
  });
  it('rejects invalid numbers before requesting a billed SMS',()=>{
    expect(()=>normalizePhone('123','MY')).toThrow();
    expect(()=>normalizePhone('not a phone','MY')).toThrow();
  });
  it('shows recoverable authentication errors',()=>{
    expect(authError({code:'auth/invalid-verification-code'})).toMatch(/code/i);
    expect(authError({code:'auth/too-many-requests'})).toMatch(/try|wait/i);
  });
});
