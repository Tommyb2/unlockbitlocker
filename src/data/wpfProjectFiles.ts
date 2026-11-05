export interface WpfFile {
  path: string;
  name: string;
  language: string;
  category: 'Configuration' | 'UI / XAML' | 'C# Code' | 'Service' | 'Build Scripts' | 'Documentation';
  content: string;
}

export const WPF_PROJECT_FILES: WpfFile[] = [
  {
    path: 'BitLockerAdminPro/BitLockerAdminPro.csproj',
    name: 'BitLockerAdminPro.csproj',
    language: 'xml',
    category: 'Configuration',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows10.0.19041.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UseWPF>true</UseWPF>
    <ApplicationManifest>app.manifest</ApplicationManifest>
    <AssemblyTitle>BitLocker Administrator Pro</AssemblyTitle>
    <AssemblyProduct>BitLocker Administrator Pro</AssemblyProduct>
    <AssemblyDescription>Windows Desktop Storage Security and BitLocker Management Suite</AssemblyDescription>
    <AssemblyVersion>1.0.0.0</AssemblyVersion>
    <FileVersion>1.0.0.0</FileVersion>
    
    <!-- Single file deployment configuration -->
    <PublishSingleFile>true</PublishSingleFile>
    <SelfContained>true</SelfContained>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <IncludeNativeLibrariesForSelfExtract>true</IncludeNativeLibrariesForSelfExtract>
    <EnableCompressionInSingleFile>true</EnableCompressionInSingleFile>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="System.Management" Version="8.0.0" />
  </ItemGroup>

</Project>`
  },
  {
    path: 'BitLockerAdminPro/app.manifest',
    name: 'app.manifest',
    language: 'xml',
    category: 'Configuration',
    content: `<?xml version="1.0" encoding="utf-8"?>
<assembly manifestVersion="1.0" xmlns="urn:schemas-microsoft-com:asm.v1">
  <assemblyIdentity version="1.0.0.0" name="BitLockerAdminPro.app"/>
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v2">
    <security>
      <requestedPrivileges xmlns="urn:schemas-microsoft-com:asm.v3">
        <!-- WAJIB: Jalankan aplikasi dengan hak akses Administrator Windows (UAC Elevation) -->
        <requestedExecutionLevel level="requireAdministrator" uiAccess="false" />
      </requestedPrivileges>
    </security>
  </trustInfo>

  <compatibility xmlns="urn:schemas-microsoft-com:compatibility.v1">
    <application>
      <!-- Windows 10 -->
      <supportedOS Id="{8e0f7a12-bfb3-4fe8-b9a5-48fd50a15a9a}" />
      <!-- Windows 11 -->
      <supportedOS Id="{8e0f7a12-bfb3-4fe8-b9a5-48fd50a15a9a}" />
    </application>
  </compatibility>

  <application xmlns="urn:schemas-microsoft-com:asm.v3">
    <windowsSettings>
      <dpiAware xmlns="http://schemas.microsoft.com/SMI/2005/WindowsSettings">true/pm</dpiAware>
      <dpiAwareness xmlns="http://schemas.microsoft.com/SMI/2016/WindowsSettings">PerMonitorV2</dpiAwareness>
    </windowsSettings>
  </application>
</assembly>`
  },
  {
    path: 'BitLockerAdminPro/App.xaml',
    name: 'App.xaml',
    language: 'xml',
    category: 'UI / XAML',
    content: `<Application x:Class="BitLockerAdminPro.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             StartupUri="MainWindow.xaml">
    <Application.Resources>
        <!-- Windows Dark Mode Theme Resources -->
        <SolidColorBrush x:Key="WindowBackground" Color="#0B0E14" />
        <SolidColorBrush x:Key="CardBackground" Color="#121824" />
        <SolidColorBrush x:Key="CardBorder" Color="#1F293D" />
        <SolidColorBrush x:Key="PrimaryBlue" Color="#2563EB" />
        <SolidColorBrush x:Key="PrimaryBlueHover" Color="#1D4ED8" />
        <SolidColorBrush x:Key="SuccessGreen" Color="#16A34A" />
        <SolidColorBrush x:Key="WarningRed" Color="#DC2626" />
        <SolidColorBrush x:Key="TextPrimary" Color="#F1F5F9" />
        <SolidColorBrush x:Key="TextSecondary" Color="#94A3B8" />
        
        <Style TargetType="Button">
            <Setter Property="Background" Value="{StaticResource PrimaryBlue}" />
            <Setter Property="Foreground" Value="White" />
            <Setter Property="FontWeight" Value="SemiBold" />
            <Setter Property="Padding" Value="14,8" />
            <Setter Property="BorderThickness" Value="0" />
            <Setter Property="Cursor" Value="Hand" />
        </Style>
    </Application.Resources>
</Application>`
  },
  {
    path: 'BitLockerAdminPro/App.xaml.cs',
    name: 'App.xaml.cs',
    language: 'csharp',
    category: 'C# Code',
    content: `using System.Security.Principal;
using System.Windows;

namespace BitLockerAdminPro
{
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // Verifikasi bahwa aplikasi berjalan dengan hak akses Administrator
            if (!IsAdministrator())
            {
                MessageBox.Show(
                    "BitLocker Administrator Pro memerlukan hak akses Administrator untuk mengelola BitLocker.\\n\\nSilakan klik kanan file .exe dan pilih 'Run as administrator'.",
                    "Akses Administrator Diperlukan",
                    MessageBoxButton.OK,
                    MessageBoxImage.Warning
                );
            }
        }

        private static bool IsAdministrator()
        {
            using var identity = WindowsIdentity.GetCurrent();
            var principal = new WindowsPrincipal(identity);
            return principal.IsInRole(WindowsBuiltInRole.Administrator);
        }
    }
}`
  },
  {
    path: 'BitLockerAdminPro/Models/DriveInfoModel.cs',
    name: 'DriveInfoModel.cs',
    language: 'csharp',
    category: 'C# Code',
    content: `using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace BitLockerAdminPro.Models
{
    public class DriveInfoModel : INotifyPropertyChanged
    {
        private string _letter = "";
        private string _volumeLabel = "";
        private string _deviceType = "";
        private long _totalBytes;
        private long _usedBytes;
        private string _bitLockerStatus = "";
        private string _lockStatus = "";
        private string _protectionStatus = "";
        private string _encryptionMethod = "";
        private double _decryptionPercent;
        private bool _isRemovable;

        public string Letter
        {
            get => _letter;
            set { _letter = value; OnPropertyChanged(); }
        }

        public string VolumeLabel
        {
            get => _volumeLabel;
            set { _volumeLabel = value; OnPropertyChanged(); }
        }

        public string DeviceType
        {
            get => _deviceType;
            set { _deviceType = value; OnPropertyChanged(); }
        }

        public long TotalBytes
        {
            get => _totalBytes;
            set { _totalBytes = value; OnPropertyChanged(); OnPropertyChanged(nameof(TotalSizeDisplay)); }
        }

        public long UsedBytes
        {
            get => _usedBytes;
            set { _usedBytes = value; OnPropertyChanged(); OnPropertyChanged(nameof(UsedSizeDisplay)); OnPropertyChanged(nameof(UsagePercentage)); }
        }

        public string BitLockerStatus
        {
            get => _bitLockerStatus;
            set { _bitLockerStatus = value; OnPropertyChanged(); }
        }

        public string LockStatus
        {
            get => _lockStatus;
            set { _lockStatus = value; OnPropertyChanged(); }
        }

        public string ProtectionStatus
        {
            get => _protectionStatus;
            set { _protectionStatus = value; OnPropertyChanged(); }
        }

        public string EncryptionMethod
        {
            get => _encryptionMethod;
            set { _encryptionMethod = value; OnPropertyChanged(); }
        }

        public double DecryptionPercent
        {
            get => _decryptionPercent;
            set { _decryptionPercent = value; OnPropertyChanged(); }
        }

        public bool IsRemovable
        {
            get => _isRemovable;
            set { _isRemovable = value; OnPropertyChanged(); }
        }

        public string TotalSizeDisplay => FormatBytes(TotalBytes);
        public string UsedSizeDisplay => FormatBytes(UsedBytes);
        public double UsagePercentage => TotalBytes > 0 ? ((double)UsedBytes / TotalBytes) * 100 : 0;

        private static string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len /= 1024;
            }
            return $"{len:0.#} {sizes[order]}";
        }

        public event PropertyChangedEventHandler? PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string? name = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }
}`
  },
  {
    path: 'BitLockerAdminPro/Services/BitLockerService.cs',
    name: 'BitLockerService.cs',
    language: 'csharp',
    category: 'Service',
    content: `using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using BitLockerAdminPro.Models;

