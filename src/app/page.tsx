"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";

type Section = "Overview" | "People" | "Attendance" | "Leave" | "Hiring" | "Reports";
type Person = { id: number; name: string; role: string; department: string; email: string; status: "Active" | "On leave"; initials: string; color: string };
type LeaveRequest = { id: number; name: string; initials: string; department: string; type: string; dates: string; days: number; status: "Pending" | "Approved" | "Declined"; color: string };

const starterPeople: Person[] = [
  { id: 1, name: "Ayesha Khan", role: "Product Designer", department: "Design", email: "ayesha.khan@example.com", status: "Active", initials: "AK", color: "lavender" },
  { id: 2, name: "Hamza Ali", role: "Frontend Engineer", department: "Engineering", email: "hamza.ali@example.com", status: "Active", initials: "HA", color: "mint" },
  { id: 3, name: "Sara Ahmed", role: "People Operations", department: "People", email: "sara.ahmed@example.com", status: "On leave", initials: "SA", color: "peach" },
  { id: 4, name: "Zain Raza", role: "Backend Engineer", department: "Engineering", email: "zain.raza@example.com", status: "Active", initials: "ZR", color: "blue" },
  { id: 5, name: "Mariam Noor", role: "Growth Associate", department: "Marketing", email: "mariam.noor@example.com", status: "Active", initials: "MN", color: "pink" },
];
const starterRequests: LeaveRequest[] = [
  { id: 101, name: "Usman Tariq", initials: "UT", department: "Engineering", type: "Annual leave", dates: "Oct 31 – Nov 3", days: 3, status: "Pending", color: "gold" },
  { id: 102, name: "Noor Fatima", initials: "NF", department: "Design", type: "Sick leave", dates: "Nov 1", days: 1, status: "Pending", color: "lavender" },
  { id: 103, name: "Bilal Sheikh", initials: "BS", department: "Sales", type: "Personal leave", dates: "Nov 4 – 5", days: 2, status: "Pending", color: "mint" },
];
const navItems: { name: Section; icon: string }[] = [
  { name: "Overview", icon: "grid" }, { name: "People", icon: "people" }, { name: "Attendance", icon: "clock" },
  { name: "Leave", icon: "calendar" }, { name: "Hiring", icon: "briefcase" }, { name: "Reports", icon: "chart" },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/></>,
    people: <><path d="M16 20v-1.7a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20"/><circle cx="9.5" cy="7" r="4"/><path d="M20.5 20v-1.7a4 4 0 0 0-3-3.9M16.5 3.2a4 4 0 0 1 0 7.6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
    calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M16 3v4M8 3v4M3.5 10h17"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.3 4.3"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  };
  return <svg {...common}>{paths[name] ?? paths.grid}</svg>;
}

function Avatar({ initials, color, small = false }: { initials: string; color: string; small?: boolean }) {
  return <span className={`avatar ${color}${small ? " avatar-small" : ""}`}>{initials}</span>;
}

