import { stringify } from 'querystring';

interface RequestParams {
  url: string;
  queryParams?: Record<string, string>;
  body?: object;
}

export function GET<T>(params: RequestParams) {
  return _fetch<T>(params.url, params.queryParams);
};

export function POST<T>(params: RequestParams) {
  var fetchParams: RequestInit = {
    method: 'POST',
    body: JSON.stringify(params.body),
  };
  return _fetch<T>(params.url, params.queryParams, fetchParams);
};

export function PUT<T>(params: RequestParams) {
  var fetchParams: RequestInit = {
    method: 'PUT',
    body: JSON.stringify(params.body),
  };
  return _fetch<T>(params.url, params.queryParams, fetchParams);
};

function _fetch<T>(url: string, queryParams?: object, fetchParams?: RequestInit): Promise<T> {
  if (fetchParams) {
    fetchParams.headers = {
      ...fetchParams.headers,
      'Content-Type': 'application/json',
    };
  }

  fetchParams = {
    ...(fetchParams || {}),
    headers: {
      ...((fetchParams && fetchParams.headers) || {}),
      ...(_getAuthObject()),
    }
  };

  return fetch(_getFullUrl(url, queryParams), fetchParams)
    .then(res => {
      // debugger;
      return res.json();
    })
    .then(res => {
      // debugger;
      if (res.error) {
        throw (res.error);
      }
      if (res.status && (res.status !== 200 || res.status !== 201)) {
        throw (res.title);
      }
      return res as T;
    })
    .catch(error => {
      // debugger;
      throw (error.toString());
    });
}

function _getFullUrl(url: string, queryParams?: object): string {
  return 'http://localhost:5000' + url + (queryParams ? ('?' + stringify(queryParams)) : '');
}

function _getAuthObject(): Record<string, string> {
  var authToken = localStorage.getItem('auth:token');
  if (!authToken) {
    return {};
  }

  return { 'Authorization': 'bearer ' + authToken };
}
