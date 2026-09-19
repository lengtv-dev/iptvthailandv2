import { ChannelItem } from '../types';

export function parseM3U(content: string): ChannelItem[] {
  const lines = content.split(/\r?\n/);
  const channels: ChannelItem[] = [];
  let currentTitle = '';
  let currentLogo = '';
  let currentGroup = '';
  let currentRemoteTv = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      // Parse tvg attributes
      const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
      currentLogo = logoMatch ? logoMatch[1] : '';

      const groupMatch = line.match(/group-title="([^"]+)"/i);
      currentGroup = groupMatch ? groupMatch[1] : '';

      const chNoMatch = line.match(/tvg-chno="([^"]+)"/i) || line.match(/tvg-id="(\d+)"/i);
      currentRemoteTv = chNoMatch ? chNoMatch[1] : '';

      // Title is after the last comma
      const commaIndex = line.lastIndexOf(',');
      if (commaIndex !== -1) {
        currentTitle = line.substring(commaIndex + 1).trim();
      } else {
        currentTitle = 'Channel ' + (channels.length + 1);
      }
    } else if (!line.startsWith('#')) {
      // It's a stream URL
      const streamUrl = line;
      if (streamUrl.startsWith('http://') || streamUrl.startsWith('https://')) {
        const id = `custom-${Date.now()}-${channels.length}`;
        channels.push({
          id,
          cid: id,
          tid: id,
          title: currentTitle || `Channel ${channels.length + 1}`,
          remotetv: currentRemoteTv || String(channels.length + 1),
          logo: currentLogo || '',
          favorite: false,
          category: currentGroup || 'livethai',
          streamUrl,
          custom: true
        });
      }
      // Reset for next
      currentTitle = '';
      currentLogo = '';
      currentGroup = '';
      currentRemoteTv = '';
    }
  }

  return channels;
}

export function parseW3U(content: string): ChannelItem[] {
  const channels: ChannelItem[] = [];
  try {
    const parsed = JSON.parse(content);
    // W3U can have 'stations' or 'groups'
    const items = parsed.stations || (parsed.groups ? parsed.groups.flatMap((g: any) => g.stations || []) : []);
    items.forEach((item: any, idx: number) => {
      const url = item.url || item.link;
      if (url) {
        const id = `w3u-${Date.now()}-${idx}`;
        channels.push({
          id,
          cid: id,
          tid: id,
          title: item.name || `Channel ${idx + 1}`,
          remotetv: item.epgId || item.number || String(idx + 1),
          logo: item.image || item.logo || '',
          favorite: false,
          category: item.group || 'livethai',
          streamUrl: url,
          custom: true
        });
      }
    });
  } catch (err) {
    console.error('Failed to parse W3U JSON', err);
  }
  return channels;
}

export function parseJSONPlaylist(content: string): ChannelItem[] {
  try {
    const parsed = JSON.parse(content);
    // If it's the okwin321 format with `data`
    if (parsed.data && Array.isArray(parsed.data)) {
      const channels: ChannelItem[] = [];
      parsed.data.forEach((entry: any) => {
        if (entry.data && Array.isArray(entry.data)) {
          entry.data.forEach((item: any) => {
            channels.push({
              id: item.id || item.cid,
              cid: item.cid,
              tid: entry.tid,
              title: item.title,
              remotetv: item.remotetv || '',
              logo: item.logo || '',
              favorite: item.favorite || false,
              category: 'livethai',
              streamUrl: `https://s.okwin321.ai/ngz168/${item.cid}/playlist.m3u8`,
              custom: true
            });
          });
        }
      });
      return channels;
    }

    // If it's a generic array of items
    const list = Array.isArray(parsed) ? parsed : (parsed.channels || parsed.items || []);
    return list.map((item: any, idx: number) => {
      const id = item.id || item.cid || `json-${Date.now()}-${idx}`;
      return {
        id: String(id),
        cid: String(item.cid || id),
        tid: String(item.tid || id),
        title: item.title || item.name || `Channel ${idx + 1}`,
        remotetv: String(item.remotetv || item.number || idx + 1),
        logo: item.logo || item.image || '',
        favorite: false,
        category: item.category || 'livethai',
        streamUrl: item.streamUrl || item.url || item.link || '',
        custom: true
      };
    }).filter((c: ChannelItem) => !!c.streamUrl);
  } catch (err) {
    console.error('Failed to parse generic JSON playlist', err);
    return [];
  }
}

export function parseTXT(content: string): ChannelItem[] {
  const lines = content.split(/\r?\n/);
  const channels: ChannelItem[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    // Check for "Title, URL" or "Title#URL" or "Title=URL"
    let title = '';
    let url = '';

    if (trimmed.includes(',')) {
      const parts = trimmed.split(',');
      title = parts[0].trim();
      url = parts.slice(1).join(',').trim();
    } else if (trimmed.includes('#')) {
      const parts = trimmed.split('#');
      title = parts[0].trim();
      url = parts.slice(1).join('#').trim();
    } else if (trimmed.includes('=')) {
      const parts = trimmed.split('=');
      title = parts[0].trim();
      url = parts.slice(1).join('=').trim();
    } else if (trimmed.startsWith('http')) {
      title = `Channel ${idx + 1}`;
      url = trimmed;
    }

    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      const id = `txt-${Date.now()}-${idx}`;
      channels.push({
        id,
        cid: id,
        tid: id,
        title: title || `Channel ${idx + 1}`,
        remotetv: String(channels.length + 1),
        logo: '',
        favorite: false,
        category: 'livethai',
        streamUrl: url,
        custom: true
      });
    }
  });

  return channels;
}

export function parseAnyPlaylist(content: string, filename?: string): ChannelItem[] {
  const trimmed = content.trim();

  // Try JSON first if starts with { or [
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    // Check if W3U format
    if (trimmed.includes('"stations"') || trimmed.includes('"groups"')) {
      const w3u = parseW3U(trimmed);
      if (w3u.length > 0) return w3u;
    }
    const json = parseJSONPlaylist(trimmed);
    if (json.length > 0) return json;
  }

  // Check if M3U
  if (trimmed.includes('#EXTM3U') || trimmed.includes('#EXTINF')) {
    return parseM3U(trimmed);
  }

  // Fallback to TXT
  return parseTXT(trimmed);
}
