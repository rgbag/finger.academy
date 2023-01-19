[![hackmd-github-sync-badge](https://hackmd.io/nn708ujuRLeo0crmfr2X_Q/badge)](https://hackmd.io/nn708ujuRLeo0crmfr2X_Q)
###### tags: `strunfun`

# [pwa-sources-statemodule](https://github.com/JhonnyJason/pwa-sources-statemodule) - statemodule

## Description
Implementation for [PWA Statemodule](https://hackmd.io/gzTX785OSVmzuxy6CnV72w?view)

## Expectation to the Environment
- `defaultState = require("./defaultstate")`
- [`localStorage`](https://developer.mozilla.org/de/docs/Web/API/Window/localStorage) available 

## Structure
- `defaultState°`
- `state°`
- `allStates°`
- `listeners°`
- `changeDetectors°`
- `loadRegularState§`
- `hasChanged§` `oldContent`,`newContent`
- `changeDetected§` `key"`, `content`
- `loadDedicated§` `key"`
- `saveDedicatedState§` `key"`
- `saveRegularState§`
- `allmightySetAndSave§` `key"`, `content`, `isDedicated?`, `silent?`
- `saveAllStates§`
- `allmightySet§` `key"`, `content`, `silent?`
- `callOnChangeListeners§` `key"`
- `.getState§`
- `.load§` `key"`
- `.save§` `key"`, `content`, `isDedicated?`
- `.saveSilently§` `key"`, `content`, `isDedicated?`
- `.saveAll§`
- `.remove§` `key"`
- `.get§` `key"`
- `.set§` `key"`, `content`
- `.setSilently§` `key"`, `content`
- `.addOnChangeListener§` `key"`, `fun§`
- `.removeOnChangeListener§` `key"`, `fun§`
- `.callOutChange§` `key"`
- `.setChangeDetectionFunction§` `key"`, `fun§`

## Specification
- `defaultState°` = the specific definition of the default state of the app
- `state°` = `localStorage.getItem("state")`
- `allStates°` = the `state°` superpositioned with all dedicated states and then also the volatile ones
- `listeners°` = map from `key"` to its list of onChange listeners
- `changeDetectors°` = map from `key"` to its specific change detector function
- `loadRegularState§` = loads the `state°` and sets up the initial `allStates°`
- `hasChanged§` `oldContent`,`newContent` = default change detection function by `!=`
- `changeDetected§` `key"`, `content` = specific check if the content for `key` has changed 
    - uses the assigned change detector function if it is available 
    - otherwise defaults to `hasChanged`
    - returns true if there was no state by the `key`
- `loadDedicated§` `key"` = reflect `localStorage.getItem(key)` into `allStates[key]` as dedicated state
- `saveDedicatedState§` `key"` = `localStorage.setItem(key, content)` where `content` is the stringified content for the `key`
- `saveRegularState§` = `localStorage.setItem("state", content)` where content is the stringified content of the regular state
- `allmightySetAndSave§` `key"`, `content`, `isDedicated?`, `silent?` =
    - is sensitive to the passed `isDedicated` and `silent` flags
        - so it would adjust if `isDedicated` had changed
        - call the onChange listeners when `silent != true`
    - checks if the content is regular, dedicated or volatile then saves or sets is appropriately
- `saveAllStates§` = saves the regular state and all the available dedicated states to localStorage
- `allmightySet§` `key"`, `content`, `silent?` = 
    - stubbornly sets the content for the `key`
    - does not call the onChange listeners if `silent == true`
- `callOnChangeListeners§` `key"` = manually call the onChange listeners for the `key`
- `.getState§` = returns the full `allStates°`
- `.load§` `key"` = 
    - if it is dedicated or does not exist yet then return `§loadDedicated key`
    - if it is volatile just return the available `content`
    - otherwise load the regular state and return whatever we may find by the `key`
- `.save§` `key"`, `content`, `isDedicated?` = 
    - saves as dedicated state when `isDedicated == true` or was a dedicated state before
    - otherwise saves it to the regular `state°`
    - always checks if we have to call the onChange listeners
- `.saveSilently§` `key"`, `content`, `isDedicated?`
    - saves as dedicated state when `isDedicated == true` or was a dedicated state before
    - otherwise saves it to the regular `state°`
    - never calls the onChange listeners
- `.saveAll§` = `§saveAllStates`
- `.remove§` `key"` = completely removes the content available by the `key` also from localStorage
- `.get§` `key"` = simply retrieves whatever is the available content by the `key`
- `.set§` `key"`, `content` = simply sets the content for the `key`
    - if the `key` did not exist yet, then it is a volatile state
    - otherwise we have an inconsistent state with the localStorage as it would not be reflected onto there
    - always checks if we have to call the onChange listeners
- `.setSilently§` `key"`, `content`
    - if the `key` did not exist yet, then it is a volatile state
    - otherwise we have an inconsistent state with the localStorage as it would not be reflected onto there
    - never calls the onChange listeners
- `.addOnChangeListener§` `key"`, `fun§` = add a function to be executed if a change has been detected
- `.removeOnChangeListener§` `key"`, `fun§` = remove a function which was previously added as onChange listener
- `.callOutChange§` `key"` = `§callOnChangeListeners key`
- `.setChangeDetectionFunction§` `key"`, `fun§` = provide your own function by which it is decided if to call the onChange listeners
- When loading the module we execute `§loadRegularState`