"use client";
import React, { CSSProperties, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  dataNascimento: string;
  mensagem: string;
}

export default function NewLeadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    cargo: "",
    dataNascimento: "",
    mensagem: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10 || cleaned.length === 11;
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
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

    // tracking params (se houver)
    const urlParams = new URLSearchParams(window.location.search);
    const trackingData = {
      utm_source: urlParams.get("utm_source") || "",
      utm_medium: urlParams.get("utm_medium") || "",
      utm_campaign: urlParams.get("utm_campaign") || "",
      utm_term: urlParams.get("utm_term") || "",
      utm_content: urlParams.get("utm_content") || "",
      gclid: urlParams.get("gclid") || "",
      fbclid: urlParams.get("fbclid") || "",
    };

    const leadData = { ...formData, ...trackingData };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      if (res.ok) {
        // sucesso -> redireciona para a lista que vai buscar do backend
        alert("Lead cadastrado com sucesso!");
        router.push("/leads");
      } else {
        const error = await res.json().catch(() => ({}));
        alert("Erro ao cadastrar lead: " + (error.message || "tente novamente"));
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com a API.");
    }
  };

  return (
    <div style={pageStyles.formContainer}>
      <div style={pageStyles.card}>
        <h2 style={pageStyles.title}>Cadastre-se</h2>
        <p style={pageStyles.subtitle}>Preencha o formulário abaixo e entraremos em contato</p>

        <form style={pageStyles.form} onSubmit={handleSubmit} noValidate>
          <div style={pageStyles.formGroup}>
            <label style={pageStyles.label}>👤 Nome Completo</label>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome completo"
              style={{ ...pageStyles.input, ...(errors.nome ? pageStyles.inputError : {}) }}
            />
            {errors.nome && <p style={pageStyles.errorText}>{errors.nome}</p>}
          </div>

          <div style={pageStyles.formGroup}>
            <label style={pageStyles.label}>📧 E-mail</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              style={{ ...pageStyles.input, ...(errors.email ? pageStyles.inputError : {}) }}
            />
            {errors.email && <p style={pageStyles.errorText}>{errors.email}</p>}
          </div>

          <div style={pageStyles.formGroup}>
            <label style={pageStyles.label}>📱 Telefone</label>
            <input
              name="telefone"
              type="tel"
              value={formData.telefone}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
              maxLength={15}
              style={{ ...pageStyles.input, ...(errors.telefone ? pageStyles.inputError : {}) }}
            />
            {errors.telefone && <p style={pageStyles.errorText}>{errors.telefone}</p>}
          </div>

          <div style={pageStyles.formGroup}>
            <label style={pageStyles.label}>💼 Cargo</label>
            <input
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              placeholder="Seu cargo atual"
              style={{ ...pageStyles.input, ...(errors.cargo ? pageStyles.inputError : {}) }}
            />
            {errors.cargo && <p style={pageStyles.errorText}>{errors.cargo}</p>}
          </div>

          <div style={pageStyles.formGroup}>
            <label style={pageStyles.label}>📅 Data de Nascimento</label>
            <input
              name="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={handleChange}
              style={{ ...pageStyles.input, ...(errors.dataNascimento ? pageStyles.inputError : {}) }}
            />
            {errors.dataNascimento && <p style={pageStyles.errorText}>{errors.dataNascimento}</p>}
          </div>

          <div style={pageStyles.formGroup}>
            <label style={pageStyles.label}>💬 Mensagem</label>
            <textarea
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              rows={4}
              placeholder="Deixe sua mensagem..."
              style={{ ...pageStyles.input, ...pageStyles.textarea, ...(errors.mensagem ? pageStyles.inputError : {}) }}
            />
            {errors.mensagem && <p style={pageStyles.errorText}>{errors.mensagem}</p>}
          </div>

          <button
            type="submit"
            style={pageStyles.submitButton}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
          >
            💾 Enviar Cadastro
          </button>
        </form>
      </div>
    </div>
  );
}

const pageStyles: { [k: string]: CSSProperties } = {
  formContainer: {
    maxWidth: "640px",
    margin: "0 auto",
    paddingTop: "1rem",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    boxShadow: "0 18px 30px -8px rgba(0,0,0,0.12)",
    padding: "2rem",
  },
  title: { fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.25rem" },
  subtitle: { color: "#6b7280", marginBottom: "1.5rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  formGroup: { display: "flex", flexDirection: "column" },
  label: { fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #e6e6e6",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.12s",
  },
  textarea: { resize: "vertical", minHeight: "80px", fontFamily: "inherit" },
  inputError: { borderColor: "#ef4444" },
  errorText: { color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem" },
  submitButton: {
    width: "100%",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    padding: "0.85rem 1rem",
    borderRadius: "0.6rem",
    border: "none",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "0.5rem",
    boxShadow: "0 10px 18px -8px rgba(79,70,229,0.45)",
    transition: "all 0.15s",
  },
};
