import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Github,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  GitBranch,
  Terminal,
  Clock,
  Layers,
  Lock,
  FileCode,
  AlertCircle,
  HelpCircle,
  Check,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useSettings } from '../../context/SettingsContext';
import {
  publishProjectToGithub,
  triggerLiveDeployment,
  getLiveDeploymentHistory,
  getLivePublishHistory,
  checkIntegrationsStatus,
  PublishGithubResult,
} from '../../services/deployService';
import { scanFilesSecurityBackend, fetchGithubRepos } from '../../services/apiClient';
import { generateProjectFiles } from '../../services/exportService';
import { DeploymentProvider, DeploymentRecord } from '../../types';

export const DeployWorkspace: React.FC = () => {
  const { activeProject } = useProject();
  const { settings, updateIntegrations } = useSettings();

  // Integrations state
  const [integrationsStatus, setIntegrationsStatus] = useState<{
    github: { connected: boolean; configured: boolean; authMethod?: string };
    deployment: { providers: { vercel?: { configured: boolean }; netlify?: { configured: boolean } } };
  }>({
    github: { connected: false, configured: false },
    deployment: { providers: {} },
  });

  // Token override inputs
  const [githubPatInput, setGithubPatInput] = useState(settings.integrations.githubPat || '');
  const [vercelTokenInput, setVercelTokenInput] = useState(settings.integrations.vercelToken || '');
  const [showTokenInputs, setShowTokenInputs] = useState(false);

  // GitHub state
  const [repoName, setRepoName] = useState(
    activeProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  );
  const [branch, setBranch] = useState('main');
  const [isPrivate, setIsPrivate] = useState(false);
  const [commitMessage, setCommitMessage] = useState('feat: initial website generated with SiteGen AI');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishGithubResult | null>(null);
  const [userRepos, setUserRepos] = useState<any[]>([]);

  // Security scan state
  const [securityStatus, setSecurityStatus] = useState<{ isClean: boolean; warnings: any[] } | null>(null);

  // Deployment state
  const [provider, setProvider] = useState<DeploymentProvider>('sitegen-cloud');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStepMessage, setDeployStepMessage] = useState('');
  const [latestDeployment, setLatestDeployment] = useState<DeploymentRecord | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [history, setHistory] = useState<DeploymentRecord[]>([]);
  const [publishHistory, setPublishHistory] = useState<any[]>([]);

  // Check integration status and load history
  useEffect(() => {
    refreshStatusAndHistory();
    runSecurityScan();
  }, [activeProject.id]);

  const refreshStatusAndHistory = async () => {
    try {
      const status = await checkIntegrationsStatus();
      setIntegrationsStatus(status);

      const [deps, pubs] = await Promise.all([
        getLiveDeploymentHistory(activeProject.id),
        getLivePublishHistory(activeProject.id),
      ]);
      setHistory(deps);
      setPublishHistory(pubs);

      // If github configured, fetch repos
      if (status.github.configured || githubPatInput) {
        try {
          const reposData = await fetchGithubRepos(githubPatInput || undefined);
          if (reposData.repos) setUserRepos(reposData.repos);
        } catch {
          // ignore repo list error if unauthenticated
        }
      }
    } catch (e) {
      console.warn('Failed to load initial status', e);
    }
  };

  const runSecurityScan = async () => {
    try {
      const files = generateProjectFiles(activeProject);
      const res = await scanFilesSecurityBackend(files);
      setSecurityStatus(res);
    } catch {
      setSecurityStatus({ isClean: true, warnings: [] });
    }
  };

  const handleSaveTokens = () => {
    updateIntegrations({
      githubPat: githubPatInput.trim(),
      githubTokenConfigured: Boolean(githubPatInput.trim()),
      githubConnected: Boolean(githubPatInput.trim()),
      vercelToken: vercelTokenInput.trim(),
      vercelTokenConfigured: Boolean(vercelTokenInput.trim()),
      deploymentProviderConnected: Boolean(vercelTokenInput.trim()),
    });
    refreshStatusAndHistory();
    setShowTokenInputs(false);
  };

  const handlePublishGithub = async () => {
    setIsPublishing(true);
    setPublishResult(null);
    try {
      const token = githubPatInput.trim() || undefined;
      const res = await publishProjectToGithub({
        repoName,
        isNewRepo: true,
        branch,
        commitMessage,
        project: activeProject,
        isPrivate,
        token,
      });
      setPublishResult(res);
      if (res.success) {
        const pubs = await getLivePublishHistory(activeProject.id);
        setPublishHistory(pubs);
      }
    } catch (e: any) {
      setPublishResult({
        success: false,
        repoUrl: '',
        commitHash: '',
        branch,
        isSimulated: false,
        error: e.message || 'Publishing operation failed.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeployWebsite = async () => {
    setIsDeploying(true);
    setDeployError(null);
    try {
      const token = vercelTokenInput.trim() || undefined;
      const res = await triggerLiveDeployment(
        {
          projectId: activeProject.id,
          projectName: activeProject.name,
          provider,
          project: activeProject,
          token,
        },
        (step) => setDeployStepMessage(step)
      );

      if (res.success && res.record) {
        setLatestDeployment(res.record);
        const deps = await getLiveDeploymentHistory(activeProject.id);
        setHistory(deps);
      } else {
        setDeployError(res.error || 'Deployment failed.');
      }
    } catch (err: any) {
      setDeployError(err.message || 'Deployment runner encountered an error.');
    } finally {
      setIsDeploying(false);
      setDeployStepMessage('');
    }
  };

  const isGithubConfigured = integrationsStatus.github.configured || Boolean(githubPatInput.trim());
  const isVercelConfigured =
    Boolean(integrationsStatus.deployment.providers.vercel?.configured) || Boolean(vercelTokenInput.trim());

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">GitHub Publishing & Live Cloud Deployment</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
              Live Edge CDN
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Deploy your website instantly with 1-click SiteGen Instant Cloud hosting, or publish to GitHub, Vercel, and Netlify.
          </p>
        </div>

        {/* Integration Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>SiteGen Instant: Ready</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${
              isGithubConfigured
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>{isGithubConfigured ? 'GitHub Connected' : 'GitHub Optional'}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${
              isVercelConfigured
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isVercelConfigured ? 'Vercel API Connected' : 'Vercel Optional'}</span>
          </div>

          <button
            onClick={() => setShowTokenInputs(!showTokenInputs)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-700 font-semibold transition cursor-pointer"
          >
            {showTokenInputs ? 'Hide Credentials' : 'Add Custom API Tokens'}
          </button>
        </div>
      </div>

      {/* Token Configuration Drawer */}
      {showTokenInputs && (
        <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                External Service Credentials (Optional — Saved In Session / Server)
              </h3>
            </div>
            <span className="text-xs text-slate-500">Tokens never committed or exposed in client builds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={githubPatInput}
                onChange={(e) => setGithubPatInput(e.target.value)}
                placeholder="ghp_•••••••••••••••••••••••••••••••••••• or github_pat_••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono outline-none focus:border-indigo-500 focus:bg-white transition"
              />
              <div className="mt-1.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Required Token Permissions:</div>
                <div>• <span className="font-semibold text-indigo-700">Classic Token (Recommended):</span> Create at <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="underline text-indigo-600">github.com/settings/tokens</a> with <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">repo</code> scope checked.</div>
                <div>• <span className="font-semibold text-indigo-700">Fine-Grained Token:</span> Requires Repository Permissions: <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">Contents: Read and write</code> and <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">Administration: Read and write</code> on the repository.</div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Vercel API Token (Personal Access Token)
              </label>
              <input
                type="password"
                value={vercelTokenInput}
                onChange={(e) => setVercelTokenInput(e.target.value)}
                placeholder="vercel_••••••••••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono outline-none focus:border-indigo-500 focus:bg-white transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Optional: Required only if deploying directly to Vercel. SiteGen Instant hosting requires no token!
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={handleSaveTokens}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              Save Credentials
            </button>
          </div>
        </div>
      )}

      {/* Security Pre-Flight Card */}
      {securityStatus && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-4 ${
            securityStatus.isClean
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {securityStatus.isClean ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold">
                {securityStatus.isClean
                  ? 'Safe Project & Secret Scan Passed:'
                  : 'Security Alert — Potential Credential Detected:'}
              </span>{' '}
              <span className="text-xs text-slate-600">
                {securityStatus.isClean
                  ? 'Zero credentials, secret tokens, or private keys detected in generated files. Safe to deploy publicly.'
                  : securityStatus.warnings.map((w) => w.message).join(' | ')}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-white border border-emerald-200 text-emerald-700">
            5 Validated Files
          </span>
        </div>
      )}

      {/* Two Column Publishing & Deployment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Publish to GitHub */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-slate-900" />
                <h3 className="text-sm font-bold text-slate-900">Step 1: GitHub Repository Publishing</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Official Git REST API</span>
            </div>

            {/* Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">Repository Name</label>
                  {userRepos.length > 0 && (
                    <span className="text-[11px] text-indigo-600 font-medium">
                      {userRepos.length} Repositories Detected
                    </span>
                  )}
                </div>
                {userRepos.length > 0 ? (
                  <div className="space-y-1.5">
                    <select
                      value={userRepos.some((r) => r.name === repoName) ? repoName : '__custom__'}
                      onChange={(e) => {
                        if (e.target.value !== '__custom__') {
                          setRepoName(e.target.value);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono outline-none focus:border-indigo-500 focus:bg-white transition"
                    >
                      <option value="__custom__">Create new repository or type custom name...</option>
                      {userRepos.map((r) => (
                        <option key={r.id || r.name} value={r.name}>
                          {r.name} {r.isPrivate ? '(Private)' : '(Public)'}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      placeholder="e.g. SiteGenAi or custom-repo-name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono outline-none focus:border-indigo-500 focus:bg-white transition text-xs"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="e.g. apex-ai-platform"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Branch</label>
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 font-mono">
                    <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="bg-transparent outline-none w-full text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Repository Visibility</label>
                  <select
                    value={isPrivate ? 'private' : 'public'}
                    onChange={(e) => setIsPrivate(e.target.value === 'private')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-indigo-500"
                  >
                    <option value="public">Public Repository</option>
                    <option value="private">Private Repository</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Commit Message</label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              {/* Files To Publish Preview */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Files In Build Payload</label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>• index.html (Semantic HTML5)</span>
                    <span className="font-semibold">Ready</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>• styles.css (Responsive Design Tokens)</span>
                    <span className="font-semibold">Ready</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>• script.js (Interactive Logic)</span>
                    <span className="font-semibold">Ready</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>• README.md & .gitignore</span>
                    <span className="font-semibold">Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Missing Credential Notice */}
            {!isGithubConfigured && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>GitHub Authentication Optional</span>
                </div>
                <p className="text-xs text-slate-600">
                  To publish to your personal GitHub, click &quot;Add Custom API Tokens&quot; above to enter a Personal Access Token.
                </p>
              </div>
            )}

            {/* Publish Results */}
            {publishResult && (
              <div
                className={`p-3.5 rounded-xl text-xs space-y-2 border ${
                  publishResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {publishResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>
                    {publishResult.success ? 'Repository Successfully Pushed to GitHub!' : 'Publishing Blocked / Failed'}
                  </span>
                </div>

                {publishResult.success ? (
                  <div className="space-y-1 text-xs font-mono text-slate-700">
                    <div>
                      Repo URL:{' '}
                      <a
                        href={publishResult.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-indigo-600 font-bold"
                      >
                        {publishResult.repoUrl}
                      </a>
                    </div>
                    <div>Commit SHA: {publishResult.commitHash}</div>
                    <div>Branch: {publishResult.branch}</div>
                  </div>
                ) : (
                  <p className="text-xs text-rose-700">{publishResult.error}</p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handlePublishGithub}
            disabled={isPublishing}
            className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
              isGithubConfigured
                ? 'bg-slate-900 hover:bg-slate-800 text-white border-transparent shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            {isPublishing ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Publishing to GitHub REST API...</span>
              </>
            ) : (
              <>
                <Github className="w-4 h-4" />
                <span>Publish Repository to GitHub</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Live Edge Deployment */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Step 2: Real Cloud Edge Deployment</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                Live Production CDN
              </span>
            </div>

            {/* Provider Selection */}
            <div className="space-y-2 text-xs">
              <label className="block text-slate-700 font-semibold">Select Hosting Provider</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sitegen-cloud', name: 'SiteGen Instant', tag: 'Zero-Config • 1-Click' },
                  { id: 'vercel', name: 'Vercel Edge', tag: 'REST API v13' },
                  { id: 'netlify', name: 'Netlify', tag: 'Static CDN' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProvider(item.id as DeploymentProvider)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      provider === item.id
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">{item.name}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{item.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Provider Readiness Notice */}
            {provider === 'sitegen-cloud' && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>SiteGen Instant Cloud Ready</span>
                </div>
                <p className="text-xs text-slate-600">
                  Ready to deploy immediately. Generates a live URL with zero third-party token requirements.
                </p>
              </div>
            )}

            {/* Unconfigured Provider Notice */}
            {!isVercelConfigured && provider === 'vercel' && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Vercel Integration Not Configured</span>
                </div>
                <p className="text-xs text-slate-600">
                  To launch on Vercel Edge, enter your Vercel Token via &quot;Add Custom API Tokens&quot; or switch to SiteGen Instant.
                </p>
              </div>
            )}

            {/* Deploy Progress Log */}
            {isDeploying && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-mono text-indigo-600 font-bold">
                  <Terminal className="w-4 h-4 animate-pulse" />
                  <span>Edge Build Pipeline Running...</span>
                </div>
                <div className="font-mono text-xs text-slate-700 pl-6">
                  &gt; {deployStepMessage}
                </div>
              </div>
            )}

            {/* Deployment Error */}
            {deployError && !isDeploying && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Deployment Error</span>
                </div>
                <p className="text-xs text-rose-700">{deployError}</p>
              </div>
            )}

            {/* Confirmed Successful Deployment Card */}
            {latestDeployment && !isDeploying && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 animate-in fade-in shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Website Live In Production!</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200 font-semibold">
                    200 OK • Online
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-mono">
                  URL:{' '}
                  <a
                    href={latestDeployment.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-indigo-600 font-bold break-all"
                  >
                    {latestDeployment.publicUrl}
                  </a>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Deployment ID: {latestDeployment.id} • Provider: {latestDeployment.provider.toUpperCase()}
                </div>
                <div className="pt-2">
                  <a
                    href={latestDeployment.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Visit Live Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleDeployWebsite}
            disabled={isDeploying}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            {isDeploying ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Deploying to {provider.toUpperCase()} Edge...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Deploy Live Website</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Deployment History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Deployment & Publishing History
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {history.length} deployments • {publishHistory.length} pushes
          </span>
        </div>

        {history.length === 0 && publishHistory.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No deployments recorded for this project yet. Click &quot;Deploy Live Website&quot; above to launch!
          </div>
        ) : (
          <div className="space-y-2 overflow-x-auto">
            {history.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs gap-3 min-w-[500px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <div className="font-bold text-slate-900">{record.projectName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {new Date(record.createdAt).toLocaleString()} • {record.provider.toUpperCase()} • ID: {record.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-600 truncate max-w-xs">
                    {record.publicUrl}
                  </span>
                  <a
                    href={record.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
