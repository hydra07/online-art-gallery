# Header
Write-Host "`n🚀 Initializing project setup..." -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor DarkCyan

# Hiển thị thông tin môi trường
Write-Host "`n📌 Environment Information:" -ForegroundColor Yellow
Write-Host "  • PowerShell Version: $($PSVersionTable.PSVersion)" -ForegroundColor Gray
Write-Host "  • Node Version: $(node -v)" -ForegroundColor Gray
Write-Host "  • Bun Version: $(bun -v)" -ForegroundColor Gray
Write-Host "  • Git Version: $(git --version)" -ForegroundColor Gray

# Write-Host "`n📦 Installing root dependencies..." -ForegroundColor Cyan
# bun install --no-workspaces

Write-Host "`n🔄 Running repository setup..." -ForegroundColor Cyan
# Gọi đến clone-repos.ps1
& "$PSScriptRoot\.config\scripts\clone-repos.ps1"

Write-Host "`n📥 Installing workspace dependencies..." -ForegroundColor Cyan
bun install

# Footer
Write-Host "`n✨ Project initialization completed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor DarkCyan
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Check .env files in each project" -ForegroundColor Gray
Write-Host "  2. Configure your environment variables" -ForegroundColor Gray
Write-Host "  3. Run 'bun dev' to start development" -ForegroundColor Gray
Write-Host "=====================================" -ForegroundColor DarkCyan
Write-Host "🎉 Happy coding!`n" -ForegroundColor Magenta