export default function Home() {
  const [section, setSection] = useState<Section>("Overview");
  const [people, setPeople] = useState(starterPeople);
  const [requests, setRequests] = useState(starterRequests);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem("fa-hrm-demo-v1");
        if (saved) {
          const data = JSON.parse(saved);
          if (Array.isArray(data.people)) setPeople(data.people);
          if (Array.isArray(data.requests)) setRequests(data.requests);
          if (typeof data.checkedIn === "boolean") setCheckedIn(data.checkedIn);
        }
      } catch { /* Use the sample workspace if browser storage is unavailable. */ }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("fa-hrm-demo-v1", JSON.stringify({ people, requests, checkedIn })); } catch { /* The app remains usable for this session. */ }
  }, [people, requests, checkedIn, hydrated]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const filteredPeople = useMemo(() => people.filter((person) => `${person.name} ${person.role} ${person.department}`.toLowerCase().includes(query.toLowerCase())), [people, query]);
  const pendingCount = requests.filter((request) => request.status === "Pending").length;
  const title = section === "Overview" ? "Good morning, Faiz" : section;
  const subtitle = section === "Overview" ? "Here’s what’s happening with your team today." : section === "People" ? "Your people, all in one place." : section === "Attendance" ? "Keep track of the team’s day." : section === "Leave" ? "Review and manage time off." : section === "Hiring" ? "Build a thoughtful hiring pipeline." : "A clear view of your people data.";

  function updateRequest(id: number, status: "Approved" | "Declined") {
    setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
    setNotice(`Request ${status.toLowerCase()}.`);
  }
  function addPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const role = String(form.get("role") ?? "").trim();
    const department = String(form.get("department") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    if (!name || !role || !department || !email) return;
    const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
    setPeople((current) => [{ id: Date.now(), name, role, department, email, status: "Active", initials, color: "blue" }, ...current]);
    setModal(false);
    setNotice(`${name} added to your team.`);
  }
  function exportPeople() {
    const rows = [["Name", "Role", "Department", "Email", "Status"], ...people.map(({ name, role, department, email, status }) => [name, role, department, email, status])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); link.download = "fa-hrm-people.csv"; link.click(); URL.revokeObjectURL(link.href);
    setNotice("People list exported.");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); setSection("Overview"); }}><span className="brand-mark">f<span>.</span></span><span className="brand-name">fa<span>hrm</span></span></a>
        <div className="workspace-label">WORKSPACE</div>
        <button className="workspace-switch"><span className="workspace-icon">N</span><span className="workspace-copy"><strong>Northstar Studio</strong><small>People workspace</small></span><span className="chevron">⌄</span></button>
        <div className="nav-label">MENU</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => <button key={item.name} className={`nav-item${section === item.name ? " active" : ""}`} onClick={() => setSection(item.name)}><Icon name={item.icon}/><span>{item.name}</span>{item.name === "Leave" && pendingCount > 0 && <span className="nav-count">{pendingCount}</span>}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-spark">✳</div><strong>Need a hand?</strong><p>Explore the quick guide to get the most from your workspace.</p><button onClick={() => setNotice("Your FA HRM workspace guide is coming soon.")}>Open help center <Icon name="arrow" size={14}/></button></div><div className="user-card"><Avatar initials="FI" color="blue"/><span className="user-info"><strong>Faiz Iqbal</strong><small>Workspace admin</small></span><button className="icon-button user-more" aria-label="More account options"><Icon name="more"/></button></div></div>
      </aside>

      <section className="main-area">
        <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{section}</strong></div><div className="top-actions"><label className="global-search"><Icon name="search" size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anything..." aria-label="Search people"/><kbd>⌘ K</kbd></label><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotice(`${pendingCount} leave requests need your attention.`)}><Icon name="bell"/><i/></button><span className="top-divider"/><Avatar initials="FI" color="blue" small/></div></header>

        <div className="content-wrap"><div className="page-heading"><div><div className="eyebrow">FRIDAY, OCTOBER 31, 2026 <span className="live-dot"/> YOUR WORKSPACE</div><h1>{title}<span className="heading-period">.</span></h1><p>{subtitle}</p></div><div className="heading-actions"><button className="button button-outline" onClick={exportPeople}><Icon name="arrow" size={16}/> Export</button><button className="button button-primary" onClick={() => section === "People" ? setModal(true) : setNotice("Choose People to add a team member.")}><Icon name="plus" size={17}/> Add a person</button></div></div>

        {section === "Overview" && <>
          <div className="metric-grid">
            <article className="metric-card"><div className="metric-top"><span>Total team</span><span className="metric-icon purple"><Icon name="people" size={17}/></span></div><div className="metric-value">{(people.length + 42).toString()}<span className="metric-change positive">↗ 8.2%</span></div><div className="metric-foot"><span>vs. last month</span><span className="mini-avatars"><Avatar initials="AK" color="lavender" small/><Avatar initials="HA" color="mint" small/><Avatar initials="+" color="neutral" small/></span><span className="foot-note">and 42 others</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Present today</span><span className="metric-icon green"><Icon name="check" size={17}/></span></div><div className="metric-value">38<span className="metric-muted"> / {people.length + 42}</span></div><div className="metric-foot"><span className="status-dot green-dot"/> <span>On track</span><span className="foot-note">· 4 away today</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>On leave</span><span className="metric-icon orange"><Icon name="calendar" size={17}/></span></div><div className="metric-value">04<span className="metric-change neutral-change">Today</span></div><div className="metric-foot"><span className="status-dot orange-dot"/> <span>2 planned · 2 sick</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Open positions</span><span className="metric-icon blue-icon"><Icon name="briefcase" size={17}/></span></div><div className="metric-value">06<span className="metric-change positive">+2 new</span></div><div className="metric-foot"><span>Across</span><span className="department-pills"><i>Eng</i><i>Design</i><i>Sales</i></span></div></article>
          </div>

          <div className="dashboard-grid"><section className="panel attendance-panel"><div className="panel-header"><div><h2>Attendance overview</h2><p>Team check-ins throughout the week</p></div><button className="select-button" onClick={() => setNotice("Showing this week’s sample attendance.")}>This week <span>⌄</span></button></div><div className="chart-legend"><span><i className="legend-present"/> Present</span><span><i className="legend-late"/> Late</span><span className="chart-total">Avg. attendance <strong>92.4%</strong></span></div><div className="chart"><div className="chart-y"><span>100%</span><span>75%</span><span>50%</span><span>25%</span></div><div className="chart-body"><div className="grid-lines"><i/><i/><i/><i/></div>{[{d:"Mon",p:77,l:8},{d:"Tue",p:89,l:5},{d:"Wed",p:82,l:9},{d:"Thu",p:94,l:4},{d:"Fri",p:70,l:6},{d:"Sat",p:32,l:2},{d:"Sun",p:12,l:1}].map((day) => <div className="bar-group" key={day.d}><div className="bar-stack" title={`${day.d}: ${day.p}% present`}><i style={{height:`${day.p}%`}}/><b style={{height:`${day.l}%`}}/></div><span>{day.d}</span></div>)}</div></div></section>
            <section className="panel quick-panel"><div className="panel-header"><div><h2>Quick actions</h2><p>Common tasks, one click away</p></div><span className="sparkle">✳</span></div><button className={`checkin-card${checkedIn ? " checked-in" : ""}`} onClick={() => { setCheckedIn(!checkedIn); setNotice(checkedIn ? "You’ve checked out." : "You’re checked in for today."); }}><span className="checkin-icon"><Icon name={checkedIn ? "check" : "clock"}/></span><span><strong>{checkedIn ? "You’re checked in" : "Clock in for today"}</strong><small>{checkedIn ? "Started just now · click to check out" : "Your day starts when you do"}</small></span><span className="checkin-arrow"><Icon name="arrow" size={16}/></span></button><button className="quick-row" onClick={() => setSection("People")}><span className="quick-symbol violet"><Icon name="people" size={17}/></span><span><strong>Add a team member</strong><small>Grow your people directory</small></span><Icon name="arrow" size={15}/></button><button className="quick-row" onClick={() => setSection("Leave")}><span className="quick-symbol amber"><Icon name="calendar" size={17}/></span><span><strong>Review time off</strong><small>{pendingCount} requests waiting for you</small></span><Icon name="arrow" size={15}/></button></section></div>

          <div className="lower-grid"><section className="panel requests-panel"><div className="panel-header"><div><div className="title-with-count"><h2>Leave requests</h2><span className="count-badge">{pendingCount}</span></div><p>Requests that need your attention</p></div><button className="text-link" onClick={() => setSection("Leave")}>View all <Icon name="arrow" size={14}/></button></div><div className="request-list">{requests.filter((request) => request.status === "Pending").slice(0, 3).map((request) => <div className="request-row" key={request.id}><Avatar initials={request.initials} color={request.color}/><div className="request-person"><strong>{request.name}</strong><span>{request.department} · {request.type}</span></div><div className="request-dates"><strong>{request.dates}</strong><span>{request.days} {request.days === 1 ? "day" : "days"}</span></div><div className="request-actions"><button className="approve-button" aria-label={`Approve ${request.name}`} onClick={() => updateRequest(request.id, "Approved")}><Icon name="check" size={16}/></button><button className="decline-button" aria-label={`Decline ${request.name}`} onClick={() => updateRequest(request.id, "Declined")}>×</button></div></div>)}{pendingCount === 0 && <div className="empty-state">You’re all caught up. No pending requests.</div>}</div></section>
            <section className="panel activity-panel"><div className="panel-header"><div><h2>Team snapshot</h2><p>A little pulse on your people</p></div><button className="icon-button subdued" aria-label="More snapshot options"><Icon name="more"/></button></div><div className="snapshot-stat"><span className="snapshot-icon">☺</span><span><strong>Team is in good spirits</strong><small>Based on this month’s check-ins</small></span><span className="snapshot-score">8.6<span>/10</span></span></div><div className="snapshot-divider"/><div className="snapshot-footer"><span><b className="status-dot green-dot"/> 38 at work</span><span><b className="status-dot orange-dot"/> 4 away</span><button onClick={() => setSection("People")}>Team details <Icon name="arrow" size={13}/></button></div></section></div>
        </>}

        {section === "People" && <section className="panel full-panel"><div className="panel-header people-toolbar"><div><h2>Team directory</h2><p>{people.length} people · manage employee information in one place</p></div><div className="directory-tools"><label className="table-search"><Icon name="search" size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a person"/></label><button className="button button-primary compact" onClick={() => setModal(true)}><Icon name="plus" size={16}/> Add person</button></div></div><div className="table-scroll"><table className="people-table"><thead><tr><th>NAME</th><th>ROLE</th><th>DEPARTMENT</th><th>STATUS</th><th>EMAIL</th><th/></tr></thead><tbody>{filteredPeople.map((person) => <tr key={person.id}><td><div className="person-cell"><Avatar initials={person.initials} color={person.color}/><strong>{person.name}</strong></div></td><td>{person.role}</td><td><span className="department-tag">{person.department}</span></td><td><span className={`person-status${person.status === "Active" ? "" : " away"}`}><i/> {person.status}</span></td><td className="email-cell">{person.email}</td><td><button className="icon-button subdued" aria-label={`Options for ${person.name}`} onClick={() => setNotice(`${person.name} · ${person.role}`)}><Icon name="more" size={17}/></button></td></tr>)}</tbody></table>{filteredPeople.length === 0 && <div className="empty-state">No people match “{query}”.</div>}</div></section>}

        {section === "Leave" && <section className="panel full-panel"><div className="panel-header"><div><div className="title-with-count"><h2>Time off requests</h2><span className="count-badge">{pendingCount} pending</span></div><p>Review requests and keep the team moving.</p></div><button className="button button-outline" onClick={() => setNotice("Leave policy settings are coming soon.")}>Leave settings</button></div><div className="leave-cards">{requests.map((request) => <article className="leave-card" key={request.id}><div className="leave-card-top"><Avatar initials={request.initials} color={request.color}/><span className={`leave-status ${request.status.toLowerCase()}`}>{request.status}</span></div><h3>{request.name}</h3><p>{request.department} · {request.type}</p><div className="leave-dates"><Icon name="calendar" size={16}/><strong>{request.dates}</strong><span>{request.days} {request.days === 1 ? "day" : "days"}</span></div>{request.status === "Pending" ? <div className="leave-card-actions"><button className="button button-outline" onClick={() => updateRequest(request.id, "Declined")}>Decline</button><button className="button button-primary" onClick={() => updateRequest(request.id, "Approved")}><Icon name="check" size={15}/> Approve</button></div> : <div className="leave-resolved">Request {request.status.toLowerCase()}</div>}</article>)}{requests.length === 0 && <div className="empty-state">No requests yet.</div>}</div></section>}

        {section === "Attendance" && <section className="panel full-panel attendance-view"><div className="panel-header"><div><h2>Attendance today</h2><p>Friday, October 31 · Sample workspace data</p></div><button className="button button-primary" onClick={() => { setCheckedIn(!checkedIn); setNotice(checkedIn ? "You’ve checked out." : "You’re checked in for today."); }}><Icon name={checkedIn ? "check" : "clock"} size={16}/>{checkedIn ? "Checked in" : "Clock in"}</button></div><div className="attendance-summary"><div><span>Present</span><strong>38</strong><small>76% of team</small></div><div><span>Late</span><strong>03</strong><small>Needs a check-in</small></div><div><span>On leave</span><strong>04</strong><small>Approved time off</small></div><div><span>Not checked in</span><strong>05</strong><small>Expected today</small></div></div><h3 className="subsection-title">Recent check-ins</h3><div className="checkin-list">{people.slice(0, 5).map((person, index) => <div className="checkin-row" key={person.id}><Avatar initials={person.initials} color={person.color}/><div><strong>{person.name}</strong><small>{person.department}</small></div><span className={`person-status${person.status === "Active" ? "" : " away"}`}><i/>{person.status === "Active" ? (index === 2 ? "Late" : "Present") : "On leave"}</span><time>{person.status === "On leave" ? "—" : `09:${index === 1 ? "18" : `0${index + 2}`} AM`}</time></div>)}</div></section>}

        {(section === "Hiring" || section === "Reports") && <section className="panel coming-panel"><div className="coming-art"><span><Icon name={section === "Hiring" ? "briefcase" : "chart"} size={29}/></span><i/><i/><i/></div><div className="eyebrow">A BETTER WAY TO WORK</div><h2>{section === "Hiring" ? "Your hiring hub is taking shape." : "People insights, made clear."}</h2><p>{section === "Hiring" ? "Keep roles, candidates, and interview feedback organized as your team grows." : "Bring attendance, retention, and team growth into one thoughtful overview."}</p><button className="button button-primary" onClick={() => setNotice(`${section} workspace is being prepared for your team.`)}>Notify me when it’s ready <Icon name="arrow" size={15}/></button><small>These workspaces will be connected to your team data in a future release.</small></section>}

        <footer className="page-footer"><span>FA HRM <i>·</i> People, thoughtfully managed.</span><span>Demo workspace · Sample data</span></footer></div>
      </section>

      {modal && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><div className="eyebrow">PEOPLE DIRECTORY</div><h2 id="modal-title">Add a team member</h2><p>Give your new teammate a place in the workspace.</p></div><button className="close-button" aria-label="Close dialog" onClick={() => setModal(false)}>×</button></div><form onSubmit={addPerson}><label>Full name<input name="name" placeholder="e.g. Amina Malik" required autoFocus/></label><label>Work email<input name="email" type="email" placeholder="amina@company.com" required/></label><div className="form-row"><label>Job title<input name="role" placeholder="e.g. Software Engineer" required/></label><label>Department<input name="department" placeholder="e.g. Engineering" required/></label></div><div className="modal-actions"><button type="button" className="button button-outline" onClick={() => setModal(false)}>Cancel</button><button type="submit" className="button button-primary"><Icon name="plus" size={16}/> Add to directory</button></div></form><div className="demo-hint">Sample workspace data is saved in this browser only.</div></section></div>}
      {notice && <div className="toast" role="status"><span className="toast-check"><Icon name="check" size={15}/></span>{notice}<button aria-label="Dismiss" onClick={() => setNotice("")}>×</button></div>}
    </main>
  );
}

