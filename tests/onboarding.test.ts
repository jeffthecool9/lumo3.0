import {describe,it,expect} from 'vitest';
import {guideKey,setupProgress} from '../shared/onboarding';
import {sampleState} from '../src/sample';
describe('guided workspace setup',()=>{
 it('starts with business facts, not a confusing menu of features',()=>{const state=sampleState();state.knowledge.name='';state.knowledge.business='';expect(setupProgress(state,false,false)).toMatchObject({count:0,next:{id:'knowledge'}});});
 it('requires approved prices before moving to sales flow',()=>{expect(setupProgress(sampleState(),false,false).next?.id).toBe('catalogue');});
 it('does not count a saved draft as approved',()=>{expect(setupProgress(sampleState(),true,true)).toMatchObject({complete:[true,true,false,false],next:{id:'plan'}});});
 it('requires a successful practice and approved plan',()=>{const state=sampleState();state.plans[0].approved_at=new Date().toISOString();expect(setupProgress(state,true,false).next?.id).toBe('chat');expect(setupProgress(state,true,true)).toMatchObject({count:4,next:null});});
 it('keeps remembered tutorial choices separate between businesses',()=>{expect(guideKey('one')).not.toBe(guideKey('two'));});
 it('recomputes readiness when a prerequisite is removed',()=>{const state=sampleState();state.plans=[];expect(setupProgress(state,true,true).complete[3]).toBe(false);});
 it('does not let an earlier approved flow mark a new draft ready',()=>{const state=sampleState();state.plans[0].approved_at=new Date().toISOString();state.plans.unshift({...state.plans[0],id:'new-draft',approved_at:null});expect(setupProgress(state,true,true).complete).toEqual([true,true,false,false]);expect(setupProgress(state,true,true,'sample-v1').count).toBe(4);});
});
