// client/src/App.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  getUsers, createUser, getUser,
  getTasks, addTask, completeTask, deleteTask,
  addFocusXp, getHistory
} from './api/api';
import './index.css';

const STORAGE_KEY = 'studyHubUserId';

const RANKS = [
  { level: 1, title: 'Novice Initiate' },
  { level: 3, title: 'Code Vanguard' },
  { level: 5, title: 'Deep Work Master' },
  { level: 10, title: 'Cyber Grandmaster' }
];
const rankFor = (level) => [...RANKS].reverse().find((r) => level >= r.level) || RANKS[0];

const DURATIONS = [15, 25, 45, 60];
const DIFFICULTY_XP = { Easy: 50, Medium: 100, Hard: 200 };

function initials(name) {
  return (name || '?').trim().slice(0, 2).toUpperCase();
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // Load the profile list once on boot, and try to resume the last session.
  useEffect(() => {
    (async () => {
      try {
        const list = await getUsers();
        setUsers(list);

        const savedId = localStorage.getItem(STORAGE_KEY);
        if (savedId) {
          try {
            const user = await getUser(savedId);
            setCurrentUser(user);
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } finally {
        setLoadingProfiles(false);
      }
    })();
  }, []);

  const selectUser = (user) => {
    localStorage.setItem(STORAGE_KEY, user._id);
    setCurrentUser(user);
  };

  const switchProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
  };

  if (loadingProfiles) {
    return <div className="hub-container"><div className="card">Loading…</div></div>;
  }

  if (!currentUser) {
    return (
      <ProfilePicker
        users={users}
        onCreate={async (username) => {
          const user = await createUser(username);
          setUsers((u) => [user, ...u]);
          selectUser(user);
        }}
        onSelect={selectUser}
      />
    );
  }

  return (
    <Hub
      user={currentUser}
      onUserUpdate={setCurrentUser}
      onSwitchProfile={switchProfile}
    />
  );
}

/* 
   PROFILE PICKER
 */
function ProfilePicker({ users, onCreate, onSelect }) {
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const submitNew = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    setError('');
    try {
      await onCreate(newName.trim());
      setNewName('');
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not create profile');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="hub-container">
      <div className="card profile-screen">
        <div className="section-header">
          <h2 className="level-title">Who's studying?</h2>
        </div>

        <div className="profile-grid">
          {users.map((u) => (
            <button key={u._id} className="profile-card" onClick={() => onSelect(u)}>
              <div className="avatar-box profile-avatar">{initials(u.username)}</div>
              <div className="name">{u.username}</div>
              <div className="meta">Level {u.level} · {rankFor(u.level).title}</div>
            </button>
          ))}

          <div className="profile-card new-profile-card">
            <div className="avatar-box profile-avatar">+</div>
            <input
              type="text"
              placeholder="New scholar's name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitNew()}
            />
            <button className="btn btn-full ghost" disabled={creating} onClick={submitNew}>
              {creating ? 'Creating…' : 'Create profile'}
            </button>
            {error && <p className="form-error">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 
   MAIN HUB
 */
function Hub({ user, onUserUpdate, onSwitchProfile }) {
  const [tab, setTab] = useState('active'); // 'active' | 'history'
  const [levelUpFlash, setLevelUpFlash] = useState(false);

  const rank = rankFor(user.level);
  const threshold = user.level * 100;
  const pct = Math.min(100, (user.xp / threshold) * 100);

  const applyResult = ({ user: updatedUser, leveledUp }) => {
    onUserUpdate(updatedUser);
    if (leveledUp) {
      setLevelUpFlash(true);
      setTimeout(() => setLevelUpFlash(false), 1600);
    }
  };

  return (
    <div className="hub-container">
      <div className="card">
        <div className="profile-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div className="avatar-box">{initials(user.username)}</div>
            <div>
              <div className="rank-tag">{rank.title}</div>
              <div className="level-title">Level {user.level} {user.username}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {levelUpFlash && <span className="xp-badge">Rank up</span>}
            <button className="btn ghost switch-profile-link" onClick={onSwitchProfile}>Switch profile</button>
          </div>
        </div>

        <div className="xp-info">
          <span className="xp-label">XP Progress</span>
          <span className="xp-value">{user.xp} / {threshold} XP</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <FocusChamber userId={user._id} onComplete={applyResult} />

      <div className="card">
        <div className="section-header">
          <h3>Quest Log</h3>
        </div>
        <div className="tab-bar">
          <button className={`tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>Active</button>
          <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>History</button>
        </div>

        {tab === 'active'
          ? <ActiveQuests userId={user._id} onComplete={applyResult} />
          : <HistoryList userId={user._id} refreshKey={`${user.xp}-${user.level}`} />}
      </div>
    </div>
  );
}

/* 
   FOCUS CHAMBER — configurable Pomodoro
 */

function FocusChamber({ userId, onComplete }) {
  const [duration, setDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            addFocusXp(userId, duration).then(onComplete);
            return duration * 60;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const pickDuration = (mins) => {
    if (running) return;
    setDuration(mins);
    setSecondsLeft(mins * 60);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const xpForDuration = Math.max(1, Math.round(duration * 3));

  return (
    <div className="card">
      <div className="section-header">
        <h3>⏱ Deep Focus Chamber</h3>
        <span className="xp-badge">+{xpForDuration} XP</span>
      </div>

      <div className="duration-picker">
        {DURATIONS.map((m) => (
          <button
            key={m}
            className={`duration-btn ${duration === m ? 'active' : ''}`}
            disabled={running}
            onClick={() => pickDuration(m)}
          >
            {m}m
          </button>
        ))}
      </div>

      <div className="timer-text">{mm}:{ss}</div>

      <div className="input-group" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <button className="btn btn-full primary" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause session' : secondsLeft === duration * 60 ? 'Begin focus session' : 'Resume'}
        </button>
        <button
          className="btn btn-full ghost"
          onClick={() => { setRunning(false); setSecondsLeft(duration * 60); }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

/* 
   ACTIVE QUESTS
 */


function ActiveQuests({ userId, onComplete }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');

  const load = useCallback(() => { getTasks(userId).then(setTasks); }, [userId]);
  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!title.trim()) return;
    const task = await addTask(title.trim(), difficulty, userId);
    setTasks((t) => [task, ...t]);
    setTitle('');
  };

  const complete = async (id) => {
    const result = await completeTask(id, userId);
    setTasks((t) => t.filter((x) => x._id !== id));
    onComplete(result);
  };

  const remove = async (id) => {
    await deleteTask(id);
    setTasks((t) => t.filter((x) => x._id !== id));
  };

  return (
    <>
      <div className="input-group">
        <input
          type="text"
          placeholder="Deploy new feature, revise algorithm…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {Object.entries(DIFFICULTY_XP).map(([k, xp]) => (
            <option key={k} value={k}>{k} (+{xp} XP)</option>
          ))}
        </select>
      </div>
      <button className="btn btn-full primary" onClick={submit} style={{ marginBottom: 12 }}>+ Add Quest</button>

      {tasks.length === 0 ? (
        <p className="empty-state">No quests active. Forge one above!</p>
      ) : (
        tasks.map((t) => (
          <div className="quest-item" key={t._id}>
            <div>
              <h3>{t.title}</h3>
              <p>{t.difficulty} · +{t.xpReward} XP</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn ghost" onClick={() => complete(t._id)}>Complete</button>
              <button className="btn ghost" onClick={() => remove(t._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </>
  );
}

/* 
   HISTORY
 */

   
function HistoryList({ userId, refreshKey }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHistory(userId).then((data) => { setEntries(data); setLoading(false); });
  }, [userId, refreshKey]);

  if (loading) return <p className="empty-state">Loading history…</p>;
  if (entries.length === 0) return <p className="empty-state">No completed quests or focus sessions yet.</p>;

  return entries.map((e) => (
    <div className="quest-item" key={e._id}>
      <div>
        <h3>{e.title}</h3>
        <p>{e.type === 'quest' ? e.difficulty : 'Focus session'} · {new Date(e.createdAt).toLocaleString()}</p>
      </div>
      <span className="xp-badge">+{e.xpEarned} XP</span>
    </div>
  ));
}