import React, { useState } from 'react';
import {
  Mail,
  Users,
  User,
  Inbox as InboxIcon,
  Send,
  Reply,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  PenLine,
  X,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';
import {
  getMessagesForStudent,
  getSentByStudent,
  sendMessage,
  type NotificationMessage,
} from '../data/mockNotifications';

const MOCK_STUDENT_ID = '1';
const MOCK_STUDENT_NAME = 'Ana García';

export const Inbox = () => {
  const { themeMode } = useGame();
  const theme = getTheme(themeMode);

  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Compose state
  const [showCompose, setShowCompose] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reply state
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState('');

  const received = getMessagesForStudent(MOCK_STUDENT_ID);
  const sent = getSentByStudent(MOCK_STUDENT_ID);
  const unreadCount = received.filter((m) => !m.read && !readIds.has(m.id)).length;

  const toggleExpand = (msg: NotificationMessage) => {
    const next = expandedId === msg.id ? null : msg.id;
    setExpandedId(next);
    if (next && !msg.read) {
      setReadIds((prev) => new Set(prev).add(msg.id));
    }
    if (expandedId !== msg.id) {
      setReplyToId(null);
      setReplyBody('');
    }
  };

  const isUnread = (msg: NotificationMessage) => !msg.read && !readIds.has(msg.id);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendNew = () => {
    if (!composeSubject.trim() || !composeBody.trim()) return;
    sendMessage({
      from: MOCK_STUDENT_NAME,
      fromId: MOCK_STUDENT_ID,
      to: 'profesor',
      subject: composeSubject.trim(),
      body: composeBody.trim(),
      date: new Date().toISOString(),
      read: false,
    });
    setComposeSubject('');
    setComposeBody('');
    setShowCompose(false);
    showSuccess();
  };

  const handleReply = (originalMsg: NotificationMessage) => {
    if (!replyBody.trim()) return;
    const reSubject = originalMsg.subject.startsWith('Re: ')
      ? originalMsg.subject
      : `Re: ${originalMsg.subject}`;
    sendMessage({
      from: MOCK_STUDENT_NAME,
      fromId: MOCK_STUDENT_ID,
      to: 'profesor',
      subject: reSubject,
      body: replyBody.trim(),
      date: new Date().toISOString(),
      read: false,
    });
    setReplyToId(null);
    setReplyBody('');
    showSuccess();
  };

  const showSuccess = () => {
    setSuccessMsg('Mensaje enviado');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const messages = tab === 'received' ? received : sent;

  return (
    <div
      className={`min-h-screen ${theme.container} pb-24 ${
        themeMode === 'young'
          ? 'bg-gradient-to-b from-finomik-blue-soft/60 to-white'
          : ''
      }`}
    >
      {/* Header */}
      <div
        className={`px-6 pt-8 pb-6 ${
          themeMode === 'young'
            ? 'bg-finomik-gradient-strong text-white'
            : 'bg-white text-finomik-primary border-b border-[color:var(--finomik-blue-6)]'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Mail size={28} />
            <div>
              <h1 className="heading-1 text-2xl tracking-tight">Buzón de mensajes</h1>
              <p
                className={
                  themeMode === 'young'
                    ? 'text-white/80 text-sm'
                    : 'text-[color:var(--finomik-blue-5)] text-sm'
                }
              >
                {received.length === 0
                  ? 'No tienes mensajes'
                  : `${received.length} recibido${received.length !== 1 ? 's' : ''}${
                      unreadCount > 0 ? ` · ${unreadCount} sin leer` : ''
                    }`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCompose(!showCompose)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
              themeMode === 'young'
                ? 'bg-white text-finomik-primary hover:bg-white/90'
                : 'bg-finomik-primary text-white hover:opacity-90'
            }`}
          >
            <PenLine size={16} />
            Escribir
          </button>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {/* Success toast */}
        {successMsg && (
          <div className="flex items-center gap-2 text-sm font-semibold text-finomik-success bg-finomik-success/10 px-4 py-2.5 rounded-xl">
            <CheckCircle size={16} />
            {successMsg}
          </div>
        )}

        {/* Compose form */}
        {showCompose && (
          <div
            className={`rounded-xl border p-4 space-y-3 ${
              themeMode === 'young'
                ? 'bg-white border-finomik-blue-4 shadow-md'
                : 'bg-white border-[color:var(--finomik-blue-6)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-finomik-primary flex items-center gap-2">
                <Send size={16} />
                Nuevo mensaje al profesor
              </h3>
              <button
                onClick={() => setShowCompose(false)}
                className="p-1 rounded-lg hover:bg-finomik-blue-soft/50 text-[color:var(--finomik-blue-5)]"
              >
                <X size={16} />
              </button>
            </div>

            <input
              type="text"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              placeholder="Asunto..."
              className="w-full rounded-lg border border-[color:var(--finomik-blue-6)] bg-white px-3 py-2 text-sm text-finomik-primary placeholder:text-[color:var(--finomik-blue-5)] focus:outline-none focus:ring-2 focus:ring-finomik-blue-4/40 focus:border-finomik-blue-4"
            />
            <textarea
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              placeholder="Escribe tu mensaje..."
              rows={3}
              className="w-full rounded-lg border border-[color:var(--finomik-blue-6)] bg-white px-3 py-2 text-sm text-finomik-primary placeholder:text-[color:var(--finomik-blue-5)] focus:outline-none focus:ring-2 focus:ring-finomik-blue-4/40 focus:border-finomik-blue-4 resize-none"
            />
            <button
              onClick={handleSendNew}
              disabled={!composeSubject.trim() || !composeBody.trim()}
              className="inline-flex items-center gap-2 bg-finomik-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              Enviar
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-finomik-blue-soft/40 p-1 rounded-xl">
          <button
            onClick={() => setTab('received')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'received'
                ? 'bg-white text-finomik-primary shadow-sm'
                : 'text-[color:var(--finomik-blue-5)] hover:text-finomik-primary'
            }`}
          >
            Recibidos
            {unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('sent')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'sent'
                ? 'bg-white text-finomik-primary shadow-sm'
                : 'text-[color:var(--finomik-blue-5)] hover:text-finomik-primary'
            }`}
          >
            Enviados
            {sent.length > 0 && (
              <span className="ml-1.5 text-xs font-normal text-[color:var(--finomik-blue-5)]">
                ({sent.length})
              </span>
            )}
          </button>
        </div>

        {/* Messages list */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                themeMode === 'young'
                  ? 'bg-finomik-blue-soft/60'
                  : 'bg-finomik-blue-soft'
              }`}
            >
              <InboxIcon size={32} className="text-[color:var(--finomik-blue-5)]" />
            </div>
            <p className="text-sm font-semibold text-[color:var(--finomik-blue-5)]">
              {tab === 'received' ? 'No tienes mensajes recibidos' : 'No has enviado ningún mensaje'}
            </p>
            {tab === 'sent' && (
              <p className="text-xs text-[color:var(--finomik-blue-5)] mt-1">
                Puedes escribir a tu profesor usando el botón "Escribir".
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const expanded = expandedId === msg.id;
              const unread = tab === 'received' && isUnread(msg);
              const isGlobal = msg.to === 'all';
              const isReplyOpen = replyToId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`rounded-xl border transition-colors ${
                    themeMode === 'young'
                      ? unread
                        ? 'bg-white border-finomik-blue-4 shadow-md'
                        : 'bg-white/80 border-[color:var(--finomik-blue-6)]/60 shadow-sm'
                      : unread
                        ? 'bg-white border-finomik-blue-4 shadow-md'
                        : 'bg-white border-[color:var(--finomik-blue-6)] shadow-sm'
                  } hover:shadow-md`}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(msg)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-3 p-4">
                      {/* Unread dot */}
                      {tab === 'received' && (
                        <div className="pt-1.5 w-3 shrink-0 flex justify-center">
                          {unread && (
                            <span className="block w-2.5 h-2.5 rounded-full bg-finomik-primary" />
                          )}
                        </div>
                      )}

                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          tab === 'sent'
                            ? 'bg-finomik-blue-soft/60 text-finomik-primary'
                            : isGlobal
                              ? 'bg-finomik-blue-soft text-finomik-primary'
                              : 'bg-finomik-success/10 text-finomik-success'
                        }`}
                      >
                        {tab === 'sent' ? (
                          <Send size={16} />
                        ) : isGlobal ? (
                          <Users size={18} />
                        ) : (
                          <User size={18} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`text-sm truncate ${
                                unread
                                  ? 'font-bold text-finomik-primary'
                                  : 'font-semibold text-finomik-primary'
                              }`}
                            >
                              {tab === 'received' ? msg.from : 'Al profesor'}
                            </span>
                            {tab === 'received' && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                  isGlobal
                                    ? 'bg-finomik-blue-soft text-finomik-primary'
                                    : 'bg-finomik-success/10 text-finomik-success'
                                }`}
                              >
                                {isGlobal ? 'Toda la clase' : 'Para ti'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[color:var(--finomik-blue-5)] shrink-0">
                            {formatDate(msg.date)}
                          </span>
                        </div>

                        <p
                          className={`text-sm truncate ${
                            unread
                              ? 'font-semibold text-finomik-primary'
                              : 'font-medium text-finomik-primary'
                          }`}
                        >
                          {msg.subject}
                        </p>

                        {!expanded && (
                          <p className="text-xs text-[color:var(--finomik-blue-5)] mt-0.5 truncate">
                            {msg.body}
                          </p>
                        )}

                        {expanded && (
                          <p className="text-sm text-[color:var(--finomik-blue-5)] mt-2 whitespace-pre-wrap">
                            {msg.body}
                          </p>
                        )}
                      </div>

                      {/* Chevron */}
                      <div className="shrink-0 text-[color:var(--finomik-blue-5)] mt-1">
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </button>

                  {/* Reply area (only for received, when expanded) */}
                  {expanded && tab === 'received' && (
                    <div className="px-4 pb-4 pt-0">
                      {!isReplyOpen ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplyToId(msg.id);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-finomik-primary hover:text-finomik-blue-4 transition-colors mt-1"
                        >
                          <Reply size={14} />
                          Responder
                        </button>
                      ) : (
                        <div
                          className="mt-3 space-y-2 border-t border-[color:var(--finomik-blue-6)] pt-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <textarea
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            placeholder="Escribe tu respuesta..."
                            rows={2}
                            className="w-full rounded-lg border border-[color:var(--finomik-blue-6)] bg-white px-3 py-2 text-sm text-finomik-primary placeholder:text-[color:var(--finomik-blue-5)] focus:outline-none focus:ring-2 focus:ring-finomik-blue-4/40 focus:border-finomik-blue-4 resize-none"
                            autoFocus
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReply(msg)}
                              disabled={!replyBody.trim()}
                              className="inline-flex items-center gap-1.5 bg-finomik-primary text-white px-3 py-1.5 rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Send size={12} />
                              Enviar respuesta
                            </button>
                            <button
                              onClick={() => {
                                setReplyToId(null);
                                setReplyBody('');
                              }}
                              className="text-xs text-[color:var(--finomik-blue-5)] hover:text-finomik-primary font-semibold"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
