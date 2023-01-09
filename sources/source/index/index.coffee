import Modules from "./allmodules"
import domconnect from "./indexdomconnect"
import { startFingerAcademy } from "./app.js"

domconnect.initialize()

global.allModules = Modules

############################################################
appStartup = ->
    ## which modules shall be kickstarted?
    # Modules.appcoremodule.startUp()
    startFingerAcademy()
    return

############################################################
run = ->
    promises = (m.initialize() for n,m of Modules when m.initialize?) 
    await Promise.all(promises)
    appStartup()

############################################################
run()