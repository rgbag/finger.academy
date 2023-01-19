############################################################
#region debug
import { createLogFunctions } from "thingy-debug"
{log, olog} = createLogFunctions("alljsesmodule")
#endregion

############################################################
import * as coursenavitationmodule from "./coursenavigationmodule.js" 
import * as virtualkeyboardmodule from "./virtualkeyboardmodule.js" 
import * as keymapdatamodule from "./keymapdatamodule.js" 
import * as coursemodule from "./coursemodule.js" 
import * as shortcutdatamodule from "./shortcutdatamodule.js" 
import * as feedbackdisplaymodule from "./feedbackdisplaymodule.js" 

############################################################
import * as headermodule from "./headermodule.js" 
import * as footermodule from "./footermodule.js" 


############################################################
export initialize = ->
    log "initialize"
    promises = []

    if coursenavitationmodule.initialize?
        promises.push(coursenavitationmodule.initialize()) 
    if virtualkeyboardmodule.initialize?
        promises.push(virtualkeyboardmodule.initialize()) 
    if keymapdatamodule.initialize? 
        promises.push(keymapdatamodule.initialize()) 
    if coursemodule.initialize? 
        promises.push(coursemodule.initialize()) 
    if shortcutdatamodule.initialize? 
        promises.push(shortcutdatamodule.initialize()) 
    if feedbackdisplaymodule.initialize? 
        promises.push(feedbackdisplaymodule.initialize()) 
    
    if headermodule.initialize? then promises.push(headermodule.initialize()) 
    if footermodule.initialize? then promises.push(footermodule.initialize())

    await Promise.all(promises)    
    return