namespace BitLockerAdminPro.Services
{
    public class BitLockerService
    {
        /// <summary>
        /// Mengambil daftar seluruh drive yang terhubung beserta status BitLocker menggunakan manage-bde.exe
        /// </summary>
        public async Task<List<DriveInfoModel>> GetAllDrivesAsync()
        {
            var list = new List<DriveInfoModel>();
            var driveInfos = DriveInfo.GetDrives();

            foreach (var d in driveInfos)
            {
                if (!d.IsReady && d.DriveType != DriveType.Removable) continue;

                var letter = d.Name.TrimEnd('\\\\');
                var model = new DriveInfoModel
                {
                    Letter = letter,
                    VolumeLabel = d.IsReady ? (string.IsNullOrEmpty(d.VolumeLabel) ? "Local Disk" : d.VolumeLabel) : "Removable Disk",
                    DeviceType = MapDeviceType(d.DriveType),
                    TotalBytes = d.IsReady ? d.TotalSize : 0,
                    UsedBytes = d.IsReady ? (d.TotalSize - d.AvailableFreeSpace) : 0,
                    IsRemovable = d.DriveType == DriveType.Removable,
                    BitLockerStatus = "Memeriksa...",
                    LockStatus = "Unknown",
                    ProtectionStatus = "Unknown",
                    EncryptionMethod = "None"
                };

                // Ambil status BitLocker spesifik drive dari manage-bde -status <drive>
                await PopulateBitLockerStatusAsync(model);
                list.Add(model);
            }

            return list;
        }

