# Script PowerShell pour créer un compte démo
# Usage: .\scripts\create-demo.ps1

Write-Host "═══════════════════════════════════════" -ForegroundColor Blue
Write-Host "   🎭 Création d'un compte Démo" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════`n" -ForegroundColor Blue

# Vérifier que Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "   Installez Node.js depuis https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Vérifier que npm est installé
try {
    $npmVersion = npm --version
    Write-Host "✅ npm détecté: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

# Exécuter le script Node.js
Write-Host "`n🚀 Exécution du script de création du compte démo...`n" -ForegroundColor Cyan

try {
    node scripts/create-demo.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Script exécuté avec succès!" -ForegroundColor Green
        Write-Host "`n📋 Identifiants du compte démo:" -ForegroundColor Blue
        Write-Host "   Email: demo@unigov.dz" -ForegroundColor White
        Write-Host "   Mot de passe: demo123456" -ForegroundColor White
        Write-Host "`n💡 Vous pouvez maintenant utiliser le bouton 'Se connecter avec le compte démo' sur la page de login" -ForegroundColor Yellow
    } else {
        Write-Host "`n❌ Erreur lors de l'exécution du script" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "`n❌ Erreur: $_" -ForegroundColor Red
    exit 1
}

