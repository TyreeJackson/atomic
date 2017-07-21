!function()
{root.define("atomic.testUtilities.ion", function ionModule(mock, assertionsLogger)
{
    function getTestStatement(testKey)
    {
        return testKey.replace(/\_/g, " ");
    }
    var ion = Object.create({},
    {
        assert:
        {value: function(condition, failureMessage)
        {
            if (!condition) throw new Error(failureMessage);
        }},
        areEqual: 
        {value: function(expectedValue, actualValue, failureMessage)
        {
            return this.assert(expectedValue===actualValue, failureMessage);
        }},
        fail:
        {value: function(failureMessage)
        {
            return this.assert(false, failureMessage);
        }},
        execute:
        {value: function(testsNamespace)
        {
            var testNames   = Object.getOwnPropertyNames(testsNamespace);
            for(var testNameCounter=0;testNameCounter<testNames.length;testNameCounter++)
            {
                if (testsNamespace[testNames[testNameCounter]].$isNamespace)    this.execute(testsNamespace[testNames[testNameCounter]]);
                else
                {
                    var tests   = new testsNamespace[testNames[testNameCounter]](this, mock);
                    for(var testKey in tests)
                    {
                        if (testKey == "__setup")   continue;
                        try
                        {
                            var testContext = {};
                            if (tests.__setup)  tests.__setup.call(testContext);
                            tests[testKey].call(testContext);
                            assertionsLogger("SUCCESS: \"" + getTestStatement(testKey) + "\" test passed successfully.");
                        }
                        catch(error)
                        {
                            assertionsLogger("FAIL:       \"" + getTestStatement(testKey) + "\" test failed.\nMessage:    " + error.message + "\nStack:  \n            " + error.stack.replace(/\n/g, "\n            ") + "\r\n\r\n");
                        }
                    }
                }
            }
        }}
    });
    
    return ion;
});}();