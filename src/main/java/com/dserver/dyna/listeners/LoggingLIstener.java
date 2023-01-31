package com.dserver.dyna.listeners;

import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.boot.context.logging.LoggingApplicationListener;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;

public class LoggingLIstener implements ApplicationListener<ApplicationEvent>, Ordered{

    @Override
    public int getOrder() {
        return LoggingApplicationListener.DEFAULT_ORDER - 1;
    }

    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        if (event instanceof ApplicationEnvironmentPreparedEvent)
        {
            // Fetch environment properties
            ConfigurableEnvironment environment = ((ApplicationEnvironmentPreparedEvent) event).getEnvironment();
            String logPath = environment.getProperty("logging.file.path");
            if (logPath == null || logPath.isEmpty())
            {
                logPath = "logs";
            }
            // Set Log Path either with default(logs) or from properties
            System.setProperty("log.path", logPath);
            String appName = environment.getProperty("spring.application.name");
            if (appName == null || appName.isEmpty())
            {
                appName = "app";
            }
            // Set App Name either with default(app) or from properties
            System.setProperty("app.name", appName);
        }
    }
    
}
