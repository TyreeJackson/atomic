Atomic Stack
======

# Description:
This project contains a stack of tools for building multi-tiered web applications.  Wow, that's a pretty loaded statement.  How about some details.

## Atomic.Net
This visual studio project contains components written in c# for the purpose of building application middleware.  Nope, still sounds loaded.  How about this, here are some features that we hope to have built in this project that you won't have to roll on your own:

* Abstract Factory/Dependency Injection hybrid IOC container (with serializable or compiled configuration)
* Singleton/Multiton general services (managed by IOC container)
* Application Service hosting layer with the following:
    * Host abstraction layer (IIS host provider included, OWIN provider may be added later)
    * Fileless (no .svc, .asmx, .ashx), fully qualified class name based routing for web services (managed by IOC container)
    * StaticFileHandler (serves up local content including virtually assembled content - used by AtomicWeb)
    * Content Negotiation (managed by IOC container; json and xml serialization providers included, additional providers may be added later through the Abstract Factory configuration)
    * File/stream data types for simple access to uploaded content in service calls via simple service method parameters
    * Pluginable user authentication/authorization model (managed by IOC container; basic authentication provider included)
* Entity Model components defined in a Generic Namespace with the following:
    * Data Object (base class contains 5 standard properties: CreatedBy(Id), CreationDateTime, Id, LastUpdatedBy(Id), LastUpdateTime)
    * Data Object List (featuring in memory indexing of data objects and in memory querying)
    * Pluginable Business Layer (managed by IOC container; with business rules engine)
    * Pluginable Data Access Layer (managed by IOC container; default data access provider still to be determined)
    * Domain Specific Querying Language built using fluent interface based grammar classes
    * Optional automatically generated CRUD RESTFul services for entities
* Core Entities
    * User


## AtomicWeb
This visual studio project contains components written in HTML/CSS/JavaScript for the purpose of building web application clients.  That sounds a little better than the .Net one, but how about a feature list anyway:

* Pure disconnected client side MVC implementation built using M:JSON / V:HTML 5 / C:JavaScript 1.8.5(ECMAScript 5).
* High Fidelity Functional Prototyping support provided by lgihtweight object data storage modules (comprising localStorage and optional remote persistence using services built upon Atomic.Net)
* Classical style inheritance/method dispatching implementation (provides instance and static scopes, base class member access, method overriding, and protected, privileged and public boundaries)
* DOM abstraction via Control controller base class. (Dependency Injection option for headless and other alternative views)
* Small MVC triplets promote reusable components (.html, .css, .js files in component folders)
* Virtual File dependency routing provided through .dep files which are processed via the Atomic.Net StaticFileHandler or other alternative engine)

# Installation Instructions
For now, get the latest source and build using Visual Studio 2012 or higher or Xamarin Studio.  (Visual Studio 2010 might work, but is currently untested).  After you build, run the AtomicWeb project.  If you are using Visual Studio on Window 8, you may need to run as an admin in order to setup the application under IIS.  You can also try running it under the visual studio development server, but this has not been tested yet.  After you run it, you should see a list of links.  The demo link loads an AtomicJS demo SPA that is still under development.  The services and entities link each open up what will eventually be the middleware discovery screens.

# Where to get help
Try reaching out to @TyreeJackson on Twitter if you have any questions or post an issue here on the GitHub project.  Please be patient on responses as this is a side project at the moment with very few contributors.

# Contribution
Please review the [Coding Standards](https://github.com/TyreeJackson/atomic/wiki/Coding-Standards) in the project wiki (currently under development).  A list of wanted features will be incoming.  In the meantime, we are in need of suggestions and contributions on expanding the Atomic Domain Specific Querying Language.  Please see the [Atomic Domain Specific Querying Language](https://github.com/TyreeJackson/atomic/wiki/Atomic-Domain-Specific-Querying-Language) page for more details.  Successful execution of the language is not an immediate goal at this time.  It is more important that we define the scope of the language first.  Implementation will come next.  After which we'll iterate enhancements on top of the base grammar set through future sprints.

# Contributors
Please visit [Contributors](https://github.com/TyreeJackson/atomic/graphs/contributors) to see the current list of contributors.

# Credits
Credit for the inspiration for the launch of this project goes to [Lee Brandt](https://twitter.com/leebrandt) and [Cory House](https://twitter.com/housecor) as it was through discussions with them at the 2012 and 2013 St. Louis Days of .Net conference that drove the decision for [Tyree Jackson](https://twitter.com/tyreejackson) to create a project to showcase some of the practices that will go into the development of these tools.

# Other notes
Please note that this project is still in the very earliest stages of development.

