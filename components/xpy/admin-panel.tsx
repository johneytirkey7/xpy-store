"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Upload, Package, DollarSign, FileText, Image as ImageIcon, 
  Trash2, Edit3, LayoutGrid, ChevronLeft, ShoppingCart, Users, ShieldAlert, ShieldCheck
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  // 🔥 TEEN TABS: products, orders, users
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "users">("products");
  
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]); 
  const [users, setUsers] = useState<any[]>([]); // 🔥 NAYA: Users store karne ke liye
  
  const [formData, setFormData] = useState({ name: "", price: "", description: "" });
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchOrders();
      fetchUsers(); // 🔥 Panel khulte hi users bhi le aao
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try { const res = await fetch("/api/products"); setProducts(await res.json()); } catch (e) {}
  };

  const fetchOrders = async () => {
    try { const res = await fetch("/api/orders"); setOrders(await res.json()); } catch (e) {}
  };

  // 🔥 NAYA: Database se Users lane wala function
  const fetchUsers = async () => {
    try { const res = await fetch("/api/users"); setUsers(await res.json()); } catch (e) {}
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) { toast.success(`Order #${orderId} status changed to ${newStatus}!`); fetchOrders(); }
    } catch (e) { toast.error("Status update fail!"); }
  };

  // 🔥 NAYA: User ko Admin banane wala function
  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (res.ok) { 
        toast.success(`User role changed to ${newRole}! 🛡️`); 
        fetchUsers(); 
      }
    } catch (e) { toast.error("Role update fail!"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description) return toast.error("Poori details bharo!");
    setIsSubmitting(true);
    let finalImageUrl = "";
    try {
      if (imageFile) {
        const cloudData = new FormData(); cloudData.append("file", imageFile); cloudData.append("upload_preset", "xpy_store_preset"); cloudData.append("cloud_name", "dm7jnfngc");
        const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dm7jnfngc/image/upload", { method: "POST", body: cloudData });
        const cloudinaryResult = await cloudinaryRes.json();
        if (cloudinaryResult.secure_url) finalImageUrl = cloudinaryResult.secure_url; 
      }
      const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, imageUrl: finalImageUrl }) });
      const data = await res.json();
      if (res.ok) { toast.success("Product save ho gaya! 🎉"); fetchProducts(); setFormData({ name: "", price: "", description: "" }); setUploadedImage(null); setImageFile(null); }
    } catch (error) { toast.error("Network error!"); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Sach mein delete karna hai?")) return;
    try { const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" }); if (res.ok) { fetchProducts(); toast.success("Product delete ho gaya! 🗑️"); } } catch (e) {}
  };

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); };
  const handleFile = (file: File) => { if (file.type.startsWith("image/")) { setImageFile(file); const reader = new FileReader(); reader.onload = (e) => setUploadedImage(e.target?.result as string); reader.readAsDataURL(file); } };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div onClick={onClose} className="absolute inset-0 bg-space-dark/90 backdrop-blur-md" />

          <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-6xl my-8">
            <div className="glass rounded-3xl border border-primary/20 overflow-hidden flex flex-col h-[85vh]">
              
              <div className="flex items-center justify-between p-6 border-b border-border bg-background/50">
                <div className="flex items-center gap-6">
                  <motion.button onClick={onClose} className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center hover:text-primary transition-colors"><ChevronLeft className="w-5 h-5" /></motion.button>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><LayoutGrid className="w-6 h-6 text-primary" /> Admin Panel</h2>

                  <div className="flex bg-secondary/30 p-1 rounded-lg ml-4">
                    <button onClick={() => setActiveTab("products")} className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === "products" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>Products</button>
                    <button onClick={() => setActiveTab("orders")} className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${activeTab === "orders" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>Orders {orders.length > 0 && <span className="bg-background text-foreground text-xs px-2 py-0.5 rounded-full">{orders.length}</span>}</button>
                    {/* 🔥 NAYA TAB BUTTON */}
                    <button onClick={() => setActiveTab("users")} className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${activeTab === "users" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>Users Manager</button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                
                {/* 🛒 TAB 1: PRODUCTS */}
                {activeTab === "products" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> Add Product</h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground outline-none" />
                        <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground outline-none" />
                        <textarea placeholder="Description" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground resize-none outline-none" />
                        <motion.div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className="relative border-2 border-dashed border-primary/50 rounded-xl p-8 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} className="hidden" />
                          {uploadedImage ? <img src={uploadedImage} alt="Preview" className="max-h-32 mx-auto rounded-lg" /> : <p className="text-muted-foreground">Drop Image Here or Click 🖼️</p>}
                        </motion.div>
                        <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold">{isSubmitting ? "Saving..." : "Save Product"}</button>
                      </form>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> Your Products</h3>
                      <div className="space-y-3">
                        {products.map((p) => (
                          <div key={p.id} className="glass-card rounded-xl p-4 flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                              {p.imageUrl ? <img src={p.imageUrl} className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-primary/20 rounded" />}
                              <div><p className="font-bold text-foreground">{p.name}</p><p className="text-primary font-bold">${p.price}</p></div>
                            </div>
                            <button onClick={() => handleDelete(p.id)} className="text-destructive p-2 bg-destructive/10 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 📦 TAB 2: ORDERS */}
                {activeTab === "orders" && (
                   <div>
                   <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2"><ShoppingCart className="w-6 h-6 text-primary" /> Customer Orders</h3>
                   {orders.length === 0 ? (
                     <div className="text-center py-20 text-muted-foreground">Koi order nahi hai abhi.</div>
                   ) : (
                     <div className="grid gap-4">
                       {orders.map((order) => (
                         <div key={order.id} className="glass-card p-6 rounded-2xl border border-primary/20 flex flex-col md:flex-row justify-between gap-6">
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                               <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold">Order #{order.id}</span>
                               <span className="text-muted-foreground text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                             </div>
                             <h4 className="text-xl font-bold text-foreground">{order.fullName}</h4>
                             <p className="text-foreground mt-2 font-medium bg-secondary/30 p-2 rounded-lg inline-block text-sm">📍 {order.address}, {order.city} - {order.pinCode}</p>
                           </div>
                           <div className="flex flex-col items-end justify-between min-w-[200px] border-l border-border pl-6">
                             <div className="text-right w-full"><p className="text-muted-foreground text-sm">Total Amount</p><p className="text-3xl font-bold text-primary">${order.totalAmount}</p></div>
                             <div className="w-full mt-4">
                               <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="w-full p-2 rounded-lg text-sm font-bold border-2 cursor-pointer outline-none bg-secondary/50 text-foreground">
                                 <option value="Pending">🕒 Pending</option>
                                 <option value="Shipped">🚚 Shipped</option>
                                 <option value="Delivered">✅ Delivered</option>
                               </select>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
                )}

                {/* 👥 TAB 3: USERS (Admin Banane ka System) */}
                {activeTab === "users" && (
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Users className="w-6 h-6 text-primary" /> User Management
                    </h3>
                    <div className="grid gap-4 max-w-4xl">
                      {users.map((user) => (
                        <div key={user.id} className="glass-card p-4 rounded-xl border border-border flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary uppercase">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-lg">{user.name}</p>
                              <p className="text-muted-foreground text-sm">{user.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 border-l border-border pl-6">
                            {/* Role Dropdown */}
                            <div className="flex items-center gap-2">
                              {user.role === "ADMIN" ? <ShieldCheck className="w-5 h-5 text-green-500" /> : <ShieldAlert className="w-5 h-5 text-yellow-500" />}
                              <select 
                                value={user.role} 
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                className={`p-2 rounded-lg text-sm font-bold border-2 cursor-pointer outline-none transition-colors ${
                                  user.role === 'ADMIN' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                                }`}
                              >
                                <option value="USER">Standard User</option>
                                <option value="ADMIN">👑 Admin Access</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}