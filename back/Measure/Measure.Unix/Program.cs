using Measure.Common;

namespace Measure.Unix
{
	public class Program
	{
		public static void Main(string[] args)
		{
			string command = Helper.GetCommand(args);

			if(command == "name")
				Helper.OutputComputerName();
			else if(command == "netwired")
				Helper.OutputNetworkWiredUpDown();
			else if(command == "netwireless")
				Helper.OutputNetworkWirelessUpDown();
			else if(command == "neti")
				Helper.OutputNetInterfaces();
			else Helper.OutputUnknownCommand();
		}
	}
}
