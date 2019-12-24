import querystring from 'querystring';

export {
  GET,
  POST,
  PUT,
  DELETE
};

// Implementation code where T is the returned data shape
function GET<T>(url: string, queryParams?: any): Promise<T> {
  const fullUrl = _buildUrl(url, queryParams);
  const requestOptions = {
    headers: Object.assign(_getAuthHeader, { 'Content-Type': 'application/json' }),
  };

  return _fetch<T>(fullUrl, requestOptions);
}

function POST<T>(url: string, body?: any, queryParams?: any): Promise<T> {
  const fullUrl = _buildUrl(url, queryParams);
  const requestOptions = {
    method: 'POST',
    headers: Object.assign(_getAuthHeader, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body || ''),
  };

  return _fetch<T>(fullUrl, requestOptions);
}

function PUT<T>(url: string, body?: any, queryParams?: any): Promise<T> {
  const fullUrl = _buildUrl(url, queryParams);
  const requestOptions = {
    method: 'PUT',
    headers: Object.assign(_getAuthHeader, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body || ''),
  };

  return _fetch<T>(fullUrl, requestOptions);
}

function DELETE<T>(url: string, queryParams?: any): Promise<T> {
  const fullUrl = _buildUrl(url, queryParams);
  const requestOptions = {
    method: 'DELETE',
    headers: Object.assign(_getAuthHeader, { 'Content-Type': 'application/json' }),
  };

  return _fetch<T>(fullUrl, requestOptions);
}



function _buildUrl(url: string, queryParams?: any): string {
  return url + ((queryParams && ('?' + querystring.stringify(queryParams))) || '');
}

function _fetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  return fetch(input, init)
    .then(_handleResponse) as Promise<T>;
}

function _handleResponse<T>(response: Response): Promise<T> {
  return response.json().then((json) => {
    if (!response.ok) {
      const error = (json && json.message) || response.statusText;
      throw new Error(error)
    }

    return json as T;
  });
}

function _getAuthHeader() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (user && user.token) {
    return { 'Authorization': 'Bearer ' + user.token }
  }

  return {};
}
