# Định nghĩa repositories
$repositories = @(
   @{
       name = "api"
       url = "https://github.com/OnlineArtGallery-SEP490-SP25-SE11/OAG-BE.git"
       branch = "preview"
       envFile = ".env"
   },
   @{
       name = "client"
       url = "https://github.com/OnlineArtGallery-SEP490-SP25-SE11/OAG-FE.git"
       branch = "master"
       envFile = ".env.local"
   },
   @{
       name = "client-admin"
       url = "https://github.com/OnlineArtGallery-SEP490-SP25-SE11/OAG-FE-ADMIN.git"
       branch = "master"
       envFile = ".env.local"
   }
)

# Function to check if a command is available
function Test-CommandExists {
    param ($command)
    $exists = $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
    return $exists
}

# Function to check required software
function Check-RequiredSoftware {
    $missingTools = @()
    
    # Check Git
    if (-not (Test-CommandExists "git")) {
        $missingTools += "git"
        Write-Host "❌ Git is not installed." -ForegroundColor Red
    } else {
        Write-Host "✅ Git is installed." -ForegroundColor Green
    }
    
    # Check Node.js
    if (-not (Test-CommandExists "node")) {
        $missingTools += "node"
        Write-Host "❌ Node.js is not installed." -ForegroundColor Red
    } else {
        Write-Host "✅ Node.js is installed." -ForegroundColor Green
    }
    
    # Check Bun
    if (-not (Test-CommandExists "bun")) {
        $missingTools += "bun"
        Write-Host "❌ Bun is not installed." -ForegroundColor Red
    } else {
        Write-Host "✅ Bun is installed." -ForegroundColor Green
    }
    
    return $missingTools
}

# Function to check if installation tools are available
function Check-InstallationTools {
    $toolsStatus = @{}
    
    # Check winget
    if (Test-CommandExists "winget") {
        $toolsStatus["winget"] = $true
        Write-Host "✅ winget is available for automatic installation." -ForegroundColor Green
    } else {
        $toolsStatus["winget"] = $false
        Write-Host "❌ winget is not available. Some automatic installations may not work." -ForegroundColor Red
    }
    
    # Check curl
    if (Test-CommandExists "curl") {
        $toolsStatus["curl"] = $true
        Write-Host "✅ curl is available for automatic installation." -ForegroundColor Green
    } else {
        $toolsStatus["curl"] = $false
        Write-Host "❌ curl is not available. Some automatic installations may not work." -ForegroundColor Red
    }
    
    return $toolsStatus
}

# Function to install software
function Install-Software {
    param (
        $software,
        $installTools
    )
    
    switch ($software) {
        "git" {
            if ($installTools["winget"]) {
                Write-Host "📥 Installing Git directly through this terminal using winget..." -ForegroundColor Cyan
                try {
                    winget install --id Git.Git -e --source winget
                    Write-Host "✅ Git installed successfully." -ForegroundColor Green
                    return $true
                } catch {
                    Write-Host "❌ Failed to install Git automatically." -ForegroundColor Red
                    return $false
                }
            } else {
                Write-Host "❌ Cannot install Git automatically: winget is not available." -ForegroundColor Red
                return $false
            }
        }
        "node" {
            if ($installTools["winget"]) {
                Write-Host "📥 Installing Node.js directly through this terminal using winget..." -ForegroundColor Cyan
                try {
                    winget install OpenJS.NodeJS.LTS
                    Write-Host "✅ Node.js installed successfully." -ForegroundColor Green
                    return $true
                } catch {
                    Write-Host "❌ Failed to install Node.js automatically." -ForegroundColor Red
                    return $false
                }
            } else {
                Write-Host "❌ Cannot install Node.js automatically: winget is not available." -ForegroundColor Red
                return $false
            }
        }
        "bun" {
            if ($installTools["curl"]) {
                Write-Host "📥 Attempting to install Bun directly through this terminal using curl..." -ForegroundColor Cyan
                try {
                    Write-Host "Running Bun installation script from bun.sh..." -ForegroundColor Yellow
                    Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://bun.sh/install.ps1')
                    Write-Host "✅ Bun installation attempt completed. Please restart your terminal after this script completes." -ForegroundColor Green
                    return $true
                } catch {
                    Write-Host "❌ Failed to install Bun automatically." -ForegroundColor Red
                    return $false
                }
            } else {
                Write-Host "❌ Cannot install Bun automatically: curl is not available." -ForegroundColor Red
                return $false
            }
        }
    }
}

