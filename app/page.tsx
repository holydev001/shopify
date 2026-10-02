'use client';

import { useEffect, useMemo, useState } from 'react';

type Product = { id: string; name: string; desc: string; price: number; color: string };
const products: Product[] = [
  { id: 'mug', name: 'The Morning Mug', desc: 'Hand-thrown stoneware · 350ml', price: 18500, color: '#b8754d' },
  { id: 'linen', name: 'Washed Linen Throw', desc: '100% European linen · oat', price: 49000, color: '#879b91' },
  { id: 'candle', name: 'Sunday Candle', desc: 'Soy wax · sandalwood & fig', price: 22000, color: '#c49761' },
  { id: 'board', name: 'Olive Wood Board', desc: 'Carved by hand · 38cm', price: 28500, color: '#738d82' },
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

function Shop({ add }: { add: (id: string) => void }) { return <><section className="hero"><div className="hero-copy"><span className="eyebrow">The everyday edit · 01</span><h1>Make room for the good things.</h1><p>Considered objects for slow mornings, warm rooms, and the rituals that make a life feel like yours.</p><a className="primary-button" href="#shop">Explore the collection</a></div><div className="hero-art" /></section><section className="section" id="shop"><div className="section-heading"><h2>Small things, well made</h2><a className="text-link" href="#shop">View all goods</a></div><div className="product-grid">{products.map(product => <article className="product-card" key={product.id}><button className="product-image" style={{ '--product': product.color } as React.CSSProperties} onClick={() => add(product.id)} aria-label={`Add ${product.name} to bag`} /><div className="product-info"><h3>{product.name}</h3><p>{product.desc}</p><div className="product-price">{money(product.price)}</div></div></article>)}</div></section><div className="feature-strip"><div><strong>Made to last</strong><p>Materials with a story and a future.</p></div><div><strong>Small batch</strong><p>Thoughtfully sourced, never mass-made.</p></div><div><strong>Easy living</strong><p>Simple returns within 14 days.</p></div></div><section className="section story" id="story"><div className="story-card" /><div><span className="eyebrow">A little about us</span><h2>Useful can be beautiful, too.</h2><p>Hearth &amp; Grain began with a simple belief: the objects we reach for every day should bring a little more calm, care, and character into the room.</p><a className="secondary-button" href="#journal">Read our story</a></div></section></>; }

function Checkout({ items, total, subtotal, delivery, ordered, setOrdered, save }: { items: [string, number][], total: number, subtotal: number, delivery: number, ordered: boolean, setOrdered: (value: boolean) => void, save: (cart: Record<string, number>) => void }) { if (ordered) return <section className="checkout"><div className="success"><span className="check">✓</span><span className="eyebrow">Order HG-{Date.now().toString().slice(-6)}</span><h1>Thank you for bringing us home.</h1><p>Your order is on its way to becoming part of your everyday. We’ve sent the details to your email.</p><a className="primary-button" href="#shop" onClick={() => setOrdered(false)}>Return to the shop</a></div></section>; return <section className="checkout"><div className="checkout-header"><div><span className="eyebrow">Secure checkout</span><h1>Complete your order.</h1></div><a className="back-link" href="#shop">← Keep shopping</a></div><div className="checkout-layout"><form className="form-card" onSubmit={e => { e.preventDefault(); save({}); setOrdered(true); }}><h2>Delivery details</h2><div className="field-grid"><Field label="Email address" type="email" full /><Field label="First name" /><Field label="Last name" /><Field label="Street address" full /><Field label="City" /><Field label="Country" value="Nigeria" /></div><button className="primary-button pay-button">Place order · {money(total)}</button><p className="fine-print">You will receive an order confirmation by email.</p></form><aside className="summary-card"><h2>Your bag</h2>{items.map(([id, quantity]) => { const p = products.find(product => product.id === id)!; return <div className="summary-row product" key={id}><span><strong>{p.name}</strong><small>{quantity} × {money(p.price)}</small></span><span>{money(p.price * quantity)}</span></div>; })}<div className="summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="summary-row"><span>Delivery</span><span>{delivery ? money(delivery) : 'Free'}</span></div><div className="summary-row total"><span>Total</span><span>{money(total)}</span></div></aside></div></section>; }
function Field({ label, type = 'text', full = false, value }: { label: string, type?: string, full?: boolean, value?: string }) { return <div className={`field ${full ? 'full' : ''}`}><label>{label}</label><input type={type} defaultValue={value} required /></div>; }
