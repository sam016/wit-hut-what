using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Org.ERM.WebApi.Tests.Extensions
{
    public static class HttpResponseMessageExtensions
    {
        /// <summary>
        /// Attempts to retrieve a strongly-typed value from a <paramref name="response"/>.
        /// </summary>
        /// <remarks>
        /// If <see cref="HttpResponseMessage.Content"/> is an instance of <see cref="ObjectContent"/>
        /// attempts to retrieve the <see cref="ObjectContent.Value"/> if it is compatible with <typeparamref name="T"/>.
        /// If it is it returns <c>true</c> and sets <paramref name="value"/>. If not it returns <c>false</c> and
        /// sets <paramref name="value"/> to the default instance of <typeparamref name="T"/>.
        /// </remarks>
        /// <typeparam name="T">The type of the value to retrieve.</typeparam>
        /// <param name="response">The response.</param>
        /// <param name="value">Will contain the retrieved value if this method succeeds.</param>
        /// <returns>Returns <c>true</c> if the response has a content with a value that can be cast to <typeparamref name="T"/>,
        /// <c>false</c> otherwise.</returns>
        public async static Task<T> GetValueAsync<T>(this HttpResponseMessage response)
        {
            if (response == null)
            {
                throw new ArgumentNullException(nameof(response));
            }

            if (response.Content is ObjectContent)
            {
                ObjectContent content = response.Content as ObjectContent;
                if (content != null)
                {
                    if (content.Value is T)
                    {
                        return (T)content.Value;
                    }
                }
            }
            else if (response.Content is StreamContent)
            {
                return await response.Content.ReadAsAsync<T>();
                //var ob = await response.Content.ReadAsAsync<Newtonsoft.Json.Linq.JObject>();

                //return ob.ToObject<T>();
            }

            return default(T);
        }

        /// <summary>
        /// Attaches the given <paramref name="request"/> to the <paramref name="response"/> if the response does not already
        /// have a pointer to a request.
        /// </summary>
        /// <param name="response">The response.</param>
        /// <param name="request">The request.</param>
        internal static void EnsureResponseHasRequest(this HttpResponseMessage response, HttpRequestMessage request)
        {
            if (response != null && response.RequestMessage == null)
            {
                response.RequestMessage = request;
            }
        }
    }
}
