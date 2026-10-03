import { FormEvent, ReactNode, CSSProperties, useMemo, useState, useEffect } from 'react'
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, AtSign, BarChart3, Bell, BriefcaseBusiness, CalendarDays, Check, CheckCircle2, ChevronDown, Clock3, Code2, Compass, Copy, FileText, Filter, GraduationCap, Heart, Home, LayoutGrid, LogOut, Mail, Menu, MessageCircle, MoreHorizontal, Pencil, Plus, Search, Send, Settings, ShieldCheck, Sparkles, Star, Target, TrendingUp, UserRound, UsersRound, X, Zap,
} from 'lucide-react'
import { Application, ApplicationStatus, Applicant, Internship, Role, applicants as seedApplicants, applications as seedApplications, interviews as seedInterviews, internships as seedInternships } from './data/mockData'

type Toast = { message: string; tone?: 'success' | 'info' }
type Modal = 'apply' | 'invite' | 'details' | 'resume' | null

type NavItem = { label: string; path: string; icon: typeof Home; badge?: string }

const studentNav: NavItem[] = [
  { label: 'Overview', path: '/student/dashboard', icon: Home },
  { label: 'Find internships', path: '/student/internships', icon: Compass },
  { label: 'Recommended', path: '/student/recommended', icon: Sparkles, badge: '4' },
  { label: 'Applications', path: '/student/applications', icon: FileText },
  { label: 'Interviews', path: '/student/interviews', icon: CalendarDays, badge: '1' },
  { label: 'Saved', path: '/student/saved', icon: Heart },
]
const recruiterNav: NavItem[] = [
  { label: 'Overview', path: '/recruiter/dashboard', icon: Home },
  { label: 'My internships', path: '/recruiter/internships', icon: BriefcaseBusiness },
  { label: 'Create internship', path: '/recruiter/internships/create', icon: Plus },
  { label: 'Applicants', path: '/recruiter/internships/technova-frontend/applicants', icon: UsersRound, badge: '12' },
  { label: 'Interviews', path: '/recruiter/interviews', icon: CalendarDays, badge: '3' },
  { label: 'Company profile', path: '/recruiter/company', icon: BriefcaseBusiness },
]

function Logo({ dark = false, onClick }: { dark?: boolean; onClick?: () => void }) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }
  return <button type="button" className={`logo ${dark ? 'logo-dark' : ''}`} onClick={handleClick} aria-label="Go to InternMatch home"><span className="logo-mark"><span></span><span></span></span><span>intern<span className="logo-coral">match</span></span></button>
}

function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button', icon, disabled = false, className = '', style }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger'; size?: 'sm' | 'md' | 'lg'; onClick?: () => void; type?: 'button' | 'submit'; icon?: ReactNode; disabled?: boolean; className?: string; style?: CSSProperties }) {
  return <button type={type} className={`btn btn-${variant} btn-${size} ${className}`} onClick={onClick} disabled={disabled} style={style}>{icon}{children}</button>
}

function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'coral' | 'mint' | 'indigo' | 'sand' | 'danger' }) { return <span className={`badge badge-${tone}`}>{children}</span> }

function MatchRing({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  return <div className={`match-ring match-${size}`} style={{ '--value': `${value * 3.6}deg` } as CSSProperties}><div className="match-ring-inner"><strong>{value}%</strong><span>match</span></div></div>
}

function Avatar({ initials, tone = 'coral', size = 'md' }: { initials: string; tone?: string; size?: 'sm' | 'md' | 'lg' }) { return <div className={`avatar avatar-${size} avatar-${tone}`}>{initials}</div> }

function ToastView({ toast, dismiss }: { toast: Toast | null; dismiss: () => void }) {
  if (!toast) return null
  return <div className={`toast toast-${toast.tone ?? 'success'}`}><CheckCircle2 size={17} /><span>{toast.message}</span><button onClick={dismiss}><X size={15} /></button></div>
}

function ModalShell({ children, title, eyebrow, close }: { children: ReactNode; title: string; eyebrow?: string; close: () => void }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}><div className="modal"><button className="modal-close" onClick={close}><X size={18} /></button>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{children}</div></div>
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{description && <p className="muted">{description}</p>}</div>{action}</div>
}

function PublicNav({ navigate }: { navigate: (path: string) => void }) {
  return <header className="public-nav">
    <Logo onClick={() => navigate('/')} />
    <nav>
      <button type="button" onClick={() => navigate('/internships')}>Find internships</button>
      <a href="#how-it-works" onClick={(e) => { e.preventDefault(); const el = document.getElementById('how-it-works'); el ? el.scrollIntoView({ behavior: 'smooth' }) : navigate('/') }}>How it works</a>
      <a href="#recruiters" onClick={(e) => { e.preventDefault(); const el = document.getElementById('recruiters'); el ? el.scrollIntoView({ behavior: 'smooth' }) : navigate('/') }}>For recruiters</a>
      <a href="#about" onClick={(e) => { e.preventDefault(); const el = document.getElementById('about'); el ? el.scrollIntoView({ behavior: 'smooth' }) : navigate('/') }}>About</a>
    </nav>
    <div className="nav-actions">
      <button type="button" className="nav-login" onClick={() => navigate('/login')}>Log in</button>
      <Button size="sm" onClick={() => navigate('/register')}>Get started <ArrowRight size={15} /></Button>
    </div>
  </header>
}

function LandingPage({ navigate }: { navigate: (path: string) => void }) {
  return <div className="public-page"><PublicNav navigate={navigate} /><main>
    <section className="hero"><div className="hero-copy"><div className="hero-kicker"><span className="pulse-dot"></span> The fit-first internship platform</div><h1>Find work that fits <em>your trajectory.</em></h1><p className="hero-lede">InternMatch helps you discover opportunities built around your skills, interests and the things you’re curious enough to build next.</p><div className="hero-actions"><Button size="lg" onClick={() => navigate('/internships')}>Explore opportunities <ArrowUpRight size={18} /></Button><Button size="lg" variant="secondary" onClick={() => navigate('/register')}>I’m hiring <ArrowRight size={17} /></Button></div><div className="hero-proof"><div className="avatar-stack"><Avatar initials="AS" size="sm" tone="indigo" /><Avatar initials="RK" size="sm" tone="mint" /><Avatar initials="PM" size="sm" tone="sand" /><span className="avatar-more">+2k</span></div><span>Trusted by ambitious early-career builders</span></div></div><HeroVisual /></section>
    <section className="signal-strip"><div><strong>2,400+</strong><span>active internships</span></div><div><strong>87%</strong><span>average fit signal</span></div><div><strong>160+</strong><span>hiring teams</span></div><div className="signal-note"><span className="signal-dot"></span>New opportunities added every week</div></section>
    <section className="story-section" id="how-it-works"><div className="story-intro"><p className="eyebrow">A better starting point</p><h2>More signal.<br /><span>Less scrolling.</span></h2><p className="muted">The strongest internship is not always the one with the loudest job description. We make the fit easier to see.</p></div><div className="story-cards"><article><span className="story-number">01</span><Compass size={25} /><h3>Build your signal</h3><p>Add the skills, projects and interests that make your path yours.</p></article><article className="story-card-accent"><span className="story-number">02</span><Target size={25} /><h3>See your fit</h3><p>Get a clear, explainable view of what matches — and what to learn next.</p></article><article><span className="story-number">03</span><Send size={25} /><h3>Make your move</h3><p>Apply with context. Track every step. Walk into interviews prepared.</p></article></div></section>
    <section className="featured-section" id="recruiters"><SectionHeading eyebrow="Fresh on the platform" title="Opportunities worth a closer look" description="A few roles with a strong signal for your next chapter." action={<Button variant="ghost" onClick={() => navigate('/internships')}>See all internships <ArrowRight size={16} /></Button>} /><div className="opportunity-grid">{seedInternships.slice(0, 3).map((item) => <OpportunityCard key={item.id} item={item} onOpen={() => navigate(`/internships/${item.id}`)} onSave={() => undefined} saved={false} />)}</div></section>
    <section className="recruiter-cta" id="about"><div><p className="eyebrow">For hiring teams</p><h2>Meet the person behind the application.</h2><p>Less resume roulette. More context, clarity and candidates who are genuinely curious about your work.</p><Button variant="secondary" onClick={() => navigate('/register')}>Build your talent pipeline <ArrowRight size={16} /></Button></div><div className="mini-analytics"><div className="mini-window-top"><span></span><span></span><span></span><small>candidate signal</small></div><div className="candidate-line"><Avatar initials="MS" size="sm" /><div><strong>Maya Singh</strong><span>Frontend Development Intern</span></div><MatchRing value={94} size="sm" /></div><div className="analytics-bars"><span style={{ height: '42%' }}></span><span style={{ height: '66%' }}></span><span style={{ height: '54%' }}></span><span className="bar-active" style={{ height: '88%' }}></span><span style={{ height: '72%' }}></span><span style={{ height: '96%' }}></span><span style={{ height: '64%' }}></span></div><div className="mini-footer"><span>Strong skills alignment</span><Badge tone="mint">Ready to meet</Badge></div></div></section>
    <footer className="public-footer"><Logo onClick={() => navigate('/')} /><span>© 2026 InternMatch. Built for the next chapter.</span><div><a href="#about" onClick={(e) => { e.preventDefault(); navigate('/internships') }}>Privacy</a><a href="#about" onClick={(e) => { e.preventDefault(); navigate('/internships') }}>Contact</a><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></div></footer>
  </main></div>
}

