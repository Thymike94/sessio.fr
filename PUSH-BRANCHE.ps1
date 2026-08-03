$ErrorActionPreference = "Stop"

Write-Host "Branche actuelle :" -ForegroundColor Cyan
git branch --show-current

$branch = git branch --show-current
if ($branch -ne "feat/rebuild-conversion-seo") {
  throw "Tu n'es pas sur feat/rebuild-conversion-seo. Aucun push n'a été effectué."
}

Write-Host "État du dépôt :" -ForegroundColor Cyan
git status -sb

$answer = Read-Host "Écris PUSH pour ajouter, committer et pousser ces fichiers"
if ($answer -cne "PUSH") {
  Write-Host "Annulé. Aucun fichier n'a été poussé." -ForegroundColor Yellow
  exit 0
}

git add .
git commit -m "feat(site): rebuild conversion and SEO experience"
git push origin feat/rebuild-conversion-seo

Write-Host "Push terminé sur feat/rebuild-conversion-seo." -ForegroundColor Green
