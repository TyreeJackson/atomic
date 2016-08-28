!function(){window.onload   =
function ComposeApp()
{
    root.atomic.forms.dock ( "#formsTutorialApp", function(){return new root.atomic.forms.tutorial.appProxy(localStorage, root.utilities.removeFromArray);} );
};}();