        private async Task PopulateBitLockerStatusAsync(DriveInfoModel model)
        {
            var (output, exitCode) = await ExecuteManageBdeAsync($"-status {model.Letter}");
            if (exitCode != 0 || string.IsNullOrEmpty(output))
            {
                model.BitLockerStatus = "Tidak Terenkripsi (Off)";
                model.ProtectionStatus = "Protection Off";
                return;
            }

            // Parsing output manage-bde
            var lockMatch = Regex.Match(output, @"Lock Status:\\s*(Locked|Unlocked)");
            if (lockMatch.Success) model.LockStatus = lockMatch.Groups[1].Value;

            var protMatch = Regex.Match(output, @"Protection Status:\\s*(Protection [A-Za-z]+)");
            if (protMatch.Success) model.ProtectionStatus = protMatch.Groups[1].Value;

            var methodMatch = Regex.Match(output, @"Encryption Method:\\s*([A-Za-z0-9\\-]+)");
            if (methodMatch.Success) model.EncryptionMethod = methodMatch.Groups[1].Value;

            var pctMatch = Regex.Match(output, @"Percentage Encrypted:\\s*([0-9\\.]+)%");
            double pct = pctMatch.Success ? double.Parse(pctMatch.Groups[1].Value) : 0;

            var convMatch = Regex.Match(output, @"Conversion Status:\\s*(.+)");
            string conv = convMatch.Success ? convMatch.Groups[1].Value.Trim() : "";

            if (conv.Contains("Decryption in Progress", StringComparison.OrdinalIgnoreCase))
            {
                model.BitLockerStatus = "Sedang Dekripsi";
                model.DecryptionPercent = 100 - pct;
            }
            else if (model.LockStatus == "Locked")
            {
                model.BitLockerStatus = "Terenkripsi (Terkunci)";
            }
            else if (model.ProtectionStatus == "Protection On")
            {
                model.BitLockerStatus = "Terenkripsi (Terbuka)";
            }
            else
            {
                model.BitLockerStatus = "Tidak Terenkripsi (Off)";
            }
        }

