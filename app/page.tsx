"use client";
import { CSSProperties, useState } from "react";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  dataNascimento: string;
  mensagem: string;
}
export default function LeadManagementSystem() {
  const [activeTab, setActiveTab] = useState('form');
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    dataNascimento: '',
    mensagem: ''
  });
  const [errors, setErrors] = useState<any>({});

  const validateEmail = (email:any) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone:any) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  };

  const formatPhone = (value:any) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (e:any) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, telefone: formatted });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    const newErrors:any = {};

    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido';
    }
    if (!formData.cargo) newErrors.cargo = 'Cargo é obrigatório';
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    if (!formData.mensagem) newErrors.mensagem = 'Mensagem é obrigatória';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const trackingData = {
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_term: urlParams.get('utm_term') || '',
        utm_content: urlParams.get('utm_content') || '',
        gclid: urlParams.get('gclid') || '',
        fbclid: urlParams.get('fbclid') || ''
      };

      const leadData = { ...formData, ...trackingData };
      console.log('Lead enviado:', leadData);
      alert('Lead cadastrado com sucesso!');
      
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
        dataNascimento: '',
        mensagem: ''
      });
    }
  };

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
      `}</style>

      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>L0gik Leads</h1>
          <nav style={styles.nav}>
            <button
              onClick={() => setActiveTab('form')}
              style={{
                ...styles.navButton,
                ...(activeTab === 'form' ? styles.navButtonActive : {})
              }}
            >
              Formulário
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              style={{
                ...styles.navButton,
                ...(activeTab === 'admin' ? styles.navButtonActive : {})
              }}
            >
              Painel Admin
            </button>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        {activeTab === 'form' ? (
          <div style={styles.formContainer}>
            <div style={styles.card}>
              <h2 style={styles.title}>Cadastre-se</h2>
              <p style={styles.subtitle}>
                Preencha o formulário abaixo e entraremos em contato
              </p>

              <div style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>👤 Nome Completo</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.nome ? styles.inputError : {})
                    }}
                    placeholder="Seu nome completo"
                  />
                  {errors.nome && (
                    <p style={styles.errorText}>{errors.nome}</p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>📧 E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.email ? styles.inputError : {})
                    }}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p style={styles.errorText}>{errors.email}</p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>📱 Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    style={{
                      ...styles.input,
                      ...(errors.telefone ? styles.inputError : {})
                    }}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                  {errors.telefone && (
                    <p style={styles.errorText}>{errors.telefone}</p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>💼 Cargo</label>
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.cargo ? styles.inputError : {})
                    }}
                    placeholder="Seu cargo atual"
                  />
                  {errors.cargo && (
                    <p style={styles.errorText}>{errors.cargo}</p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>📅 Data de Nascimento</label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.dataNascimento ? styles.inputError : {})
                    }}
                  />
                  {errors.dataNascimento && (
                    <p style={styles.errorText}>{errors.dataNascimento}</p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>💬 Mensagem</label>
                  <textarea
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    rows={4}
                    style={{
                      ...styles.input,
                      ...styles.textarea,
                      ...(errors.mensagem ? styles.inputError : {})
                    }}
                    placeholder="Deixe sua mensagem..."
                  />
                  {errors.mensagem && (
                    <p style={styles.errorText}>{errors.mensagem}</p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  style={styles.submitButton}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                >
                  💾 Enviar Cadastro
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.card}>
            <h2 style={styles.title}>Painel Administrativo</h2>
            <div style={styles.adminPlaceholder}>
              <p style={styles.adminText}>Painel em desenvolvimento</p>
              <p style={styles.adminSubtext}>
                Aqui você poderá gerenciar, visualizar e exportar seus leads
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {

  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  header: {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
  },
  navButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  navButtonActive: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  formContainer: {
    maxWidth: '600px',
    margin: '0 auto',
  },
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
   
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s',
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
  submitButton: {
    width: '100%',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
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
};