imports.init
({
    atomicLib:      "3rdparty/atomic.js",
    appViewLib:     "views/appView.js",
    proxyLib:       "proxies/appProtoProxy.js",
    controllerLib:  "controllers/appController.js"
})
(function(libs)
{
    var atomic  = libs.atomicLib.atomic.htmlCompositionRoot();
    var app =
    new libs.controllerLib.todoMVC.appController
    (
        atomic.viewAdapterFactory.create
        (
            new libs.appViewLib.todoMVC.appView(), 
            document.querySelector("#todoMVCApp")
        ),
        new libs.proxyLib.todoMVC.appProxy(window.localStorage, libs.atomicLib.utilities.removeFromArray),
        atomic.observer
    );
    app.launch();
});