        /// <summary>
        /// Membuka kunci drive menggunakan Password: manage-bde -unlock E: -Password
        /// </summary>
        public async Task<(bool Success, string Message)> UnlockWithPasswordAsync(string driveLetter, string password)
        {
            var pinfo = new ProcessStartInfo
            {
                FileName = "manage-bde.exe",
                Arguments = $"-unlock {driveLetter} -Password",
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = new Process { StartInfo = pinfo };
            process.Start();

            // Kirim password ke stdin (aman dari logging command line Windows)
            await process.StandardInput.WriteLineAsync(password);
            await process.StandardInput.FlushAsync();

            string output = await process.StandardOutput.ReadToEndAsync();
            string error = await process.StandardError.ReadToEndAsync();
            await process.WaitForExitAsync();

            bool success = process.ExitCode == 0 && output.Contains("successfully unlocked", StringComparison.OrdinalIgnoreCase);
            return (success, success ? "Drive berhasil dibuka dengan Password." : (string.IsNullOrEmpty(error) ? output : error));
        }

        /// <summary>
        /// Membuka kunci drive menggunakan 48-digit Recovery Key: manage-bde -unlock E: -RecoveryPassword [KEY]
        /// </summary>
        public async Task<(bool Success, string Message)> UnlockWithRecoveryKeyAsync(string driveLetter, string recoveryKey)
        {
            var cleanKey = recoveryKey.Trim().Replace(" ", "");
            var (output, exitCode) = await ExecuteManageBdeAsync($"-unlock {driveLetter} -RecoveryPassword {cleanKey}");

            bool success = exitCode == 0 && output.Contains("successfully unlocked", StringComparison.OrdinalIgnoreCase);
            return (success, success ? "Drive berhasil dibuka dengan Recovery Key 48-digit." : output);
        }

        /// <summary>
        /// Menonaktifkan BitLocker dan memulai proses dekripsi: manage-bde -off E:
        /// </summary>
        public async Task<(bool Success, string Message)> DisableBitLockerAsync(string driveLetter)
        {
            var (output, exitCode) = await ExecuteManageBdeAsync($"-off {driveLetter}");
            bool success = exitCode == 0 || output.Contains("Decryption is now in progress", StringComparison.OrdinalIgnoreCase);
            return (success, output);
        }

        /// <summary>
        /// Menjeda proses dekripsi atau enkripsi: manage-bde -pause E:
        /// </summary>
        public async Task<(bool Success, string Message)> PauseBitLockerAsync(string driveLetter)
        {
            var (output, exitCode) = await ExecuteManageBdeAsync($"-pause {driveLetter}");
            return (exitCode == 0, output);
        }

        /// <summary>
        /// Melanjutkan proses dekripsi atau enkripsi: manage-bde -resume E:
        /// </summary>
        public async Task<(bool Success, string Message)> ResumeBitLockerAsync(string driveLetter)
        {
            var (output, exitCode) = await ExecuteManageBdeAsync($"-resume {driveLetter}");
            return (exitCode == 0, output);
        }

        private static async Task<(string Output, int ExitCode)> ExecuteManageBdeAsync(string arguments)
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "manage-bde.exe",
                    Arguments = arguments,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = new Process { StartInfo = psi };
                process.Start();

                string stdout = await process.StandardOutput.ReadToEndAsync();
                string stderr = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();

                return (string.IsNullOrWhiteSpace(stderr) ? stdout : $"{stdout}\\n{stderr}", process.ExitCode);
            }
            catch (Exception ex)
            {
                return ($"Error mengeksekusi manage-bde: {ex.Message}", -1);
            }
        }

