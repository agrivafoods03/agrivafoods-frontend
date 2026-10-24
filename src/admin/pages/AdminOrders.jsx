import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { ShoppingBag, Eye, RefreshCw, X, CheckCircle2, Truck, AlertCircle } from 'lucide-react';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeOrder, setActiveOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('Pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await adminApi.getOrders(params);
      setOrders(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const openOrderModal = (order) => {
    setActiveOrder(order);
    setNewStatus((order.orderStatus || 'placed').toLowerCase());
    setNewPaymentStatus(order.paymentStatus || 'Pending');
    setTrackingNumber(order.trackingNumber || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!activeOrder) return;

    setUpdating(true);
    try {
      const id = activeOrder._id || activeOrder.id;
      await adminApi.updateOrderStatus(id, {
        orderStatus: newStatus,
        paymentStatus: newPaymentStatus,
        trackingNumber: trackingNumber || undefined
      });
      setMsg(`Order ${activeOrder.orderNumber} updated (Order: ${newStatus}, Payment: ${newPaymentStatus})`);
      setActiveOrder(null);
      await fetchOrders();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleRecordPaymentCollected = async () => {
    if (!activeOrder) return;
    setUpdating(true);
    try {
      const id = activeOrder._id || activeOrder.id;
      await adminApi.updateOrderStatus(id, {
        paymentStatus: 'Completed'
      });
      setMsg(`Payment for Order #${activeOrder.orderNumber} recorded as Collected!`);
      setActiveOrder(prev => ({ ...prev, paymentStatus: 'Completed', paidAt: new Date().toISOString() }));
      setNewPaymentStatus('Completed');
      await fetchOrders();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to record payment');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18382A]">Customer Orders</h1>
          <p className="text-xs sm:text-sm text-gray-500">Track order fulfillments, payment confirmations, and courier tracking numbers</p>
        </div>
        <button
          onClick={fetchOrders}
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

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
        <label className="text-xs font-semibold text-gray-600">Filter Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
        >
          <option value="All">All Orders</option>
          <option value="placed">Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-xs">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total (₹)</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const id = order._id || order.id;
                  return (
                    <tr key={id} className="hover:bg-gray-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-[#18382A]">{order.orderNumber}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-gray-800">{order.customer?.fullName || order.customer?.name}</div>
                        <div className="text-[11px] text-gray-400">{order.customer?.phone}</div>
                      </td>
                      <td className="py-3 px-3 text-gray-500">
                        {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {order.items?.length || 0} item(s)
                      </td>
                      <td className="py-3 px-3 font-bold text-[#18382A]">₹{order.total}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.paymentMethod === 'COD'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : (order.paymentMethod || 'Razorpay')}
                        </span>
                        <div className={`text-[10px] font-bold mt-0.5 ${
                          order.paymentStatus?.toLowerCase() === 'completed' || order.paymentStatus?.toLowerCase() === 'paid'
                            ? 'text-emerald-600'
                            : order.paymentStatus?.toLowerCase() === 'failed'
                            ? 'text-red-600'
                            : 'text-amber-600'
                        }`}>
                          {order.paymentStatus === 'Pending' ? 'Pending (Pay on Delivery)' : (order.paymentStatus || 'Pending')}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          order.orderStatus?.toLowerCase() === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                          order.orderStatus?.toLowerCase() === 'shipped' ? 'bg-blue-50 text-blue-700' :
                          order.orderStatus?.toLowerCase() === 'cancelled' ? 'bg-red-50 text-red-700' :
                          order.orderStatus?.toLowerCase() === 'processing' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openOrderModal(order)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#009447] hover:bg-emerald-50 rounded-lg transition"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-[#18382A]">Order #{activeOrder.orderNumber}</h3>
                <p className="text-xs text-gray-400">Placed on {new Date(activeOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setActiveOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping */}
            <div className="bg-gray-50 p-3.5 rounded-xl text-xs space-y-1">
              <div className="font-semibold text-gray-800">
                Customer: {activeOrder.customer?.fullName || activeOrder.customer?.name} ({activeOrder.customer?.email})
              </div>
              <div className="text-gray-600">Phone: {activeOrder.customer?.phone}</div>
              <div className="text-gray-600">
                Address: {activeOrder.shippingAddress?.address || activeOrder.shippingAddress?.street},{' '}
                {activeOrder.shippingAddress?.city}, {activeOrder.shippingAddress?.state} - {activeOrder.shippingAddress?.pinCode || activeOrder.shippingAddress?.pincode}
              </div>
            </div>

            {/* Payment Information & Verification */}
            <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#18382A]">Payment Method:</span>
                <span className={`px-2 py-0.5 rounded-md font-bold uppercase ${
                  activeOrder.paymentMethod === 'COD' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-gray-100 text-gray-800'
                }`}>
                  {activeOrder.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : (activeOrder.paymentMethod || 'Razorpay')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#18382A]">Payment Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  activeOrder.paymentStatus?.toLowerCase() === 'completed' || activeOrder.paymentStatus?.toLowerCase() === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeOrder.paymentStatus?.toLowerCase() === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {activeOrder.paymentStatus === 'Pending' ? 'Pending (Pay on Delivery)' : (activeOrder.paymentStatus || 'Pending')}
                </span>
              </div>

              {activeOrder.paymentMethod === 'COD' && (
                <div className="p-2 bg-amber-50/90 rounded-lg border border-amber-200/70 text-[11px] text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Doorstep COD Collection</span>
                  </div>
                  <p className="text-amber-800 pl-5">
                    Collect <strong>₹{activeOrder.total}</strong> via cash or courier UPI QR code upon doorstep handover.
                  </p>
                </div>
              )}

              {/* One-click COD payment recording */}
              {activeOrder.paymentMethod === 'COD' && activeOrder.paymentStatus?.toLowerCase() !== 'completed' && activeOrder.paymentStatus?.toLowerCase() !== 'paid' && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleRecordPaymentCollected}
                  className="w-full mt-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Record Payment as Collected (₹{activeOrder.total})</span>
                </button>
              )}

              {activeOrder.razorpayOrderId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[11px]">Razorpay Order ID:</span>
                  <span className="font-mono text-[11px] text-gray-800">{activeOrder.razorpayOrderId}</span>
                </div>
              )}
              {activeOrder.razorpayPaymentId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[11px]">Razorpay Payment ID:</span>
                  <span className="font-mono text-[11px] text-gray-800">{activeOrder.razorpayPaymentId}</span>
                </div>
              )}
              {activeOrder.paidAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[11px]">Paid / Collected At:</span>
                  <span className="text-[11px] text-emerald-800 font-semibold">{new Date(activeOrder.paidAt).toLocaleString()}</span>
                </div>
              )}
              {activeOrder.paymentFailureReason && (
                <div className="flex justify-between items-center text-red-700">
                  <span className="font-semibold text-[11px]">Failure Reason:</span>
                  <span className="text-[11px]">{activeOrder.paymentFailureReason}</span>
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase">Ordered Items</h4>
              {activeOrder.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                  <div>
                    <div className="font-semibold text-gray-800">{item.name || item.productName}</div>
                    <div className="text-gray-400 text-[11px]">Size: {item.weight} &times; {item.quantity}</div>
                  </div>
                  <div className="font-bold text-[#18382A]">₹{item.itemTotal || (item.price * item.quantity)}</div>
                </div>
              ))}
              <div className="flex justify-between text-xs pt-1 border-t font-semibold">
                <span>Total Amount:</span>
                <span className="text-[#009447] font-bold text-sm">₹{activeOrder.total}</span>
              </div>
            </div>

            {/* Update Status Form */}
            <form onSubmit={handleUpdateStatus} className="pt-3 border-t space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase">Fulfillment & Payment Update</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Order Fulfillment Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewStatus(val);
                      // If admin marks a COD order as delivered, auto-suggest payment as Completed
                      if (val === 'delivered' && activeOrder?.paymentMethod === 'COD' && newPaymentStatus === 'Pending') {
                        setNewPaymentStatus('Completed');
                      }
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                  >
                    <option value="placed">Placed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                  >
                    <option value="Pending">Pending (Unpaid / COD Due)</option>
                    <option value="Completed">Completed (Paid / Collected)</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Courier Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DTDC-88492048"
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveOrder(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl shadow-sm"
                >
                  {updating ? 'Saving...' : 'Update Fulfillment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
