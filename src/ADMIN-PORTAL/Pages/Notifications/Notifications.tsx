import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Tabs, Tab, Badge, Card} from "react-bootstrap";
import { ArrowLeft, Bell, Check, Clock, AlertCircle, Users, CreditCard, CheckCheck, Trash2} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  date: string;
  type: "info" | "success" | "warning" | "member" | "payment";
  read: boolean;
}
const NAVY = "#0f2a55";
const GOLD = "#f5c542";

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Member Registration",
    message:
      "John Doe has registered as a new member. Please review and approve.",
    time: "5 min ago",
    date: "Today",
    type: "member",
    read: false,
  },
  {
    id: "2",
    title: "Contribution Received",
    message: "₹5,000 contribution from Staff #12345.",
    time: "1 hour ago",
    date: "Today",
    type: "payment",
    read: false,
  },
  {
    id: "3",
    title: "System Update",
    message: "System maintenance scheduled tonight.",
    time: "5 hours ago",
    date: "Yesterday",
    type: "warning",
    read: true,
  },
];

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return <Check size={18} className="text-success" />;
    case "warning":
      return <AlertCircle size={18} style={{ color: GOLD }} />;
    case "member":
      return <Users size={18} style={{ color: NAVY }} />;
    case "payment":
      return <CreditCard size={18} className="text-success" />;
    default:
      return <Clock size={18} className="text-muted" />;
  }
};

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const remove = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const groupByDate = (list: Notification[]) =>
    list.reduce<Record<string, Notification[]>>((acc, n) => {
      acc[n.date] = acc[n.date] || [];
      acc[n.date].push(n);
      return acc;
    }, {});

  const NotificationItem = ({ n }: { n: Notification }) => (
    <div
      className="d-flex gap-3 p-3 align-items-start border-bottom"
      style={{ background: n.read ? "#fff" : "rgba(245,197,66,0.08)" }}
    >
      <div className="p-2 bg-light rounded-circle">{getIcon(n.type)}</div>

      <div className="flex-grow-1">
        <div className="fw-semibold">{n.title}</div>
        <div className="text-muted small">{n.message}</div>
        <div className="small mt-1" style={{ color: "#a36a00" }}>
          {n.time}
        </div>
      </div>

      <div className="d-flex gap-2">
        {!n.read && (
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => markRead(n.id)}>
            <Check size={14} />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline-danger"
          onClick={() => remove(n.id)} >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: NAVY }} className="py-3">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3 text-white">
            <Button
              variant="link"
              className="text-white p-0"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft />
            </Button>
            <Bell />
            <h5 className="mb-0">Notifications</h5>
          </div>

          {unread.length > 0 && (
            <Button variant="outline-light" size="sm" onClick={markAllRead}>
              <CheckCheck size={16} className="me-2" />
              Mark all read
            </Button>
          )}
        </Container>
      </div>

      {/* Content */}
      <Container className="py-4">
        <Tabs defaultActiveKey="all" className="mb-4">
          <Tab
            eventKey="all"
            title={
              <>
                All <Badge bg="secondary">{notifications.length}</Badge>
              </>
            }
          >
            {Object.entries(groupByDate(notifications)).map(([date, list]) => (
              <div key={date} className="mb-4">
                <small className="text-muted fw-semibold">{date}</small>
                <Card className="mt-2">
                  {list.map((n) => (
                    <NotificationItem key={n.id} n={n} />
                  ))}
                </Card>
              </div>
            ))}
          </Tab>

          <Tab
            eventKey="unread"
            title={
              <>
                Unread <Badge bg="warning">{unread.length}</Badge>
              </>
            }
          >
            <Card>
              {unread.length ? (
                unread.map((n) => <NotificationItem key={n.id} n={n} />)
              ) : (
                <div className="text-center p-5 text-muted">
                  All caught up 🎉
                </div>
              )}
            </Card>
          </Tab>

          <Tab
            eventKey="read"
            title={
              <>
                Read <Badge bg="secondary">{read.length}</Badge>
              </>
            }
          >
            <Card>
              {read.length ? (
                read.map((n) => <NotificationItem key={n.id} n={n} />)
              ) : (
                <div className="text-center p-5 text-muted">
                  No read notifications
                </div>
              )}
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default Notifications;