        private static string MapDeviceType(DriveType type) => type switch
        {
            DriveType.Removable => "USB Flashdisk",
            DriveType.Fixed => "Drive Internal / Eksternal",
            _ => "Storage Device"
        };
    }
}`
  },
  {
    path: 'BitLockerAdminPro/MainWindow.xaml',
    name: 'MainWindow.xaml',
    language: 'xml',
    category: 'UI / XAML',
    content: `<Window x:Class="BitLockerAdminPro.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="BitLocker Administrator Pro [Administrator]"
        Height="780" Width="1200"
        WindowStartupLocation="CenterScreen"
        Background="{StaticResource WindowBackground}">
    <Grid>
        <Grid.RowDefinitions>
            <!-- Title Bar -->
            <RowDefinition Height="46" />
            <!-- Main Content Area -->
            <RowDefinition Height="*" />
            <!-- Status Bar -->
            <RowDefinition Height="32" />
        </Grid.RowDefinitions>

        <!-- Top Header Windows Title -->
        <Border Grid.Row="0" Background="#0F131C" BorderBrush="{StaticResource CardBorder}" BorderThickness="0,0,0,1">
            <DockPanel Margin="16,0">
                <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                    <TextBlock Text="🛡️" FontSize="18" Margin="0,0,10,0" />
                    <TextBlock Text="BitLocker Administrator Pro" Foreground="White" FontSize="15" FontWeight="Bold" VerticalAlignment="Center" />
                    <Border Background="#1E293B" CornerRadius="4" Padding="6,2" Margin="12,0,0,0">
                        <TextBlock Text="ADMINISTRATOR PRIVILEGES" Foreground="#38BDF8" FontSize="10" FontWeight="Bold" />
                    </Border>
                </StackPanel>
                <StackPanel Orientation="Horizontal" HorizontalAlignment="Right">
                    <Button Content="🔄 Refresh Drives" Click="BtnRefresh_Click" Margin="0,0,8,0" Background="#1E293B" />
                    <Button Content="➕ Deteksi USB" Click="BtnScanUsb_Click" Background="#2563EB" />
                </StackPanel>
            </DockPanel>
        </Border>

        <!-- Workspace Tabs -->
        <TabControl Grid.Row="1" Background="Transparent" BorderThickness="0" Margin="16">
            <TabItem Header="Daftar Perangkat Penyimpanan" Foreground="White" FontSize="13">
                <Grid Margin="0,16,0,0">
                    <Grid.ColumnDefinitions>
                        <ColumnDefinition Width="3*" />
                        <ColumnDefinition Width="2*" />
                    </Grid.ColumnDefinitions>

                    <!-- Drive List Table -->
                    <Border Grid.Column="0" Background="{StaticResource CardBackground}" BorderBrush="{StaticResource CardBorder}" BorderThickness="1" CornerRadius="8" Padding="12" Margin="0,0,12,0">
                        <ListView x:Name="ListViewDrives" SelectionChanged="ListViewDrives_SelectionChanged" Background="Transparent" BorderThickness="0" Foreground="White">
                            <ListView.View>
                                <GridView>
                                    <GridViewColumn Header="Drive" DisplayMemberBinding="{Binding Letter}" Width="60" />
                                    <GridViewColumn Header="Label Volume" DisplayMemberBinding="{Binding VolumeLabel}" Width="160" />
                                    <GridViewColumn Header="Tipe Perangkat" DisplayMemberBinding="{Binding DeviceType}" Width="130" />
                                    <GridViewColumn Header="Status BitLocker" DisplayMemberBinding="{Binding BitLockerStatus}" Width="170" />
                                    <GridViewColumn Header="Kapasitas" DisplayMemberBinding="{Binding TotalSizeDisplay}" Width="90" />
                                </GridView>
                            </ListView.View>
                        </ListView>
                    </Border>

                    <!-- BitLocker Control & Action Panel -->
                    <Border Grid.Column="1" Background="{StaticResource CardBackground}" BorderBrush="{StaticResource CardBorder}" BorderThickness="1" CornerRadius="8" Padding="16">
                        <StackPanel>
                            <TextBlock Text="Panel Kontrol BitLocker" Foreground="White" FontSize="16" FontWeight="Bold" Margin="0,0,0,16" />
                            
                            <!-- Drive Info Detail -->
                            <TextBlock x:Name="TxtSelectedDrive" Text="Pilih drive dari daftar untuk mengelola" Foreground="{StaticResource TextSecondary}" Margin="0,0,0,12" />
                            
                            <!-- Action Buttons -->
                            <Button x:Name="BtnUnlock" Content="🔓 Buka Kunci (Unlock Drive)" Click="BtnUnlock_Click" Margin="0,0,0,8" />
                            <Button x:Name="BtnDisable" Content="⛔ Matikan BitLocker (Dekripsi)" Click="BtnDisable_Click" Background="{StaticResource WarningRed}" Margin="0,0,0,8" />
                            <Button x:Name="BtnCheckStatus" Content="📋 manage-bde -status" Click="BtnCheckStatus_Click" Background="#1E293B" Margin="0,0,0,8" />
                            
                            <!-- Decryption Progress -->
                            <TextBlock Text="Progres Dekripsi Real-Time:" Foreground="{StaticResource TextSecondary}" Margin="0,12,0,4" />
                            <ProgressBar x:Name="ProgressDecryption" Height="14" Maximum="100" Value="0" Foreground="{StaticResource SuccessGreen}" Background="#0F131C" />
                            <TextBlock x:Name="TxtProgressPct" Text="0% Selesai" Foreground="{StaticResource TextSecondary}" HorizontalAlignment="Right" Margin="0,4,0,0" FontSize="11" />
                        </StackPanel>
                    </Border>
                </Grid>
            </TabItem>

            <!-- Console Log Tab -->
            <TabItem Header="PowerShell &amp; Activity Log" Foreground="White" FontSize="13">
                <Border Background="#090A0F" BorderBrush="{StaticResource CardBorder}" BorderThickness="1" CornerRadius="8" Padding="12" Margin="0,16,0,0">
                    <TextBox x:Name="TxtConsoleLog" Background="Transparent" Foreground="#38BDF8" FontFamily="Consolas" FontSize="12" IsReadOnly="True" TextWrapping="Wrap" VerticalScrollBarVisibility="Auto" />
                </Border>
            </TabItem>
        </TabControl>

        <!-- Status Bar -->
        <Border Grid.Row="2" Background="#0A0D14" BorderBrush="{StaticResource CardBorder}" BorderThickness="0,1,0,0" Padding="16,0">
            <DockPanel VerticalAlignment="Center">
                <TextBlock Text="BitLocker Administrator Pro v1.0.0 · Sistem: Windows 10/11 x64" Foreground="{StaticResource TextSecondary}" FontSize="11" />
                <TextBlock Text="Status: Siap" HorizontalAlignment="Right" Foreground="#4ADE80" FontSize="11" />
            </DockPanel>
        </Border>
    </Grid>