# Check for required software before proceeding
Write-Host "`n🔍 Checking for required software..." -ForegroundColor Cyan
$missingTools = Check-RequiredSoftware

if ($missingTools.Count -gt 0) {
    Write-Host "`n⚠️ The following required software is missing: $($missingTools -join ', ')" -ForegroundColor Yellow
    
    # Check if we have the tools to perform installation
    Write-Host "`n🔍 Checking installation tools availability..." -ForegroundColor Cyan
    $installTools = Check-InstallationTools
    
    # Clear Y/N prompt for terminal installation
    if ($installTools["winget"] -or $installTools["curl"]) {
        $installChoice = Read-Host "`nDo you want to install the missing software directly through this terminal? (y/n)"
        
        if ($installChoice.ToLower() -eq "y") {
            Write-Host "`n🚀 Attempting to install missing software through the terminal..." -ForegroundColor Cyan
            foreach ($tool in $missingTools) {
                $installed = Install-Software -software $tool -installTools $installTools
                
                if (-not $installed) {
                    Write-Host "`n⚠️ Terminal installation for $tool was not successful." -ForegroundColor Yellow
                    $manualChoice = Read-Host "Do you want to install $tool manually now? The script will wait. (y/n)"
                    
                    if ($manualChoice.ToLower() -eq "y") {
                        Write-Host "Installation links:" -ForegroundColor Cyan
                        switch ($tool) {
                            "git" { Write-Host "Git: https://git-scm.com/downloads" -ForegroundColor White }
                            "node" { Write-Host "Node.js: https://nodejs.org/" -ForegroundColor White }
                            "bun" { Write-Host "Bun: https://bun.sh/" -ForegroundColor White }
                        }
                        
                        Write-Host "Please install $tool and then press Enter to continue..." -ForegroundColor Yellow
                        Read-Host | Out-Null
                    } else {
                        $continueChoice = Read-Host "Continue without installing $tool? (y/n)"
                        if ($continueChoice.ToLower() -ne "y") {
                            Write-Host "Exiting script. Please restart after installing the required software." -ForegroundColor Yellow
                            exit
                        }
                    }
                }
            }
        } else {
            $manualInstallChoice = Read-Host "Would you like to manually install the missing software now? The script will wait. (y/n)"
            
            if ($manualInstallChoice.ToLower() -eq "y") {
                Write-Host "`nPlease install the following software:" -ForegroundColor Yellow
                foreach ($tool in $missingTools) {
                    switch ($tool) {
                        "git" { Write-Host "Git: https://git-scm.com/downloads" -ForegroundColor White }
                        "node" { Write-Host "Node.js: https://nodejs.org/" -ForegroundColor White }
                        "bun" { Write-Host "Bun: https://bun.sh/" -ForegroundColor White }
                    }
                }
                
                $waitChoice = Read-Host "Press Enter when you've completed the installations to continue, or type 'exit' to quit"
                if ($waitChoice -eq "exit") {
                    Write-Host "Exiting script. Please restart after installing the required software." -ForegroundColor Yellow
                    exit
                }
            } else {
                $skipChoice = Read-Host "Continue without installing the required software? This is not recommended. (y/n)"
                if ($skipChoice.ToLower() -ne "y") {
                    Write-Host "Exiting script. Please restart after installing the required software." -ForegroundColor Yellow
                    exit
                }
                Write-Host "⚠️ Continuing with missing dependencies. Some operations may fail." -ForegroundColor Yellow
            }
        }
    } else {
        # No installation tools available
        Write-Host "`n⚠️ Cannot perform automatic installation because required tools (winget, curl) are not available." -ForegroundColor Yellow
        $manualInstallChoice = Read-Host "Would you like to manually install the missing software now? The script will wait. (y/n)"
        
        if ($manualInstallChoice.ToLower() -eq "y") {
            Write-Host "`nPlease install the following software:" -ForegroundColor Yellow
            foreach ($tool in $missingTools) {
                switch ($tool) {
                    "git" { Write-Host "Git: https://git-scm.com/downloads" -ForegroundColor White }
                    "node" { Write-Host "Node.js: https://nodejs.org/" -ForegroundColor White }
                    "bun" { Write-Host "Bun: https://bun.sh/" -ForegroundColor White }
                }
            }
            
            Write-Host "Press Enter when you've completed the installations to continue..." -ForegroundColor Yellow
            Read-Host | Out-Null
        } else {
            $skipChoice = Read-Host "Continue without installing the required software? This is not recommended. (y/n)"
            if ($skipChoice.ToLower() -ne "y") {
                Write-Host "Exiting script. Please restart after installing the required software." -ForegroundColor Yellow
                exit
            }
            Write-Host "⚠️ Continuing with missing dependencies. Some operations may fail." -ForegroundColor Yellow
        }
    }
    
    # Re-check installed tools after installation attempts
    if (($installChoice.ToLower() -eq "y") -or ($manualInstallChoice.ToLower() -eq "y")) {
        $stillMissing = @()
        Write-Host "`n🔍 Re-checking installed software..." -ForegroundColor Cyan
        foreach ($tool in $missingTools) {
            if (-not (Test-CommandExists $tool)) {
                Write-Host "❌ $tool is still not installed or not available in the PATH." -ForegroundColor Red
                $stillMissing += $tool
            } else {
                Write-Host "✅ $tool is now installed." -ForegroundColor Green
            }
        }
        
        if ($stillMissing.Count -gt 0) {
            $finalContinueChoice = Read-Host "Some tools are still missing. Continue anyway? (y/n)"
            if ($finalContinueChoice.ToLower() -ne "y") {
                Write-Host "Exiting script. Please restart after installing the required software." -ForegroundColor Yellow
                exit
            }
            Write-Host "⚠️ Continuing with missing dependencies. Some operations may fail." -ForegroundColor Yellow
        }
    }
}

