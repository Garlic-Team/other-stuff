@echo off

:A
echo Jdu na to!
git add . && git commit -m 'PollBot-1.0.0' && git push
timeout 1
GOTO B

:B
GOTO A

pause