</Window>`
  },
  {
    path: 'BitLockerAdminPro/MainWindow.xaml.cs',
    name: 'MainWindow.xaml.cs',
    language: 'csharp',
    category: 'C# Code',
    content: `using System;
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;
using BitLockerAdminPro.Models;
using BitLockerAdminPro.Services;

namespace BitLockerAdminPro
{
    public partial class MainWindow : Window
    {
        private readonly BitLockerService _bitLockerService;
        private readonly ObservableCollection<DriveInfoModel> _drives;
        private readonly DispatcherTimer _timer;

        public MainWindow()
        {
            InitializeComponent();
            _bitLockerService = new BitLockerService();
            _drives = new ObservableCollection<DriveInfoModel>();
            ListViewDrives.ItemsSource = _drives;

            // Timer untuk auto refresh progres dekripsi setiap 5 detik
            _timer = new DispatcherTimer { Interval = TimeSpan.FromSeconds(5) };
            _timer.Tick += async (s, e) => await RefreshDrivesAsync();
            _timer.Start();

            Loaded += async (s, e) => await RefreshDrivesAsync();
        }

        private async System.Threading.Tasks.Task RefreshDrivesAsync()
        {
            try
            {
                var drives = await _bitLockerService.GetAllDrivesAsync();
                _drives.Clear();
                foreach (var d in drives)
                {
                    _drives.Add(d);
                }
                LogActivity("INFO", "Daftar drive berhasil diperbarui via manage-bde");
            }
            catch (Exception ex)
            {
                LogActivity("ERROR", $"Gagal memperbarui drive: {ex.Message}");
            }
        }

        private async void BtnRefresh_Click(object sender, RoutedEventArgs e)
        {
            await RefreshDrivesAsync();
        }

        private async void BtnScanUsb_Click(object sender, RoutedEventArgs e)
        {
            LogActivity("INFO", "Memindai perangkat penyimpanan USB baru...");
            await RefreshDrivesAsync();
        }

        private void ListViewDrives_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (ListViewDrives.SelectedItem is DriveInfoModel drive)
            {
                TxtSelectedDrive.Text = $"{drive.Letter} [{drive.VolumeLabel}] - {drive.BitLockerStatus}\\nKapasitas: {drive.UsedSizeDisplay} / {drive.TotalSizeDisplay}";
                ProgressDecryption.Value = drive.DecryptionPercent;
                TxtProgressPct.Text = $"{drive.DecryptionPercent:0}% Selesai";
                BtnUnlock.IsEnabled = drive.LockStatus == "Locked";
                BtnDisable.IsEnabled = drive.BitLockerStatus.Contains("Terenkripsi");
            }
        }

        private async void BtnUnlock_Click(object sender, RoutedEventArgs e)
        {
            if (ListViewDrives.SelectedItem is not DriveInfoModel drive) return;

            // Prompt dialog untuk input password atau 48-digit recovery key
            var inputDialog = new UnlockDialog(drive.Letter);
            if (inputDialog.ShowDialog() == true)
            {
                LogActivity("COMMAND", $"Membuka kunci drive {drive.Letter}...");
                (bool success, string msg) = inputDialog.IsRecoveryKey
                    ? await _bitLockerService.UnlockWithRecoveryKeyAsync(drive.Letter, inputDialog.Credential)
                    : await _bitLockerService.UnlockWithPasswordAsync(drive.Letter, inputDialog.Credential);

                if (success)
                {
                    MessageBox.Show($"Drive {drive.Letter} berhasil dibuka!", "BitLocker Administrator Pro", MessageBoxButton.OK, MessageBoxImage.Information);
                    LogActivity("SUCCESS", $"Drive {drive.Letter} berhasil dibuka.");
                    await RefreshDrivesAsync();
                }
                else
                {
                    MessageBox.Show($"Gagal membuka kunci drive: {msg}", "Error BitLocker", MessageBoxButton.OK, MessageBoxImage.Error);
                    LogActivity("ERROR", $"Gagal membuka {drive.Letter}: {msg}");
                }
            }
        }

