import { useCallback, useEffect, useMemo, useState } from 'react';
import { campaignApi } from './api/campaignApi.js';

const platformOptions = ['Instagram', 'Facebook', 'Google Ads', 'YouTube', 'LinkedIn'];

function Icon({ name, size = 18 }) {
  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    megaphone: <><path d="m3 11 18-5v12L3 13v-2Z" /><path d="m6 14 2 6h4l-2.2-5.4" /><path d="M21 10v4" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    refresh: <><path d="M20 7v5h-5" /><path d="M4 17v-5h5" /><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2" /></>,
    eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    edit: <><path d="m15 5 4 4" /><path d="M4 20 8.5 19 19 8.5a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z" /></>,
    trash: <><path d="M4 7h16" /><path d="M10 11v6M14 11v6" /><path d="m5 7 1 14h12l1-14M9 7V4h6v3" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  };

  return <svg {...shared}>{paths[name]}</svg>;
}

function formatBudget(value) {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    : '—';
}

function CampaignForm({ mode, campaign, onCancel, onSubmit, saving, submitError }) {
  const [form, setForm] = useState({
    campaignName: campaign?.campaignName || '',
    platform: campaign?.platform || '',
    budget: campaign?.budget ?? '',
    active: campaign?.active ?? true,
  });
  const [validationError, setValidationError] = useState('');

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function submit(event) {
    event.preventDefault();
    const campaignName = form.campaignName.trim();
    const budget = Number(form.budget);

    if (!campaignName || !form.platform) {
      setValidationError('Campaign name and platform are required.');
      return;
    }
    if (form.budget === '' || !Number.isFinite(budget) || budget < 0) {
      setValidationError('Enter a valid budget of zero or more.');
      return;
    }

    setValidationError('');
    onSubmit({
      campaignName,
      platform: form.platform,
      budget,
      active: Boolean(form.active),
    });
  }

  return (
    <form className="campaign-form" onSubmit={submit}>
      <div className="form-field">
        <label htmlFor="campaignName">Campaign name</label>
        <input
          id="campaignName"
          name="campaignName"
          type="text"
          maxLength="50"
          placeholder="e.g. Summer product launch"
          value={form.campaignName}
          onChange={updateField}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="platform">Platform</label>
        <select
          id="platform"
          name="platform"
          value={form.platform}
          onChange={updateField}
          required
        >
          <option value="" disabled>Select a platform</option>
          {platformOptions.map((platform) => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="budget">Budget</label>
        <input
          id="budget"
          name="budget"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={form.budget}
          onChange={updateField}
          required
        />
      </div>
      <label className="active-toggle">
        <span className="toggle-copy">
          <strong>Campaign is active</strong>
          <small>Active campaigns are currently running.</small>
        </span>
        <input
          type="checkbox"
          name="active"
          checked={form.active}
          onChange={updateField}
        />
        <span className="toggle-track" aria-hidden="true" />
      </label>
      {validationError && <p className="form-error" role="alert">{validationError}</p>}
      {submitError && <p className="form-error" role="alert">{submitError}</p>}
      <div className="modal-actions">
        <button className="button button-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="button button-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create campaign'}
        </button>
      </div>
    </form>
  );
}

function CampaignDetails({ campaign }) {
  return (
    <dl className="detail-list">
      <div><dt>Campaign ID</dt><dd>#{campaign.id}</dd></div>
      <div><dt>Campaign name</dt><dd>{campaign.campaignName}</dd></div>
      <div><dt>Platform</dt><dd>{campaign.platform}</dd></div>
      <div><dt>Budget</dt><dd>{formatBudget(campaign.budget)}</dd></div>
      <div>
        <dt>Status</dt>
        <dd><StatusBadge active={campaign.active} /></dd>
      </div>
    </dl>
  );
}

function StatusBadge({ active }) {
  return (
    <span className={`status-badge ${active ? 'status-active' : 'status-inactive'}`}>
      <span className="status-dot" />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function CampaignModal({ modal, onClose, onSubmit, saving, submitError }) {
  if (!modal) return null;

  const titles = {
    create: 'Create campaign',
    edit: 'Edit campaign',
    view: 'Campaign details',
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">{modal.mode === 'view' ? 'Campaign overview' : 'Campaign workspace'}</span>
            <h2 id="modal-title">{titles[modal.mode]}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {modal.mode === 'view' ? (
          <>
            <CampaignDetails campaign={modal.campaign} />
            <div className="modal-actions">
              <button className="button button-secondary" type="button" onClick={onClose}>Close</button>
            </div>
          </>
        ) : (
          <CampaignForm
            key={`${modal.mode}-${modal.campaign?.id || 'new'}`}
            mode={modal.mode}
            campaign={modal.campaign}
            onCancel={onClose}
            onSubmit={onSubmit}
            saving={saving}
            submitError={submitError}
          />
        )}
      </section>
    </div>
  );
}

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState('checking');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [modal, setModal] = useState(null);
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);
  const [lookupId, setLookupId] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError('');
    setConnection('checking');
    try {
      await campaignApi.checkConnection();
      setConnection('online');
      const data = await campaignApi.getAll();
      if (!Array.isArray(data)) {
        throw new Error('The campaign service returned an unexpected campaign list.');
      }
      setCampaigns(data);
    } catch (loadError) {
      setConnection('offline');
      setError(loadError.message || 'Unable to load campaigns.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 4000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const stats = useMemo(() => ({
    total: campaigns.length,
    active: campaigns.filter((campaign) => campaign.active).length,
    inactive: campaigns.filter((campaign) => !campaign.active).length,
  }), [campaigns]);

  async function saveCampaign(campaign) {
    setSaving(true);
    setModalError('');
    try {
      if (modal.mode === 'edit') {
        await campaignApi.update(modal.campaign.id, campaign);
        setNotice('Campaign updated successfully.');
      } else {
        await campaignApi.create(campaign);
        setNotice('Campaign created successfully.');
      }
      setModal(null);
      await loadCampaigns();
    } catch (saveError) {
      setModalError(saveError.message || 'Unable to save the campaign.');
    } finally {
      setSaving(false);
    }
  }

  async function findCampaign(event) {
    event.preventDefault();
    const id = lookupId.trim();
    if (!/^\d+$/.test(id) || Number(id) < 1) {
      setLookupError('Enter a valid campaign ID.');
      return;
    }

    setLookingUp(true);
    setLookupError('');
    try {
      const campaign = await campaignApi.getById(id);
      setModalError('');
      setModal({ mode: 'view', campaign });
    } catch (lookupFailure) {
      setLookupError(lookupFailure.message || 'Unable to find this campaign.');
    } finally {
      setLookingUp(false);
    }
  }

  async function deleteCampaign() {
    setDeleting(true);
    setDeleteError('');
    try {
      await campaignApi.remove(deleteTarget.id);
      setNotice(`"${deleteTarget.campaignName}" was deleted.`);
      setDeleteTarget(null);
      await loadCampaigns();
    } catch (deleteError) {
      setDeleteError(deleteError.message || 'Unable to delete the campaign.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard" aria-label="Campaign Studio home">
          <span className="brand-mark"><Icon name="megaphone" size={21} /></span>
          <span className="brand-name">market<span>pilot</span></span>
        </a>
        <span className="sidebar-label">WORKSPACE</span>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="nav-link nav-link-active" href="#dashboard">
            <Icon name="grid" /><span>Overview</span>
          </a>
          <a className="nav-link" href="#campaigns">
            <Icon name="megaphone" /><span>Campaigns</span>
            <span className="nav-count">{stats.total}</span>
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon"><Icon name="arrow" size={16} /></div>
            <strong>Make every click count.</strong>
            <p>Keep your campaigns organized and ready to grow.</p>
          </div>
          <div className="profile-row">
            <div className="avatar">CM</div>
            <div><strong>Campaign Manager</strong><span>Workspace admin</span></div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="breadcrumbs">Workspace <span>/</span> Campaigns</div>
          <div className={`connection-pill connection-${connection}`}>
            <span className="connection-dot" />
            {connection === 'online' ? 'Backend connected' : connection === 'checking' ? 'Connecting…' : 'Backend offline'}
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <span className="eyebrow">YOUR MARKETING WORKSPACE</span>
              <h1>Digital Marketing Campaign Manager</h1>
              <p className="page-subtitle">Plan, organize, and keep track of every campaign in one place.</p>
            </div>
            <button className="button button-primary create-button" onClick={() => { setModalError(''); setModal({ mode: 'create' }); }}>
              <Icon name="plus" /> New campaign
            </button>
          </section>

          {notice && <div className="toast toast-success" role="status">{notice}</div>}
          {error && (
            <div className="alert alert-error" role="alert">
              <span>{error}</span>
              <button className="text-button" type="button" onClick={loadCampaigns}>Try again</button>
            </div>
          )}

          <section className="stats-grid" aria-label="Campaign statistics">
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon icon-lavender"><Icon name="grid" /></span><span className="stat-label">ALL CAMPAIGNS</span></div>
              <div className="stat-value">{loading ? '—' : stats.total}</div>
              <div className="stat-caption">Across all platforms</div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon icon-green"><span className="status-dot" /></span><span className="stat-label">ACTIVE</span></div>
              <div className="stat-value">{loading ? '—' : stats.active}</div>
              <div className="stat-caption">Currently running</div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon icon-amber"><span className="status-dot" /></span><span className="stat-label">INACTIVE</span></div>
              <div className="stat-value">{loading ? '—' : stats.inactive}</div>
              <div className="stat-caption">Paused or completed</div>
            </article>
          </section>

          <section className="lookup-card" aria-labelledby="lookup-heading">
            <div className="lookup-copy">
              <span className="lookup-icon"><Icon name="search" /></span>
              <div>
                <h2 id="lookup-heading">Find a campaign</h2>
                <p>Look up campaign details using its ID.</p>
              </div>
            </div>
            <form className="lookup-form" onSubmit={findCampaign}>
              <label className="visually-hidden" htmlFor="campaignLookup">Campaign ID</label>
              <input
                id="campaignLookup"
                type="number"
                min="1"
                placeholder="Enter campaign ID"
                value={lookupId}
                onChange={(event) => {
                  setLookupId(event.target.value);
                  setLookupError('');
                }}
                required
              />
              <button className="button button-dark" type="submit" disabled={lookingUp}>
                {lookingUp ? 'Searching…' : <>Find campaign <Icon name="arrow" size={16} /></>}
              </button>
            </form>
            {lookupError && <p className="lookup-error" role="alert">{lookupError}</p>}
          </section>

          <section className="campaign-section" id="campaigns">
            <div className="section-heading">
              <div>
                <span className="eyebrow">CAMPAIGN OVERVIEW</span>
                <h2>All campaigns <span className="section-count">{stats.total}</span></h2>
              </div>
              <button className="button button-secondary refresh-button" onClick={loadCampaigns} disabled={loading}>
                <Icon name="refresh" /> Refresh
              </button>
            </div>

            <div className="table-card">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">CAMPAIGN</th>
                      <th scope="col">PLATFORM</th>
                      <th scope="col">BUDGET</th>
                      <th scope="col">STATUS</th>
                      <th scope="col" className="actions-heading">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5"><div className="table-message"><span className="spinner" /> Loading campaigns…</div></td></tr>
                    ) : campaigns.length === 0 ? (
                      <tr>
                        <td colSpan="5">
                          <div className="empty-state">
                            <span className="empty-icon"><Icon name="megaphone" size={23} /></span>
                            <strong>{connection === 'offline' ? 'Campaigns are unavailable' : 'No campaigns yet'}</strong>
                            <p>{connection === 'offline' ? 'Reconnect to the backend and try again.' : 'Create your first campaign to get started.'}</p>
                            {connection !== 'offline' && (
                              <button className="button button-primary button-small" onClick={() => { setModalError(''); setModal({ mode: 'create' }); }}>
                                <Icon name="plus" size={16} /> Create campaign
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : campaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td>
                          <div className="campaign-name-cell">
                            <span className={`platform-avatar platform-${campaign.platform?.toLowerCase().replace(/[^a-z]/g, '') || 'default'}`}>
                              {(campaign.platform || '?').slice(0, 1)}
                            </span>
                            <span><strong>{campaign.campaignName}</strong><small>ID #{campaign.id}</small></span>
                          </div>
                        </td>
                        <td><span className="platform-name">{campaign.platform}</span></td>
                        <td className="budget-cell">{formatBudget(campaign.budget)}</td>
                        <td><StatusBadge active={campaign.active} /></td>
                        <td>
                          <div className="row-actions">
                            <button className="icon-button" type="button" aria-label={`View ${campaign.campaignName}`} title="View" onClick={() => { setModalError(''); setModal({ mode: 'view', campaign }); }}><Icon name="eye" /></button>
                            <button className="icon-button" type="button" aria-label={`Edit ${campaign.campaignName}`} title="Edit" onClick={() => { setModalError(''); setModal({ mode: 'edit', campaign }); }}><Icon name="edit" /></button>
                            <button className="icon-button icon-button-danger" type="button" aria-label={`Delete ${campaign.campaignName}`} title="Delete" onClick={() => { setDeleteError(''); setDeleteTarget(campaign); }}><Icon name="trash" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <footer className="table-footer">
                <span>{loading ? 'Loading records' : `Showing ${campaigns.length} campaign${campaigns.length === 1 ? '' : 's'}`}</span>
                <span>Digital Marketing Campaign Service</span>
              </footer>
            </div>
          </section>
          <footer className="page-footer">Built for smarter campaign management <span>·</span> Marketpilot</footer>
        </div>
      </main>

      <CampaignModal
        modal={modal}
        onClose={() => { setModal(null); setModalError(''); }}
        onSubmit={saveCampaign}
        saving={saving}
        submitError={modalError}
      />

      {deleteTarget && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-card confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
            <div className="confirm-icon"><Icon name="trash" size={21} /></div>
            <h2 id="confirm-title">Delete this campaign?</h2>
            <p><strong>{deleteTarget.campaignName}</strong> will be permanently removed. This action cannot be undone.</p>
            {deleteError && <p className="form-error" role="alert">{deleteError}</p>}
            <div className="modal-actions">
              <button className="button button-secondary" type="button" onClick={() => { setDeleteTarget(null); setDeleteError(''); }} disabled={deleting}>Keep campaign</button>
              <button className="button button-danger" type="button" onClick={deleteCampaign} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete campaign'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
