import React,{useId} from 'react';
import './brand.css';

export function BrandMark({className=''}:{className?:string}){
  const gradientId=useId();
  return <svg className={`lumo-mark ${className}`} viewBox="0 0 40 40" fill="none" aria-hidden="true"><defs><linearGradient id={gradientId} x1="4" y1="2" x2="36" y2="39" gradientUnits="userSpaceOnUse"><stop stopColor="#6488F5"/><stop offset="1" stopColor="#2048E5"/></linearGradient></defs><rect width="40" height="40" rx="10" fill={`url(#${gradientId})`}/><circle cx="20" cy="20" r="6.85" stroke="white" strokeWidth="2.15"/><circle cx="20" cy="20" r="3.35" fill="white"/></svg>;
}

export function Brand({compact=false,className=''}:{compact?:boolean;className?:string}){
  return <a className={`lumo-brand ${compact?'brand-compact':''} ${className}`} href="/" aria-label="Lumo home"><BrandMark/>{!compact&&<span>Lumo</span>}</a>;
}
