import axios from "axios";
import { ConfluenceResponse, ConfluenceAPIResponse } from "../types/search";

const API_TOKEN = import.meta.env.VITE_CONFLUENCE_API_TOKEN;
const EMAIL =
  import.meta.env.VITE_CONFLUENCE_EMAIL || "toufic.hajj@cwpenergy.com";

export const searchConfluence = async (
  query: string
): Promise<ConfluenceResponse> => {
  if (!API_TOKEN) {
    throw new Error("CONFIGURATION_ERROR");
  }

  try {
    const base64Auth = btoa(`${EMAIL}:${API_TOKEN}`);
    const response = await axios.get(`/confluence-api/wiki/rest/api/search`, {
      headers: {
        Authorization: `Basic ${base64Auth}`,
        Accept: "application/json",
        "X-Atlassian-Token": "no-check",
      },
      params: {
        cql: `text ~ "${query}"`,
        limit: 10,
        expand:
          "content.space,content.version,content.metadata,content.body.view",
      },
    });

    const responseData = response.data as ConfluenceAPIResponse;
    if (!responseData || !Array.isArray(responseData.results)) {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("INVALID_RESPONSE");
    }

    return {
      results: responseData.results.map((item) => ({
        id: item.id || "unknown",
        title: item.title || "Untitled",
        excerpt: item.excerpt || "",
        url: item._links?.webui || "#",
        source: "Confluence",
        project: item.space?.name || "Unknown Space",
        lastModified: item.version?.when || new Date().toISOString(),
        author: item.version?.by?.displayName || "Unknown Author",
      })),
      total: responseData.size || 0,
    };
  } catch (error) {
    console.error("Error searching Confluence:", error);
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("CONNECTION_ERROR");
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error("Auth Error Details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
        });
        throw new Error("AUTHENTICATION_ERROR");
      }
    }
    throw error;
  }
};
