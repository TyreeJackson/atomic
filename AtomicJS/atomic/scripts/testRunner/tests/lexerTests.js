!function()
{"use strict";root.define("atomic.tests.lexer", function lexerTests(ion, mock)
{return{
    __setup:
    function()
    {
        this.mockScanner            = new mock("scanner");
        this.mockTokenizers         = new mock("tokenizers");
        this.mockRemoveFromArray    = new mock("removeFromArray");
        this.lexer                  = new root.atomic.lexer(this.mockScanner.object, this.mockTokenizers.object, this.mockRemoveFromArray.object);
    },
    When_calling_read_the_read_method_is_called_on_the_scanner_with_the_input_specified:
    function()
    {
        this.mockTokenizers.setup(tokenizers=>tokenizers.length).returns(1);
        var sentence    = faker.lorem.sentence(3);
        this.mockScanner.setup(scanner=>scanner.read(mock.isAny));
        this.lexer.read(sentence);
        this.mockScanner.verify(scanner=>scanner.read(sentence), mock.times.once());
    },
    When_calling_getNextToken_the_lexer_returns_true_if_the_scanner_returns_true_from_its_eof_property:
    function()
    {
        this.mockTokenizers.setup(tokenizers=>tokenizers.length).returns(1);
        this.mockScanner.setup(scanner=>scanner.eof).returns(true);
        ion.assert(this.lexer.getNextToken(), "A true value was expected to be returned from the call to the getNextToken method when the scanner returns false from it's eof property.");
        this.mockScanner.verify(scanner=>scanner.eof, mock.times.once());
    },
    When_calling_getNextToken_the_lexer_calls_the_scan_method_on_the_scanner_and_throws_an_exception_when_the_scanner_immediately_returns_false_from_the_scan_method:
    function()
    {
        this.mockTokenizers.setup(tokenizers=>tokenizers.length).returns(1);
        ion.expectException("Invalid syntax.  Unable to tokenize statement {}.");
        this.mockScanner.setup(scanner=>scanner.eof).returns(false);
        this.mockScanner.setup(scanner=>scanner.scan()).returns(false);
        this.mockScanner.setup(scanner=>scanner.input).returns(null);
        this.lexer.getNextToken();
    },
    When_calling_getNextToken_the_lexer_calls_the_scan_method_on_the_scanner_and_reads_the_current_character_with_each_tokenizer_still_actve_when_the_scanner_returns_true_from_the_scan_method:
    function()
    {
        var counter         = 0;
        var characters      = faker.lorem.sentence(3);
        var mockTokenizer1  = new mock("tokenizer1");
        var mockTokenizer2  = new mock("tokenizer2");
        var tokenizers      = [mockTokenizer1.object, mockTokenizer2.object];
        this.mockTokenizers.setup(tokenizers=>tokenizers.length).returns(2);
        this.mockTokenizers.setup(tokenizers=>tokenizers[mock.isAny]).callback(index=>tokenizers[index]);
        mockTokenizer1.setup(tokenizer=>tokenizer.read(mock.isAny)).callback(char=>char!=undefined);
        mockTokenizer2.setup(tokenizer=>tokenizer.read(mock.isAny)).returns(false);
        this.mockScanner.setup(scanner=>scanner.eof).returns(false);
        this.mockScanner.setup(scanner=>scanner.scan()).callback(()=>{counter++; return counter<characters.length;});
        this.mockScanner.setup(scanner=>scanner.current).callback(()=>characters[counter]);
        this.lexer.getNextToken();
        
    }
};});}();