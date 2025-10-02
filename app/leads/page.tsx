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
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchLeads();
    }, []);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        setFilteredLeads(
            leads.filter(
                (lead) =>
                    lead.nome.toLowerCase().includes(lowerSearch) ||
                    lead.email.toLowerCase().includes(lowerSearch)
            )
        );
    }, [search, leads]);

    const fetchLeads = () => {
        setLoading(true);
        fetch("/api/leads")
            .then((res) => res.json())
            .then((data) => {
                setLeads(data || []);
                setFilteredLeads(data || []);
            })
            .catch((err) => {
                console.error("Erro ao buscar leads:", err);
                setLeads([]);
                setFilteredLeads([]);
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

    const exportCSV = () => {
        if (filteredLeads.length === 0) return;

        const headers = ["Nome", "Email", "Telefone", "Cargo", "DataNascimento", "CriadoEm"];
        const rows = filteredLeads.map((lead) => [
            lead.nome,
            lead.email,
            lead.telefone,
            lead.cargo,
            lead.dataNascimento,
            new Date(lead.createdAt).toLocaleString("pt-BR"),
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map((e) => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `leads_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Painel Administrativo</h2>

            <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
            />

            <button onClick={exportCSV} style={styles.exportButton}>
                Exportar CSV
            </button>

            {loading ? (
                <p>Carregando...</p>
            ) : filteredLeads.length === 0 ? (
                <p>Nenhum lead encontrado.</p>
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
                            {filteredLeads.map((lead) => (
                                <tr key={lead._id}>
                                    <td style={styles.td} data-label="Nome">{lead.nome}</td>
                                    <td style={styles.td} data-label="Email">{lead.email}</td>
                                    <td style={styles.td} data-label="Telefone">{lead.telefone}</td>
                                    <td style={styles.td} data-label="Cargo">{lead.cargo}</td>
                                    <td style={styles.td} data-label="Data Nasc.">{lead.dataNascimento}</td>
                                    <td style={styles.td} data-label="Criado em">
                                        {new Date(lead.createdAt).toLocaleString("pt-BR")}
                                    </td>
                                    <td style={styles.td} data-label="Ações">
                                        <a
                                            href={`/leads/${lead._id}`}
                                            style={{ marginRight: "10px", cursor: "pointer" }}
                                            title="Visualizar"
                                        >
                                            👁️
                                        </a>
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
    searchInput: {
        width: "100%",
        padding: "8px",
        marginBottom: "15px",
        borderRadius: "0.5rem",
        border: "1px solid #ccc",
    },
    exportButton: {
        padding: "8px 12px",
        marginBottom: "15px",
        borderRadius: "0.5rem",
        border: "none",
        backgroundColor: "#1d4ed8",
        color: "#fff",
        cursor: "pointer",
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
    td: {
        border: "1px solid #ddd",
        padding: "8px",
        color: "#000",
    },
};
