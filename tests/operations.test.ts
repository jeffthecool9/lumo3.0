import {describe,it,expect} from 'vitest';
import {appointmentInput,appointmentConflict,leadInput,leadPatch,settingsInput,type Appointment} from '../shared/operations';
const id='10000000-0000-4000-8000-000000000001';
const slot={lead_id:id,service:'Haircut',resource:'Chair A',starts_at:'2027-01-01T03:00:00Z',ends_at:'2027-01-01T04:00:00Z',status:'confirmed' as const,notes:''};
describe('business input boundaries',()=>{
  it('rejects caller-supplied ownership and unexpected fields',()=>{
    expect(leadInput.safeParse({name:'Test',workspace_id:'other'}).success).toBe(false);
    expect(appointmentInput.safeParse({...slot,workspace_id:'other'}).success).toBe(false);
    expect(leadPatch.safeParse({}).success).toBe(false);
  });
  it('preserves untouched fields in a partial lead update',()=>{
    expect(leadPatch.parse({stage:'won'})).toEqual({stage:'won'});
    expect(leadInput.parse({name:' Test '})).toEqual({name:'Test',email:'',phone:'',interest:'',notes:'',stage:'new'});
  });
  it('bounds input and validates contact email',()=>{
    expect(leadInput.safeParse({name:'Test',email:'not-an-email'}).success).toBe(false);
    expect(leadInput.safeParse({name:'Test',notes:'x'.repeat(2001)}).success).toBe(false);
  });
  it('requires explicit timezone timestamps and a positive, bounded appointment duration',()=>{
    expect(appointmentInput.safeParse(slot).success).toBe(true);
    expect(appointmentInput.safeParse({...slot,starts_at:'2027-01-01T03:00'}).success).toBe(false);
    expect(appointmentInput.safeParse({...slot,ends_at:slot.starts_at}).success).toBe(false);
    expect(appointmentInput.safeParse({...slot,ends_at:'2027-01-03T04:00:00Z'}).success).toBe(false);
  });
  it('validates business timezones',()=>{
    expect(settingsInput.safeParse({industry:'beauty',timezone:'Asia/Kuala_Lumpur'}).success).toBe(true);
    expect(settingsInput.safeParse({industry:'beauty',timezone:'Mars/City'}).success).toBe(false);
  });
  it('keeps the sample conflict rule consistent with confirmed resource slots',()=>{
    const saved={...slot,id,created_at:'',updated_at:''} as Appointment;
    const other={...saved,id:'other',resource:'chair a'};
    expect(appointmentConflict([saved],other)).toBe(true);
    expect(appointmentConflict([saved],{...other,status:'requested'})).toBe(false);
    expect(appointmentConflict([saved],{...other,starts_at:slot.ends_at,ends_at:'2027-01-01T05:00:00Z'})).toBe(false);
    expect(appointmentConflict([saved],saved)).toBe(false);
  });
});
