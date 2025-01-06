export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  source: string;
  project: string;
  lastModified: string;
  author: string;
}

export interface ConfluenceResponse {
  results: SearchResult[];
  total: number;
}

interface ConfluenceVersion {
  by: {
    displayName: string;
  };
  when: string;
}

interface ConfluenceSpace {
  name: string;
}

interface ConfluenceLinks {
  webui: string;
}

export interface ConfluenceSearchResult {
  id: string;
  title: string;
  excerpt: string;
  _links: ConfluenceLinks;
  space: ConfluenceSpace;
  version: ConfluenceVersion;
}

export interface ConfluenceAPIResponse {
  results: ConfluenceSearchResult[];
  size: number;
}
