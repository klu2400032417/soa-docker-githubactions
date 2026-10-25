const API_BASE_URL = '/DigitalMarketingCampaign';

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    throw new Error(
      'Unable to connect to the campaign service. Check that the backend is running and that VITE_BACKEND_URL is correct.',
      { cause: error },
    );
  }

  const responseText = await response.text();
  let responseBody = responseText;

  if (response.headers.get('content-type')?.includes('application/json') && responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }
  }

  if (!response.ok) {
    if (response.status === 500 && !responseText.trim()) {
      throw new Error(
        'Unable to connect to the campaign service. Check that the backend is running and that VITE_BACKEND_URL is correct.',
      );
    }

    const detail =
      typeof responseBody === 'string'
        ? responseBody
        : responseBody?.message || responseBody?.error;
    throw new Error(
      detail
        ? `Request failed (${response.status}): ${detail}`
        : `Request failed with status ${response.status}.`,
    );
  }

  return responseBody;
}

export const campaignApi = {
  checkConnection: () => request('/'),
  getAll: () => request('/displayall'),
  getById: (id) => request(`/get/${encodeURIComponent(id)}`),
  create: (campaign) =>
    request('/add', {
      method: 'POST',
      body: JSON.stringify(campaign),
    }),
  update: (id, campaign) =>
    request(`/update/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(campaign),
    }),
  remove: (id) =>
    request(`/delete/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};
