AtomicJS todoMVC Demo
======

# Description:
This folder contains a todoMVC compliant demo built using AtomicJS.

## todoMVC root folder
Contains the `index.html` file which contains all of the elements that fulfill the `view` responsibility of the [MVVAC](http://tyreejackson.com/model-view-view-adapter-controller-with-atomicjs/) pattern.

This folder also contains the `index.js` file which contains the todoMVC composition root function which is assigned to the window.onload event.  This function chains in the AtomicJS htmlCompositionRoot to initialize AtomicJS to work with an HTML DOM based view.  It then composes the todoMVC demo `appController` by injecting a `viewAdapter` constructed using the html based `viewAdapterFactory` which has the root dom element for the todoMVC view passed as an argument.  It also injects the `appProtoProxy` and `atomic.observer` class into the `appController`.

This folder also contains the `index.css` file which contains the css classes specific to this todoMVC demo implementation.

Debug versions of these files are also included for working with the source AtomicJS files.

## 3rdparty folder
Contains the assembled `atomic.js` script.  This is the only script dependency that this todoMVC demo depends on.

## controllers folder
Contains the class that fulfills the `controller` responsibility of the [MVVAC](http://tyreejackson.com/model-view-view-adapter-controller-with-atomicjs/) pattern.  This class listens to events from the `appView` class and updates the data that the appView is bound to with changes received from the service `proxy`.

## node_modules
This is a required standard folder provided by the todoMVC template.  It is not specific to this AtomicJS based todoMVC implementation.

## proxies folder
Contains the prototype `proxy` class that is used provide access to localstorage based data storage for the todoMVC demo.  This data fulfills the `model` responsibility of the [MVVAC](http://tyreejackson.com/model-view-view-adapter-controller-with-atomicjs/) pattern.  The `proxy` class contained within mocks the functionality that would be implemented in something like a remote web service provider.

## views folder
Contains the `appView` class that fulfills the `view adapter` responsibility of the [MVVAC](http://tyreejackson.com/model-view-view-adapter-controller-with-atomicjs/) pattern.  This class defines the elements that should be present in the view in order for the application to function.  Code in this class is not tied directly to any particular view technology such as HTML and remains completely agnostic of specific DOM technology.  Instead, the view adapter can be attached to an underlying HTML DOM based view by composing AtomicJS using the html specific view adapter supporting classes.  See the AtomicJS [htmlCompositionRoot.js](https://github.com/TyreeJackson/atomic/blob/master/AtomicJS/atomic/scripts/htmlCompositionRoot.js) file for more insight.

