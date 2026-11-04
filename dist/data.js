'use strict';
// Shared by the public directory and the owner draft editor.
// GitHub is the source of truth; no credentials are needed for the public list.
window.DirectoryData = (() => {
  const valid = data => Array.isArray(data) && data.every(p => p && typeof p.Company === 'string' && typeof p.Category === 'string' && Object.values(p).every(v => typeof v === 'string' || typeof v === 'number'));
  async function readJSON(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url, {cache:'no-cache',signal:controller.signal});
      if (!response.ok) throw new Error('Directory request failed');
      return await response.json();
    } finally {clearTimeout(timer);}
  }
  async function load({requireLive=false}={}) {
    const settings = await readJSON('config.json');
    const repo = settings.githubRepository || '';
    const remote = /^[\w.-]+\/[\w.-]+$/.test(repo) ? `https://raw.githubusercontent.com/${repo}/${encodeURIComponent(settings.githubBranch || 'main')}/dist/providers_clean.json` : '';
    if (remote) {
      try {
        const data = await readJSON(remote);
        if (!valid(data)) throw new Error('Invalid live directory');
        return {data,settings,isLive:true};
      } catch (error) {if (requireLive) throw error;}
    }
    const data = await readJSON('providers_clean.json');
    if (!valid(data)) throw new Error('Invalid directory copy');
    return {data,settings,isLive:!remote};
  }
  return {load,valid};
})();
