package com.adela.hana_bridge_beapi.config.openai;


import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.util.concurrent.TimeUnit;

@Configuration
public class OpenAiConfig {

    @Value("${openai.api.key}")
    private String openAiKey;

    @Bean
    public WebClient openAiWebClient(){
        //타임 아웃 설정
        HttpClient httpClient = HttpClient.create()
                //ChatGPT 서버 연결 시간 5초 이내
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                .doOnConnected(conn -> conn
                        //ChatGPT 응답 시간 10초 이내
                        .addHandlerLast(new ReadTimeoutHandler(15000, TimeUnit.MILLISECONDS))
                        //요청을 ChatGPT 서버로 보내는 시간 5초 이내
                        .addHandlerLast(new WriteTimeoutHandler(5000, TimeUnit.MILLISECONDS)));

        return WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openAiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
