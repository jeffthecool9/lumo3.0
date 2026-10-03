import React,{useEffect,useRef} from 'react';
import {X} from 'lucide-react';
export function Modal({title,onClose,children,className='',hideHeading=false}:{title:string;onClose:()=>void;children:React.ReactNode;className?:string;hideHeading?:boolean}){
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{ref.current?.showModal();const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;};},[]);
  return <dialog ref={ref} className={`modal ${className}`} aria-label={title} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current)onClose();}}><div className="modal-head">{!hideHeading&&<h2>{title}</h2>}<button className="icon-button" aria-label="Close dialog" title="Close" onClick={onClose}><X size={20}/></button></div>{children}</dialog>;
}
