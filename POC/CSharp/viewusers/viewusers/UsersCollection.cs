using MongoDB.Driver;
using System.Collections.Generic;

namespace ViewUsers
{
  public class UsersCollection
  {
    public List<Users> users = new MongoClient("mongodb://localhost:3001/").GetDatabase("meteor").GetCollection<Users>("users").Find(_ => true).ToList();
  }
}