function HeroVisual() {
  return <div className="hero-visual"><div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div><div className="hero-card hero-profile-card"><div className="hero-card-label"><span className="signal-dot"></span> your signal</div><div className="hero-profile"><Avatar initials="MS" size="lg" /><div><strong>Maya Singh</strong><span>Frontend developer</span></div><MoreHorizontal size={18} /></div><div className="hero-skill-row"><span>React</span><span>Figma</span><span>Systems thinking</span></div><div className="hero-progress"><div className="hero-progress-label"><span>Profile strength</span><strong>78%</strong></div><div className="progress"><span style={{ width: '78%' }}></span></div></div></div><div className="hero-card hero-match-card"><div className="match-card-top"><span>Fit signal</span><MatchRing value={92} /></div><strong>Frontend Development<br />Intern</strong><span className="company-line"><span className="company-dot" style={{ background: '#ee6b52' }}></span>TechNova Labs · Remote</span><div className="match-tags"><span>React</span><span>JavaScript</span><span>Git</span></div><div className="match-footer"><span><Check size={13} /> 3 skills matched</span><ArrowUpRight size={17} /></div></div><div className="floating-note"><Sparkles size={14} /><span>New match found</span></div><div className="constellation"><span></span><span></span><span></span><span></span><i></i><i></i></div></div>
}

function OpportunityCard({ item, onOpen, onSave, saved }: { item: Internship; onOpen: () => void; onSave: () => void; saved: boolean }) {
  return <article className="opportunity-card"><div className="card-topline"><div className="company-lockup"><span className="company-logo" style={{ background: item.companyColor }}>{item.companyShort}</span><div><strong>{item.company}</strong><span>{item.posted}</span></div></div><button className={`icon-button ${saved ? 'saved' : ''}`} onClick={(event) => { event.stopPropagation(); onSave() }} aria-label="Save internship"><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button></div><button className="opportunity-body" onClick={onOpen}><h3>{item.title}</h3><div className="opportunity-meta"><span><Compass size={14} />{item.location}</span><span><Zap size={14} />{item.mode}</span><span><Clock3 size={14} />{item.duration}</span></div><div className="skill-list">{item.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></button><div className="opportunity-footer"><div><strong>{item.stipend}</strong><span> · {item.openings} openings</span></div><div className="match-inline"><span>fit</span><strong>{item.match}%</strong></div></div></article>
}

function AuthPage({ initialRole = 'student', mode = 'login', onLogin, navigate }: { initialRole?: Role; mode?: 'login' | 'register' | 'forgot'; onLogin: (role: Role) => void; navigate: (path: string) => void }) {
  const [role, setRole] = useState<Role>(initialRole)
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState(mode === 'login' ? 'student@demo.com' : '')
  const [password, setPassword] = useState('demo1234')
  
  // Student registration fields
  const [department, setDepartment] = useState('Computer Science & Eng.')
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year')
  const [collegeName, setCollegeName] = useState('RV College of Engineering')

  // Recruiter registration fields
  const [businessName, setBusinessName] = useState('TechNova Labs')
  const [designation, setDesignation] = useState('Hiring Manager')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (mode === 'forgot') {
      setError('')
      navigate('/login')
      return
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (mode === 'login') {
        const lowerEmail = email.toLowerCase()
        const detectedRole: Role = (lowerEmail.includes('recruiter') || lowerEmail.includes('technova') || lowerEmail.includes('hr')) ? 'recruiter' : 'student'
        onLogin(detectedRole)
      } else {
        onLogin(role)
      }
    }, 500)
  }

  if (mode === 'forgot') return <div className="auth-page"><div className="auth-side"><Logo dark onClick={() => navigate('/')} /><div className="auth-side-copy"><p className="eyebrow">A calmer way forward</p><h1>Get back to your next chapter.</h1><p>We’ll send a reset link to your inbox. Demo mode keeps this flow frontend-only.</p></div></div><div className="auth-main"><button className="back-link" onClick={() => navigate('/login')}><ArrowLeft size={16} /> Back to login</button><div className="auth-form-wrap"><div className="auth-heading"><p className="eyebrow">Reset access</p><h2>Forgot your password?</h2><p className="muted">Enter your email and we’ll show the next step.</p></div><form onSubmit={submit}><label>Email address<input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>{error && <p className="form-error">{error}</p>}<Button type="submit" size="lg" className="full-width">Send reset link <ArrowRight size={16} /></Button></form><p className="auth-switch">Remembered it? <button onClick={() => navigate('/login')}>Log in</button></p></div></div></div>

  return <div className="auth-page">
    <div className="auth-side">
      <Logo dark onClick={() => navigate('/')} />
      <div className="auth-side-copy">
        <p className="eyebrow">{mode === 'register' ? 'Start with your signal' : 'Welcome back'}</p>
        <h1>{mode === 'register' ? 'Your next opportunity starts here.' : 'Make your next move count.'}</h1>
        <p>{mode === 'register' ? 'Create a profile that shows more than a title. Tell us about your background.' : 'Log in using your registered email to enter your workspace directly.'}</p>
      </div>
      <div className="auth-side-quote">
        <span>“</span>
        <p>The best opportunity is the one that feels like a stretch — not a mismatch.</p>
        <small>— InternMatch principle no. 02</small>
      </div>
    </div>
    <div className="auth-main">
      <button type="button" className="back-link" onClick={() => navigate('/')}><ArrowLeft size={16} /> Back to home</button>
      <div className="auth-form-wrap">
        <div className="auth-heading">
          <p className="eyebrow">{mode === 'register' ? 'Create account' : 'Direct Sign-in'}</p>
          <h2>{mode === 'register' ? 'Tell us where you’re headed.' : 'Log in to InternMatch'}</h2>
          <p className="muted">{mode === 'register' ? 'Select your role and fill in your details below.' : 'Enter your email address to automatically open your workspace.'}</p>
        </div>

        {mode === 'register' && (
          <div className="role-toggle">
            <button type="button" className={role === 'student' ? 'active' : ''} onClick={() => setRole('student')}>
              <GraduationCap size={17} />
              <span>Student</span>
              <small>Find your fit</small>
            </button>
            <button type="button" className={role === 'recruiter' ? 'active' : ''} onClick={() => setRole('recruiter')}>
              <BriefcaseBusiness size={17} />
              <span>Recruiter</span>
              <small>Meet your next hire</small>
            </button>
          </div>
        )}

        <form onSubmit={submit}>
          {mode === 'register' && (
            <label>Full name
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="e.g. Maya Singh" required />
            </label>
          )}

          <label>Email address
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder={mode === 'login' ? "e.g. student@demo.com or recruiter@demo.com" : "you@example.com"} required />
          </label>

          <label>Password
            <div className="password-input">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
          </label>

          {mode === 'register' && role === 'student' && (
            <>
              <div className="form-field-grid" style={{ marginTop: 10 }}>
                <label>Department / Stream
                  <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option>Computer Science & Eng.</option>
                    <option>Information Technology</option>
                    <option>Electronics & Comm.</option>
                    <option>Mechanical Eng.</option>
                    <option>Data Science & AI</option>
                    <option>Design & Architecture</option>
                  </select>
                </label>
                <label>Academic Year
                  <select value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)}>
                    <option>1st Year (Freshman)</option>
                    <option>2nd Year (Sophomore)</option>
                    <option>3rd Year (Junior)</option>
                    <option>Final Year (Senior)</option>
                    <option>Postgraduate</option>
                  </select>
                </label>
              </div>
              <label style={{ marginTop: 10 }}>College / University
                <input value={collegeName} onChange={(e) => setCollegeName(e.target.value)} placeholder="e.g. RV College of Engineering" />
              </label>
            </>
          )}

          {mode === 'register' && role === 'recruiter' && (
            <>
              <div className="form-field-grid" style={{ marginTop: 10 }}>
                <label>Company / Business Name
                  <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. TechNova Labs" required />
                </label>
                <label>Your Role / Designation
                  <input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Talent Acquisition Lead" />
                </label>
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="form-row">
              <label className="checkbox-label"><input type="checkbox" defaultChecked /> <span>Remember me</span></label>
              <button className="text-button" type="button" onClick={() => navigate('/forgot-password')}>Forgot password?</button>
            </div>
          )}

          {error && <p className="form-error">{error}</p>}

          <Button type="submit" size="lg" className="full-width" disabled={loading} style={{ marginTop: 15 }}>
            {loading ? 'Opening workspace…' : mode === 'register' ? `Create ${role === 'student' ? 'Student' : 'Recruiter'} Account` : 'Log In to Workspace'} <ArrowRight size={16} />
          </Button>
        </form>

        <p className="auth-switch">
          {mode === 'register' ? 'Already have an account?' : 'New to InternMatch?'} <button type="button" onClick={() => navigate(mode === 'register' ? '/login' : '/register')}>{mode === 'register' ? 'Log in' : 'Create account'}</button>
        </p>
      </div>
    </div>
  </div>
}

