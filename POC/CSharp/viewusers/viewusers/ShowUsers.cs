using Nancy;

namespace ViewUsers
{
  public class ShowUsers: NancyModule
  {
    public ShowUsers()
    {
      Get["/users"] = args =>
      {
        return Response.AsJson(new UsersCollection());
      };
    }
  }
}
