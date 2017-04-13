@ECHO OFF
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
    IF "%1"=="--glob" (
        SET glob="%2"
        SHIFT
    )
    SHIFT
    GOTO :loop
)

IF NOT DEFINED desc (
	set desc=
) ELSE (
	set desc=--desc %desc%
)

IF NOT DEFINED tags (
	set tags=
) ELSE (
	set tags=--tags %tags%
)

IF NOT DEFINED glob (
	set glob=
) ELSE (
	set glob=--glob %glob%
)


ECHO Executing... $ node plunk --dir %dir% %desc% %tags% %glob%
node plunk --dir %dir% %desc% %tags% %glob%

goto :eof

:joinpath
set Path1=%~1
set Path2=%~2
if {%Path1:~-1,1%}=={\} (set dir=%Path1%%Path2%) else (set dir=%Path1%\%Path2%)
goto :eof
