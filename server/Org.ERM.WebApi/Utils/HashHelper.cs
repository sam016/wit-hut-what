
// TODO: Implement the hashing for better security

namespace Org.ERM.WebApi.Utils
{
    public static class HashHelper
    {
        public static string HashPassword(string data)
        {
            return data;
        }

        public static bool AreSameHashes(string hash1, string hash2)
        {
            return hash1 == hash2;
        }
    }

}
