using System;
using System.Diagnostics;
using System.IO;
using System.ServiceProcess;

namespace ServiceRunner
{
	public class Service : ServiceBase
	{
		private const string ServiceFile = "WinService.cmd";
		private Process process;
		private bool stopped = false;

		public Service()
		{
			this.ServiceName = typeof(Service).Assembly.FullName;
			this.CanPauseAndContinue = false;
			this.CanStop = true;
			this.CanShutdown = false;
			this.CanHandlePowerEvent = false;
			this.CanHandleSessionChangeEvent = false;
		}

		protected override void OnStart(string[] args)
		{
			base.OnStart(args);

			Environment.CurrentDirectory = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);

			if(File.Exists(ServiceFile))
			{
				this.process = new Process();
				this.process.StartInfo.UseShellExecute = true;
				this.process.StartInfo.FileName = ServiceFile;
				this.process.StartInfo.WorkingDirectory = Environment.CurrentDirectory;
				this.process.Start();
				this.process.WaitForExitAsync().ContinueWith((t) => this.OnProcessExited());
			}
			else this.Stop();
		}

		protected override void OnStop()
		{
			this.stopped = true;

			if(this.process != null && !this.process.HasExited)
				this.process.Kill(true);

			base.OnStop();
		}

		private void OnProcessExited()
		{
			if(!this.stopped)
				this.Stop();
		}
	}
}