function AppShell({ role, path, navigate, onLogout, children }: { role: Role; path: string; navigate: (path: string) => void; onLogout: () => void; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const items = role === 'student' ? studentNav : recruiterNav
  const isActive = (item: NavItem) => path === item.path || (item.path.includes('/internships/technova') && path.includes('/applicants'))
  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'mobile-show' : ''}`}>
      <Logo onClick={() => navigate('/')} />
      <div className="workspace-label">{role === 'student' ? 'STUDENT WORKSPACE' : 'RECRUITER WORKSPACE'}</div>
      <nav className="side-nav">{items.map((item) => { const Icon = item.icon; return <button key={item.path} className={isActive(item) ? 'active' : ''} onClick={() => { setMobileOpen(false); navigate(item.path) }}><Icon size={18} strokeWidth={isActive(item) ? 2.4 : 1.8} /><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</button> })}</nav>
      <div className="sidebar-bottom">
        <button onClick={() => { setMobileOpen(false); navigate(role === 'student' ? '/student/profile' : '/recruiter/company') }}><Settings size={17} /> Settings</button>
        <button onClick={() => { setMobileOpen(false); onLogout() }}><LogOut size={17} /> Sign out</button>
      </div>
    </aside>
    <div className="mobile-topbar">
      <button className="icon-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation menu"><Menu size={20} /></button>
      <Logo onClick={() => navigate('/')} />
      <button className="icon-button" onClick={() => navigate(role === 'student' ? '/student/interviews' : '/recruiter/interviews')} aria-label="View notifications"><Bell size={19} /></button>
    </div>
    <main className="app-main">
      <div className="app-topbar">
        <div className="breadcrumb" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} title="Go to home landing page">
          <span>Workspace</span>
          <ChevronDown size={14} />
          <strong>{role === 'student' ? 'Student view' : 'Recruiter view'}</strong>
        </div>
        <div className="topbar-actions">
          <button className="notification-button" onClick={() => navigate(role === 'student' ? '/student/interviews' : '/recruiter/interviews')}>
            <Bell size={18} /><i></i>
          </button>
          <button type="button" className="topbar-user" onClick={() => navigate(role === 'student' ? '/student/profile' : '/recruiter/company')} style={{ border: 0, background: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <Avatar initials={role === 'student' ? 'MS' : 'TN'} size="sm" tone={role === 'student' ? 'coral' : 'indigo'} />
            <div>
              <strong>{role === 'student' ? 'Maya Singh' : 'TechNova Labs'}</strong>
              <span>{role === 'student' ? 'Student account' : 'Hiring team'}</span>
            </div>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
      {children}
    </main>
  </div>
}

function DashboardPage({ navigate, applications, interviews }: { navigate: (path: string) => void; applications: Application[]; interviews: typeof seedInterviews }) {
  const appStatus = applications[0]?.status ?? 'Applied'
  return <div className="page-wrap"><div className="page-header welcome-header"><div><p className="eyebrow">Monday, September 29, 2026</p><h1>Good morning, Maya <span>✦</span></h1><p className="muted">A little progress today goes a long way.</p></div><Button onClick={() => navigate('/student/internships')} icon={<Search size={17} />}>Find opportunities</Button></div><div className="dashboard-grid"><section className="main-column"><div className="profile-strength card"><div className="profile-strength-copy"><div className="section-title-row"><div><p className="eyebrow">Your profile strength</p><h2>Looking good, Maya.</h2></div><span className="profile-percent">78%</span></div><p className="muted">You’re close to having a profile that tells the full story.</p><div className="progress"><span style={{ width: '78%' }}></span></div><div className="strength-items"><button type="button" className="inline-link" style={{ fontSize: 10, textDecoration: 'none', color: 'inherit' }} onClick={() => navigate('/student/profile')}><Check size={14} style={{ color: '#5c9a76' }} /> Add one more project</button><button type="button" className="inline-link" style={{ fontSize: 10, textDecoration: 'none', color: 'inherit' }} onClick={() => navigate('/student/profile')}><X size={14} style={{ color: '#bd746a' }} /> Upload your resume</button></div></div><div className="strength-ring"><MatchRing value={78} size="lg" /><span>profile<br />complete</span></div></div><div className="section-heading compact"><div><p className="eyebrow">Curated for your signal</p><h2>Recommended for you</h2></div><button className="inline-link" onClick={() => navigate('/student/recommended')}>View all <ArrowRight size={15} /></button></div><div className="opportunity-grid dashboard-opportunities">{seedInternships.slice(0, 2).map((item) => <OpportunityCard key={item.id} item={item} onOpen={() => navigate(`/internships/${item.id}`)} onSave={() => undefined} saved={false} />)}</div><div className="section-heading compact"><div><p className="eyebrow">Keep the momentum</p><h2>Recent applications</h2></div><button className="inline-link" onClick={() => navigate('/student/applications')}>See activity <ArrowRight size={15} /></button></div><div className="activity-list card">{applications.slice(0, 3).map((application) => { const item = seedInternships.find((internship) => internship.id === application.internshipId)!; return <ApplicationRow key={application.id} application={application} item={item} onClick={() => navigate('/student/applications')} /> })}</div></section><aside className="side-column"><div className="next-up card"><div className="card-heading"><div><p className="eyebrow">Next up</p><h3>Keep an eye on this</h3></div><Badge tone="coral">{appStatus}</Badge></div><div className="next-up-date"><span className="date-block"><strong>06</strong><small>OCT</small></span><div><strong>Interview with Brightside</strong><span>Product Design Intern · 4:00 PM</span></div></div><div className="next-up-line"><CalendarDays size={16} /><span>Video call · 35 minutes</span><button className="text-button" onClick={() => navigate('/student/interviews')}>View details</button></div></div><div className="learning-card card"><div className="learning-icon"><Sparkles size={19} /></div><p className="eyebrow">Tiny unlock</p><h3>TypeScript could lift your fit score.</h3><p className="muted">It’s the only missing skill for 3 of your strongest matches.</p><button className="inline-link" onClick={() => navigate('/student/internships')}>Explore learning paths <ArrowRight size={15} /></button></div><div className="saved-peek card"><div className="card-heading"><div><p className="eyebrow">Saved for later</p><h3>3 opportunities</h3></div><Heart size={19} /></div>{seedInternships.slice(1, 3).map((item) => <button className="saved-row" key={item.id} onClick={() => navigate(`/internships/${item.id}`)}><span className="company-logo small" style={{ background: item.companyColor }}>{item.companyShort}</span><span><strong>{item.title}</strong><small>{item.company}</small></span><ArrowUpRight size={15} /></button>)}<button className="inline-link" onClick={() => navigate('/student/saved')}>Go to saved <ArrowRight size={15} /></button></div></aside></div></div>
}

function ApplicationRow({ application, item, onClick }: { application: Application; item: Internship; onClick: () => void }) { return <button className="application-row" onClick={onClick}><span className="company-logo small" style={{ background: item.companyColor }}>{item.companyShort}</span><span className="application-info"><strong>{item.title}</strong><small>{item.company} · Applied {application.applied}</small></span><Badge tone={application.status === 'Shortlisted' ? 'mint' : 'sand'}>{application.status}</Badge><ArrowRight size={16} /></button> }

function DiscoverPage({ navigate, savedIds, toggleSave, publicMode = false }: { navigate: (path: string) => void; savedIds: string[]; toggleSave: (id: string) => void; publicMode?: boolean }) {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('All work modes')
  const [sort, setSort] = useState('Best fit')
  const filtered = useMemo(() => seedInternships.filter((item) => `${item.title} ${item.company} ${item.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())).filter((item) => mode === 'All work modes' || item.mode === mode).sort((a, b) => sort === 'Newest' ? a.posted.localeCompare(b.posted) : b.match - a.match), [query, mode, sort])
  return <div className={`page-wrap discover-page ${publicMode ? 'public-discover' : ''}`}>{publicMode && <div className="public-discover-head"><PublicNav navigate={navigate} /></div>}<div className="page-header discover-header"><div><p className="eyebrow">The opportunity board</p><h1>Find your next<br /><em>good stretch.</em></h1><p className="muted">Explore internships where your current signal meets something worth learning.</p></div><div className="discover-count"><strong>{filtered.length}</strong><span>opportunities<br />in your orbit</span></div></div><div className="discover-toolbar"><div className="search-field"><Search size={18} /><input placeholder="Search roles, skills or companies..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></div><div className="filter-actions"><div className="select-wrap"><Filter size={15} /><select value={mode} onChange={(event) => setMode(event.target.value)}><option>All work modes</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select><ChevronDown size={14} /></div><div className="select-wrap"><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Best fit</option><option>Newest</option></select><ChevronDown size={14} /></div></div></div><div className="discover-content"><aside className="discover-filters card"><div className="filter-header"><strong>Refine your search</strong><button className="text-button" onClick={() => { setQuery(''); setMode('All work modes') }}>Reset</button></div><label>Work mode</label>{['All work modes', 'Remote', 'Hybrid', 'On-site'].map((filter) => <button key={filter} className={`filter-option ${mode === filter ? 'active' : ''}`} onClick={() => setMode(filter)}><span className="radio-dot"></span>{filter}<small>{filter === 'All work modes' ? 24 : filter === 'Remote' ? 12 : filter === 'Hybrid' ? 7 : 5}</small></button>)}<label>Focus areas</label>{['Frontend', 'Product design', 'Data & analytics', 'Growth'].map((filter, index) => <button key={filter} className={`filter-option ${query === filter ? 'active' : ''}`} onClick={() => setQuery(query === filter ? '' : filter)}><span className="checkbox-fake"></span>{filter}<small>{[9, 6, 5, 4][index]}</small></button>)}<div className="filter-tip"><Sparkles size={16} /><p><strong>Pro tip</strong><br />Complete your profile to unlock more precise match signals.</p></div></aside><div className="discover-results"><div className="results-header"><span>Showing <strong>{filtered.length}</strong> roles</span><span className="result-meta"><span className="signal-dot"></span> Updated today</span></div>{filtered.length > 0 ? filtered.map((item) => <OpportunityCard key={item.id} item={item} saved={savedIds.includes(item.id)} onSave={() => toggleSave(item.id)} onOpen={() => navigate(`/internships/${item.id}`)} />) : <EmptyState title="No roles in this orbit yet" description="Try broadening your search or resetting your filters." action={<Button onClick={() => { setQuery(''); setMode('All work modes') }}>Reset filters</Button>} />}</div></div></div>
}

