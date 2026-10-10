import { env } from '../config/env.js';

// Patterns to detect accidental secret leakage in source files
const SENSITIVE_PATTERNS = [
  /AIza[0-9A-Za-z-_]{35}/i,                     // Google API Key
  /sk-[a-zA-Z0-9]{20,}/i,                       // OpenAI Secret Key
  /ghp_[a-zA-Z0-9]{36}/i,                       // GitHub Personal Access Token
  /github_pat_[a-zA-Z0-9_]{40,}/i,              // GitHub Fine-Grained PAT
  /mongodb(?:\+srv)?:\/\/[^\s"']+/i,            // MongoDB URI with credentials
  /vercel_[a-zA-Z0-9_]{20,}/i,                  // Vercel token pattern
  /-----BEGIN (?:RSA|OPENSSH|PRIVATE) KEY-----/i, // SSH / RSA private keys
  /aws[_-]?key[_-]?(?:id|secret)?\s*[:=]\s*['"][a-zA-Z0-9/+=]{16,}['"]/i,
];

// Blocked paths that must never be pushed to a repository
const BLOCKED_PATHS = [
  /^\.env(\..+)?$/i,
  /^node_modules\//i,
  /^dist\//i,
  /^\.git\//i,
  /^\.vscode\//i,
  /\.pem$/i,
  /\.key$/i,
  /\.pfx$/i,
  /\.cert$/i,
];

/**
 * Scan project files for credentials or private assets before publishing
 */
export function scanFilesForSecrets(files) {
  const warnings = [];

  for (const [filePath, content] of Object.entries(files)) {
    // Check if filename is blocked
    for (const pattern of BLOCKED_PATHS) {
      if (pattern.test(filePath)) {
        warnings.push({
          file: filePath,
          type: 'BLOCKED_PATH',
          message: `File path '${filePath}' matches prohibited file rules (.env, node_modules, private keys).`,
        });
      }
    }

    if (typeof content === 'string') {
      for (const pattern of SENSITIVE_PATTERNS) {
        if (pattern.test(content)) {
          warnings.push({
            file: filePath,
            type: 'SECRET_DETECTED',
            message: `Potential credential or API key token signature detected in file '${filePath}'.`,
          });
          break;
        }
      }
    }
  }

  return {
    isClean: warnings.length === 0,
    warnings,
  };
}

/**
 * Sanitize file map, discarding any accidental prohibited files (.env, credentials)
 */
export function sanitizePublishFiles(files) {
  const sanitized = {};

  for (const [filePath, content] of Object.entries(files)) {
    let isBlocked = false;
    for (const pattern of BLOCKED_PATHS) {
      if (pattern.test(filePath)) {
        isBlocked = true;
        break;
      }
    }

    // Must be a safe relative path without directory traversal (..)
    if (filePath.includes('..') || filePath.startsWith('/') || filePath.startsWith('\\')) {
      isBlocked = true;
    }

    if (!isBlocked && typeof content === 'string') {
      sanitized[filePath] = content;
    }
  }

  // Ensure standard .gitignore is always present in published repos
  if (!sanitized['.gitignore']) {
    sanitized['.gitignore'] = `node_modules/
.env
.env.local
dist/
build/
.DS_Store
npm-debug.log*
`;
  }

  return sanitized;
}

export const githubService = {
  /**
   * Check connection status of GitHub integration
   */
  getStatus() {
    const hasToken = Boolean(env.GITHUB_TOKEN && env.GITHUB_TOKEN.trim().length > 0);
    const hasOAuth = Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);
    return {
      connected: hasToken || hasOAuth,
      authMethod: hasToken ? 'personal_access_token' : hasOAuth ? 'oauth_app' : 'unconfigured',
      configured: hasToken || hasOAuth,
    };
  },

  /**
   * Fetch authenticated GitHub user details
   */
  async getAuthenticatedUser(customToken) {
    const token = customToken || env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GitHub token is not configured. Please supply a valid Personal Access Token or configure GITHUB_TOKEN on the server.');
    }

    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SiteGen-AI-Publisher/3.0',
      },
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `GitHub authentication failed with status ${res.status}`);
    }

    return await res.json();
  },

  /**
   * List accessible repositories for authenticated user
   */
  async listUserRepositories(customToken) {
    const token = customToken || env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GitHub token is not configured. Please supply a token or configure server environment.');
    }

    const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=30&type=all', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SiteGen-AI-Publisher/3.0',
      },
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Failed to fetch GitHub repositories (${res.status})`);
    }

    const repos = await res.json();
    return repos.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      htmlUrl: r.html_url,
      defaultBranch: r.default_branch || 'main',
      isPrivate: r.private,
      owner: r.owner.login,
      updatedAt: r.updated_at,
    }));
  },

  /**
   * Publish source files to a GitHub repository using official REST API commits
   */
  async publishRepository({
    repoName,
    isNewRepo = true,
    branch = 'main',
    commitMessage = 'feat: website generated and published with SiteGen AI',
    files,
    isPrivate = false,
    customToken,
  }) {
    const token = customToken || env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GitHub token is not configured. Please supply a GitHub Personal Access Token or configure GITHUB_TOKEN.');
    }

    // 1. Sanitize & Scan files for security
    const sanitizedFiles = sanitizePublishFiles(files);
    const secretScan = scanFilesForSecrets(sanitizedFiles);
    if (!secretScan.isClean) {
      const issues = secretScan.warnings.map((w) => `${w.file}: ${w.message}`).join('; ');
      throw new Error(`Security validation blocked publish operation: ${issues}`);
    }

    // 2. Validate repo name
    const validRepoName = repoName.trim().replace(/[^a-zA-Z0-9._-]/g, '-');
    if (!validRepoName) {
      throw new Error('Invalid repository name provided.');
    }

    const user = await this.getAuthenticatedUser(token);
    const owner = user.login;
    let repoUrl = `https://github.com/${owner}/${validRepoName}`;

    // 3. Create repository if isNewRepo is requested
    if (isNewRepo) {
      const createRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'SiteGen-AI-Publisher/3.0',
        },
        body: JSON.stringify({
          name: validRepoName,
          description: 'Website generated with SiteGen AI',
          private: Boolean(isPrivate),
          auto_init: true, // Creates default commit so ref exists
        }),
      });

      if (createRes.status === 422) {
        // Repo already exists; proceed to commit on existing repo
      } else if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        if (createRes.status === 403 && err.message && err.message.includes('Resource not accessible by personal access token')) {
          const isFineGrained = token.startsWith('github_pat_');
          const tokenTypeDesc = isFineGrained ? 'Fine-Grained Personal Access Token (github_pat_)' : 'Personal Access Token';
          throw new Error(
            `GitHub Permission Error: Your ${tokenTypeDesc} cannot create new repositories or write files. ` +
            (isFineGrained
              ? `To fix this: Either (1) create a Classic Personal Access Token at github.com/settings/tokens with the 'repo' scope checked (recommended & works instantly), OR (2) edit this fine-grained token at github.com/settings/tokens, grant Repository Permissions -> 'Contents' (Read and Write) and 'Administration' (Read and Write), or select an existing repository.`
              : `To fix this: Ensure your GitHub token has the 'repo' scope (Full control of private repositories) selected at github.com/settings/tokens.`)
          );
        }
        throw new Error(err.message || `Failed to create repository ${validRepoName} (${createRes.status})`);
      } else {
        const repoData = await createRes.json();
        repoUrl = repoData.html_url || repoUrl;
        // Small delay to allow GitHub repository initialization
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    // 4. Ensure branch exists or create from default branch ref
    let refSha = null;
    const refRes = await fetch(`https://api.github.com/repos/${owner}/${validRepoName}/git/ref/heads/${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SiteGen-AI-Publisher/3.0',
      },
    });

    if (refRes.ok) {
      const refData = await refRes.json();
      refSha = refData.object.sha;
    } else {
      // Branch doesn't exist yet, try to branch off default branch (main/master)
      const repoDetailsRes = await fetch(`https://api.github.com/repos/${owner}/${validRepoName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'SiteGen-AI-Publisher/3.0',
        },
      });

      if (repoDetailsRes.ok) {
        const repoInfo = await repoDetailsRes.json();
        const baseBranch = repoInfo.default_branch || 'main';
        const baseRefRes = await fetch(
          `https://api.github.com/repos/${owner}/${validRepoName}/git/ref/heads/${baseBranch}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3+json',
              'User-Agent': 'SiteGen-AI-Publisher/3.0',
            },
          }
        );

        if (baseRefRes.ok) {
          const baseRef = await baseRefRes.json();
          // Create the target branch ref
          const createRefRes = await fetch(
            `https://api.github.com/repos/${owner}/${validRepoName}/git/refs`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'SiteGen-AI-Publisher/3.0',
              },
              body: JSON.stringify({
                ref: `refs/heads/${branch}`,
                sha: baseRef.object.sha,
              }),
            }
          );
          if (createRefRes.ok) {
            const createdRef = await createRefRes.json();
            refSha = createdRef.object.sha;
          } else {
            refSha = baseRef.object.sha;
          }
        }
      }
    }

    // 5. Commit all files sequentially or via Contents API
    let latestCommitSha = refSha || 'commit-' + Date.now().toString(36);
    const fileEntries = Object.entries(sanitizedFiles);

    for (const [filePath, fileContent] of fileEntries) {
      // Check existing file SHA if updating
      let existingFileSha = null;
      try {
        const getFileRes = await fetch(
          `https://api.github.com/repos/${owner}/${validRepoName}/contents/${filePath}?ref=${branch}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3+json',
              'User-Agent': 'SiteGen-AI-Publisher/3.0',
            },
          }
        );
        if (getFileRes.ok) {
          const fileMeta = await getFileRes.json();
          existingFileSha = fileMeta.sha;
        }
      } catch {
        // file doesn't exist yet
      }

      const bodyPayload = {
        message: `${commitMessage} (${filePath})`,
        content: Buffer.from(fileContent, 'utf-8').toString('base64'),
        branch,
      };
      if (existingFileSha) {
        bodyPayload.sha = existingFileSha;
      }

      const putRes = await fetch(
        `https://api.github.com/repos/${owner}/${validRepoName}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'SiteGen-AI-Publisher/3.0',
          },
          body: JSON.stringify(bodyPayload),
        }
      );

      if (!putRes.ok) {
        const putErr = await putRes.json().catch(() => ({}));
        if (putRes.status === 403 && putErr.message && putErr.message.includes('Resource not accessible by personal access token')) {
          const isFineGrained = token.startsWith('github_pat_');
          throw new Error(
            `GitHub Permission Error: The personal access token does not have write access to repository contents. ` +
            (isFineGrained
              ? `Your fine-grained token needs "Repository permissions -> Contents: Read and write" on repository '${validRepoName}' (or select 'All repositories'). Or generate a Classic Personal Access Token with the 'repo' scope at github.com/settings/tokens.`
              : `Please ensure your token has the 'repo' scope checked at github.com/settings/tokens.`)
          );
        }
        throw new Error(`Failed to commit file ${filePath}: ${putErr.message || putRes.statusText}`);
      }

      const putData = await putRes.json();
      if (putData.commit && putData.commit.sha) {
        latestCommitSha = putData.commit.sha;
      }
    }

    return {
      success: true,
      repoName: validRepoName,
      repoUrl,
      branch,
      commitHash: latestCommitSha,
      filesCommitted: fileEntries.length,
      publishedAt: new Date().toISOString(),
      owner,
      isSimulated: false,
    };
  },
};
