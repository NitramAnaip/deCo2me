using System;
using System.Net.NetworkInformation;

namespace Measure.Common
{
	public static class Helper
	{
		public static string GetCommand(string[] args)
		{
			if(args.Length > 0)
				return args[0].ToLower();
			else
			{
				Console.WriteLine("Usage: Measure <command>");
				return "";
			}
		}

		public static void OutputComputerName()
		{
			Console.WriteLine(Environment.MachineName);
		}

		public static void OutputNetInterfaces()
		{
			foreach(NetworkInterface net in NetworkInterface.GetAllNetworkInterfaces())
			{
				IPInterfaceStatistics netStat = net.GetIPStatistics();
				Console.WriteLine($"{net.Name} - {net.NetworkInterfaceType} - {netStat.BytesSent} - {netStat.BytesReceived}");
			}
		}

		public static void OutputNetworkWiredUpDown()
		{
			long up = 0;
			long down = 0;

			foreach(NetworkInterface net in NetworkInterface.GetAllNetworkInterfaces())
			{
				if(net.NetworkInterfaceType != NetworkInterfaceType.Wireless80211)
				{
					IPInterfaceStatistics netStat = net.GetIPStatistics();

					up += netStat.BytesSent;
					down += netStat.BytesReceived;
				}
			}

			Console.WriteLine(up);
			Console.WriteLine(down);
		}

		public static void OutputNetworkWirelessUpDown()
		{
			long up = 0;
			long down = 0;

			foreach(NetworkInterface net in NetworkInterface.GetAllNetworkInterfaces())
			{
				if(net.NetworkInterfaceType == NetworkInterfaceType.Wireless80211)
				{
					IPInterfaceStatistics netStat = net.GetIPStatistics();

					up += netStat.BytesSent;
					down += netStat.BytesReceived;
				}
			}

			Console.WriteLine(up);
			Console.WriteLine(down);
		}

		public static void OutputUnknownCommand()
		{
			Console.WriteLine("Unknown command");
		}
	}
}
