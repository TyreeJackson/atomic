atomic.ready(function(global)
{with(namespace("atomic"))
{
    /* Testing AtomicJS mocking capabilities */
    /* Jasmine tests coming soon */
    var frameworkMock   = new atomic.mocking.Mock();
    frameworkMock.Setup(framework => framework.DownloadExists("2.0.0.0")).Returns("2.0.0.0");

    console.info("====>   frameworkMock.Object.DownloadExists(\"2.0.0.0\") === \"2.0.0.0\": " + (frameworkMock.Object.DownloadExists("2.0.0.0") === "2.0.0.0"));
    console.info("====>   Verify DownloadExists(\"2.0.0.0\") called once: " + frameworkMock.Verify(framework => framework.DownloadExists("2.0.0.0"), stat => stat.callCount === 1));

}});