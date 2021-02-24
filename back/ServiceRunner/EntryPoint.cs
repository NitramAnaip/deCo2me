using System.ServiceProcess;

namespace ServiceRunner
{
	public static class EntryPoint
	{
		public static void Main(string[] args)
		{
			ServiceBase.Run(new Service());
		}
	}
}
