'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  dataNascimento: string;
  mensagem: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  createdAt: string;
  updatedAt: string;
}

export default function LeadDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/leads/${id}`);
      
      if (!response.ok) {
        throw new Error('Lead não encontrado');
      }
      
      const data = await response.json();
      setLead(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao deletar lead');
      }
      
      alert('Lead deletado com sucesso!');
      router.push('/');
    } catch (err) {
      alert('Erro ao deletar lead: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Carregando detalhes do lead...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorTitle}>❌ Erro</h2>
          <p style={styles.errorText}>{error}</p>
          <Link href="/">
            <button style={styles.btnPrimary}>← Voltar para lista</button>
          </Link>
        </div>
      </div>
    );
  }

  if (!lead) {
    return null;
  }

  const hasTracking = lead.utm_source || lead.utm_medium || lead.utm_campaign || 
                      lead.utm_term || lead.utm_content || lead.gclid || lead.fbclid;

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <Link href="/">
              <button style={styles.btnBack}>← Voltar</button>
            </Link>
            <h1 style={styles.title}>Detalhes do Lead</h1>
            <p style={styles.subtitle}>ID: {id}</p>
          </div>
          <div style={styles.headerActions}>
            <Link href={`/leads/edit/${id}`}>
              <button style={styles.btnSecondary}>✏️ Editar</button>
            </Link>
            <button 
              style={styles.btnDanger}
              onClick={() => setShowDeleteModal(true)}
            >
              🗑️ Deletar
            </button>
          </div>
        </div>

        {/* Cards Container */}
        <div style={styles.cardsContainer}>
          
          {/* Informações Pessoais */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>👤 Informações Pessoais</h2>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.infoGrid}>
                <InfoItem label="Nome Completo" value={lead.nome} />
                <InfoItem label="E-mail" value={lead.email} icon="📧" />
                <InfoItem label="Telefone" value={lead.telefone} icon="📱" />
                <InfoItem label="Cargo" value={lead.cargo} icon="💼" />
                <InfoItem 
                  label="Data de Nascimento" 
                  value={formatDate(lead.dataNascimento)} 
                  icon="🎂" 
                />
              </div>
              
              <div style={styles.messageSection}>
                <label style={styles.messageLabel}>💬 Mensagem</label>
                <div style={styles.messageBox}>
                  {lead.mensagem}
                </div>
              </div>
            </div>
          </div>

          {/* Dados de Tracking */}
          {hasTracking && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>📊 Dados de Tracking</h2>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.trackingGrid}>
                  {lead.utm_source && (
                    <TrackingItem label="UTM Source" value={lead.utm_source} />
                  )}
                  {lead.utm_medium && (
                    <TrackingItem label="UTM Medium" value={lead.utm_medium} />
                  )}
                  {lead.utm_campaign && (
                    <TrackingItem label="UTM Campaign" value={lead.utm_campaign} />
                  )}
                  {lead.utm_term && (
                    <TrackingItem label="UTM Term" value={lead.utm_term} />
                  )}
                  {lead.utm_content && (
                    <TrackingItem label="UTM Content" value={lead.utm_content} />
                  )}
                  {lead.gclid && (
                    <TrackingItem label="Google Click ID (GCLID)" value={lead.gclid} />
                  )}
                  {lead.fbclid && (
                    <TrackingItem label="Facebook Click ID (FBCLID)" value={lead.fbclid} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Metadados */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>🕒 Metadados</h2>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.metaGrid}>
                <InfoItem 
                  label="Data de Cadastro" 
                  value={formatDateTime(lead.createdAt)} 
                  icon="📅" 
                />
                <InfoItem 
                  label="Última Atualização" 
                  value={formatDateTime(lead.updatedAt)} 
                  icon="🔄" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Delete */}
      {showDeleteModal && (
        <div style={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>⚠️ Confirmar Exclusão</h2>
            <p style={styles.modalText}>
              Tem certeza que deseja deletar o lead de <strong>{lead.nome}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div style={styles.modalActions}>
              <button 
                style={styles.btnSecondary}
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button 
                style={styles.btnDanger}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deletando...' : 'Sim, Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para exibir informações
interface InfoItemProps {
  label: string;
  value: string;
  icon?: string;
}

function InfoItem({ label, value, icon }: InfoItemProps) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>
        {icon && <span style={styles.infoIcon}>{icon}</span>}
        {label}
      </span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

// Componente para itens de tracking
interface TrackingItemProps {
  label: string;
  value: string;
}

function TrackingItem({ label, value }: TrackingItemProps) {
  return (
    <div style={styles.trackingItem}>
      <span style={styles.trackingLabel}>{label}</span>
      <span style={styles.trackingValue}>{value}</span>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '2rem 1rem',
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    marginTop: '1rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  headerActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  btnBack: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnPrimary: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnSecondary: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnDanger: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cardsContainer: {
    display: 'grid',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
  },
  cardBody: {
    padding: '1.5rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  infoLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  infoIcon: {
    fontSize: '1rem',
  },
  infoValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#111827',
  },
  messageSection: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb',
  },
  messageLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
    display: 'block',
    marginBottom: '0.75rem',
  },
  messageBox: {
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    color: '#374151',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
  trackingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
  },
  trackingItem: {
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
  },
  trackingLabel: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
  },
  trackingValue: {
    display: 'block',
    fontSize: '0.875rem',
    color: '#111827',
    fontWeight: '500',
    wordBreak: 'break-all',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #4f46e5',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    color: '#6b7280',
    fontSize: '1rem',
  },
  errorContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '3rem 2rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: '1.5rem',
    color: '#ef4444',
    marginBottom: '1rem',
  },
  errorText: {
    color: '#6b7280',
    marginBottom: '2rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '1rem',
  },
  modalText: {
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
};