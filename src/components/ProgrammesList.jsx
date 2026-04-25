import React, { useState } from 'react';
import { Books, CaretRight, Users, Plus, PencilSimple, Trash, Check, X } from "@phosphor-icons/react";

const ProgrammesList = ({ leaders, setLeaders, programmes = [], setProgrammes }) => {
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [newProgName, setNewProgName] = useState("");
  const [editingProg, setEditingProg] = useState(null);
  const [editProgValue, setEditProgValue] = useState("");

  const getLeadersForProg = (prog) => {
    return leaders.filter(l => l.programmes.includes(prog));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newProgName.trim()) return;
    if (programmes.includes(newProgName.trim())) {
      alert("Programme already exists!");
      return;
    }
    setProgrammes([...programmes, newProgName.trim()]);
    setNewProgName("");
  };

  const handleDelete = (prog, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${prog}"? This action cannot be undone.`)) {
      setProgrammes(programmes.filter(p => p !== prog));
      if (selectedProgramme === prog) setSelectedProgramme(null);
    }
  };

  const startEdit = (prog, e) => {
    e.stopPropagation();
    setEditingProg(prog);
    setEditProgValue(prog);
  };

  const saveEdit = (prog, e) => {
    e.stopPropagation();
    if (!editProgValue.trim() || editProgValue.trim() === prog) {
      setEditingProg(null);
      return;
    }
    if (programmes.includes(editProgValue.trim())) {
      alert("Programme already exists!");
      return;
    }
    const updated = programmes.map(p => p === prog ? editProgValue.trim() : p);
    setProgrammes(updated);
    setEditingProg(null);
    if (selectedProgramme === prog) setSelectedProgramme(editProgValue.trim());
  };
  const handleRemoveLeader = (email, prog) => {
    setLeaders(prev => prev.map(l => {
      if (l.email === email) {
        return { ...l, programmes: l.programmes.filter(p => p !== prog) };
      }
      return l;
    }));
  };

  const handleAddLeader = (e, prog) => {
    const email = e.target.value;
    if (!email) return;
    setLeaders(prev => prev.map(l => {
      if (l.email === email) {
        return { ...l, programmes: [...l.programmes, prog] };
      }
      return l;
    }));
    e.target.value = "";
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ➕ Add New Programme Card */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} color="var(--ibes-red)" weight="bold" /> Add New Programme
        </h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            className="ibes-input" 
            value={newProgName} 
            onChange={(e) => setNewProgName(e.target.value)} 
            placeholder="Enter official programme name..." 
            style={{ flex: 1, padding: '12px 16px', fontSize: '14px' }} 
          />
          <button 
            type="submit" 
            style={{ backgroundColor: 'var(--ibes-navy)', color: 'white', border: 'none', padding: '0 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Add Programme
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: 'var(--ibes-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Books size={28} weight="duotone" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Academic Programmes</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Manage official IBES programmes and view assigned leaders.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {programmes.map(prog => {
            const progLeaders = getLeadersForProg(prog);
            const isSelected = selectedProgramme === prog;
            const isEditing = editingProg === prog;

            return (
              <div 
                key={prog}
                onClick={() => !isEditing && setSelectedProgramme(isSelected ? null : prog)}
                style={{ 
                  padding: '20px', 
                  borderRadius: '12px', 
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--ibes-navy)' : '#e2e8f0',
                  backgroundColor: isSelected ? '#f8fafc' : 'white',
                  cursor: isEditing ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  boxShadow: isSelected ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <input 
                      type="text" 
                      className="ibes-input" 
                      value={editProgValue} 
                      onChange={(e) => setEditProgValue(e.target.value)} 
                      style={{ padding: '8px 12px', fontSize: '14px', flex: 1 }} 
                      autoFocus
                    />
                    <button onClick={(e) => saveEdit(prog, e)} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', padding: '0 10px', cursor: 'pointer' }}><Check size={18} weight="bold" /></button>
                    <button onClick={(e) => { e.stopPropagation(); setEditingProg(null); }} style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0 10px', cursor: 'pointer' }}><X size={18} weight="bold" /></button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: '700', lineHeight: '1.4', flex: 1 }}>{prog}</h3>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedProgramme(isSelected ? null : prog); }} style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }} title="View">View</button>
                      <button onClick={(e) => startEdit(prog, e)} style={{ background: '#f0fdf4', color: '#059669', border: '1px solid #dcfce3', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }} title="Edit">Edit</button>
                      <button onClick={(e) => handleDelete(prog, e)} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }} title="Delete">Delete</button>
                    </div>
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px' }}>
                  <Users size={16} />
                  <span>{progLeaders.length} Assigned Leader{progLeaders.length !== 1 ? 's' : ''}</span>
                </div>

                {isSelected && !isEditing && (
                  <div className="fade-in" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', fontWeight: '700' }}>Assigned Academic Personnel</h4>
                    {progLeaders.length === 0 ? (
                      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>No leaders currently assigned.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                        {progLeaders.map(leader => (
                          <div key={leader.email} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--ibes-red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>
                              {leader.name.charAt(0)}
                            </div>
                            <div style={{ fontSize: '14px', color: '#334155', fontWeight: '600', flex: 1 }}>{leader.name}</div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleRemoveLeader(leader.email, prog); }}
                              style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '12px' }}>
                      <select 
                        onChange={(e) => handleAddLeader(e, prog)}
                        className="ibes-input"
                        style={{ padding: '8px 12px', fontSize: '13px', width: '100%', cursor: 'pointer' }}
                        defaultValue=""
                      >
                        <option value="" disabled hidden>+ Assign a Leader to Programme</option>
                        {leaders.filter(l => !l.programmes.includes(prog)).map(l => (
                          <option key={l.email} value={l.email}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgrammesList;
