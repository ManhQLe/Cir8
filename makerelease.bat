@echo off

@SET COMPILE="C:\Users\Manh Le\Desktop\Mini JavaScript\compiler.jar"
@SET JAVA="C:\Program Files (x86)\Java\jre1.8.0_65\bin\java.exe"

@SET DEST=release
@SET DSTBROWSERPATH=%DEST%\browser
@SET DSTNODEPATH=%DEST%\nodejs

@SET SRCBROWSERPATH=src\browser
@SET SRCNODEPATH=src\nodejs

@echo ------Releasing Browser Scripts------

@%JAVA% -jar %COMPILE% --compilation_level SIMPLE_OPTIMIZATIONS --js %SRCBROWSERPATH%\Cir8.js --js_output_file %DSTBROWSERPATH%\Cir8.min.js
@xcopy %SRCBROWSERPATH%\Cir8.js %DSTBROWSERPATH% /y
@xcopy ..\Ctrl8\release\browser\*.js %DSTBROWSERPATH% /y


@echo ------Releasing Node Scripts------

@%JAVA% -jar %COMPILE%  --compilation_level SIMPLE_OPTIMIZATIONS --js %SRCNODEPATH%\index.js --js_output_file %DSTNODEPATH%\index.js

@xcopy ".\README.md" .\%DEST% /y

@echo ------Completed------