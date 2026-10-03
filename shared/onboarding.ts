import type {WorkspaceState} from './schema.js';
export const setupSteps=[
 {id:'knowledge',title:'Business details',action:'Add business details'},
 {id:'catalogue',title:'Products & prices',action:'Review products & prices'},
 {id:'plan',title:'Sales flow',action:'Review sales flow'},
 {id:'chat',title:'Practice chat',action:'Start a practice chat'},
] as const;
export type SetupTab=typeof setupSteps[number]['id'];
export function setupProgress(state:WorkspaceState,approvedOffers:boolean,tested:boolean,planId=state.plans[0]?.id){
 const approved=!!state.plans.find(p=>p.id===planId)?.approved_at;
 const complete=[!!state.knowledge.name.trim()&&!!state.knowledge.business.trim(),approvedOffers,approved,tested&&approved];
 return {complete,count:complete.filter(Boolean).length,next:setupSteps[complete.findIndex(done=>!done)]??null};
}
export const guideKey=(workspaceId:string)=>`lumo-guide-v1:${workspaceId}`;
