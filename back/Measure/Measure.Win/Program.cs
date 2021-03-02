using System;
using System.Globalization;
using System.Management;
using LibreHardwareMonitor.Hardware;
using Measure.Common;

namespace Measure.Win
{
	public class Program
	{
		private static readonly NumberFormatInfo numberFormat = new CultureInfo("en-US").NumberFormat;

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
			else if(command == "model")
				OutputComputerModel();
			else if(command == "power")
				OutputComputerPower();
			else Helper.OutputUnknownCommand();
		}

		private static void OutputComputerModel()
		{
			ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT Manufacturer,Model FROM Win32_ComputerSystem");
			foreach(ManagementObject mo in searcher.Get())
			{
				foreach(PropertyData property in mo.Properties)
					Console.WriteLine(property.Value);
			}
		}

		private static void OutputComputerPower()
		{
			Computer computer = new Computer
			{
				IsCpuEnabled = true,
				IsGpuEnabled = true,
			};

			float energy = 0;

			computer.Open();
			computer.Accept(new UpdateVisitor());

			foreach(IHardware hardware in computer.Hardware)
			{
				foreach(ISensor sensor in hardware.Sensors)
				{
					if(sensor.SensorType == SensorType.Power)
						energy += sensor.Value.Value;
				}
			}

			Console.WriteLine(energy.ToString(numberFormat));

			computer.Close();
		}
	}
}
