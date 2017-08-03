!function()
{"use strict";root.define("atomic.tests.scanner", function scannerTests(ion, mock)
{return{
    __setup:
    function()
    {
        this.scanner    = new root.atomic.scanner();
    },
    When_calling_scan_true_is_returned_on_each_call_until_the_method_has_been_called_for_each_character_in_the_sentence:
    function()
    {
        var sentence    = faker.lorem.sentences(3,3);
        this.scanner.read(sentence);
        for(var counter=0;counter<sentence.length;counter++)    ion.assert(this.scanner.scan(), "The scanner should return true for position " + counter + " of " + sentence.length + ".");
        ion.assert(!this.scanner.scan(), "The scanner should return false after the last position in " + sentence.length + ".");
    }
};});}();