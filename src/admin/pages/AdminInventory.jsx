import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Boxes, AlertTriangle, CheckCircle2, Save, Search, RefreshCw, X } from 'lucide-react';

export const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStock, setFilterStock] = useState('all'); // all, low, out
  const [editingItem, setEditingItem] = useState(null);
  const [stockInput, setStockInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getInventory();
      setInventory(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openEdit = (item) => {
    setEditingItem(item);
    setStockInput(item.stock);
    setPriceInput(item.price);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setUpdating(true);
    try {
      await adminApi.updateVariantStock(editingItem.productId, editingItem.sku, {
        stock: Number(stockInput),
        price: Number(priceInput)
      });
      setMsg(`Stock updated for ${editingItem.productName} (${editingItem.weight})`);
      setEditingItem(null);
      await fetchInventory();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update stock');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = inventory.filter((item) => {
    const matchSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;
    if (filterStock === 'low') return item.isLowStock;
    if (filterStock === 'out') return item.isOutOfStock;
    return true;
  });

  const lowStockCount = inventory.filter(i => i.isLowStock).length;
  const outOfStockCount = inventory.filter(i => i.isOutOfStock).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18382A]">Inventory & Stock Management</h1>
          <p className="text-xs sm:text-sm text-gray-500">Monitor and update warehouse stock quantities at the package-size variant level</p>
        </div>
        <button
          onClick={fetchInventory}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Stock Health Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">Total Tracked Variants</div>
            <div className="text-xl font-bold text-[#18382A] mt-1">{inventory.length}</div>
          </div>
          <Boxes className="w-8 h-8 text-[#009447]" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-600 font-semibold uppercase">Low Stock Alert (&le; 10)</div>
            <div className="text-xl font-bold text-amber-700 mt-1">{lowStockCount}</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-red-600 font-semibold uppercase">Out Of Stock</div>
            <div className="text-xl font-bold text-red-700 mt-1">{outOfStockCount}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-sm">!</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search variant SKU or product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
          >
            <option value="all">All Variants</option>
            <option value="low">Low Stock (&le; 10 Units)</option>
            <option value="out">Out of Stock (0 Units)</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading inventory...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">No inventory records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Stock Units</th>
                  <th className="py-3 px-3">Health Status</th>
                  <th className="py-3 px-4 text-right">Quick Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={`${item.productId}-${item.sku}`} className="hover:bg-gray-50/70">
                    <td className="py-3 px-4 font-bold text-[#18382A]">{item.productName}</td>
                    <td className="py-3 px-3 font-mono text-gray-500">{item.sku}</td>
                    <td className="py-3 px-3 font-semibold text-gray-700">{item.weight}</td>
                    <td className="py-3 px-3 font-bold text-[#18382A]">₹{item.price}</td>
                    <td className="py-3 px-3 font-bold text-sm">
                      <span className={item.isOutOfStock ? 'text-red-600' : item.isLowStock ? 'text-amber-600' : 'text-emerald-700'}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.isOutOfStock
                          ? 'bg-red-50 text-red-700'
                          : item.isLowStock
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {item.isOutOfStock ? 'Out of Stock' : item.isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#009447] hover:bg-emerald-50 rounded-lg transition"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Adjust Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-[#18382A]">Adjust Stock & Price</h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-gray-600">
              <div className="font-semibold text-[#18382A]">{editingItem.productName}</div>
              <div className="text-gray-400 mt-0.5">Variant: {editingItem.weight} | SKU: {editingItem.sku}</div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Available Stock Units</label>
                <input
                  type="number"
                  min="0"
                  value={stockInput}
                  onChange={(e) => setStockInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl shadow-sm"
                >
                  {updating ? 'Saving...' : 'Update Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
