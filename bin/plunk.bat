@ECHO OFF
SET desc=""
SET tags=""
SET dir=%cd%
cd /d %~dp0

:loop
IF NOT "%1"=="" (
    IF "%1"=="--dir" (
        CALL :joinpath %dir% %~2
        SHIFT
    )
    IF "%1"=="--desc" (
        SET desc=%2
        SHIFT
    )
    IF "%1"=="--tags" (
        SET tags=%2
        SHIFT
    )
    SHIFT
    GOTO :loop
)

ECHO Executing... $ node plunk --dir %dir% --desc %desc% --tags %tags%
node plunk --dir %dir% --desc %desc% --tags %tags%
goto :eof

:joinpath
set Path1=%~1
set Path2=%~2
if {%Path1:~-1,1%}=={\} (set dir=%Path1%%Path2%) else (set dir=%Path1%\%Path2%)
goto :eof
