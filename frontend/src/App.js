import React, { useEffect, useState } from 'react';

const API = '/api/products';

const styles = {
  root: { margin: 0, padding: 0, fontFamily: "'Segoe UI', sans-serif", background: '#0a0a0a', minHeight: '100vh', color: '#fff' },
  sidebar: { width: 220, background: '#111', height: '100vh', position: 'fixed', top: 0, left: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid #222' },
  logo: { padding: '28px 24px 20px', borderBottom: '1px solid #222' },
  logoText: { fontSize: 22, fontWeight: 800, letterSpacing: 2, background: 'linear-gradient(90deg, #e63946, #f4a261, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  logoSub: { fontSize: 10, color: '#555', letterSpacing: 3, marginTop: 2 },
  navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', cursor: 'pointer', color: active ? '#fff' : '#555', background: active ? '#1a1a1a' : 'transparent', borderLeft: active ? '3px solid #e63946' : '3px solid transparent', fontSize: 14, fontWeight: active ? 600 : 400, transition: 'all 0.2s' }),
  navIcon: { fontSize: 18 },
  main: { marginLeft: 220, padding: '32px 36px', minHeight: '100vh' },
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#fff' },
  pageSubtitle: { fontSize: 13, color: '#555', marginTop: 4 },
  badge: (color) => ({ background: color, color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 1 }),
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 },
  statCard: (accent) => ({ background: '#111', border: `1px solid #1e1e1e`, borderRadius: 16, padding: '24px', position: 'relative', overflow: 'hidden' }),
  statAccent: (color) => ({ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: color }),
  statValue: { fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#555', letterSpacing: 1, textTransform: 'uppercase' },
  statIcon: { fontSize: 28, position: 'absolute', right: 20, top: 20, opacity: 0.15 },
  card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 24, marginBottom: 24 },
  cardTitle: { fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 20, letterSpacing: 1, textTransform: 'uppercase' },
  toolbar: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' },
  searchBox: { flex: 1, minWidth: 200, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 16px', color: '#fff', fontSize: 14, outline: 'none' },
  select: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 16px', color: '#fff', fontSize: 14, outline: 'none', cursor: 'pointer' },
  btnPrimary: { background: 'linear-gradient(135deg, #e63946, #c1121f)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 },
  btnSecondary: { background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 20px', fontSize: 14, cursor: 'pointer' },
  btnDanger: { background: 'transparent', color: '#e63946', border: '1px solid #e63946', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600 },
  btnEdit: { background: 'transparent', color: '#2ec4b6', border: '1px solid #2ec4b6', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: 11, color: '#555', letterSpacing: 1, textTransform: 'uppercase', borderBottom: '1px solid #1e1e1e' },
  td: { padding: '14px 16px', fontSize: 14, color: '#ccc', borderBottom: '1px solid #161616' },
  trHover: { background: '#141414' },
  modal: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalBox: { background: '#111', border: '1px solid #2a2a2a', borderRadius: 20, padding: 36, width: 480, maxWidth: '90vw' },
  modalTitle: { fontSize: 20, fontWeight: 700, marginBottom: 24, color: '#fff' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 12, color: '#555', letterSpacing: 1, textTransform: 'uppercase' },
  input: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' },
  formActions: { display: 'flex', gap: 12, justifyContent: 'flex-end' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#333' },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
};

const stockStatus = (qty) => {
  if (qty === 0) return { label: 'Out of Stock', color: '#e63946' };
  if (qty < 20) return { label: 'Low Stock', color: '#f4a261' };
  return { label: 'In Stock', color: '#2ec4b6' };
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '', quantity: '', location: '', price: '' });
  const [editId, setEditId] = useState(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [hoveredRow, setHoveredRow] = useState(null);

  const fetchProducts = () => fetch(API).then(r => r.json()).then(setProducts).catch(() => {});

  useEffect(() => { fetchProducts(); }, []);

  const openModal = (product = null) => {
    if (product) {
      setForm({ name: product.name, sku: product.sku, quantity: product.quantity, location: product.location, price: product.price || '' });
      setEditId(product.id);
    } else {
      setForm({ name: '', sku: '', quantity: '', location: '', price: '' });
      setEditId(null);
    }
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API}/${editId}` : API;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
    });
    setModal(false);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const status = stockStatus(p.quantity).label;
    const matchFilter = filterStatus === 'all' || status === filterStatus;
    return matchSearch && matchFilter;
  });

  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + p.quantity, 0);
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity < 20).length;
  const outOfStock = products.filter(p => p.quantity === 0).length;

  const navItems = [
    { id: 'dashboard', icon: '▦', label: 'Dashboard' },
    { id: 'inventory', icon: '◫', label: 'Inventory' },
  ];

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoText}>NEXUS WMS</div>
          <div style={styles.logoSub}>WAREHOUSE MANAGEMENT</div>
        </div>
        <div style={{ marginTop: 16 }}>
          {navItems.map(n => (
            <div key={n.id} style={styles.navItem(activeNav === n.id)} onClick={() => setActiveNav(n.id)}>
              <span style={styles.navIcon}>{n.icon}</span>
              {n.label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', padding: '24px', borderTop: '1px solid #1a1a1a' }}>
          <div style={{ fontSize: 11, color: '#333', letterSpacing: 1 }}>NEXUS WMS v1.0</div>
          <div style={{ fontSize: 11, color: '#222', marginTop: 4 }}>© 2025</div>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div>
            <div style={styles.pageTitle}>{activeNav === 'dashboard' ? 'Dashboard' : 'Inventory'}</div>
            <div style={styles.pageSubtitle}>{new Date().toDateString()} — Real-time warehouse overview</div>
          </div>
          <button style={styles.btnPrimary} onClick={() => { setActiveNav('inventory'); openModal(); }}>
            + Add Product
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Products', value: totalProducts, icon: '📦', color: '#e63946' },
            { label: 'Total Stock Units', value: totalStock, icon: '🏭', color: '#f4a261' },
            { label: 'Low Stock Items', value: lowStock, icon: '⚠️', color: '#f4a261' },
            { label: 'Out of Stock', value: outOfStock, icon: '🚫', color: '#e63946' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard(s.color)}>
              <div style={styles.statAccent(s.color)} />
              <div style={styles.statIcon}>{s.icon}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Stock Status Summary (Dashboard only) */}
        {activeNav === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Stock Status Breakdown</div>
              {[
                { label: 'In Stock', color: '#2ec4b6', count: products.filter(p => p.quantity >= 20).length },
                { label: 'Low Stock', color: '#f4a261', count: lowStock },
                { label: 'Out of Stock', color: '#e63946', count: outOfStock },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                    <span style={{ fontSize: 14, color: '#aaa' }}>{s.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 120, height: 6, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${totalProducts ? (s.count / totalProducts) * 100 : 0}%`, height: '100%', background: s.color, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 13, color: '#fff', fontWeight: 700, width: 20 }}>{s.count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>Recent Products</div>
              {products.slice(-4).reverse().map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#444' }}>{p.sku}</div>
                  </div>
                  <span style={styles.badge(stockStatus(p.quantity).color)}>{stockStatus(p.quantity).label}</span>
                </div>
              ))}
              {products.length === 0 && <div style={{ color: '#333', fontSize: 13 }}>No products yet</div>}
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Product Inventory</div>
          <div style={styles.toolbar}>
            <input
              style={styles.searchBox}
              placeholder="🔍  Search by name or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select style={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            {activeNav === 'inventory' && (
              <button style={styles.btnPrimary} onClick={() => openModal()}>+ Add Product</button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <div style={{ fontSize: 16, color: '#444' }}>No products found</div>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {['ID', 'Product Name', 'SKU', 'Quantity', 'Location', 'Status', 'Actions'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const status = stockStatus(p.quantity);
                  return (
                    <tr key={p.id}
                      style={hoveredRow === p.id ? styles.trHover : {}}
                      onMouseEnter={() => setHoveredRow(p.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={{ ...styles.td, color: '#444', fontSize: 12 }}>#{p.id}</td>
                      <td style={{ ...styles.td, fontWeight: 600, color: '#fff' }}>{p.name}</td>
                      <td style={{ ...styles.td, fontFamily: 'monospace', color: '#f4a261' }}>{p.sku}</td>
                      <td style={{ ...styles.td, fontWeight: 700 }}>{p.quantity}</td>
                      <td style={{ ...styles.td, color: '#888' }}>{p.location || '—'}</td>
                      <td style={styles.td}>
                        <span style={styles.badge(status.color)}>{status.label}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={styles.btnEdit} onClick={() => openModal(p)}>Edit</button>
                          <button style={styles.btnDanger} onClick={() => handleDelete(p.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div style={styles.modalBox}>
            <div style={styles.modalTitle}>{editId ? '✏️ Edit Product' : '➕ Add New Product'}</div>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                {[
                  { key: 'name', label: 'Product Name', placeholder: 'e.g. Laptop Pro', span: true },
                  { key: 'sku', label: 'SKU', placeholder: 'e.g. SKU-001' },
                  { key: 'quantity', label: 'Quantity', placeholder: '0', type: 'number' },
                  { key: 'location', label: 'Location', placeholder: 'e.g. A1' },
                ].map(f => (
                  <div key={f.key} style={{ ...styles.formGroup, gridColumn: f.span ? 'span 2' : 'span 1' }}>
                    <label style={styles.label}>{f.label}</label>
                    <input
                      style={styles.input}
                      type={f.type || 'text'}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      required={f.key !== 'location'}
                    />
                  </div>
                ))}
              </div>
              <div style={styles.formActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" style={styles.btnPrimary}>{editId ? 'Update Product' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
