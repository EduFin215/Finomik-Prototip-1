import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  Users,
  User,
  Mail,
  Inbox,
  Reply,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from 'lucide-react';
import { mockStudents } from '../../data/mockProfessorData';
import {
  getSentByProfessor,
  getMessagesForProfessor,
  sendMessage,
  getRecipientName,
  type NotificationMessage,
} from '../../data/mockNotifications';

export const MessagesView: React.FC = () => {
  const [tab, setTab] = useState<'compose' | 'sent' | 'received'>('compose');

  const [recipient, setRecipient] = useState('all');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [sentMessages, setSentMessages] = useState(getSentByProfessor);
  const [receivedMessages, setReceivedMessages] = useState(getMessagesForProfessor);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Reply state
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');

  const refreshLists = () => {
    setSentMessages(getSentByProfessor());
    setReceivedMessages(getMessagesForProfessor());
  };

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) return;
    sendMessage({
      from: 'Profesor García',
      fromId: 'profesor',
      to: recipient,
      subject: subject.trim(),
      body: body.trim(),
      date: new Date().toISOString(),
      read: false,
    });
    setSubject('');
    setBody('');
    refreshLists();
    showSuccess('Mensaje enviado correctamente');
  };

  const handleReply = (originalMsg: NotificationMessage) => {
    if (!replyBody.trim()) return;
    const reSubject = replySubject.trim() || (
      originalMsg.subject.startsWith('Re: ')
        ? originalMsg.subject
        : `Re: ${originalMsg.subject}`
    );
    sendMessage({
      from: 'Profesor García',
      fromId: 'profesor',
      to: originalMsg.fromId,
      subject: reSubject,
      body: replyBody.trim(),
      date: new Date().toISOString(),
      read: false,
    });
    setReplyToId(null);
    setReplySubject('');
    setReplyBody('');
    refreshLists();
    showSuccess('Respuesta enviada correctamente');
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadReceived = receivedMessages.filter((m) => !m.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Success toast */}
      {successMsg && (
        <div className="flex items-center gap-2 text-sm font-semibold text-finomik-success bg-finomik-success/10 px-4 py-2.5 rounded-xl">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-finomik-blue-soft/40 p-1 rounded-xl">
        <button
          onClick={() => setTab('compose')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            tab === 'compose'
              ? 'bg-white text-finomik-primary shadow-sm'
              : 'text-[color:var(--finomik-blue-5)] hover:text-finomik-primary'
          }`}
        >
          <Mail size={16} />
          Redactar
        </button>
        <button
          onClick={() => setTab('received')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            tab === 'received'
              ? 'bg-white text-finomik-primary shadow-sm'
              : 'text-[color:var(--finomik-blue-5)] hover:text-finomik-primary'
          }`}
        >
          <Inbox size={16} />
          Recibidos
          {unreadReceived > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
              {unreadReceived}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            tab === 'sent'
              ? 'bg-white text-finomik-primary shadow-sm'
              : 'text-[color:var(--finomik-blue-5)] hover:text-finomik-primary'
          }`}
        >
          <Send size={16} />
          Enviados
          <span className="text-xs font-normal text-[color:var(--finomik-blue-5)]">
            ({sentMessages.length})
          </span>
        </button>
      </div>

      {/* Compose tab */}
      {tab === 'compose' && (
        <div className="bg-white rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-5 sm:p-6">
          <h3 className="heading-2 text-lg text-finomik-primary mb-4 flex items-center gap-2">
            <Mail size={20} />
            Nuevo mensaje
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-finomik-primary mb-1.5">
                Destinatario
              </label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-xl border border-[color:var(--finomik-blue-6)] bg-white px-4 py-2.5 text-sm text-finomik-primary focus:outline-none focus:ring-2 focus:ring-finomik-blue-4/40 focus:border-finomik-blue-4 transition-colors"
              >
                <option value="all">Toda la clase</option>
                {mockStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-finomik-primary mb-1.5">
                Asunto
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Escribe el asunto del mensaje..."
                className="w-full rounded-xl border border-[color:var(--finomik-blue-6)] bg-white px-4 py-2.5 text-sm text-finomik-primary placeholder:text-[color:var(--finomik-blue-5)] focus:outline-none focus:ring-2 focus:ring-finomik-blue-4/40 focus:border-finomik-blue-4 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-finomik-primary mb-1.5">
                Mensaje
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                rows={4}
                className="w-full rounded-xl border border-[color:var(--finomik-blue-6)] bg-white px-4 py-2.5 text-sm text-finomik-primary placeholder:text-[color:var(--finomik-blue-5)] focus:outline-none focus:ring-2 focus:ring-finomik-blue-4/40 focus:border-finomik-blue-4 transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!subject.trim() || !body.trim()}
              className="inline-flex items-center gap-2 bg-finomik-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              Enviar mensaje
            </button>
          </div>
        </div>
      )}

      {/* Received tab */}
      {tab === 'received' && (
        <div className="bg-white rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-5 sm:p-6">
          <h3 className="heading-2 text-lg text-finomik-primary mb-4 flex items-center gap-2">
            <Inbox size={20} />
            Mensajes de alumnos
          </h3>

          {receivedMessages.length === 0 ? (
            <p className="text-sm text-[color:var(--finomik-blue-5)] text-center py-8">
              No has recibido mensajes de alumnos.
            </p>
          ) : (
            <div className="space-y-3">
              {receivedMessages.map((msg) => {
                const isExpanded = expandedId === msg.id;
                const isReplyOpen = replyToId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`rounded-xl border transition-colors ${
                      !msg.read
                        ? 'border-finomik-blue-4 bg-finomik-blue-soft/20'
                        : 'border-[color:var(--finomik-blue-6)]'
                    } hover:border-finomik-blue-4`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedId(isExpanded ? null : msg.id);
                        if (!isExpanded) {
                          setReplyToId(null);
                          setReplyBody('');
                          setReplySubject('');
                        }
                      }}
                      className="w-full text-left"
                    >
                      <div className="flex items-start gap-3 p-4">
                        <div className="pt-1.5 w-3 shrink-0 flex justify-center">
                          {!msg.read && (
                            <span className="block w-2.5 h-2.5 rounded-full bg-finomik-primary" />
                          )}
                        </div>

                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-finomik-blue-soft text-finomik-primary">
                          <User size={18} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className={`text-sm truncate ${!msg.read ? 'font-bold' : 'font-semibold'} text-finomik-primary`}>
                              {msg.from}
                            </span>
                            <span className="text-xs text-[color:var(--finomik-blue-5)] shrink-0">
                              {formatDate(msg.date)}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${!msg.read ? 'font-semibold' : 'font-medium'} text-finomik-primary`}>
                            {msg.subject}
                          </p>

                          {!isExpanded && (
                            <p className="text-xs text-[color:var(--finomik-blue-5)] mt-0.5 truncate">
                              {msg.body}
                            </p>
                          )}

                          {isExpanded && (
                            <p className="text-sm text-[color:var(--finomik-blue-5)] mt-2 whitespace-pre-wrap">
                              {msg.body}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 text-[color:var(--finomik-blue-5)] mt-1">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4">
                        {!isReplyOpen ? (
                          <button
                            onClick={() => setReplyToId(msg.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-finomik-primary hover:text-finomik-blue-4 transition-colors"
                          >
                            <Reply size={14} />
                            Responder a {msg.from.split(' ')[0]}
                          </button>
                        ) : (
                          <div className="mt-2 space-y-2 border-t border-[color:var(--finomik-blue-6)] pt-3">
                            <input
                              type="text"
                              value={replySubject}
                              onChange={(e) => setReplySubject(e.target.value)}
                              placeholder={`Re: ${msg.subject}`}
                              className="w-full rounded-lg border border-[color:var(--finomik-blue-6)] bg-white px-3 py-2 text-sm text-finomik-primary placeholder:text-[color:var(--finomik-blue-5)] focus:outline-none focus:ring-2 focus:ring-finomik-blue-4/40 focus:border-finomik-blue-4"
                            />
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
                                  setReplySubject('');
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
      )}

      {/* Sent tab */}
      {tab === 'sent' && (
        <div className="bg-white rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-5 sm:p-6">
          <h3 className="heading-2 text-lg text-finomik-primary mb-4">
            Mensajes enviados
            <span className="ml-2 text-sm font-normal text-[color:var(--finomik-blue-5)]">
              ({sentMessages.length})
            </span>
          </h3>

          {sentMessages.length === 0 ? (
            <p className="text-sm text-[color:var(--finomik-blue-5)] text-center py-8">
              No has enviado ningún mensaje todavía.
            </p>
          ) : (
            <div className="space-y-3">
              {sentMessages.map((msg) => {
                const isExpanded = expandedId === msg.id;
                const isGlobal = msg.to === 'all';

                return (
                  <button
                    key={msg.id}
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                    className="w-full text-left rounded-xl border border-[color:var(--finomik-blue-6)] hover:border-finomik-blue-4 transition-colors"
                  >
                    <div className="flex items-start gap-3 p-4">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isGlobal
                            ? 'bg-finomik-blue-soft text-finomik-primary'
                            : 'bg-finomik-success/10 text-finomik-success'
                        }`}
                      >
                        {isGlobal ? <Users size={18} /> : <User size={18} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="font-semibold text-sm text-finomik-primary truncate">
                            {getRecipientName(msg.to)}
                          </span>
                          <span className="text-xs text-[color:var(--finomik-blue-5)] shrink-0">
                            {formatDate(msg.date)}
                          </span>
                        </div>
                        <p className="text-sm text-finomik-primary font-medium truncate">
                          {msg.subject}
                        </p>

                        {isExpanded && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-sm text-[color:var(--finomik-blue-5)] mt-2 whitespace-pre-wrap"
                          >
                            {msg.body}
                          </motion.p>
                        )}
                      </div>

                      <div className="shrink-0 text-[color:var(--finomik-blue-5)] mt-1">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
