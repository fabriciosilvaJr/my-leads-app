"use client";
import React, { CSSProperties, useEffect, useState } from "react";

interface Lead {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  dataNascimento: string;
  mensagem?: string;
  createdAt: string;
}

export default function LeadsListPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data || []);
      })
      .catch((err) => {
        console.error("Erro ao buscar leads:", err);
        setLeads([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Painel Administrativo</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : leads.length === 0 ? (
        <p>Nenhum lead cadastrado ainda.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Telefone</th>
                <th style={styles.th}>Cargo</th>
                <th style={styles.th}>Data Nasc.</th>
                <th style={styles.th}>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td style={styles.td}>{lead.nome}</td>
                  <td style={styles.td}>{lead.email}</td>
                  <td style={styles.td}>{lead.telefone}</td>
                  <td style={styles.td}>{lead.cargo}</td>
                  <td style={styles.td}>{lead.dataNascimento}</td>
                  <td style={styles.td}>{new Date(lead.createdAt).toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {

  
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: '2rem',
  },

  textarea: {
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
 
  adminPlaceholder: {
    textAlign: 'center',
    padding: '3rem 0',
  },
  adminText: {
    fontSize: '1.125rem',
    color: '#6b7280',
    marginBottom: '1rem',
  },
  adminSubtext: {
    fontSize: '0.875rem',
    color: '#9ca3af',
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
    color: "#000",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
    background: "#f4f4f4",
    color: "#000",
  },
  td: { border: "1px solid #ddd", padding: "8px", color: "#000" },
};