function DetailPage({ item, navigate, saved, toggleSave, openModal }: { item: Internship; navigate: (path: string) => void; saved: boolean; toggleSave: () => void; openModal: (modal: Modal) => void }) {
  return <div className="page-wrap detail-page"><button className="back-link" onClick={() => navigate('/student/internships')}><ArrowLeft size={16} /> Back to opportunities</button><div className="detail-hero"><div><div className="detail-company"><span className="company-logo large" style={{ background: item.companyColor }}>{item.companyShort}</span><div><strong>{item.company}</strong><span>Hiring on InternMatch · {item.posted}</span></div></div><h1>{item.title}</h1><div className="detail-meta"><span><Compass size={16} />{item.location}</span><span><Zap size={16} />{item.mode}</span><span><Clock3 size={16} />{item.duration}</span><span><BriefcaseBusiness size={16} />{item.type}</span></div></div><MatchRing value={item.match} size="lg" /></div><div className="detail-layout"><div className="detail-content"><DetailSection title="About the internship"><p>{item.description}</p></DetailSection><DetailSection title="What you’ll do"><ul className="check-list">{item.responsibilities.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></DetailSection><DetailSection title="The signal we’re looking for"><div className="tag-cluster">{item.skills.map((skill) => <Badge key={skill} tone="coral">{skill} <Check size={12} /></Badge>)}</div><p className="small-note">These are the core skills for this role. Your profile matches {item.match}% of the current signal.</p></DetailSection><DetailSection title="What you’ll learn"><div className="learn-grid">{item.learn.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div></DetailSection><DetailSection title="About the company"><p>{item.company} is building practical tools for people at the beginning of their careers. Their teams are small, thoughtful and allergic to unnecessary process.</p><button className="inline-link" onClick={() => navigate('/recruiter/company')}>Visit company <ArrowUpRight size={15} /></button></DetailSection></div><aside className="detail-aside"><div className="apply-card card"><div className="apply-card-top"><p className="eyebrow">Ready when you are</p><span className="deadline-dot"><span></span> Deadline {item.deadline}</span></div><h3>Make this one count.</h3><p className="muted">Your profile is a {item.match}% match for this role. You’re bringing a strong starting point.</p><Button size="lg" className="full-width" onClick={() => openModal('apply')}>Apply now <ArrowRight size={17} /></Button><Button variant="secondary" className="full-width" onClick={toggleSave} icon={<Heart size={16} fill={saved ? 'currentColor' : 'none'} />}>{saved ? 'Saved to your list' : 'Save internship'}</Button><div className="apply-facts"><div><strong>{item.stipend}</strong><span>Compensation</span></div><div><strong>{item.openings}</strong><span>Openings</span></div><div><strong>{item.education.split(' ').slice(0, 4).join(' ')}…</strong><span>Eligibility</span></div></div></div><div className="match-explainer card"><div className="card-heading"><div><p className="eyebrow">Frontend representation</p><h3>Why this matches you</h3></div><Sparkles size={18} /></div><div className="explainer-score"><MatchRing value={item.match} size="sm" /><div><strong>Strong alignment</strong><span>Your signal is clear here.</span></div></div><div className="explainer-list"><span><Check size={14} /> React</span><span><Check size={14} /> JavaScript</span><span><Check size={14} /> Web development interest</span><span className="missing"><span>○</span> TypeScript is a growth edge</span></div><small>Not real AI yet — this preview shows how the future recommendation engine will explain its reasoning.</small></div></aside></div></div>
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) { return <section className="detail-section"><h2>{title}</h2>{children}</section> }

function ApplicationsPage({ applications, navigate }: { applications: Application[]; navigate: (path: string) => void }) {
  const [tab, setTab] = useState<'All' | 'In progress' | 'Closed'>('All')
  const filtered = applications.filter((app) => {
    if (tab === 'In progress') return app.status !== 'Rejected'
    if (tab === 'Closed') return app.status === 'Rejected'
    return true
  })
  return <div className="page-wrap"><div className="page-header"><div><p className="eyebrow">Your momentum</p><h1>Applications</h1><p className="muted">A clear view of every door you’ve knocked on.</p></div><Button variant="secondary" onClick={() => navigate('/student/internships')} icon={<Plus size={16} />}>New application</Button></div><div className="pipeline card"><div className="pipeline-heading"><div><p className="eyebrow">Application pipeline</p><h3>Keep moving forward</h3></div><span><span className="signal-dot"></span> {applications.length} active applications</span></div><div className="pipeline-steps">{['Applied', 'Under review', 'Shortlisted', 'Interview', 'Decision'].map((step, index) => <div className={`pipeline-step ${index < 3 ? 'complete' : ''}`} key={step}><span>{index < 3 ? <Check size={14} /> : index + 1}</span><strong>{step}</strong>{index < 4 && <i></i>}</div>)}</div></div><div className="table-card card"><div className="table-header"><strong>All applications</strong><div><button className={`tab-button ${tab === 'All' ? 'active' : ''}`} onClick={() => setTab('All')}>All <span>{applications.length}</span></button><button className={`tab-button ${tab === 'In progress' ? 'active' : ''}`} onClick={() => setTab('In progress')}>In progress <span>{applications.filter((a) => a.status !== 'Rejected').length}</span></button><button className={`tab-button ${tab === 'Closed' ? 'active' : ''}`} onClick={() => setTab('Closed')}>Closed <span>{applications.filter((a) => a.status === 'Rejected').length}</span></button></div></div><div className="application-table"><div className="table-row table-labels"><span>Opportunity</span><span>Applied</span><span>Last update</span><span>Status</span><span></span></div>{filtered.map((application) => { const item = seedInternships.find((internship) => internship.id === application.internshipId) ?? seedInternships[0]; return <div className="table-row" key={application.id}><span className="table-company"><span className="company-logo small" style={{ background: item.companyColor }}>{item.companyShort}</span><span><strong>{item.title}</strong><small>{item.company}</small></span></span><span>{application.applied}</span><span>{application.updated}</span><span><Badge tone={application.status === 'Shortlisted' ? 'mint' : 'sand'}>{application.status}</Badge></span><button className="icon-button" onClick={() => navigate(`/internships/${item.id}`)} title="View internship details"><ArrowUpRight size={16} /></button></div> })}</div></div></div>
}

function InterviewsPage({ interviews, navigate, notify }: { interviews: typeof seedInterviews; navigate: (path: string) => void; notify?: (msg: string) => void }) {
  const upcoming = interviews.filter((item) => item.status === 'Upcoming')
  return <div className="page-wrap"><div className="page-header"><div><p className="eyebrow">Your calendar</p><h1>Interviews</h1><p className="muted">Go in with context. Leave with clarity.</p></div><Button variant="secondary" onClick={() => notify?.('Calendar synced with your upcoming interviews.')} icon={<CalendarDays size={16} />}>Open calendar</Button></div>{upcoming.length ? <div className="interview-feature card"><div className="interview-date"><span>OCT</span><strong>06</strong><small>TUE</small></div><div className="interview-info"><Badge tone="coral">Upcoming</Badge><h2>{upcoming[0].role}</h2><p>{upcoming[0].company} · Hiring team conversation</p><div className="interview-meta"><span><Clock3 size={15} />{upcoming[0].time}</span><span><MessageCircle size={15} />{upcoming[0].mode}</span></div></div><div className="interview-actions"><Button onClick={() => navigate(`/internships/${upcoming[0].internshipId}`)} icon={<ArrowRight size={15} />}>View details</Button><Button variant="secondary" onClick={() => window.open('https://meet.google.com', '_blank')}>Join interview</Button></div></div> : <EmptyState title="No upcoming interviews" description="When a recruiter invites you, the details will land here." />}{interviews.length > 0 && <div className="section-heading compact"><div><p className="eyebrow">Your history</p><h2>Previous interviews</h2></div></div>}{interviews.filter((item) => item.status === 'Completed').map((item) => <div className="history-row card" key={item.id}><CheckCircle2 size={18} /><div><strong>{item.role}</strong><span>{item.company} · {item.date}</span></div><Badge tone="neutral">Completed</Badge><ArrowUpRight size={16} /></div>)}</div>
}

function ProfilePage({ openModal }: { openModal?: (modal: Modal) => void }) {
  const [skills, setSkills] = useState(['React', 'JavaScript', 'Git', 'Figma'])
  const [editing, setEditing] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [addingSkill, setAddingSkill] = useState(false)
  const [resumeName, setResumeName] = useState('maya-singh-resume.pdf')

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills((current) => [...current, newSkill.trim()])
      setNewSkill('')
      setAddingSkill(false)
    }
  }

  return <div className="page-wrap profile-page"><div className="page-header"><div><p className="eyebrow">Your signal, in full</p><h1>My profile</h1><p className="muted">The strongest application starts before you press apply.</p></div><Button variant={editing ? 'primary' : 'secondary'} onClick={() => setEditing(!editing)} icon={editing ? <Check size={16} /> : <Pencil size={16} />}>{editing ? 'Save changes' : 'Edit profile'}</Button></div><div className="profile-layout"><aside className="profile-summary card"><Avatar initials="MS" size="lg" /><h2>Maya Singh</h2><p>Frontend developer in the making</p><span className="profile-location"><Compass size={14} /> Bengaluru, India</span><div className="profile-summary-score"><MatchRing value={78} size="md" /><div><strong>78%</strong><span>profile strength</span></div></div><div className="profile-summary-links"><a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><AtSign size={15} /> linkedin.com/in/mayasingh</a><a href="https://github.com" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Code2 size={15} /> github.com/mayacodes</a></div></aside><div className="profile-sections"><ProfileSection title="Personal information" icon={<UserRound size={17} />} action={editing ? 'Editing' : 'Visible to recruiters'}><div className="field-grid"><Field label="Full name" value="Maya Singh" editing={editing} /><Field label="Email" value="maya@demo.com" editing={editing} /><Field label="Location" value="Bengaluru, India" editing={editing} /><Field label="Portfolio" value="mayasingh.dev" editing={editing} /></div></ProfileSection><ProfileSection title="Skills & interests" icon={<Zap size={17} />} action={`${skills.length} skills`}><div className="tag-cluster editable-tags">{skills.map((skill) => <button key={skill} onClick={() => editing && setSkills(skills.filter((item) => item !== skill))}>{skill}{editing && <X size={12} strokeWidth={2.5} />}</button>)}{addingSkill ? <div style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}><input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Enter skill..." style={{ padding: '4px 8px', fontSize: 11, borderRadius: 6, border: '1px solid #ccc' }} onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()} /><Button size="sm" onClick={handleAddSkill}>Add</Button></div> : <button type="button" className="add-tag" onClick={() => setAddingSkill(true)}><Plus size={13} /> Add skill</button>}</div><div className="interest-row"><span>Product building</span><span>Design systems</span><span>Learning in public</span></div></ProfileSection><ProfileSection title="Education" icon={<GraduationCap size={17} />} action="Current"><div className="education-row"><div className="education-icon"><GraduationCap size={18} /></div><div><strong>B.Tech in Computer Science</strong><span>RV College of Engineering · 2024 — 2028</span></div><Badge tone="mint">Current</Badge></div></ProfileSection><ProfileSection title="Projects" icon={<Code2 size={17} />} action="2 projects"><div className="project-grid"><div className="project-item"><div className="project-item-top"><strong>StudyCircle</strong><ArrowUpRight size={15} /></div><p>Collaborative study planning for student communities.</p><div className="skill-list"><span>React</span><span>Firebase</span></div></div><div className="project-item"><div className="project-item-top"><strong>Campus Cart</strong><ArrowUpRight size={15} /></div><p>A marketplace prototype for student-to-student selling.</p><div className="skill-list"><span>Next.js</span><span>Stripe</span></div></div></div></ProfileSection><ProfileSection title="Resume" icon={<FileText size={17} />} action="Uploaded"><div className="resume-row"><div className="resume-icon"><FileText size={21} /></div><div><strong>{resumeName}</strong><span>Uploaded Sep 21, 2026 · 1.2 MB</span></div><Button size="sm" variant="secondary" onClick={() => openModal?.('resume')}>Preview</Button><label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer', margin: 0 }}>Replace<input type="file" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) setResumeName(e.target.files[0].name) }} /></label></div></ProfileSection></div></div></div>
}