        private async void BtnDisable_Click(object sender, RoutedEventArgs e)
        {
            if (ListViewDrives.SelectedItem is not DriveInfoModel drive) return;

            // Konfirmasi keamanan wajib
            var res = MessageBox.Show(
                $"PERINGATAN KEAMANAN:\\n\\nAnda akan menonaktifkan proteksi BitLocker dan mendekripsi seluruh isi drive {drive.Letter} [{drive.VolumeLabel}].\\n\\nPastikan perangkat TETAP TERHUBUNG selama proses dekripsi berlangsung!\\n\\nLanjutkan proses dekripsi resmi Windows?",
                "Konfirmasi Dekripsi BitLocker",
                MessageBoxButton.YesNo,
                MessageBoxImage.Warning
            );

            if (res == MessageBoxResult.Yes)
            {
                LogActivity("COMMAND", $"manage-bde -off {drive.Letter}");
                var (success, msg) = await _bitLockerService.DisableBitLockerAsync(drive.Letter);
                if (success)
                {
                    MessageBox.Show($"Dekripsi pada drive {drive.Letter} telah dimulai. Pantau progres pada bar dekripsi.", "Dekripsi Berjalan", MessageBoxButton.OK, MessageBoxImage.Information);
                    LogActivity("SUCCESS", $"Dekripsi dimulai untuk {drive.Letter}: {msg}");
                    await RefreshDrivesAsync();
                }
                else
                {
                    MessageBox.Show($"Gagal memulai dekripsi: {msg}", "Error BitLocker", MessageBoxButton.OK, MessageBoxImage.Error);
                    LogActivity("ERROR", $"Gagal dekripsi {drive.Letter}: {msg}");
                }
            }
        }

        private async void BtnCheckStatus_Click(object sender, RoutedEventArgs e)
        {
            if (ListViewDrives.SelectedItem is not DriveInfoModel drive) return;
            LogActivity("COMMAND", $"manage-bde -status {drive.Letter}");
            // Memanggil service status
            await RefreshDrivesAsync();
        }

        private void LogActivity(string level, string message)
        {
            var line = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] [{level}] {message}\\r\\n";
            TxtConsoleLog.AppendText(line);
            TxtConsoleLog.ScrollToEnd();
        }
    }

    // Dialog form sederhana untuk Unlock
    public class UnlockDialog : Window
    {
        private readonly TextBox _txtInput = new() { Margin = new Thickness(0, 0, 0, 12), Height = 30 };
        private readonly RadioButton _rbPassword = new() { Content = "Password Pengguna", IsChecked = true, Margin = new Thickness(0, 0, 10, 0) };
        private readonly RadioButton _rbRecovery = new() { Content = "Recovery Key (48 Digit)", Margin = new Thickness(0, 0, 0, 10) };

        public string Credential => _txtInput.Text;
        public bool IsRecoveryKey => _rbRecovery.IsChecked == true;

        public UnlockDialog(string driveLetter)
        {
            Title = $"Buka Kunci Drive {driveLetter} - BitLocker";
            Width = 450;
            Height = 230;
            WindowStartupLocation = WindowStartupLocation.CenterScreen;
            Background = System.Windows.Media.Brushes.Black;
            Foreground = System.Windows.Media.Brushes.White;

            var sp = new StackPanel { Margin = new Thickness(16) };
            sp.Children.Add(new TextBlock { Text = $"Masukkan Kredensial untuk Drive {driveLetter}:", Margin = new Thickness(0, 0, 0, 10), FontWeight = FontWeights.Bold });
            
            var rbPanel = new StackPanel { Orientation = Orientation.Horizontal, Margin = new Thickness(0, 0, 0, 10) };
            rbPanel.Children.Add(_rbPassword);
            rbPanel.Children.Add(_rbRecovery);
            sp.Children.Add(rbPanel);

            sp.Children.Add(_txtInput);

            var btnPanel = new StackPanel { Orientation = Orientation.Horizontal, HorizontalAlignment = HorizontalAlignment.Right };
            var btnOk = new Button { Content = "Unlock Drive", Width = 110, Margin = new Thickness(0, 0, 8, 0) };
            btnOk.Click += (s, e) => { DialogResult = true; Close(); };
            var btnCancel = new Button { Content = "Batal", Width = 80 };
            btnCancel.Click += (s, e) => { DialogResult = false; Close(); };

            btnPanel.Children.Add(btnOk);
            btnPanel.Children.Add(btnCancel);
            sp.Children.Add(btnPanel);

            Content = sp;
        }
    }
}`
  },
  {
    path: 'BitLockerAdminPro/build.bat',
    name: 'build.bat',
    language: 'batch',
    category: 'Build Scripts',
    content: `@echo off
