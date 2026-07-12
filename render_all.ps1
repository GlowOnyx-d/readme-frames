$ErrorActionPreference = 'Stop'
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Copying config.js to compositions..."
Copy-Item config.js compositions\skills-ticker\config.js -Force
Copy-Item config.js compositions\terminal\config.js -Force
Copy-Item config.js compositions\intro-card\config.js -Force
Copy-Item config.js compositions\commit-chart\config.js -Force
Copy-Item config.js compositions\lang-donut\config.js -Force

Write-Host "Rendering intro-card..."
Set-Location compositions\intro-card
hyperframes render --fps 60 --output ..\..\assets\intro-card.mp4
Set-Location ..\..

Write-Host "Rendering skills-ticker..."
Set-Location compositions\skills-ticker
hyperframes render --fps 60 --output ..\..\assets\skills-ticker.mp4
Set-Location ..\..

Write-Host "Rendering terminal..."
Set-Location compositions\terminal
hyperframes render --fps 60 --output ..\..\assets\terminal.mp4
Set-Location ..\..

Write-Host "Rendering commit-chart..."
Set-Location compositions\commit-chart
hyperframes render --fps 60 --output ..\..\assets\commit-chart.mp4
Set-Location ..\..

Write-Host "Rendering lang-donut..."
Set-Location compositions\lang-donut
hyperframes render --fps 60 --output ..\..\assets\lang-donut.mp4
Set-Location ..\..

Write-Host "Converting mp4 to gif/png..."
ffmpeg -y -i assets\intro-card.mp4 -vf "fps=30,scale=1280:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 assets\intro-card.gif
ffmpeg -y -i assets\skills-ticker.mp4 -vf "fps=30,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 assets\skills-ticker.gif
ffmpeg -y -i assets\terminal.mp4 -vf "fps=30,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 assets\terminal.gif
ffmpeg -y -i assets\commit-chart.mp4 -vf "fps=30,scale=900:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 assets\commit-chart.gif
ffmpeg -y -sseof -0.3 -i assets\lang-donut.mp4 -update 1 -frames:v 1 -vf "scale=600:-1:flags=lanczos" assets\lang-donut.png

Write-Host "Cleaning up mp4s..."
Remove-Item assets\*.mp4 -Force

Write-Host "Committing and pushing..."
git add assets\*.gif
git add assets\*.png
git commit -m "chore: render README animations"
git push

Write-Host "Done."
