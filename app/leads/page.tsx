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
    fetchLeads();
  }, []);

  const fetchLeads = () => {
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
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este lead?")) return;

    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((lead) => lead._id !== id));
      } else {
        console.error("Erro ao deletar lead");
      }
    } catch (err) {
      console.error("Erro ao deletar lead:", err);
    }
  };

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
                <th style={styles.th}>Ações</th>
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
                  <td style={styles.td}>
                    {new Date(lead.createdAt).toLocaleString("pt-BR")}
                  </td>
                  <td style={styles.td}>
                    {/* Botão de visualizar */}
                    <a
                      href={`/leads/${lead._id}`}
                      style={{ marginRight: "10px", cursor: "pointer" }}
                      title="Visualizar"
                    >
                      👁️
                    </a>

                    {/* Botão de deletar */}
                    <span
                      onClick={() => handleDelete(lead._id)}
                      style={{ cursor: "pointer", color: "red" }}
                      title="Deletar"
                    >
                      🗑️
                    </span>
                  </td>
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
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.5rem",
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
