statemodule = {name: "statemodule"}
############################################################
#region printLogFunctions
log = (arg) ->
    if allModules.debugmodule.modulesToDebug["statemodule"]?  then console.log "[statemodule]: " + arg
    return
ostr = (obj) -> JSON.stringify(obj, null, 4)
olog = (obj) -> log "\n" + ostr(obj)
print = (arg) -> console.log(arg)
#endregion

############################################################
try defaultState = require("./defaultstate.js")
catch err then defaultstate = {}

############################################################
#region internalProperties
state = null
allStates = {}

listeners = {}
changeDetectors = {}

#endregion

############################################################
#region internalFunctions
loadRegularState = ->
    state = localStorage.getItem("state")
    if state? then state = JSON.parse(state)
    else state = {}
    
    for key,content of state
        if !content? then content = null
        if !content? or !content.content? then state[key] = {content}
        allStates[key] = state[key]

    isVolatile = true
    for key,content of defaultState when !allStates[key]?
        allStates[key] = {content, isVolatile}

    return

############################################################
#region stateChangeStuff
hasChanged = (oldContent, newContent) -> oldContent != newContent

changeDetected = (key, content) ->
    detector = changeDetectors[key] || hasChanged
    return true if !allStates[key]?
    oldContent = allStates[key].content
    return detector(allStates[key].content, content)

#endregion

############################################################
loadDedicated = (key) ->
    log "loadDedicated"
    isDedicated = true
    contentString = localStorage.getItem(key)
    # print "- - -"
    # print key
    # print contentString
    # print "- - -"
    content = JSON.parse(contentString)
    allStates[key] = {content, isDedicated}
    # print ostr {allStates}
    return content
    
saveDedicatedState = (key) ->
    log "saveDedicatedState"
    log key
    olog {allStates}
    content = allStates[key].content
    allStates[key].isDedicated = true
    contentString = JSON.stringify(content)
    localStorage.setItem(key, contentString)    
    return

saveRegularState = ->
    log "saveRegularState"
    stateString = JSON.stringify(state)
    localStorage.setItem("state", stateString)
    return

allmightySetAndSave = (key, content, isDedicated, silent) ->
    isVolatile = (allStates[key]? and allStates[key].isVolatile)
    
    # print("isDedicated: "+ isDedicated)

    if typeof isDedicated != "boolean"
        # print("I was here!")
        isDedicated = (allStates[key]? and (allStates[key].isDedicated == true))
        ## true when it existed and was isDedicated
        ## false if it did not exist
        ## false if it was not isDedicated

    # print("isDedicated: "+ isDedicated)

    if allStates[key]?
        if allStates[key].isDedicated then isDedicatedChanged = (isDedicated != allStates[key].isDedicated)
        else isDedicatedChanged = isDedicated
        
        # print("allStates[key].isDedicated: " + allStates[key].isDedicated)
        # print("isDedicatedChanged: " + isDedicatedChanged)
        # olog "changeDetected: "+changeDetected(key, content)
        return unless changeDetected(key, content) or isVolatile or isDedicatedChanged

        # print("key: " + key)
        # print("changeDetected: "+ changeDetected(key, content))
        # print("isDedicatedChanged: "+ isDedicatedChanged)
        # print("isVolatile: "+ isVolatile)
        # print("- - -")

        allStates[key].content = content

        if isDedicated then allStates[key].isDedicated = true
        if isDedicatedChanged and !isDedicated 
            localStorage.removeItem(key)
            delete allStates[key].isDedicated
        if isVolatile then delete allStates[key].isVolatile
    else
        allStates[key] = {content, isDedicated}


    if isDedicated
        saveDedicatedState(key)
        if state[key]?
            delete state[key]
            saveRegularState()
    else
        if !state[key]? then state[key] = allStates[key]
        saveRegularState()

    if silent then return
    return callOnChangeListeners(key)
    
saveAllStates = ->
    log "saveAllStates"
    olog allStates
    for key,content of allStates when content.isDedicated
        saveDedicatedState(key)
    saveRegularState()
    return


############################################################
allmightySet = (key, content, silent) ->
    isVolatile = true
    return unless changeDetected(key, content)

    try allStates[key].content = content
    catch err then allStates[key] = {content,isVolatile}
    
    if silent then return
    return callOnChangeListeners(key)

############################################################
decomposeObject = (obj) ->
    keys = Object.keys(obj)
    if keys.length != 1 then throw new Error("Object did not have exactly one Member!")
    key = keys[0]
    content = obj[key]
    return {key, content}

############################################################
callOnChangeListeners = (key) ->
    return if !listeners[key]?
    promises = (fun() for fun in listeners[key])
    return await Promise.all(promises)

#endregion

############################################################
#region exposedFunctions
statemodule.getState = -> allStates

############################################################
#region localStorageRelevantFunctions
statemodule.load = (key) ->
    log "statemodule.load"
    olog {allStates}
    if allStates[key]? and allStates[key].isVolatile
        return allStates[key].content
    if allStates[key]? and !allStates[key].isDedicated
        loadRegularState()
        return allStates[key].content
    return loadDedicated(key)

statemodule.save = (key, content, isDedicated) ->
    log "statemodule.save"
    return unless key?
    if typeof key == "object" then {key, content} = decomposeObject(key)

    if !content? and !isDedicated? then saveDedicatedState(key)
    else return allmightySetAndSave(key, content, isDedicated, false)

statemodule.saveSilently = (key, content, isDedicated) ->
    log "statemodule.saveSilently"
    if typeof key == "object" then {key, content} = decomposeObject(key)

    return allmightySetAndSave(key, content, isDedicated, true)

statemodule.saveAll = saveAllStates

statemodule.saveRegularState = saveRegularState

############################################################
statemodule.remove = (key) ->
    log "statemodule.remove"
    return unless allStates[key]?
    if allStates[key].isVolatile
        delete allStates[key]
        return
    if allStates[key].isDedicated
        localStorage.removeItem(key)
        delete allStates[key]
        return
    delete allStates[key]
    delete state[key]
    saveRegularState()
    return

#endregion

############################################################
#region regularGettSetterFunctions
statemodule.get = (key) ->
    return undefined unless allStates[key]? 
    return allStates[key].content

statemodule.set = (key, content) ->
    log "statemodule.set"
    if typeof key == "object" then {key, content} = decomposeObject(key)

    allmightySet(key, content, false)
    return

statemodule.setSilently = (key, content) ->
    log "statemodule.setSilently"
    if typeof key == "object" then {key, content} = decomposeObject(key)

    allmightySet(key, content, true)
    return

#endregion

############################################################
#region stateChangeRelevantFunctions
statemodule.addOnChangeListener = (key, fun) ->
    log "statemodule.addOnChangeListener"
    if !listeners[key]? then listeners[key] = []
    listeners[key].push(fun)
    return

statemodule.removeOnChangeListener = (key, fun) ->
    log "statemodule.removeOnChangeListener"
    candidates = listeners[key]
    if candidates?
        for candidate,i in candidates when candidate == fun
            log "candidate found at: " + i
            candidates[i] = candidates[candidates.length - 1]
            candidates.pop()
            return
        log "No candidate found for given function!"
    return

statemodule.clearOnChangeListeners = (key, fun) ->
    log "statemodule.clearOnChangeListener"
    listeners[key] = []
    return

statemodule.callOutChange = (key) -> callOnChangeListeners(key)

############################################################
statemodule.setChangeDetectionFunction = (key, fun) ->
    if !fun? then delete changeDetectors[key]
    else changeDetectors[key] = fun
    return

#endregion

#endregion

############################################################
loadRegularState()

module.exports = statemodule