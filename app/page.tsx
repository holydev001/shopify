'use client';

import { Suspense, useEffect, useState, type CSSProperties } from 'react';
import { Bounds, ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';

type Product = { id: string; name: string; desc: string; price: number; color: string };
const products: Product[] = [
  { id: 'orbit-black', name: 'Orbit / Black', desc: 'Cloud-knit upper · carbon sole', price: 89500, color: '#1e2529' },
  { id: 'orbit-clay', name: 'Orbit / Clay', desc: 'Cloud-knit upper · clay sole', price: 89500, color: '#b66547' },
  { id: 'orbit-moss', name: 'Orbit / Moss', desc: 'Cloud-knit upper · moss sole', price: 89500, color: '#78856e' },
  { id: 'orbit-fog', name: 'Orbit / Fog', desc: 'Cloud-knit upper · fog sole', price: 89500, color: '#b9b8ad' },
];
const money = (value: number) => `₦${value.toLocaleString('en-NG')}`;

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [view, setView] = useState<'shop' | 'checkout'>('shop');
  const [authOpen, setAuthOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [toast, setToast] = useState('');
  useEffect(() => { const saved = window.localStorage.getItem('hearth-cart'); if (saved) setCart(JSON.parse(saved)); }, []);
  const save = (next: Record<string, number>) => { setCart(next); window.localStorage.setItem('hearth-cart', JSON.stringify(next)); };
  const add = (id: string) => { save({ ...cart, [id]: (cart[id] || 0) + 1 }); setToast('Added to your bag'); setTimeout(() => setToast(''), 1800); };
  const items = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  const count = items.reduce((sum, [, quantity]) => sum + quantity, 0);
  const subtotal = items.reduce((sum, [id, quantity]) => sum + (products.find(p => p.id === id)?.price || 0) * quantity, 0);
  const delivery = subtotal >= 75000 || subtotal === 0 ? 0 : 4500;
  const total = subtotal + delivery;
  const openCheckout = () => { if (count) setView('checkout'); else setToast('Your bag is empty'); };

  return <>
    <div className="announcement">Free delivery on orders over ₦75,000 <span>·</span> Thoughtful things for everyday living</div>
    <header className="site-header"><a className="brand" href="#shop"><span className="brand-mark">H</span><span>HEARTH<br /><i>&amp; GRAIN</i></span></a><nav><a href="#shop">Shop</a><a href="#story">Our story</a><a href="#journal">Journal</a></nav><div className="header-actions"><button className="icon-button" onClick={() => setAuthOpen(true)}>◯ <span>Account</span></button><button className="bag-button" onClick={openCheckout}>Bag <span>{count}</span></button></div></header>
    {view === 'shop' ? <Shop add={add} /> : <Checkout items={items} total={total} subtotal={subtotal} delivery={delivery} ordered={ordered} setOrdered={setOrdered} save={save} />}
    <footer className="site-footer"><div><a className="brand footer-brand" href="#shop"><span className="brand-mark">H</span><span>HEARTH<br /><i>&amp; GRAIN</i></span></a><p>Objects for a slower, better everyday.</p></div><div className="footer-links"><div><strong>Explore</strong><a href="#shop">All goods</a><a href="#story">Our story</a><a href="#journal">Journal</a></div><div><strong>Help</strong><a href="#shipping">Shipping &amp; returns</a><a href="mailto:hello@hearthandgrain.co">Contact</a></div></div><div className="newsletter"><strong>Notes from the hearth</strong><p>New arrivals, small rituals, and good things to know.</p><form onSubmit={e => { e.preventDefault(); setToast('You’re on the list — welcome in.'); }}><input type="email" required placeholder="Your email address" /><button>Join</button></form></div></footer>
    {authOpen && <div className="auth-modal"><div className="auth-card"><button className="close-modal" onClick={() => setAuthOpen(false)}>×</button><span className="eyebrow">Welcome back</span><h2>Keep the good things close.</h2><p>Sign in to see your orders and save your favourite pieces.</p><button className="google-button" onClick={() => setToast('Google sign-in will be connected in production')}>Continue with Google</button></div></div>}
    {toast && <div className="toast">{toast}</div>}
  </>;
}

function Shop({ add }: { add: (id: string) => void }) {
  const [colorway, setColorway] = useState(products[0]);
  const [size, setSize] = useState('42');
  return <>
    <section className="studio-hero"><div className="studio-copy"><span className="eyebrow">Sole Studio · 01</span><h1>Wear the future<br /><em>lightly.</em></h1><p>Orbit is a daily runner designed around one idea: the best things disappear into your rhythm.</p><div className="studio-actions"><button className="primary-button" onClick={() => add(colorway.id)}>Add to bag · {money(colorway.price)}</button><a className="secondary-button" href="#details">Explore the build</a></div><div className="studio-meta"><span><b>01</b> responsive knit</span><span><b>02</b> zero-drop sole</span><span><b>03</b> made to move</span></div></div><div className="shoe-stage" aria-label="Interactive 3D sneaker. Drag horizontally to rotate."><div className="stage-label">DRAG TO ROTATE <span>↔</span></div><ShoeFallback color={colorway.color} /><ShoeViewer /><div className="asset-note">3D sample asset · CC BY 4.0</div><div className="stage-grid" /></div></section>
    <section className="colorway-bar"><div><span className="eyebrow">Choose your orbit</span><h2>Four ways to move.</h2></div><div className="swatches">{products.map(product => <button key={product.id} className={`swatch ${colorway.id === product.id ? 'selected' : ''}`} style={{ background: product.color }} onClick={() => setColorway(product)} aria-label={`Select ${product.name}`} />)}</div><div className="colorway-name"><strong>{colorway.name}</strong><span>{colorway.desc}</span></div></section>
    <section className="section product-detail" id="details"><div><span className="eyebrow">Built for the in-between</span><h2>A sneaker with<br /><em>nothing extra.</em></h2></div><div className="detail-copy"><p>The Orbit keeps the engineering quiet so your day can be loud. A breathable one-piece upper, a flexible zero-drop sole, and just enough structure for wherever the day bends.</p><div className="size-picker"><span>Select your size</span><div>{['40','41','42','43','44','45'].map(option => <button key={option} className={size === option ? 'active' : ''} onClick={() => setSize(option)}>{option}</button>)}</div></div><button className="text-link detail-add" onClick={() => add(colorway.id)}>Add size {size} to bag · {money(colorway.price)}</button></div></section>
    <div className="feature-strip"><div><strong>30-day roam</strong><p>Try Orbit at your own pace.</p></div><div><strong>Small-batch build</strong><p>Made in considered quantities.</p></div><div><strong>Free delivery</strong><p>On orders over ₦75,000.</p></div></div>
    <section className="section story" id="story"><div className="story-card story-card-shoe"><span>01</span><strong>MOVE<br />LIGHTLY</strong></div><div><span className="eyebrow">A different kind of shop</span><h2>Objects with a point of view.</h2><p>We make fewer things, with more intention. Each release starts with a daily friction and ends with something that feels inevitable in your hands—or on your feet.</p><a className="secondary-button" href="#journal">Read the field notes</a></div></section>
  </>;
}

function ShoeFallback({ color }: { color: string }) {
  return <div className="orbit shoe-fallback" style={{ '--shoe-color': color } as CSSProperties} aria-hidden="true"><div className="shoe-shadow" /><div className="shoe"><div className="shoe-heel" /><div className="shoe-sole" /><div className="shoe-upper"><div className="shoe-logo">O</div><i className="lace lace-one" /><i className="lace lace-two" /><i className="lace lace-three" /></div></div></div>;
}

function ShoeViewer() {
  return <Canvas className="shoe-canvas" style={{ width: '100%', height: '100%' }} resize={{ offsetSize: true }} camera={{ position: [0, 0.25, 4], fov: 34 }} dpr={[1, 1.5]}>
    <CanvasSizer />
    <ambientLight intensity={1.8} />
    <directionalLight position={[4, 5, 3]} intensity={2.3} />
    <Suspense fallback={null}><Bounds fit clip observe margin={1.2}><ShoeModel /></Bounds></Suspense>
    <ContactShadows position={[0, -1.25, 0]} opacity={0.4} scale={5} blur={2.5} far={4} />
    <Environment preset="city" />
    <OrbitControls enablePan={false} minDistance={3} maxDistance={5} autoRotate autoRotateSpeed={0.7} />
  </Canvas>;
}

function CanvasSizer() {
  const { gl, setSize } = useThree();
  useEffect(() => {
    const container = gl.domElement.parentElement;
    if (!container) return;
    const syncSize = () => setSize(container.clientWidth, container.clientHeight);
    syncSize();
    const observer = new ResizeObserver(syncSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [gl, setSize]);
  return null;
}

function ShoeModel() {
  const { scene } = useGLTF('/models/materials-variants-shoe.glb');
  return <primitive object={scene.clone()} rotation={[0.03, -1.25, 0]} />;
}

function Checkout({ items, total, subtotal, delivery, ordered, setOrdered, save }: { items: [string, number][], total: number, subtotal: number, delivery: number, ordered: boolean, setOrdered: (value: boolean) => void, save: (cart: Record<string, number>) => void }) { if (ordered) return <section className="checkout"><div className="success"><span className="check">✓</span><span className="eyebrow">Order HG-{Date.now().toString().slice(-6)}</span><h1>Thank you for bringing us home.</h1><p>Your order is on its way to becoming part of your everyday. We’ve sent the details to your email.</p><a className="primary-button" href="#shop" onClick={() => setOrdered(false)}>Return to the shop</a></div></section>; return <section className="checkout"><div className="checkout-header"><div><span className="eyebrow">Secure checkout</span><h1>Complete your order.</h1></div><a className="back-link" href="#shop">← Keep shopping</a></div><div className="checkout-layout"><form className="form-card" onSubmit={e => { e.preventDefault(); save({}); setOrdered(true); }}><h2>Delivery details</h2><div className="field-grid"><Field label="Email address" type="email" full /><Field label="First name" /><Field label="Last name" /><Field label="Street address" full /><Field label="City" /><Field label="Country" value="Nigeria" /></div><button className="primary-button pay-button">Place order · {money(total)}</button><p className="fine-print">You will receive an order confirmation by email.</p></form><aside className="summary-card"><h2>Your bag</h2>{items.map(([id, quantity]) => { const p = products.find(product => product.id === id)!; return <div className="summary-row product" key={id}><span><strong>{p.name}</strong><small>{quantity} × {money(p.price)}</small></span><span>{money(p.price * quantity)}</span></div>; })}<div className="summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="summary-row"><span>Delivery</span><span>{delivery ? money(delivery) : 'Free'}</span></div><div className="summary-row total"><span>Total</span><span>{money(total)}</span></div></aside></div></section>; }
function Field({ label, type = 'text', full = false, value }: { label: string, type?: string, full?: boolean, value?: string }) { return <div className={`field ${full ? 'full' : ''}`}><label>{label}</label><input type={type} defaultValue={value} required /></div>; }
