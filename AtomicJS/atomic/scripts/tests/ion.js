﻿!function()
{root.define("atomic.testUtilities.ion", function ionModule(mock, assertionsLogger, performance)
{
    function getTestStatement(testKey)
    {
        return testKey.replace(/\_/g, " ");
    }
    var testContext = undefined;
    var ion         = Object.create({},
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
        expectException:
        {value: function(exceptionMessage)
        {
            Object.defineProperty(testContext, "expectedException", {value: exceptionMessage});
        }},
        log:
        {value: function(message)
        {
            assertionsLogger("    LOG:        "+message.replace(/\n/g, "                \n"));
        }},
        execute:
        {value: function(testsNamespace, name)
        {
            var testNames   = Object.getOwnPropertyNames(testsNamespace);
            for(var testNameCounter=0;testNameCounter<testNames.length;testNameCounter++)
            {
                var testName        = testNames[testNameCounter];
                if (testsNamespace[testName].$isNamespace)  this.execute(testsNamespace[testName]);
                else
                {
                    var tests       = new testsNamespace[testName](this, mock);
                    assertionsLogger("RUNNING " + getTestStatement(testName) + " tests...")
                    for(var testKey in tests)
                    {
                        if (testKey == "__setup")   continue;
                        var testStart   = performance.now();
                        testContext = {};
                        try
                        {
                            if (tests.__setup)  tests.__setup.call(testContext);
                            tests[testKey].call(testContext);
                        }
                        catch(error)
                        {
                            if (testContext.expectedException !== error.message)
                            {
                                assertionsLogger("\n    FAIL:       \"" + getTestStatement(testKey) + "\" test failed in " + (performance.now()-testStart) + " ms.\n                Message:    " + error.message + "\n                Stack:      " + error.stack.replace(/\n/g, "\n                            ") + "\n\n");
                                continue;
                            }
                        }
                        assertionsLogger("    SUCCESS:    \"" + getTestStatement(testKey) + "\" test passed successfully in " + (performance.now()-testStart) + " ms.");
                    }
                    assertionsLogger(testName + " tests complete.\n\n")
                }
            }
        }}
    });
    
    return ion;
});}();