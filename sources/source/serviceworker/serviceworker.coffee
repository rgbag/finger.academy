### Hello! ###

cacheName = 'sample-cache-name'
filesToCache = [
    ##list of files to be cached
]

### Start the service worker and cache all of the app's content ###
self.addEventListener('install', installEventHandler) 
self.addEventListener('fetch', fetchEventHandler)

#region fetchFromCache
fetchEventHandler = (event) -> event.respondWith(cacheAnswer(event.request))

# returns a Promise as it is an asnc function as we await on other stuff ;-)
cacheAnswer = (request) ->
    try return await caches.match(request)
    catch err then return fetch(request)
#endregion

#region cacheInstallation
installEventHandler = (event) -> event.waitUntil(cacheInstall())

# returns a Promise as it is an asnc function as we await on other stuff ;-)
cacheInstall = ->
    try await caches.delete(cacheName)
    catch err # make clean install and remain silent when something goes wrong
    cache = await caches.open(cacheName)
    await cache.addAll filesToCache
    return
#endregion    