# Total repositories for progress bar
$totalRepos = $repositories.Count
$repoIndex = 0

# Header
Write-Host "`n📦 Starting repository setup process..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor DarkCyan

# Continue with the existing repository cloning code
foreach ($repo in $repositories) {
   $repoIndex++
   Write-Host "`n🔄 Cloning $($repo.name) from branch $($repo.branch)..." -ForegroundColor Cyan
   # Update progress bar
   Write-Progress -PercentComplete (($repoIndex / $totalRepos) * 100) `
                 -Activity "Cloning Repositories" `
                 -Status "Processing $($repo.name) ($repoIndex of $totalRepos)"
   
   if (-not (Test-Path $repo.name)) {
       Write-Host "  📁 Creating directory $($repo.name)..." -ForegroundColor Gray
       New-Item -ItemType Directory -Path $repo.name | Out-Null
   }
   
   try {
       # Clone repository
       $output = git clone -b $repo.branch $repo.url $repo.name 2>&1
       
       if ($LASTEXITCODE -eq 0) {
           Write-Host "  ✅ Successfully cloned $($repo.name)" -ForegroundColor Green
           
           # Create env file
           $envPath = Join-Path $repo.name $repo.envFile
           New-Item -ItemType File -Path $envPath -Force | Out-Null
           Write-Host "  📄 Created $($repo.envFile) successfully" -ForegroundColor Green
           
           # Add separator
           Write-Host "  -----------------------------------" -ForegroundColor DarkGray
       } else {
           Write-Host "  ❌ Failed to clone $($repo.name)" -ForegroundColor Red
           Write-Host "  🔍 Error: $output" -ForegroundColor Red
       }
   }
   catch {
       Write-Host "  ❌ Error occurred while processing $($repo.name)" -ForegroundColor Red
       Write-Host "  🔍 Details: $($_.Exception.Message)" -ForegroundColor Red
   }
}

# Complete progress bar
Write-Progress -Completed -Activity "Cloning Repositories"

# Footer
Write-Host "`n✨ All repositories have been processed successfully!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor DarkCyan
Write-Host "📊 Summary:" -ForegroundColor Yellow
Write-Host "  • Total repositories: $totalRepos" -ForegroundColor Yellow
Write-Host "  • Processed: $repoIndex" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor DarkCyan
Write-Host "🎉 Setup complete! You can now proceed with development.`n" -ForegroundColor Magenta
