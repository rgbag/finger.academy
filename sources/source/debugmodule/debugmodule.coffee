import { addModulesToDebug } from "thingy-debug"

############################################################
export modulesToDebug = {

    configmodule: true
    coursemodule: true
    coursenavigationmodule: true
    feedbackdisplaymodule: true
    footermodule: true
    headermodule: true
    keymapdatamodule: true
    shortcutdatamodule: true
    virtualkeyboardmodule: true

}

addModulesToDebug(modulesToDebug)