function ProfileSection({ title, icon, action, children }: { title: string; icon: ReactNode; action: string; children: ReactNode }) { return <section className="profile-section card"><div className="profile-section-header"><div><span className="profile-section-icon">{icon}</span><h3>{title}</h3></div><span>{action}</span></div>{children}</section> }
function Field({ label, value, editing }: { label: string; value: string; editing: boolean }) { return <label className="profile-field"><span>{label}</span>{editing ? <input defaultValue={value} /> : <strong>{value}</strong>}</label> }

function RecruiterDashboard({ navigate, applicants }: { navigate: (path: string) => void; applicants: Applicant[] }) {
  const shortlisted = applicants.filter((item) => item.status === 'Shortlisted').length
  return <div className="page-wrap"><div className="page-header welcome-header"><div><p className="eyebrow">Monday, September 29, 2026</p><h1>Good morning, TechNova <span>✦</span></h1><p className="muted">Here’s where your talent pipeline stands.</p></div><Button onClick={() => navigate('/recruiter/internships/create')} icon={<Plus size={17} />}>Create internship</Button></div><div className="stat-grid"><StatCard label="Active internships" value="04" delta="+1 this month" icon={<BriefcaseBusiness size={18} />} tone="coral" onClick={() => navigate('/recruiter/internships')} /><StatCard label="Total applicants" value="148" delta="+24% vs last month" icon={<UsersRound size={18} />} tone="indigo" onClick={() => navigate('/recruiter/internships/technova-frontend/applicants')} /><StatCard label="Shortlisted" value={`${12 + shortlisted}`} delta="8 need review" icon={<Star size={18} />} tone="mint" onClick={() => navigate('/recruiter/internships/technova-frontend/applicants')} /><StatCard label="Upcoming interviews" value="03" delta="Next one in 2 days" icon={<CalendarDays size={18} />} tone="sand" onClick={() => navigate('/recruiter/interviews')} /></div><div className="recruiter-grid"><section className="analytics-card card"><div className="card-heading"><div><p className="eyebrow">Pipeline health</p><h3>Applications over time</h3></div><div className="date-select">Last 30 days <ChevronDown size={14} /></div></div><div className="chart-area"><div className="chart-y"><span>50</span><span>25</span><span>0</span></div><div className="chart-bars">{[38, 52, 32, 58, 42, 68, 55, 82, 66, 92, 72, 88].map((height, index) => <div className={`chart-column ${index === 9 ? 'active' : ''}`} key={index}><span style={{ height: `${height}%` }}></span><small>{['1 Sep', '', '5 Sep', '', '10 Sep', '', '15 Sep', '', '20 Sep', '', '25 Sep', ''][index]}</small></div>)}</div></div><div className="chart-footer"><span><i className="legend-dot coral"></i>Applications <strong>148</strong></span><span><i className="legend-dot indigo"></i>Shortlisted <strong>32</strong></span><span className="chart-growth"><TrendingUp size={14} /> 18.4% from last period</span></div></section><section className="applicant-peek card"><div className="card-heading"><div><p className="eyebrow">Needs your eye</p><h3>Recent applicants</h3></div><button className="inline-link" onClick={() => navigate('/recruiter/internships/technova-frontend/applicants')}>View all <ArrowRight size={15} /></button></div>{applicants.map((applicant) => <button className="applicant-peek-row" key={applicant.id} onClick={() => navigate(`/recruiter/applicants/${applicant.id}`)}><Avatar initials={applicant.initials} size="sm" tone={applicant.id === 'maya-singh' ? 'coral' : applicant.id === 'arjun-mehta' ? 'indigo' : 'mint'} /><span><strong>{applicant.name}</strong><small>{applicant.skills.slice(0, 3).join(' · ')}</small></span><MatchRing value={applicant.match} size="sm" /></button>)}</section></div><div className="recruiter-bottom-grid"><section className="performance-card card"><div className="card-heading"><div><p className="eyebrow">Internship performance</p><h3>Roles with momentum</h3></div><button className="inline-link" onClick={() => navigate('/recruiter/internships')}>Manage roles <ArrowRight size={15} /></button></div>{seedInternships.slice(0, 3).map((item, index) => <div className="performance-row" key={item.id} onClick={() => navigate(`/recruiter/internships/${item.id}/applicants`)} style={{ cursor: 'pointer' }}><span className="performance-rank">0{index + 1}</span><span className="company-logo small" style={{ background: item.companyColor }}>{item.companyShort}</span><span><strong>{item.title}</strong><small>{item.company}</small></span><div className="performance-bar"><span style={{ width: `${[82, 66, 48][index]}%` }}></span></div><strong>{[42, 29, 18][index]} applicants</strong></div>)}</section><section className="recruiter-callout"><div className="callout-icon"><Sparkles size={20} /></div><p className="eyebrow">A better shortlist</p><h3>Make the signal visible.</h3><p>Applicants with richer project context are 2.4× more likely to move forward.</p><button className="inline-link" onClick={() => navigate('/recruiter/internships/technova-frontend/applicants')}>Explore best practices <ArrowRight size={15} /></button></section></div></div>
}

