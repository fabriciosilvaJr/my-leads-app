"use client";

import React, { CSSProperties, FormEvent, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  dataNascimento: string;
  mensagem: string;
}

export default function EditLeadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    cargo: "",
    dataNascimento: "",
    mensagem: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/leads/${id}`);
      if (!res.ok) throw new Error("Erro ao carregar lead");
      const data = await res.json();
      setFormData({
        nome: data.nome || "",
        email: data.email || "",
        telefone: data.telefone || "",
        cargo: data.cargo || "",
        dataNascimento: data.dataNascimento || "",
        mensagem: data.mensagem || "",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10 || cleaned.length === 11;
  };
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, telefone: formatted });
    if (errors.telefone) setErrors({ ...errors, telefone: "" });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.nome) newErrors.nome = "Nome é obrigatório";
    if (!formData.email) newErrors.email = "E-mail é obrigatório";
    else if (!validateEmail(formData.email)) newErrors.email = "E-mail inválido";
    if (!formData.telefone) newErrors.telefone = "Telefone é obrigatório";
    else if (!validatePhone(formData.telefone)) newErrors.telefone = "Telefone inválido";
    if (!formData.cargo) newErrors.cargo = "Cargo é obrigatório";
    if (!formData.dataNascimento) newErrors.dataNascimento = "Data de nascimento é obrigatória";
    if (!formData.mensagem) newErrors.mensagem = "Mensagem é obrigatória";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push(`/leads/${id}`);
      } else {
        const error = await res.json().catch(() => ({}));
        alert("Erro ao atualizar lead: " + (error.message || "tente novamente"));
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com a API.");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={pageStyles.formContainer}>
      <div style={pageStyles.card}>
        <h2 style={pageStyles.title}>Editar Lead</h2>

        <form style={pageStyles.form} onSubmit={handleSubmit} noValidate>
          {/* Campos do formulário */}
          {["nome","email","telefone","cargo","dataNascimento","mensagem"].map((field) => (
            <div style={pageStyles.formGroup} key={field}>
              <label style={pageStyles.label}>
                {field === "nome" ? "👤 Nome Completo" :
                 field === "email" ? "📧 E-mail" :
                 field === "telefone" ? "📱 Telefone" :
                 field === "cargo" ? "💼 Cargo" :
                 field === "dataNascimento" ? "📅 Data de Nascimento" :
                 "💬 Mensagem"}
              </label>
              {field === "mensagem" ? (
                <textarea
                  name={field}
                  value={formData[field as keyof FormData]}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Deixe sua mensagem..."
                  style={{ ...pageStyles.input, ...pageStyles.textarea, ...(errors[field] ? pageStyles.inputError : {}) }}
                />
              ) : (
                <input
                  name={field}
                  type={field === "email" ? "email" : field === "telefone" ? "tel" : field === "dataNascimento" ? "date" : "text"}
                  value={formData[field as keyof FormData]}
                  onChange={field === "telefone" ? handlePhoneChange : handleChange}
                  placeholder={
                    field === "nome" ? "Seu nome completo" :
                    field === "email" ? "seu@email.com" :
                    field === "telefone" ? "(11) 99999-9999" :
                    field === "cargo" ? "Seu cargo atual" : ""
                  }
                  maxLength={field === "telefone" ? 15 : undefined}
                  style={{ ...pageStyles.input, ...(errors[field] ? pageStyles.inputError : {}) }}
                />
              )}
              {errors[field] && <p style={pageStyles.errorText}>{errors[field]}</p>}
            </div>
          ))}

          <button type="submit" style={pageStyles.submitButton}>
            💾 Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}

const pageStyles: { [k: string]: CSSProperties } = {
  formContainer: { maxWidth: "640px", margin: "0 auto", paddingTop: "1rem" },
  card: { backgroundColor: "#ffffff", borderRadius: "1rem", boxShadow: "0 18px 30px -8px rgba(0,0,0,0.12)", padding: "2rem" },
  title: { fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.25rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  formGroup: { display: "flex", flexDirection: "column" },
  label: { fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" },
  input: { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #e6e6e6", fontSize: "1rem", outline: "none", transition: "all 0.12s" },
  textarea: { resize: "vertical", minHeight: "80px", fontFamily: "inherit" },
  inputError: { borderColor: "#ef4444" },
  errorText: { color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem" },
  submitButton: { width: "100%", backgroundColor: "#4f46e5", color: "#fff", padding: "0.85rem 1rem", borderRadius: "0.6rem", border: "none", fontSize: "1rem", fontWeight: 700, cursor: "pointer", marginTop: "0.5rem" },
};
