import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {canRenderScene, scenePose} from './scene-state';

// All surfaces are local, illustrative records. No customer screenshots or remote models.
const surfaces = [
  {label:'01 / CUSTOMER ENQUIRY', lines:['Hi, tote ni berapa?', '有黑色吗？', 'English + BM + 中文'], color:'#d9f991'},
  {label:'02 / APPROVED BUSINESS FACT', lines:['Canvas tote', 'RM129', 'Stock & delivery: ask the team.'], color:'#f5f7f0'},
  {label:'03 / ONE CONVERSATION', lines:['RM129 for the canvas tote.', 'Nak pakai sendiri or as a gift?', 'Gift. Budget below RM150.'], color:'#edf3e8'},
  {label:'04 / BUYING INTENT', lines:['Canvas tote / black', 'Budget below RM150', 'Needed by Friday'], color:'#d9f991'},
  {label:'05 / HUMAN FOLLOW-UP', lines:['One buyer. One lead.', 'Confirm colour & delivery.', 'Contact only with permission.'], color:'#f5f7f0'},
];

export function createLumoScene(host:HTMLElement, isPaused:() => boolean, onReady:(ready:boolean) => void) {
  let renderer:THREE.WebGLRenderer;
  try {renderer = new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});} catch {onReady(false); return () => {};}
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden','true');
  host.append(canvas);
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38,1,.1,60);
  scene.add(new THREE.HemisphereLight(0xffffff,0x536464,2.5));
  const key = new THREE.DirectionalLight(0xffffff,4); key.position.set(-4,7,8); scene.add(key);
  const fill = new THREE.DirectionalLight(0x92afff,2); fill.position.set(5,-2,3); scene.add(fill);
  const resources:{dispose:() => void}[] = [];
  const texture = (draw:(ctx:CanvasRenderingContext2D) => void,w=1024,h=576) => {
    const image = document.createElement('canvas'); image.width=w; image.height=h;
    const ctx = image.getContext('2d');
    if (!ctx) throw new Error('Texture unavailable');
    draw(ctx); const map = new THREE.CanvasTexture(image); map.colorSpace=THREE.SRGBColorSpace; resources.push(map); return map;
  };
  const addMesh = (geometry:THREE.BufferGeometry, material:THREE.Material, parent:THREE.Object3D) => {
    resources.push(geometry,material); const mesh = new THREE.Mesh(geometry,material); parent.add(mesh); return mesh;
  };
  let failed = false;
  const logo = new THREE.Group(); scene.add(logo);
  const boards:THREE.Group[] = [];
  try {
    const blue = texture(ctx => {const g=ctx.createLinearGradient(0,0,512,512);g.addColorStop(0,'#6488f5');g.addColorStop(1,'#2048e5');ctx.fillStyle=g;ctx.fillRect(0,0,512,512);},512,512);
    const outline=new THREE.Shape();const half=1.125,radius=.5625;
    outline.moveTo(-half+radius,-half);outline.lineTo(half-radius,-half);outline.quadraticCurveTo(half,-half,half,-half+radius);
    outline.lineTo(half,half-radius);outline.quadraticCurveTo(half,half,half-radius,half);outline.lineTo(-half+radius,half);
    outline.quadraticCurveTo(-half,half,-half,half-radius);outline.lineTo(-half,-half+radius);outline.quadraticCurveTo(-half,-half,-half+radius,-half);
    const mark=new THREE.ExtrudeGeometry(outline,{depth:.32,bevelEnabled:true,bevelThickness:.08,bevelSize:.06,bevelSegments:4,curveSegments:16});mark.translate(0,0,-.16);
    const positions=mark.getAttribute('position'),uv=mark.getAttribute('uv');
    for(let i=0;i<positions.count;i++) uv.setXY(i,(positions.getX(i)+half)/(half*2),(positions.getY(i)+half)/(half*2));
    addMesh(mark,new THREE.MeshStandardMaterial({map:blue,metalness:.18,roughness:.27}),logo);
    // The ring and centre disk preserve the exact proportions of Lumo's approved mark.
    const ring = addMesh(new THREE.TorusGeometry(.385,.061,16,80),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.3}),logo); ring.position.z=.29;
    const dot = addMesh(new THREE.CylinderGeometry(.188,.188,.07,64),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.3}),logo);dot.rotation.x=Math.PI/2;dot.position.z=.29;
    surfaces.forEach((surface,index) => {
      const group = new THREE.Group();scene.add(group);boards.push(group);
      const map = texture(ctx => {
        ctx.fillStyle=surface.color;ctx.fillRect(0,0,1024,576);
        ctx.fillStyle='#17201a';ctx.font='600 28px Inter, Arial, sans-serif';ctx.fillText(surface.label,54,78);
        ctx.fillStyle='#8b9b82';ctx.fillRect(54,106,916,2);
        surface.lines.forEach((line,i) => {ctx.fillStyle=i===2 ? '#4e5d49' : '#17201a';ctx.font=`${i===2 ? '400 30' : '600 48'}px Inter, Arial, "Microsoft YaHei", sans-serif`;ctx.fillText(line,54,205+i*111,916);});
        ctx.fillStyle='#586951';ctx.font='400 22px Arial';ctx.fillText('LUMO / ILLUSTRATIVE SAMPLE',54,536);
      });
      addMesh(new RoundedBoxGeometry(3.65,2.07,.14,3,.12),new THREE.MeshStandardMaterial({color:0x66765d,roughness:.5}),group);
      const face=addMesh(new THREE.PlaneGeometry(3.54,1.97),new THREE.MeshBasicMaterial({map,transparent:true}),group);face.position.z=.078;
      group.userData.face=face;group.userData.index=index;
    });
  } catch {failed=true; onReady(false);}
  let phase = Number(host.closest('.lumo-story')?.getAttribute('data-scene-phase') ?? 0);
  let progress = Number(host.closest('.lumo-story')?.getAttribute('data-scene-progress') ?? 0);
  let entry = Number(host.closest('.lumo-story')?.getAttribute('data-scene-entry') ?? 0);
  let visible = false, frame=0, dirty=true, intro=0, last=0;
  let pointerX=0,pointerY=0;
  const root = host.closest('.lumo-story')!;
  const mobile = () => innerWidth<=800 || innerHeight<=650;
  function resize() {
    const {width,height}=host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio,mobile() ? 1 : 1.5));
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();dirty=true;wake();
  }
  function paint(now:number) {
    frame=0;
    if (!canRenderScene(visible,document.hidden,isPaused(),failed)) return;
    const delta=last ? Math.min(40,now-last) : 16;last=now;intro=Math.min(1,intro+delta/850);
    const pose=scenePose(phase,progress,mobile(),entry);
    const short=innerHeight<=650;
    camera.position.set(pose.cameraX+Math.sin(phase*.8)*pose.entering*.22,Math.sin(phase*.7)*pose.entering*.18,pose.cameraZ-phase*pose.entering*.12);camera.lookAt(0,0,0);
    logo.position.set(pose.logoX,(short ? -1.5 : pose.logoY) - (1-intro)*.35,.7);
    logo.scale.setScalar(short ? .55 : pose.logoScale);logo.rotation.set(-.12+pointerY*.04,pose.logoTurn+pointerX*.06,-.08);
    boards.forEach((board,index) => {
      const opening = pose.entering;
      const distance=Math.abs(phase-index);
      const show = index===0 || index===1 || index===4;
      const opacity=opening ? Math.max(0,1-distance*.9) : (show ? 1 : 0);
      board.visible=opacity>.01;
      const face=board.userData.face as THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;face.material.opacity=opacity;
      if (opening) {
        board.position.set(2.25+(index-phase)*.75,-.4-(index-phase)*.35,-.15-Math.abs(index-phase)*.8);
        board.rotation.set(.06, -.12+(index-phase)*.22, -.025+(index-phase)*.035);
        board.scale.setScalar(1.17);
      } else {
        const positions=[[-2.9,-1.05,-.3],[2.8,-.65,-.5],[0,0,-2],[0,0,-2],[3,-2,-.4]];
        const [x,y,z]=positions[index];board.position.set(mobile() ? (index===4 ? 0 : x*.43) : x,mobile() ? (index===4 ? (short ? -2.6 : -2.5) : (short ? -2.1 : -1.85)) : y,z);board.rotation.set(-.05,index===0 ? .18 : -.18,index===0 ? -.08 : .08);board.scale.setScalar(mobile() ? (index===4 ? .37 : .48) : (index===4 ? .64 : .75));
      }
    });
    try {renderer.render(scene,camera);canvas.dataset.phase=String(phase);canvas.dataset.rendered='true';onReady(true);} catch {failed=true;onReady(false);}
    dirty=false;
    if (intro<1) frame=requestAnimationFrame(paint);
  }
  function wake() {dirty=true;if (!frame && canRenderScene(visible,document.hidden,isPaused(),failed)) frame=requestAnimationFrame(paint);}
  const observer=new IntersectionObserver(entries => {visible=entries[0].isIntersecting;if (visible) wake();else {cancelAnimationFrame(frame);frame=0;last=0;}},{threshold:0});observer.observe(host);
  const size=new ResizeObserver(resize);size.observe(host);
  const timeline=(event:Event) => {const detail=(event as CustomEvent<{phase:number;progress:number;entry:number}>).detail;phase=detail.phase;progress=detail.progress;entry=detail.entry;wake();};
  const pointer=(event:PointerEvent) => {if (mobile() || event.pointerType!=='mouse') return;pointerX=event.clientX/innerWidth-.5;pointerY=event.clientY/innerHeight-.5;wake();};
  const lost=(event:Event) => {event.preventDefault();failed=true;cancelAnimationFrame(frame);frame=0;onReady(false);};
  const restored=() => {failed=false;intro=1;wake();};
  const visibility=() => {if(document.hidden || isPaused()){cancelAnimationFrame(frame);frame=0;last=0;}else if(dirty || visible) wake();};
  root.addEventListener('lumo:scene',timeline);root.addEventListener('pointermove',pointer);host.addEventListener('lumo:pause',visibility);document.addEventListener('visibilitychange',visibility);
  canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);resize();
  return () => {cancelAnimationFrame(frame);observer.disconnect();size.disconnect();root.removeEventListener('lumo:scene',timeline);root.removeEventListener('pointermove',pointer);host.removeEventListener('lumo:pause',visibility);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);resources.forEach(resource => resource.dispose());renderer.dispose();canvas.remove();};
}