function StatCard({ label, value, delta, icon, tone, onClick }: { label: string; value: string; delta: string; icon: ReactNode; tone: string; onClick?: () => void }) {
  return <div className={`stat-card card stat-${tone}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{delta}</small></div>
}

function RecruiterInternships({ navigate, internships }: { navigate: (path: string) => void; internships: Internship[] }) {
  const [tab, setTab] = useState<'Published' | 'Drafts' | 'Closed'>('Published')
  return <div className="page-wrap"><div className="page-header"><div><p className="eyebrow">Your opportunities</p><h1>My internships</h1><p className="muted">A living view of the roles you’re building teams around.</p></div><Button onClick={() => navigate('/recruiter/internships/create')} icon={<Plus size={17} />}>Create internship</Button></div><div className="role-tabs"><button className={tab === 'Published' ? 'active' : ''} onClick={() => setTab('Published')}>Published <span>4</span></button><button className={tab === 'Drafts' ? 'active' : ''} onClick={() => setTab('Drafts')}>Drafts <span>1</span></button><button className={tab === 'Closed' ? 'active' : ''} onClick={() => setTab('Closed')}>Closed <span>2</span></button></div><div className="recruiter-role-list">{internships.map((item) => <div className="recruiter-role card" key={item.id}><span className="company-logo" style={{ background: item.companyColor }}>{item.companyShort}</span><div className="recruiter-role-main"><div><h3>{item.title}</h3><span>{item.mode} · {item.duration} · Created Sep {item.id === 'technova-frontend' ? '18' : '12'}, 2026</span></div><Badge tone="mint">Published</Badge></div><div className="role-metrics"><div><strong>{item.id === 'technova-frontend' ? '42' : item.id === 'brightside-product' ? '29' : '18'}</strong><span>Applicants</span></div><div><strong>{item.deadline}</strong><span>Application deadline</span></div><div className="role-progress"><div className="progress"><span style={{ width: `${Math.min(item.match + 2, 95)}%` }}></span></div><span>Role momentum</span></div></div><div className="role-actions"><Button size="sm" variant="secondary" onClick={() => navigate(`/recruiter/internships/${item.id}/applicants`)}>View applicants</Button><Button size="sm" variant="ghost" onClick={() => navigate('/recruiter/internships/create')}>Edit</Button><button className="icon-button" onClick={() => navigate(`/recruiter/internships/${item.id}/applicants`)}><MoreHorizontal size={18} /></button></div></div>)}</div></div>
}

function CreateInternship({ navigate, addInternship, notify }: { navigate: (path: string) => void; addInternship: (item: Internship) => void; notify: (message: string, tone?: Toast['tone']) => void }) {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('Bengaluru, India')
  const [mode, setMode] = useState<Internship['mode']>('Remote')
  const [stipend, setStipend] = useState('₹10,000 / month')
  const [error, setError] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim()) { setError('Give this opportunity a clear title before publishing.'); return }
    const item: Internship = { ...seedInternships[0], id: `new-${Date.now()}`, title, location, mode, stipend, company: 'TechNova Labs', companyShort: 'TN', companyColor: '#ee6b52', posted: 'just now', deadline: 'Nov 15, 2026', match: 88 }
    addInternship(item)
    notify('Internship published — it’s now live in My internships.')
    navigate('/recruiter/internships')
  }
  const saveDraft = () => {
    notify('Draft saved successfully.', 'info')
    navigate('/recruiter/internships')
  }
  return <div className="page-wrap form-page"><button className="back-link" onClick={() => navigate('/recruiter/internships')}><ArrowLeft size={16} /> Back to internships</button><div className="page-header"><div><p className="eyebrow">Build the next role</p><h1>Create internship</h1><p className="muted">Give the right candidate enough context to see themselves here.</p></div><Badge tone="sand">Frontend preview</Badge></div><form className="create-layout" onSubmit={submit}><div className="form-sections"><section className="form-card card"><div className="form-card-heading"><span>01</span><div><h2>Role basics</h2><p>Start with the signal candidates search for.</p></div></div><div className="form-field-grid"><label className="span-2">Internship title *<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Product Marketing Intern" /></label><label>Company<input defaultValue="TechNova Labs" /></label><label>Internship type<select defaultValue="Full-time"><option>Full-time</option><option>Part-time</option></select></label><label>Location<input value={location} onChange={(event) => setLocation(event.target.value)} /></label><label>Work mode<select value={mode} onChange={(event) => setMode(event.target.value as Internship['mode'])}><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label><label>Duration<select defaultValue="3 months"><option>3 months</option><option>4 months</option><option>6 months</option></select></label><label>Monthly stipend<select value={stipend} onChange={(event) => setStipend(event.target.value)}><option>₹7,500 / month</option><option>₹10,000 / month</option><option>₹15,000 / month</option></select></label></div>{error && <p className="form-error">{error}</p>}</section><section className="form-card card"><div className="form-card-heading"><span>02</span><div><h2>The work</h2><p>Set expectations clearly and make the opportunity feel real.</p></div></div><label>Short description<textarea rows={4} defaultValue="Ship thoughtful product experiences with a small, ambitious team." /></label><label>Responsibilities<textarea rows={4} defaultValue={'Build polished product surfaces\nPair with design and product\nDocument decisions and learn in public'} /></label></section><section className="form-card card"><div className="form-card-heading"><span>03</span><div><h2>What makes a fit</h2><p>Help candidates understand where they can grow.</p></div></div><div className="form-field-grid"><label>Required skills<input defaultValue="React, JavaScript, Git" /></label><label>Preferred skills<input defaultValue="TypeScript, Storybook" /></label><label className="span-2">What you’ll learn<textarea rows={3} defaultValue="Modern product engineering, design systems and how a remote team ships." /></label></div></section></div><aside className="create-aside"><div className="publish-card card"><p className="eyebrow">Ready to publish?</p><h3>Make your next hire feel seen.</h3><p className="muted">You can edit everything after publishing. This is a frontend mock — no external submission will happen.</p><div className="publish-check"><Check size={15} /><span>Role details included</span></div><div className="publish-check"><Check size={15} /><span>Match signal ready</span></div><Button type="submit" size="lg" className="full-width">Publish internship <ArrowRight size={17} /></Button><button type="button" className="save-draft" onClick={saveDraft}>Save as draft</button></div></aside></form></div>
}

function ApplicantsPage({ applicants, navigate, updateApplicant }: { applicants: Applicant[]; navigate: (path: string) => void; updateApplicant: (id: string, status: ApplicationStatus) => void }) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const filtered = applicants.filter((item) => filter === 'All' || item.status === filter).filter((item) => `${item.name} ${item.education} ${item.skills.join(' ')}`.toLowerCase().includes(search.toLowerCase()))
  return <div className="page-wrap"><div className="page-header"><div><p className="eyebrow">Frontend Development Intern</p><h1>Applicants</h1><p className="muted">42 people are interested in joining this role.</p></div><Button variant="secondary" icon={<Filter size={16} />}>Filter view</Button></div><div className="applicant-toolbar card"><div className="role-tabs">{['All', 'New', 'Shortlisted', 'Interview', 'Rejected'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item} <span>{item === 'All' ? applicants.length : applicants.filter((candidate) => candidate.status === item).length}</span></button>)}</div><div className="search-field small-search"><Search size={16} /><input placeholder="Search applicants" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div><div className="applicants-list">{filtered.map((applicant) => <div className="applicant-row card" key={applicant.id}><Avatar initials={applicant.initials} tone={applicant.id === 'maya-singh' ? 'coral' : applicant.id === 'arjun-mehta' ? 'indigo' : 'mint'} /><div className="applicant-main"><div><h3>{applicant.name}</h3><p>{applicant.education}</p></div><div className="applicant-skills">{applicant.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="applicant-match"><MatchRing value={applicant.match} size="sm" /><span>fit signal</span></div><div className="applicant-date"><span>Applied</span><strong>{applicant.applied}</strong></div><Badge tone={applicant.status === 'Shortlisted' ? 'mint' : applicant.status === 'Interview' ? 'coral' : applicant.status === 'New' ? 'sand' : 'neutral'}>{applicant.status}</Badge><div className="applicant-actions"><button className="icon-button" onClick={() => navigate(`/recruiter/applicants/${applicant.id}`)} title="View applicant details"><ArrowUpRight size={17} /></button><button className="icon-button" onClick={() => updateApplicant(applicant.id, applicant.status === 'Shortlisted' ? 'Interview' : 'Shortlisted')} title="Toggle status"><MoreHorizontal size={18} /></button></div></div>)}{filtered.length === 0 && <EmptyState title="No applicants in this view" description="Try a different status filter or search query." />}</div></div>
}

function ApplicantProfile({ applicant, navigate, updateApplicant, openModal }: { applicant: Applicant; navigate: (path: string) => void; updateApplicant: (id: string, status: ApplicationStatus) => void; openModal: (modal: Modal) => void }) {
  return <div className="page-wrap applicant-profile-page"><button className="back-link" onClick={() => navigate('/recruiter/internships/technova-frontend/applicants')}><ArrowLeft size={16} /> Back to applicants</button><div className="applicant-profile-hero"><div className="applicant-profile-identity"><Avatar initials={applicant.initials} size="lg" tone="coral" /><div><div className="identity-row"><h1>{applicant.name}</h1><Badge tone={applicant.status === 'Shortlisted' ? 'mint' : 'sand'}>{applicant.status}</Badge></div><p>{applicant.education} · {applicant.location}</p><span className="profile-links"><Mail size={14} /> {applicant.name.toLowerCase().replace(' ', '.')}@gmail.com <span>·</span> <AtSign size={14} /> LinkedIn</span></div></div><div className="profile-actions"><Button variant="secondary" onClick={() => updateApplicant(applicant.id, 'Rejected')}>Reject</Button><Button onClick={() => updateApplicant(applicant.id, 'Shortlisted')} icon={<Check size={16} />}>Shortlist</Button><Button variant="soft" onClick={() => openModal('invite')} icon={<CalendarDays size={16} />}>Invite to interview</Button></div></div><div className="applicant-profile-layout"><div className="applicant-profile-main"><DetailSection title="About Maya"><p>{applicant.bio}</p></DetailSection><DetailSection title="Projects">{applicant.projects.map((project) => <div className="candidate-project" key={project.name}><div className="candidate-project-heading"><div className="project-symbol"><Code2 size={18} /></div><div><strong>{project.name}</strong><span>{project.description}</span></div><ArrowUpRight size={16} /></div><div className="skill-list">{project.tech.map((skill) => <span key={skill}>{skill}</span>)}</div></div>)}</DetailSection><DetailSection title="Experience & achievements"><div className="timeline-item"><span></span><div><strong>{applicant.experience}</strong><p>Built a stronger eye for product quality while collaborating across design and engineering.</p></div></div><div className="timeline-item"><span></span><div><strong>{applicant.achievement}</strong><p>A meaningful milestone in a very busy year.</p></div></div></DetailSection></div><aside className="applicant-profile-aside"><div className="candidate-signal card"><div className="card-heading"><div><p className="eyebrow">Frontend representation</p><h3>Match analysis</h3></div><MatchRing value={applicant.match} size="sm" /></div><div className="signal-summary"><strong>4 / 5 required skills</strong><span>Strong alignment for this role</span></div><div className="signal-list"><span><Check size={14} /> React</span><span><Check size={14} /> JavaScript</span><span><Check size={14} /> Git</span><span><Check size={14} /> CSS</span><span className="missing"><X size={14} /> TypeScript</span></div><small>Match signals are calculated based on profile alignment.</small></div><div className="resume-card card"><div className="card-heading"><div><p className="eyebrow">Candidate material</p><h3>Resume</h3></div><FileText size={18} /></div><div className="resume-preview"><FileText size={20} /><span><strong>maya-singh-resume.pdf</strong><small>1.2 MB · PDF</small></span><ArrowUpRight size={15} /></div><Button variant="secondary" className="full-width" onClick={() => openModal('resume')}>View resume</Button></div></aside></div></div>
}

function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <div className="empty-state card"><div className="empty-icon"><Compass size={21} /></div><h3>{title}</h3><p>{description}</p>{action}</div> }

function InviteModal({ applicant, close, notify, addInterview }: { applicant: Applicant; close: () => void; notify: (message: string) => void; addInterview: (interview: typeof seedInterviews[number]) => void }) { const [sent, setSent] = useState(false); const submit = (event: FormEvent) => { event.preventDefault(); setSent(true); addInterview({ id: `invite-${Date.now()}`, internshipId: 'technova-frontend', company: 'TechNova Labs', role: 'Frontend Development Intern', date: 'Oct 09, 2026', time: '3:30 PM IST', mode: 'Video call', meeting: 'meet.technova.co/maya', status: 'Upcoming' }); notify(`Interview invitation sent to ${applicant.name}.`) }; return <ModalShell title={sent ? 'Invitation sent.' : `Invite ${applicant.name} to interview`} eyebrow={sent ? 'Nice work' : 'Next step'} close={close}>{sent ? <div className="success-modal"><div className="success-icon"><Check size={25} /></div><p>They’ll see the invitation in their InternMatch workspace. You can find it in your Interviews tab.</p><Button className="full-width" onClick={close}>Done <ArrowRight size={16} /></Button></div> : <form onSubmit={submit} className="modal-form"><div className="modal-recipient"><Avatar initials={applicant.initials} size="sm" tone="coral" /><div><strong>{applicant.name}</strong><span>Frontend Development Intern · TechNova Labs</span></div></div><div className="form-field-grid"><label>Date<input type="date" defaultValue="2026-10-09" /></label><label>Time<input type="time" defaultValue="15:30" /></label><label>Interview mode<select defaultValue="Video call"><option>Video call</option><option>Phone call</option><option>In person</option></select></label><label>Meeting link<input defaultValue="meet.technova.co/maya" /></label></div><label>Message<textarea rows={4} defaultValue={`Hi ${applicant.name.split(' ')[0]},\n\nWe’d love to learn more about your work and share what we’re building at TechNova.`} /></label><Button type="submit" size="lg" className="full-width">Send invitation <Send size={16} /></Button></form>}</ModalShell> }

function ApplyModal({ item, close, submit }: { item: Internship; close: () => void; submit: () => void }) { const [sent, setSent] = useState(false); return <ModalShell title={sent ? 'Application sent.' : `Apply to ${item.company}`} eyebrow={sent ? 'You made the move' : 'One clear next step'} close={close}>{sent ? <div className="success-modal"><div className="success-icon"><Check size={25} /></div><p>Your application is now in progress. We’ll keep the status updated in your workspace.</p><Button className="full-width" onClick={close}>Back to opportunity <ArrowRight size={16} /></Button></div> : <form className="modal-form" onSubmit={(event) => { event.preventDefault(); setSent(true); submit() }}><div className="modal-role"><span className="company-logo" style={{ background: item.companyColor }}>{item.companyShort}</span><div><strong>{item.title}</strong><span>{item.company} · {item.mode}</span></div><MatchRing value={item.match} size="sm" /></div><div className="form-field-grid"><label>Your name<input defaultValue="Maya Singh" /></label><label>Email<input defaultValue="maya@demo.com" /></label></div><label>Resume<div className="file-pill"><FileText size={16} /><span>maya-singh-resume.pdf</span><Badge tone="mint">Ready</Badge></div></label><label>Short introduction<textarea rows={4} defaultValue="I’m a frontend builder who loves the details that make a product feel calm and useful. I’d be excited to learn with TechNova’s team." /></label><label>Optional cover message<textarea rows={3} placeholder="Anything else you’d like the team to know?" /></label><Button type="submit" size="lg" className="full-width">Submit application <ArrowRight size={16} /></Button></form>}</ModalShell> }

function ResumeModal({ close }: { close: () => void }) {
  return <ModalShell title="Resume Preview" eyebrow="Candidate Document" close={close}>
    <div style={{ background: '#f5f3ee', padding: 20, borderRadius: 12, border: '1px solid #e2ddd3' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottom: '1px solid #ded8cb', paddingBottom: 10 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18 }}>Maya Singh</h3>
          <p style={{ margin: 0, fontSize: 12, color: '#777' }}>maya@demo.com · Bengaluru, India</p>
        </div>
        <Badge tone="mint">Verified Resume</Badge>
      </div>
      <h4 style={{ margin: '10px 0 5px', fontSize: 13 }}>Education</h4>
      <p style={{ margin: 0, fontSize: 12, color: '#555' }}>B.Tech in CS — RV College of Engineering (2024 - 2028)</p>
      <h4 style={{ margin: '15px 0 5px', fontSize: 13 }}>Skills</h4>
      <p style={{ margin: 0, fontSize: 12, color: '#555' }}>React, JavaScript, TypeScript, Git, Figma, HTML, CSS</p>
      <h4 style={{ margin: '15px 0 5px', fontSize: 13 }}>Projects</h4>
      <p style={{ margin: 0, fontSize: 12, color: '#555' }}>• StudyCircle — Collaborative study planner built with React & Firebase.</p>
      <p style={{ margin: 0, fontSize: 12, color: '#555' }}>• Campus Cart — Peer-to-peer campus marketplace with Next.js.</p>
    </div>
    <div style={{ marginTop: 20 }}>
      <Button className="full-width" onClick={close}>Close Preview</Button>
    </div>
  </ModalShell>
}

function RecruiterInterviews({ interviews }: { interviews: typeof seedInterviews }) { return <div className="page-wrap"><div className="page-header"><div><p className="eyebrow">Your calendar</p><h1>Interviews</h1><p className="muted">Keep great conversations moving.</p></div><Button variant="secondary" icon={<CalendarDays size={16} />}>Open calendar</Button></div><div className="recruiter-interview-grid">{interviews.map((item) => <div className="recruiter-interview card" key={item.id}><div className="interview-top"><Badge tone={item.status === 'Upcoming' ? 'coral' : 'neutral'}>{item.status}</Badge><MoreHorizontal size={17} /></div><div className="interview-small-date"><span>{item.date.split(' ')[0]}</span><strong>{item.date.split(' ')[1]?.replace(',', '')}</strong></div><h3>{item.role}</h3><p>{item.company}</p><div className="interview-meta"><span><Clock3 size={14} />{item.time}</span><span><MessageCircle size={14} />{item.mode}</span></div><Button size="sm" variant="secondary" onClick={() => window.open('https://meet.google.com', '_blank')}>View details <ArrowRight size={14} /></Button></div>)}</div></div> }

function CompanyPage() { return <div className="page-wrap"><div className="page-header"><div><p className="eyebrow">Your hiring story</p><h1>Company profile</h1><p className="muted">Give candidates the context behind the role.</p></div><Button icon={<Pencil size={16} />}>Edit profile</Button></div><div className="company-profile card"><div className="company-profile-top"><span className="company-logo xlarge">TN</span><div><h2>TechNova Labs</h2><p>Tools for the people building what’s next.</p><span className="profile-location"><Compass size={14} /> Bengaluru · Remote-first · 68 people</span></div><Badge tone="mint">Profile 86% complete</Badge></div><div className="company-profile-grid"><div><p className="eyebrow">About</p><p>TechNova is a product studio building practical tools that help ambitious people learn, work and grow with more context.</p></div><div><p className="eyebrow">Our principles</p><div className="principle-tags"><span>Craft over theatre</span><span>Learn in public</span><span>Make room for curiosity</span></div></div></div></div></div> }

export default function App() {
  const [path, setPath] = useState(window.location.pathname || '/')
  const [role, setRole] = useState<Role>(() => window.location.pathname.includes('recruiter') ? 'recruiter' : 'student')
  const [savedIds, setSavedIds] = useState<string[]>(['brightside-product', 'orbit-data'])
  const [applications, setApplications] = useState<Application[]>(seedApplications)
  const [interviewList, setInterviewList] = useState(seedInterviews)
  const [internshipList, setInternshipList] = useState(seedInternships)
  const [applicantList, setApplicantList] = useState(seedApplicants)
  const [toast, setToast] = useState<Toast | null>(null)
  const [modal, setModal] = useState<Modal>(null)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (nextPath: string) => { window.history.pushState({}, '', nextPath); setPath(nextPath); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const notify = (message: string, tone: Toast['tone'] = 'success') => { setToast({ message, tone }); setTimeout(() => setToast(null), 3500) }
  const onLogin = (nextRole: Role = 'student') => { setRole(nextRole); navigate(nextRole === 'student' ? '/student/dashboard' : '/recruiter/dashboard'); notify(`Welcome to your ${nextRole} workspace.`, 'info') }
  const toggleSave = (id: string) => setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const addApplication = (internshipId: string) => { if (applications.some((item) => item.internshipId === internshipId)) return; setApplications((current) => [{ id: `app-${Date.now()}`, internshipId, applied: 'Sep 29, 2026', updated: 'Sep 29, 2026', status: 'Applied', note: 'Your application was sent successfully.' }, ...current]); notify('Application sent — good luck with the next step.') }
  const updateApplicant = (id: string, status: ApplicationStatus) => { setApplicantList((current) => current.map((item) => item.id === id ? { ...item, status } : item)); notify(`Applicant moved to ${status}.`) }
  const addInterview = (interview: typeof seedInterviews[number]) => setInterviewList((current) => [interview, ...current])
  const addInternship = (item: Internship) => setInternshipList((current) => [item, ...current])
  const detailsId = path.match(/\/internships\/([^/]+)/)?.[1]
  const applicantId = path.match(/\/recruiter\/applicants\/([^/]+)/)?.[1]
  const detailItem = internshipList.find((item) => item.id === detailsId) ?? internshipList[0]
  const detailApplicant = applicantList.find((item) => item.id === applicantId) ?? applicantList[0]
  const openModal = (next: Modal) => setModal(next)

  let content: ReactNode
  if (path === '/' || path === '') content = <LandingPage navigate={navigate} />
  else if (path === '/login' || path === '/signin') content = <AuthPage mode="login" onLogin={onLogin} navigate={navigate} />
  else if (path === '/register' || path === '/signup' || path === '/get-started') content = <AuthPage mode="register" onLogin={onLogin} navigate={navigate} />
  else if (path === '/forgot-password') content = <AuthPage mode="forgot" onLogin={onLogin} navigate={navigate} />
  else if (path === '/internships') content = <DiscoverPage navigate={navigate} savedIds={savedIds} toggleSave={toggleSave} publicMode />
  else if (detailsId) content = <AppShell role={role} path={path} navigate={navigate} onLogout={() => navigate('/')}><DetailPage item={detailItem} navigate={navigate} saved={savedIds.includes(detailItem.id)} toggleSave={() => toggleSave(detailItem.id)} openModal={openModal} /></AppShell>
  else if (path.startsWith('/student/')) content = <AppShell role="student" path={path} navigate={navigate} onLogout={() => navigate('/')} >{path === '/student/dashboard' && <DashboardPage navigate={navigate} applications={applications} interviews={interviewList} />}{path === '/student/internships' && <DiscoverPage navigate={navigate} savedIds={savedIds} toggleSave={toggleSave} />}{path === '/student/recommended' && <DiscoverPage navigate={navigate} savedIds={savedIds} toggleSave={toggleSave} />}{path === '/student/applications' && <ApplicationsPage applications={applications} navigate={navigate} />}{path === '/student/interviews' && <InterviewsPage interviews={interviewList} navigate={navigate} notify={notify} />}{path === '/student/saved' && <div className="page-wrap"><div className="page-header"><div><p className="eyebrow">Your shortlist</p><h1>Saved internships</h1><p className="muted">Keep the possibilities that feel worth a closer look.</p></div></div><div className="opportunity-grid">{internshipList.filter((item) => savedIds.includes(item.id)).map((item) => <OpportunityCard key={item.id} item={item} saved onSave={() => toggleSave(item.id)} onOpen={() => navigate(`/internships/${item.id}`)} />)}</div></div>}{path === '/student/profile' && <ProfilePage openModal={openModal} />}</AppShell>
  else if (path.startsWith('/recruiter/')) content = <AppShell role="recruiter" path={path} navigate={navigate} onLogout={() => navigate('/')} >{path === '/recruiter/dashboard' && <RecruiterDashboard navigate={navigate} applicants={applicantList} />}{path === '/recruiter/internships' && <RecruiterInternships navigate={navigate} internships={internshipList} />}{path === '/recruiter/internships/create' && <CreateInternship navigate={navigate} addInternship={addInternship} notify={notify} />}{path.includes('/applicants') && !applicantId && <ApplicantsPage applicants={applicantList} navigate={navigate} updateApplicant={updateApplicant} />}{applicantId && <ApplicantProfile applicant={detailApplicant} navigate={navigate} updateApplicant={updateApplicant} openModal={openModal} />}{path === '/recruiter/interviews' && <RecruiterInterviews interviews={interviewList} />}{path === '/recruiter/company' && <CompanyPage />}</AppShell>
  else content = <LandingPage navigate={navigate} />

  return (
    <>
      {content}
      <ToastView toast={toast} dismiss={() => setToast(null)} />
      {modal === 'apply' && <ApplyModal item={detailItem} close={() => setModal(null)} submit={() => addApplication(detailItem.id)} />}
      {modal === 'invite' && <InviteModal applicant={detailApplicant} close={() => setModal(null)} notify={notify} addInterview={addInterview} />}
      {modal === 'resume' && <ResumeModal close={() => setModal(null)} />}
    </>
  )
}
