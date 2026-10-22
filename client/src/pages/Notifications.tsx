import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  MessageSquare, 
  Gift, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  Inbox
} from 'lucide-react';
import { api } from '../services/api';
import type { NotificationItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshNotificationsCount } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      refreshNotificationsCount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      refreshNotificationsCount();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'request_received':
        return <Inbox className="w-5 h-5 text-rekind-espresso" />;
      case 'request_accepted':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'need_offer':
        return <Gift className="w-5 h-5 text-rekind-terracotta" />;
      case 'message_received':
        return <MessageSquare className="w-5 h-5 text-rekind-brown" />;
      case 'transfer_completed':
        return <Sparkles className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-rekind-dark" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-rekind-border/70 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rekind-terracotta">
            Updates & Activity
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-rekind-dark">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-rekind-muted mt-1">
            Stay informed on item requests, neighbor offers, messages, and transfer milestones.
          </p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-rekind-border text-xs font-semibold text-rekind-dark hover:bg-rekind-sand/30 transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-rekind-brown" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-rekind-dark text-white'
              : 'bg-white border border-rekind-border text-rekind-muted hover:text-rekind-dark'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'unread'
              ? 'bg-rekind-dark text-white'
              : 'bg-white border border-rekind-border text-rekind-muted hover:text-rekind-dark'
          }`}
        >
          Unread ({notifications.filter(n => !n.isRead).length})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white p-5 rounded-2xl border border-rekind-border animate-pulse h-20" />
          ))}
        </div>
      ) : filteredNotifs.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkAsRead(notif.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                notif.isRead
                  ? 'bg-white border-rekind-border/70 text-rekind-muted'
                  : 'bg-rekind-cream border-rekind-tan/60 shadow-xs'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-rekind-border shrink-0">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-rekind-dark">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-rekind-muted shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-rekind-dark/80 leading-relaxed mb-3">
                  {notif.message}
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    to={notif.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rekind-brown hover:text-rekind-dark"
                  >
                    <span>View Activity</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  {!notif.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notif.id);
                      }}
                      className="text-[11px] text-rekind-muted hover:text-rekind-dark"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-rekind-border p-8 space-y-2">
          <Bell className="w-10 h-10 text-rekind-muted mx-auto" />
          <h3 className="font-heading font-bold text-base text-rekind-dark">All caught up!</h3>
          <p className="text-xs text-rekind-muted">You have no new notifications right now.</p>
        </div>
      )}

    </div>
  );
};
