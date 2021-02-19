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
			else if(command == "netWired")
				Helper.OutputNetworkWiredUpDown();
			else if(command == "netWireless")
				Helper.OutputNetworkWirelessUpDown();
			else Helper.OutputUnknownCommand();
		}
	}
}
