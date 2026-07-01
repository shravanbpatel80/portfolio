import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, Server, Database, Trash2, RefreshCw, LogOut, 
  Calendar, User, Mail, FileText, CheckCircle2, AlertTriangle, Copy, 
  ExternalLink, ChevronLeft, Terminal, Eye, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [dbSource, setDbSource] = useState<'supabase' | 'in-memory' | 'unknown'>('unknown');
  const [isTableMissing, setIsTableMissing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sqlSchema = `CREATE TABLE enquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

  useEffect(() => {
    if (token) {
      fetchEnquiries();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('admin_token', data.token);
          setToken(data.token);
          setLoading(false);
          return;
        }
      }
      
      // Fallback if status is 404 or unauthorized (deployed to Netlify / static offline)
      if (username === 'admin' && password === 'admin123') {
        console.warn("Express auth unavailable (static Netlify fallback). Authenticating locally...");
        localStorage.setItem('admin_token', 'local-admin-token');
        setToken('local-admin-token');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      // Offline fallback
      if (username === 'admin' && password === 'admin123') {
        console.warn("Express auth unreachable (static Netlify fallback). Authenticating locally...");
        localStorage.setItem('admin_token', 'local-admin-token');
        setToken('local-admin-token');
      } else {
        setError('Connection to auth service failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setEnquiries([]);
  };

  const fetchEnquiries = async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const response = await fetch('/api/enquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        handleLogout();
        setError('Session expired. Please log in again.');
        return;
      }

      if (response.ok) {
        const resData = await response.json();
        if (resData.success) {
          // Merge server data with any locally saved browser enquiries
          const locals = JSON.parse(localStorage.getItem('local_enquiries') || '[]');
          const serverData = resData.data || [];
          
          // Deduplicate based on ID or content
          const merged = [...locals];
          serverData.forEach((s: Enquiry) => {
            if (!merged.some(m => m.id === s.id)) {
              merged.push(s);
            }
          });

          setEnquiries(merged);
          setDbSource(resData.source);
          setIsTableMissing(!!resData.supabase_table_missing);
          setRefreshing(false);
          return;
        }
      }
      throw new Error("Express backend returned non-ok response, falling back...");
    } catch (err) {
      console.warn("Using offline localStorage enquiries queue (static hosting fallback):", err);
      const locals = JSON.parse(localStorage.getItem('local_enquiries') || '[]');
      setEnquiries(locals);
      setDbSource('in-memory');
      setIsTableMissing(false);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    
    // Always remove from local queue if it exists there
    try {
      const locals = JSON.parse(localStorage.getItem('local_enquiries') || '[]');
      const updatedLocals = locals.filter((e: Enquiry) => e.id !== id);
      localStorage.setItem('local_enquiries', JSON.stringify(updatedLocals));
    } catch (e) {
      console.error("Local storage delete fail:", e);
    }

    // Attempt to remove from server as well
    if (!id.startsWith('local-')) {
      try {
        await fetch(`/api/enquiries/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.warn("Failed to delete from server (offline/static fallback).", err);
      }
    }

    // Always update visual state instantly
    setEnquiries(prev => prev.filter(e => e.id !== id));
    setDeleteId(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 relative overflow-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Header navigation */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-white transition duration-300 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Portfolio
          </button>
          
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Terminal className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              Admin Terminal
            </span>
          </div>
        </div>

        {/* Auth Page */}
        {!token ? (
          <div className="max-w-md mx-auto py-12">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-extrabold font-display text-white tracking-tight">Admin Authentication</h2>
                <p className="text-xs text-slate-400">
                  Authenticate using standard credentials to access visitor messages.
                </p>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-xs bg-slate-950 text-white border border-white/5 rounded-xl p-3.5 outline-none focus:border-indigo-500/50 focus:bg-slate-900/40 transition duration-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs bg-slate-950 text-white border border-white/5 rounded-xl p-3.5 outline-none focus:border-indigo-500/50 focus:bg-slate-900/40 transition duration-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl text-xs transition duration-300 disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2"
                >
                  {loading ? 'Decrypting Session...' : 'Unlock Console'}
                </button>
              </form>

              <div className="text-center pt-2">
                <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                  Credentials Hint: admin / admin123
                </span>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Dashboard Page */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Upper Dashboard Header and Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/30 border border-white/5 p-6 rounded-3xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-xl font-bold font-display text-white">Enquiry Management Console</h2>
                </div>
                <p className="text-xs text-slate-400">
                  Logged in as <strong className="text-slate-200">System Administrator</strong>. Real-time updates active.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchEnquiries}
                  disabled={refreshing}
                  className="px-4 py-2.5 text-xs font-mono border border-white/5 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-xl transition duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 text-xs font-mono bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/15 rounded-xl transition duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/20 border border-white/5 p-5 rounded-3xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Total Records</span>
                <p className="text-3xl font-extrabold text-white font-mono">{enquiries.length}</p>
                <span className="text-[10px] text-slate-400 block pt-1">Stored across fallback + live caches</span>
              </div>

              <div className="bg-slate-900/20 border border-white/5 p-5 rounded-3xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Integration Layer</span>
                <div className="flex items-center gap-2 pt-1.5">
                  <Database className={`w-5 h-5 ${dbSource === 'supabase' ? 'text-indigo-400' : 'text-amber-500'}`} />
                  <span className="text-sm font-bold text-white capitalize">
                    {dbSource === 'supabase' ? 'Supabase cloud' : 'In-Memory Fallback'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block pt-1.5">
                  {dbSource === 'supabase' ? 'Syncing directly with pg database' : 'No connection to enquiries table'}
                </span>
              </div>

              <div className="bg-slate-900/20 border border-white/5 p-5 rounded-3xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Infrastructure Status</span>
                <div className="flex items-center gap-2 pt-1.5">
                  {isTableMissing ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
                      <span className="text-sm font-bold text-amber-500">Table Missing</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-bold text-emerald-500">System Healthy</span>
                    </>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block pt-1.5">
                  {isTableMissing ? 'SQL table enquiries is missing in Supabase' : 'Direct pipeline is operational'}
                </span>
              </div>
            </div>

            {/* Alert: Table Missing Guideline */}
            {isTableMissing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-amber-500/5 border-2 border-amber-500/20 rounded-3xl p-6 md:p-8 space-y-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-amber-300">Supabase Table Schema Configuration Required</h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      Your Supabase client is connected, but the schema table <code className="font-mono text-white bg-slate-950 px-1.5 py-0.5 rounded">enquiries</code> does not exist inside your project yet. To enable full cloud storage synchronization, run the following SQL command inside your <strong>Supabase SQL Editor</strong>:
                    </p>
                  </div>
                </div>

                <div className="relative bg-slate-950 rounded-2xl border border-white/5 p-5 font-mono text-[11px] text-indigo-300 overflow-x-auto">
                  <button 
                    onClick={copyToClipboard}
                    className="absolute top-4 right-4 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-[10px] flex items-center gap-1.5 cursor-pointer transition duration-200"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedSql ? 'Copied!' : 'Copy SQL'}
                  </button>
                  <pre className="pr-16 text-slate-200">{sqlSchema}</pre>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  Note: While table setup is pending, the application is automatically routing all user inquiries to the local Node.js server RAM store fallback, so no test enquiries will be lost!
                </p>
              </motion.div>
            )}

            {/* Enquiries Grid */}
            <div className="space-y-4">
              <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-400">
                Inbox Enquiries Queue
              </h3>

              {enquiries.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/10 border border-white/5 rounded-3xl space-y-2">
                  <p className="text-sm text-slate-400 font-medium">No visitor enquiries found.</p>
                  <p className="text-xs text-slate-500">Send an inquiry from the main portfolio page contact form to see it stream here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enquiries.map((enq) => (
                    <motion.div
                      key={enq.id}
                      layoutId={`card-${enq.id}`}
                      className="bg-slate-900/30 border border-white/5 hover:border-indigo-500/20 rounded-3xl p-6 transition duration-300 flex flex-col justify-between space-y-4 relative group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-white block">{enq.subject}</span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" /> {enq.name}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {enq.email}
                              </span>
                            </div>
                          </div>

                          <div className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {new Date(enq.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-2xl border border-white/5 font-sans whitespace-pre-wrap">
                          {enq.message}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded-lg border border-white/5">
                          ID: {enq.id}
                        </span>

                        {deleteId === enq.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-rose-400">Confirm delete?</span>
                            <button
                              onClick={() => handleDelete(enq.id)}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[10px] rounded-lg cursor-pointer transition"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeleteId(null)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded-lg cursor-pointer transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteId(enq.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                            title="Delete Enquiry Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
