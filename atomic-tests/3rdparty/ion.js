!function()
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
        {value: function(exceptionMessage, callback)
        {
            if (callback !== undefined)
            {
                var thrownException;
                try
                {
                    callback();
                }
                catch(error)
                {
                    thrownException = error;
                }
                if (thrownException === undefined || exceptionMessage !== thrownException.message)
                {
                    Object.defineProperty(testContext, "expectedException", {value: exceptionMessage});
                    Object.defineProperty(testContext, "thrownException", {value: thrownException});
                    throw new Error("Unexpected exception");
                }
            }
            else    Object.defineProperty(testContext, "expectedException", {value: exceptionMessage, configurable: true});
        }},
        log:
        {value: function(message)
        {
            assertionsLogger("    LOG:        "+message.replace(/\n/g, "                \n"), "rgba(192,192,192,0.5)");
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
                    var tests                   = new testsNamespace[testName](this, mock);
                    var testContextPrototype    = {};
                    if (tests.__setupSuite) tests.__setupSuite.call(testContextPrototype);

                    assertionsLogger("RUNNING " + getTestStatement(testName) + " tests...", "rgba(255,255,255,0.8)");
                    for(var testKey in tests)
                    {
                        if (testKey == "__setup" || testKey == "__setupSuite")  continue;
                        var testStart   = performance.now();
                        var setupEnd    = undefined;
                        testContext = Object.create(testContextPrototype, {});
                        try
                        {
                            if (tests.__setup)
                            {
                                tests.__setup.call(testContext);
                                setupEnd    = performance.now();
                            }
                            tests[testKey].call(testContext);
                        }
                        catch(error)
                        {
                            if (error.message === "Unexpected exception" && testContext.thrownException !== undefined)
                            {
                                assertionsLogger("\n    FAIL:       \"" + getTestStatement(testKey) + "\" test failed in " + (performance.now()-testStart) + " ms" + (setupEnd !== undefined ? " (setup time: " + (setupEnd-testStart) + " ms)" : "") + ".\n                Message:    Expected exception with message `" + testContext.expectedException + " but instead caught an exception with message " + testContext.thrownException.message + ".\n                Stack:      " + testContext.thrownException.stack.replace(/\n/g, "\n                            ") + "\n\n", "rgb(255,64,64)");
                                continue;
                            }
                            else if (testContext.expectedException !== error.message)
                            {
                                assertionsLogger("\n    FAIL:       \"" + getTestStatement(testKey) + "\" test failed in " + (performance.now()-testStart) + " ms" + (setupEnd !== undefined ? " (setup time: " + (setupEnd-testStart) + " ms)" : "") + ".\n                Message:    " + error.message + "\n                Stack:      " + error.stack.replace(/\n/g, "\n                            ") + "\n\n", "rgb(255,64,64)");
                                continue;
                            }
                            else
                            {
                                Object.defineProperty(testContext, "expectedException", {value: undefined});
                            }
                        }
                        if (testContext.expectedException !== undefined)    assertionsLogger("\n    FAIL:       \"" + getTestStatement(testKey) + "\" test failed in " + (performance.now()-testStart) + " ms" + (setupEnd !== undefined ? " (setup time: " + (setupEnd-testStart) + " ms)" : "") + ".\n                Message:    Expected exception with message `" + testContext.expectedException + "` but no exception was thrown.", "rgb(255,64,64)");
                        else                                                assertionsLogger("    SUCCESS:    \"" + getTestStatement(testKey) + "\" test passed successfully in " + (performance.now()-testStart) + " ms" + (setupEnd !== undefined ? " (setup time: " + (setupEnd-testStart) + " ms)" : "") + ".", "rgb(64,255,64)");
                    }
                    assertionsLogger(getTestStatement(testName) + " tests complete.\n\n", "rgba(255,255,255,0.8)")
                }
            }
        }}
    });
    
    return ion;
});}();