echo ==========================================================
echo   BitLocker Administrator Pro - Build Standalone .EXE
echo   Target: Windows 10 & Windows 11 (x64)
echo ==========================================================
echo.

where dotnet >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] .NET 8 SDK tidak ditemukan di komputer ini!
    echo Silakan install .NET 8 SDK dari https://dotnet.microsoft.com/download/dotnet/8.0
    pause
    exit /b 1
)

echo [1/3] Merestore dependensi NuGet...
dotnet restore

echo.
echo [2/3] Membangun aplikasi (.NET 8 WPF x64 Release)...
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o ./publish

if %ERRORLEVEL% equ 0 (
    echo.
    echo ==========================================================
    echo   [SUKSES] Build selesai!
    echo   File executable siap di:
    echo   %~dp0publish\\BitLockerAdminPro.exe
    echo.
    echo   CATATAN: Jalankan file .exe dengan 'Run as Administrator'!
    echo ==========================================================
) else (
    echo.
    echo [ERROR] Build gagal. Periksa error di atas.
)

pause`
  },
  {
    path: 'BitLockerAdminPro/README.md',
    name: 'README.md',
    language: 'markdown',
    category: 'Documentation',
    content: `# BitLocker Administrator Pro

Aplikasi Windows Desktop profesional berbasis **C# .NET 8 WPF** untuk mengelola, membuka kunci, menonaktifkan enkripsi, dan memantau status BitLocker pada penyimpanan internal (SSD/HDD) dan eksternal (Flashdisk USB, Portable SSD, Hardisk Eksternal).

---

## 📋 Fitur Utama
1. **Deteksi Perangkat Otomatis**: Mendeteksi Flashdisk USB, SSD Eksternal, HDD Eksternal, dan drive internal dengan kapasitas, jenis perangkat, dan status BitLocker.
2. **Unlock BitLocker**: Mendukung Password maupun 48-digit Recovery Key secara aman melalui \`manage-bde.exe\`.
3. **Disable BitLocker (Dekripsi)**: Mematikan enkripsi dan mendekripsi volume resmi Windows dengan pemantauan persentase real-time.
4. **Pause & Resume**: Kemampuan menjeda dan melanjutkan proses dekripsi jika didukung volume.
5. **Keamanan Administrator**: Dilengkapi \`app.manifest\` dengan hak akses UAC \`requireAdministrator\`.
6. **Dark Mode Windows 11**: Tampilan modern dengan palet warna hitam, biru, hijau, dan merah.

---

## 🛠️ Persyaratan Sistem
- Sistem Operasi: Windows 10 (1809+) atau Windows 11 (64-bit).
- Hak Akses: Administrator Lokal (UAC Elevated).
- Runtime: .NET 8 Desktop Runtime (jika menjalankan build framework-dependent) atau gunakan build self-contained (tidak memerlukan instalasi .NET terpisah).

---

## 🚀 Petunjuk Build & Compile

### Cara 1: Menggunakan Script Otomatis (build.bat)
1. Buka folder proyek di Windows.
2. Klik kanan file \`build.bat\` lalu pilih **Run as Administrator** (atau jalankan di Command Prompt).
3. Script akan otomatis memanggil \`dotnet publish\` dan menghasilkan file:
   \`publish\\BitLockerAdminPro.exe\` (Single-file standalone tanpa dependensi luar).

### Cara 2: Menggunakan Visual Studio 2022
1. Buka file \`BitLockerAdminPro.csproj\` di Visual Studio 2022 (v17.8 atau lebih baru).
2. Pastikan workload **.NET Desktop Development** terpasang.
3. Pilih konfigurasi **Release** dan target **x64**.
4. Klik kanan project \`BitLockerAdminPro\` -> **Publish...** -> Folder -> Publish.

### Cara 3: Menggunakan .NET CLI Terminal
\`\`\`bash
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o ./publish
\`\`\`

---

## 🔒 Keamanan Data
- Aplikasi ini **TIDAK PERNAH** memformat atau menghapus data pengguna.
- Aplikasi ini **TIDAK** membobol sandi; semua proses menggunakan API dan utilitas resmi Windows (\`manage-bde.exe\`).
- Selalu konfirmasi sebelum memulai dekripsi dan pastikan drive tetap terhubung hingga progres mencapai 100%.`
  }
];
