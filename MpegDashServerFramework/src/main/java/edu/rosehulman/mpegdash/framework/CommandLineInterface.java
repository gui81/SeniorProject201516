package edu.rosehulman.mpegdash.framework;

import java.util.Scanner;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.beust.jcommander.JCommander;

@ComponentScan
@EnableAutoConfiguration
@SpringBootApplication
public class CommandLineInterface {

    private static final Logger LOGGER = LogManager.getLogger(CommandLineInterface.class);

    public static void main(String[] args) {
        SpringApplication.run(new Object[]{CommandLineInterface.class, CommandLineInterface.class}, args);
        CommandLineArgs params = new CommandLineArgs();
        JCommander cmd = new JCommander(params);

        // parse given arguments
        cmd.parse(args);

        // show usage information if help flag exists
        if (params.getHelp()) {
            cmd.usage();
            return;
        }
        
        String imageName = "mpegdash/nodejs";
        if (params.getSetup()) {
//            imageName = params.getImageName();
            DockerCommandLauncher.setupImage(imageName);
            System.exit(0);
            return;
        }
        
        ServerLauncher launcher = new ServerLauncher(params.getAutoLaunch());
        Scanner scanner = new Scanner(System.in);
        String line = null;
        printHelpMessage();
        
        while(scanner.hasNext()){
            line = scanner.nextLine();
            if(line.equals("quit")){
                System.exit(0);
            }else if(line.equals("feeds")){
                launcher.printAllServers();
            }else if(line.startsWith("launch")){
                launcher.launchServer(line.substring(7, line.length()));
            }else if(line.startsWith("shutdown")){
                launcher.shutdownServer(line.substring(9, line.length()));
            }else if(line.startsWith("restart")){
                launcher.restartServer(line.substring(8, line.length()));
            }else{
                printHelpMessage();
            }
        }
    }
    
    private static void printHelpMessage(){
        System.out.println(
                "Valid commands: \n" +
                "quit - exits the current program and shuts down all video feeds\n" +
                "feeds - prints out a list of video feeds and their details\n" +
                "launch [video title] - launches the specified server if not enabled\n" +
                "shutdown [video title] - shuts down the specified server if not disabled\n");
    }
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/greeting").allowedOrigins("*");
            }
        };
    }

}