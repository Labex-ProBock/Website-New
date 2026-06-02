$ErrorActionPreference = "Continue"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Python = "C:\Users\Mandy\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
$Log = Join-Path $Root "bulk-image-fetch.log"
$ErrLog = Join-Path $Root "bulk-image-fetch.err.log"

Set-Location $Root

"[$(Get-Date -Format o)] Starting bulk image fetch" | Out-File -FilePath $Log -Encoding utf8
& $Python "scripts\bulk-image-fetch.py" 1>> $Log 2>> $ErrLog
$FetchExit = $LASTEXITCODE
"[$(Get-Date -Format o)] bulk-image-fetch.py exited with $FetchExit" | Out-File -FilePath $Log -Encoding utf8 -Append

if ($FetchExit -eq 0) {
  "[$(Get-Date -Format o)] Regenerating catalogue data" | Out-File -FilePath $Log -Encoding utf8 -Append
  & npm.cmd run build:catalogue 1>> $Log 2>> $ErrLog
  $CatalogueExit = $LASTEXITCODE
  "[$(Get-Date -Format o)] build:catalogue exited with $CatalogueExit" | Out-File -FilePath $Log -Encoding utf8 -Append

  "[$(Get-Date -Format o)] Running production build" | Out-File -FilePath $Log -Encoding utf8 -Append
  & npm.cmd run build 1>> $Log 2>> $ErrLog
  $BuildExit = $LASTEXITCODE
  "[$(Get-Date -Format o)] build exited with $BuildExit" | Out-File -FilePath $Log -Encoding utf8 -Append
}
